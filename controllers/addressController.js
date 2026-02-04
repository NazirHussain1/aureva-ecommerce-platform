const Address = require("../models/Address");

const getAddresses = async (req, res) => {
  const addresses = await Address.findAll({
    where: { userId: req.user.id },
  });
  res.json(addresses);
};

const addAddress = async (req, res) => {
  const address = await Address.create({
    ...req.body,
    userId: req.user.id,
  });
  res.status(201).json(address);
};

const deleteAddress = async (req, res) => {
  const address = await Address.findByPk(req.params.id);

  if (!address || address.userId !== req.user.id) {
    return res.status(404).json({ message: "Address not found" });
  }

  await address.destroy();
  res.json({ message: "Address deleted" });
};

module.exports = { getAddresses, addAddress, deleteAddress };
