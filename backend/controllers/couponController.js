const Coupon = require("../models/Coupon");

const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const amount = Number(orderAmount);

    if (!code || Number.isNaN(amount) || amount < 0) {
      return res.status(400).json({ message: "Coupon code and order amount are required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({ message: "Invalid or expired coupon" });
    }

    if (amount < coupon.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase amount is $${coupon.minPurchase}`,
      });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (amount * coupon.discountValue) / 100;

      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = Math.min(coupon.discountValue, amount);
    }

    res.json({
      discount: Number(discount.toFixed(2)),
      finalAmount: Number((amount - discount).toFixed(2)),
      couponCode: coupon.code,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { applyCoupon };
