const Address = require("../models/Address");

const getAddresses = async (req, res) => {
  const addresses = await Address.findAll({
    where: { userId: req.user.id },
  });
  res.json(addresses);
};

const addAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;

    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: req.user.id } }
      );
    }

    const address = await Address.create({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || false,
      userId: req.user.id,
    });

    res.status(201).json(address);
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Failed to add address', error: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);

    if (!address || address.userId !== req.user.id) {
      return res.status(404).json({ message: "Address not found" });
    }

    const { fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;

    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: req.user.id } }
      );
    }

    await address.update({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault !== undefined ? isDefault : address.isDefault,
    });

    res.json(address);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Failed to update address', error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);

    if (!address || address.userId !== req.user.id) {
      return res.status(404).json({ message: "Address not found" });
    }

    await address.destroy();
    res.json({ message: "Address deleted" });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Failed to delete address', error: error.message });
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
