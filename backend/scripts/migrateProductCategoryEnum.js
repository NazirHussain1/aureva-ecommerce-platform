require("dotenv").config();

const sequelize = require("../config/db");

const run = async () => {
  try {
    await sequelize.authenticate();

    // 1) Expand enum so both legacy and current values are temporarily valid.
    await sequelize.query(`
      ALTER TABLE products
      MODIFY category ENUM(
        'skincare',
        'haircare',
        'makeup',
        'fragrance',
        'men',
        'women',
        'kids',
        'wellness',
        'personal wellness',
        'beauty accessories'
      ) NOT NULL
    `);

    // 2) Normalize legacy values to the current category set.
    await sequelize.query(
      "UPDATE products SET category = 'wellness' WHERE category = 'personal wellness'"
    );
    await sequelize.query(
      "UPDATE products SET category = 'makeup' WHERE category = 'beauty accessories'"
    );

    // 3) Lock enum to current supported values.
    await sequelize.query(`
      ALTER TABLE products
      MODIFY category ENUM(
        'skincare',
        'haircare',
        'makeup',
        'fragrance',
        'men',
        'women',
        'kids',
        'wellness'
      ) NOT NULL
    `);

    console.log("Product category enum migration completed.");
  } catch (error) {
    console.error("Failed to migrate product category enum:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
