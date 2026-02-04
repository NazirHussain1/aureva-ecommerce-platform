const Coupon = require("../models/Coupon");

const applyCoupon = async (req, res) => {
  const { code, orderAmount } = req.body;

  const coupon = await Coupon.findOne({ where: { code } });

  if (!coupon || !coupon.isActive) {
    return res.status(400).json({ message: "Invalid coupon" });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return res.status(400).json({ message: "Coupon expired" });
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ message: "Coupon limit reached" });
  }

  if (orderAmount < coupon.minOrderAmount) {
    return res.status(400).json({
      message: `Minimum order amount is ${coupon.minOrderAmount}`,
    });
  }

  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount = (orderAmount * coupon.discountValue) / 100;

    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    discount,
    finalAmount: orderAmount - discount,
    couponCode: coupon.code,
  });
};

module.exports = { applyCoupon };
