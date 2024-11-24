'use strict';

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
    const products = await Routine.getRecommendedProducts(
      user_id,
      category
    );
    res.json({ products });
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res.status(500).json({
      message: "Error fetching recommended products",
      error: error.message,
    });
  }
};

exports.DayRoutine = async (req, res) => {
  const { user_id, category } = req.params;
  const { product_id } = req.body;
  if (!user_id || !product_id || !category) {
    return res.status(400).json({
      message: "User ID, Product ID, Usage Time, and Category are required",
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

    if (product.category !== category ) {
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
      error: error.message,
    });
  }
};

exports.NightRoutine = async (req, res) => {
  const { user_id, category } = req.params;
  const { product_id } = req.body;
  if (!user_id || !product_id || !category) {
    return res.status(400).json({
      message: "User ID, Product ID, Usage Time, and Category are required",
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

    if (product.category !== category ) {
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
      error: error.message,
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
      error: error.message,
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
      error: error.message,
    });
  }
};

exports.updateAppliedStatus = async (req, res) => {
  const { product_id, user_id } = req.params;
  const { applied } = req.body;

  if (
    user_id === undefined ||
    product_id === undefined ||
    applied === undefined
  ) {
    return res.status(400).json({
      message: "User ID, Product ID, and Applied status are required",
    });
  }

  if (typeof applied !== "boolean") {
    return res.status(400).json({
      message: "Invalid value for applied. Allowed values: 'true', 'false'",
    });
  }

  try {
    const result = await Routine.updateAppliedStatus(
      user_id,
      product_id,
      applied
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Routine not found for the given user ID and product ID",
      });
    }

    res.json({
      message: "Applied status updated successfully",
    });
  } catch (error) {
    console.error("Error updating applied status:", error);
    res.status(500).json({
      message: "Error updating applied status",
      error: error.message,
    });
  }
};
