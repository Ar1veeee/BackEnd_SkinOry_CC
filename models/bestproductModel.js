"use strict";

const client = require("../config/redistClient");
const db = require("../config/db");

const Best = {
  addMultipleProducts: async (bests) => {
    return new Promise((resolve, reject) => {
      const values = bests.map((best) => [
        best.name_product,
        best.skin_type,
        best.category,
        best.price,
        best.rating,
        best.image_url,
        best.store_url,
      ]);

      const query = `
        INSERT INTO best_products (name_product, skin_type, category, price, rating, image_url, store_url)
        VALUES ?
      `;

      db.query(query, [values], (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  },

  findProductByNameAndSkinType: (name_product, skin_type) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM best_products WHERE name_product = ? AND skin_type = ?";
      db.query(query, [name_product, skin_type], (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return reject(error);
        }
        resolve(results[0]);
      });
    });
  },
  /*

  //--------use this if you not using Memorystore Redist
  getRecommendedProducts: async (user_id) => {
    const query = `
      SELECT b.*
      FROM best_products b
      JOIN users u ON u.skin_type = b.skin_type
      WHERE u.id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  },
  */

  BestProductBySkinType: async (user_id) => {
    const redisKey = `recommended:${user_id}`;
    const cachedData = await client.get(redisKey);
    if (cachedData) {
      console.log("Data from Redis cache");
      return JSON.parse(cachedData);
    }
    const query = `
SELECT b.*
FROM best_products b
JOIN users u ON u.skin_type = b.skin_type
WHERE u.id = ?
`;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id], async (error, results) => {
        if (error) {
          reject(error);
        }
        await client.set(redisKey, JSON.stringify(results), "EX", 3600);

        resolve(results);
      });
    });
  },

};

module.exports = Best;
