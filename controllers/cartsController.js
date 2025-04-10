import Cart from "../models/CartModel.js";
import mongoose from "mongoose";
import CartItem from "../models/CartItemModel.js";
import Course from "../models/CourseModel.js";
import InvoiceItem from "../models/InvoiceItemModel.js";
import Invoice from "../models/InvoiceModel.js";

const createCartForUser = async (userId) => {
  try {
    const cart = await Cart.create({ userId });
    return cart;
  } catch (error) {
    throw new Error("Unable to create cart");
  }
};
const addToCart = async (req, res) => {
  const { cartId, courseId } = req.body;
  const userId = req.user._id;
  console.log(`Cart ID: ${cartId}, Course ID: ${courseId}`);

  if (!cartId || !courseId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const cartExists = await Cart.findById(cartId);
    const courseExists = await Course.findById(courseId);

    if (!cartExists || !courseExists) {
      return res.status(404).json({ error: "Cart or Course not found" });
    }
    const cartItemExists = await CartItem.findOne({
      cartId: cartId,
      courseId: courseId,
    });
    if (cartItemExists) {
      return res
        .status(400)
        .json({ error: "This course is already in your cart." });
    }
    // "Check if the user has purchased this course yet."
    const userInvoices = await Invoice.find({ userId: userId });
    const purchasedCourseIds = new Set();
    for (const invoice of userInvoices) {
      const invoiceItems = await InvoiceItem.find({
        invoiceId: invoice._id,
        courseId: courseId,
      });
      if (invoiceItems.length > 0) {
        return res
          .status(400)
          .json({ error: "You have already purchased this course." });
      }
    }

    // Get course information from courseId
    const courseDetails = await Course.findById(courseId);

    // Add to cart if the course has not been purchased
    const cartItem = await CartItem.create({
      cartId: cartId,
      courseId: courseId,
    });

    // Package cartItem and courseDetails into a single object
    const responseData = {
      success: "Course added to cart successfully",
      cartItem,
      courseDetails,
    };
  console.log("Added Successfully");
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Add Unsuccessful");
  }
};


const removeFromCart = async (req, res) => {
  const { cartId, courseId } = req.params;

  try {
    const result = await CartItem.findOneAndDelete({
      cartId: cartId,
      courseId: courseId,
    });

    if (result) {
      return res
        .status(200)
        .json({ message: "Course remove from cart successfully" });
    } else {
      return res.status(404).json({ error: "Cart Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    const cartItems = await CartItem.find({ cartId: cart._id });
    return res.status(200).json({ cartItems });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Delete all CartItems linked to this cartId
    const result = await CartItem.deleteMany({ cartId: cart._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No items found in cart" });
    }

    res.status(200).json({ message: "All items removed from cart successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export { createCartForUser, addToCart, removeFromCart, getCart ,clearCart};
