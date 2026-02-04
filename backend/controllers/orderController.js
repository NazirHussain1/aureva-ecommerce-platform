const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

const placeOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
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

  res.status(201).json({
    message: "Order placed successfully",
    orderId: order.id,
  });
};

module.exports = { placeOrder };
