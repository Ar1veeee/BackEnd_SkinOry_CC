"use strict";
const client = require("../config/redistClient");
const db = require("../config/db");

const Routine = {
  addDayRoutine: async (user_id, product_id, category) => {
    const query = `
      INSERT INTO day_routines (user_id, product_id, category)
      VALUES (?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, product_id, category], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },

  addNightRoutine: async (user_id, product_id, category) => {
    const query = `
      INSERT INTO night_routines (user_id, product_id, category)
      VALUES (?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, product_id, category], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },

  getDayRoutinesByUserId: async (user_id) => {
    const query = `
      SELECT p.id_product, p.name_product, p.skin_type, p.category
      FROM day_routines r
      JOIN products p ON r.product_id = p.id_product
      WHERE r.user_id = ?
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

  deleteDayRoutinesByUserId: async (user_id) => {
    const query = `
      DELETE FROM day_routines WHERE user_id = ?
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

  getNightRoutinesByUserId: async (user_id) => {
    const query = `
      SELECT p.id_product, p.name_product, p.skin_type, p.category
      FROM night_routines r
      JOIN products p ON r.product_id = p.id_product
      WHERE r.user_id = ?
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

  deleteNightRoutinesByUserId: async (user_id) => {
    const query = `
      DELETE FROM night_routines WHERE user_id = ?
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

  findDayRoutineByUserAndProduct: async (user_id, product_id) => {
    const query = `
      SELECT * FROM day_routines WHERE user_id = ? AND product_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, product_id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  },

  findNightRoutineByUserAndProduct: async (user_id, product_id) => {
    const query = `
      SELECT * FROM night_routines WHERE user_id = ? AND product_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, product_id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  },
  /*

  //--------use this if you not using Memorystore Redis
  getRecommendedProducts: async (user_id, category) => {
    const query = `
      SELECT p.*
      FROM products p
      JOIN users u ON u.skin_type = p.skin_type
      WHERE u.id = ? AND p.category = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, category], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  },
  */

  //------Use this if you using Memorystore Redis
  getRecommendedProducts: async (user_id, category) => {
    const redisKey = `recommended:${user_id}:${category}`;
    const cachedData = await client.get(redisKey);
    if (cachedData) {
      console.log("Data from Redis cache");
      return JSON.parse(cachedData);
    }
    const query = `
SELECT p.*
FROM products p
JOIN users u ON u.skin_type = p.skin_type
WHERE u.id = ? AND p.category = ?
`;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, category], async (error, results) => {
        if (error) {
          reject(error);
        }
        await client.set(redisKey, JSON.stringify(results), "EX", 3600);

        resolve(results);
      });
    });
  },
};
module.exports = Routine;
