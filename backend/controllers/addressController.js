const Address = require("../models/Address");

const getStreet = ({ street, addressLine1 }) => street || addressLine1;

const compact = (payload) =>
  Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined && value !== ""));

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses", error: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine2, city, state, zipCode, country, isDefault, addressType } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const address = await Address.create({
      fullName,
      phone,
      street: getStreet(req.body),
      addressLine2,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || false,
      addressType,
      user: req.user.id,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: "Failed to add address", error: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine2, city, state, zipCode, country, isDefault, addressType } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user.id, _id: { $ne: req.params.id } }, { isDefault: false });
    }

    const updatePayload = compact({
      fullName,
      phone,
      street: getStreet(req.body),
      addressLine2,
      city,
      state,
      zipCode,
      country,
      isDefault,
      addressType,
    });

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Failed to update address", error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address", error: error.message });
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
