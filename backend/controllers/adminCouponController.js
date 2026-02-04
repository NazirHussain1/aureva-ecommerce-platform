const Coupon = require("../models/Coupon");

const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
};

const getCoupons = async (req, res) => {
  const coupons = await Coupon.findAll();
  res.json(coupons);
};

const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findByPk(req.params.id);

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  await coupon.update(req.body);
  res.json(coupon);
};

const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findByPk(req.params.id);

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  await coupon.destroy();
  res.json({ message: "Coupon deleted" });
};

module.exports = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};
