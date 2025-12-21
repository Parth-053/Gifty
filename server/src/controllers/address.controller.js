import Address from "../models/Address.model.js";

/* =========================
   GET MY ADDRESSES
   ========================= */
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id })
      .sort({ isDefault: -1, createdAt: -1 });

    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ADD NEW ADDRESS
   ========================= */
export const addAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE ADDRESS
   ========================= */
export const deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
