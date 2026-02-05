const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const User = require("../models/User");
const { sendOrderConfirmationEmail } = require("../services/emailService");

const placeOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      UserId: req.user.id,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    const orderItems = items.map((item) => ({
      OrderId: order.id,
      ProductId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    const user = await User.findByPk(req.user.id);
    const orderWithItems = { ...order.toJSON(), items };
    await sendOrderConfirmationEmail(orderWithItems, user);

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
