"use strict";

const Best = require("../models/bestproductModel");

exports.AddBestProduct = async (req, res) => {
  const bests = req.body;

  if (!Array.isArray(bests) || bests.length === 0) {
    return res.status(400).json({
      message: "Request body must be an array of products",
    });
  }

 for (const best of bests) {
    const { name_product, skin_type, category, price, rating, image_url, store_url } = best;
    if (
      !name_product ||
      !skin_type ||
      !category ||
      !price ||
      !rating ||
      !image_url ||
      !store_url 
    ) {
      return res.status(400).json({
        message: "All fields are required: name_product, skin_type, category, price, rating, image_url, store_url",
      });
    }

    try {
      const existingProduct = await Best.findProductByNameAndSkinType(
        name_product, 
        skin_type
      );
      if (existingProduct) {
        return res.status(400).json({
          message: `Product "${name_product}" for usage time "${skin_type}" already exists`,
        });
      }
    } catch (error) {
      console.error("Error checking for existing product:", error);
      return res.status(500).json({ message: "Failed to check existing products" });
    }
  }
   try {
    await Best.addMultipleProducts(bests);
    res.status(201).json({ message: "Products added successfully" });
  } catch (error) {
    console.error("Error adding products:", error);
    res.status(500).json({
      message: "Failed to add products",
    });
  }   
};

exports.ShowBestProduct = async (req, res) => {
  try {
    const best = await Best.BestProductBySkinType();
    res.status(200).json({
      id: best.id,
      name_product: best.name_product,
      skin_type: best.skin_type,
      category: best.category,
      price: best.price,
      rating: best.rating,
      image_url: best.image_url,
      store_url: best.store_url,
    })
  } catch (error) {
    console.error("Error show best products", error);
    res.status(500).json({
      message:"Error Server"
    })
  }
}