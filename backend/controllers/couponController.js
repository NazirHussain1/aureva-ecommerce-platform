const Coupon = require("../models/Coupon");

const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({ message: "Invalid or expired coupon" });
    }

    if (orderAmount < coupon.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase amount is $${coupon.minPurchase}`,
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
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { applyCoupon };
