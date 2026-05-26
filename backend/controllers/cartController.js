import Cart from "../models/Cart.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      const item = cart.items.find((i) => i.productId.toString() === productId);
      if (item) item.quantity += 1;
      else cart.items.push({ productId, quantity: 1 });
    }
    await cart.save();
    res.json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Remove item from cart
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update item quantity
export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });
    item.quantity = quantity;
    await cart.save();
    res.json({ message: "Quantity updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ FIX: Get cart — filter out null products (deleted from DB but still in cart)
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      // Return empty cart structure instead of null
      return res.json({ userId, items: [] });
    }

    // ✅ Remove items where product was deleted (populate returns null)
    const validItems = cart.items.filter(
      (item) => item.productId !== null && item.productId !== undefined
    );

    // If we removed some nulls, save the cleaned cart to DB
    if (validItems.length !== cart.items.length) {
      cart.items = validItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));
      await cart.save();
      // Re-fetch with populate after cleaning
      cart = await Cart.findOne({ userId }).populate("items.productId");
    }

    res.json(cart || { userId, items: [] });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};