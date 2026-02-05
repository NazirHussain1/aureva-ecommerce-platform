const Shipment = require('../models/Shipment');
const ShipmentTracking = require('../models/ShipmentTracking');
const Order = require('../models/Order');
const User = require('../models/User');
const NotificationService = require('./notificationService');
const { sendEmail } = require('../config/email');

class ShipmentService {
  // Create shipment for order
  static async createShipment(orderId, shipmentData, adminId) {
    try {
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      // Create shipment
      const shipment = await Shipment.create({
        OrderId: orderId,
        trackingNumber: shipmentData.trackingNumber,
        courierService: shipmentData.courierService,
        courierName: shipmentData.courierName,
        estimatedDeliveryDate: shipmentData.estimatedDeliveryDate,
        trackingUrl: shipmentData.trackingUrl,
        notes: shipmentData.notes
      });

      // Add initial tracking entry
      await ShipmentTracking.create({
        ShipmentId: shipment.id,
        status: 'picked_up',
        location: 'Warehouse',
        description: 'Order has been picked up by courier',
        timestamp: new Date()
      });

      // Update order status
      await order.update({
        orderStatus: 'shipped'
      });

      // Notify customer
      await this.notifyCustomerShipment(order, shipment);

      return shipment;
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  }

  // Update shipment status
  static async updateShipmentStatus(shipmentId, statusData) {
    try {
      const shipment = await Shipment.findByPk(shipmentId, {
        include: [{ model: Order }]
      });

      if (!shipment) {
        throw new Error('Shipment not found');
      }

      // Update shipment
      await shipment.update({
        status: statusData.status,
        currentLocation: statusData.location,
        actualDeliveryDate: statusData.status === 'delivered' ? new Date() : null
      });

      // Add tracking entry
      await ShipmentTracking.create({
        ShipmentId: shipment.id,
        status: statusData.status,
        location: statusData.location,
        description: statusData.description,
        timestamp: new Date()
      });

      // Update order status if delivered
      if (statusData.status === 'delivered') {
        await shipment.Order.update({
          orderStatus: 'delivered',
          deliveredAt: new Date()
        });

        // Notify customer
        await NotificationService.createOrderStatusNotification(
          shipment.Order.UserId,
          shipment.Order.id,
          'delivered'
        );
      }

      return shipment;
    } catch (error) {
      console.error('Error updating shipment status:', error);
      throw error;
    }
  }

  // Get shipment tracking
  static async getShipmentTracking(trackingNumber) {
    try {
      const shipment = await Shipment.findOne({
        where: { trackingNumber },
        include: [
          {
            model: ShipmentTracking,
            order: [['timestamp', 'DESC']]
          },
          {
            model: Order,
            attributes: ['id', 'totalAmount', 'orderStatus']
          }
        ]
      });

      return shipment;
    } catch (error) {
      console.error('Error getting shipment tracking:', error);
      throw error;
    }
  }

  // Notify customer about shipment
  static async notifyCustomerShipment(order, shipment) {
    try {
      const user = await User.findByPk(order.UserId);

      // Create notification
      await NotificationService.createNotification(
        user.id,
        'order_status',
        'Order Shipped',
        `Your order #${order.id} has been shipped. Tracking: ${shipment.trackingNumber}`,
        {
          orderId: order.id,
          trackingNumber: shipment.trackingNumber,
          courierService: shipment.courierService
        }
      );

      // Send email
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2196F3, #64B5F6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .tracking-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196F3; }
                .button { display: inline-block; background: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Your Order Has Been Shipped! 🚚</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.name}!</h2>
                    <p>Great news! Your order #${order.id} has been shipped and is on its way to you.</p>
                    
                    <div class="tracking-box">
                        <h3>Shipment Details</h3>
                        <p><strong>Tracking Number:</strong> ${shipment.trackingNumber}</p>
                        <p><strong>Courier Service:</strong> ${shipment.courierService.toUpperCase()}</p>
                        <p><strong>Estimated Delivery:</strong> ${shipment.estimatedDeliveryDate ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString() : '2-5 business days'}</p>
                    </div>
                    
                    ${shipment.trackingUrl ? `
                    <a href="${shipment.trackingUrl}" class="button">Track Your Order</a>
                    ` : ''}
                    
                    <p>You can track your order using the tracking number above on the courier's website.</p>
                </div>
                <div class="footer">
                    <p>Thank you for shopping with Aureva Beauty Shop!</p>
                    <p>© 2024 Aureva Beauty Shop. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `;

      await sendEmail({
        email: user.email,
        subject: `Order Shipped - Tracking #${shipment.trackingNumber}`,
        html: emailTemplate
      });
    } catch (error) {
      console.error('Error notifying customer:', error);
    }
  }
}

module.exports = ShipmentService;