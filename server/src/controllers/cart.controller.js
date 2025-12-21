import Cart from "../models/Cart.model.js";

/* =========================
   ADD TO CART
   ========================= */
export const addToCart = async (req, res) => {
  const { productId, quantity, customizationData } = req.body;

  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      userId: req.user.id,
      items: [],
    });
  }

  cart.items.push({
    productId,
    quantity,
    customizationData,
  });

  await cart.save();

  res.json({ message: "Added to cart" });
};

/* =========================
   GET CART
   ========================= */
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate(
    "items.productId"
  );

  res.json(cart || { items: [] });
};

/* =========================
   REMOVE ITEM
   ========================= */
export const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== req.params.productId
  );

  await cart.save();
  res.json({ message: "Item removed" });
};

/* =========================
   CLEAR CART
   ========================= */
export const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user.id });
  res.json({ message: "Cart cleared" });
};
