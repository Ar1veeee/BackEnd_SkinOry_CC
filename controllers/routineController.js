"use strict";

const Routine = require("../models/routineModel");
const Product = require("../models/productModel");
const { User } = require("../models/userModel");

exports.getRecommendedProducts = async (req, res) => {
  const { user_id, category } = req.params;

  if (!user_id || !category) {
    return res.status(400).json({
      message: "User ID, and Category are required",
    });
  }

  try {
    const products = await Routine.getRecommendedProducts(user_id, category);
    res.json({ products });
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res.status(500).json({
      message: "Error fetching recommended products",      
    });
  }
};

exports.DayRoutine = async (req, res) => {
  const { user_id, category, product_id } = req.params;  
  if (!user_id || !product_id || !category) {
    return res.status(400).json({
      message: "User ID, Product ID, and Category are required",
    });
  }

  try {
    const user = await User.findUserById(user_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const product = await Product.findProductById(product_id);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    if (user.skin_type !== product.skin_type) {
      return res.status(400).json({
        message: `Skin type mismatch: Product skin type is "${product.skin_type}" but user's skin type is "${user.skin_type}".`,
      });
    }

    if (product.category !== category) {
      return res.status(400).json({
        message: `Product does not match the provided category "${category}"`,
      });
    }

    const existingRoutine = await Routine.findDayRoutineByUserAndProduct(
      user_id,
      product_id
    );
    if (existingRoutine) {
      return res.status(400).json({ message: "Routine already exists" });
    }

    await Routine.addDayRoutine(user_id, product_id, category);
    res.json({ message: "Day Routine added successfully", product });
  } catch (error) {
    console.error("Error adding routine:", error);
    res.status(500).json({
      message: "Error adding routine",
    });
  }
};

exports.DeleteDayRoutine = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findAuthByUserId(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await Routine.deleteDayRoutinesByUserId(user_id);
    res.status(202).json({ message: "Day Routine Deleted Successfully" });
  } catch (error) {
    console.error("Error Deleting Day Routine", error);
    res.status(500).json({
      message: "Error Deleting Day Routine",      
    });
  }
};

exports.NightRoutine = async (req, res) => {
  const { user_id, category, product_id } = req.params;

  if (!user_id || !product_id || !category) {
    return res.status(400).json({
      message: "User ID, Product ID, and Category are required",
    });
  }

  try {
    const user = await User.findUserById(user_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const product = await Product.findProductById(product_id);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    if (user.skin_type !== product.skin_type) {
      return res.status(400).json({
        message: `Skin type mismatch: Product skin type is "${product.skin_type}" but user's skin type is "${user.skin_type}".`,
      });
    }

    if (product.category !== category) {
      return res.status(400).json({
        message: `Product does not match the provided category "${category}"`,
      });
    }

    const existingRoutine = await Routine.findNightRoutineByUserAndProduct(
      user_id,
      product_id
    );
    if (existingRoutine) {
      return res.status(400).json({ message: "Routine already exists" });
    }

    await Routine.addNightRoutine(user_id, product_id, category);
    res.json({ message: "Night Routine added successfully", product });
  } catch (error) {
    console.error("Error adding routine:", error);
    res.status(500).json({
      message: "Error adding routine",
    });
  }
};

exports.DeleteNightRoutine = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findAuthByUserId(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await Routine.deleteNightRoutinesByUserId(user_id);
    res.status(202).json({ message: "Night Routine Deleted Successfully" });
  } catch (error) {
    console.error("Error Deleting Night Routine", error);
    res.status(500).json({
      message: "Error Deleting Night Routine",
    });
  }
};

exports.getUserDayRoutines = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const routines = await Routine.getDayRoutinesByUserId(user_id);
    res.json({ routines });
  } catch (error) {
    console.error("Error fetching user routines:", error);
    res.status(500).json({
      message: "Error fetching user routines",
    });
  }
};

exports.getUserNightRoutines = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const routines = await Routine.getNightRoutinesByUserId(user_id);
    res.json({ routines });
  } catch (error) {
    console.error("Error fetching user routines:", error);
    res.status(500).json({
      message: "Error fetching user routines",
    });
  }
};