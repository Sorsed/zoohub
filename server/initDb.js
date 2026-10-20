const fs = require("fs");
const path = require("path");
const pool = require("./db");
const seed = require("./seed");

let isInitializing = false;

async function initDb({ force = false } = {}) {
  if (isInitializing) {
    console.log("⏳ DB initialization already in progress...");
    return { success: false, message: "DB initialization is already in progress." };
  }

  isInitializing = true;
  try {
    console.log("🔄 Starting database initialization / migration...");

    // 1. Run schema.sql to ensure all tables exist
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schemaSql);
    console.log("✅ Schema successfully verified and applied.");

    // 2. Check if animals are already present
    const countRes = await pool.query("SELECT COUNT(*) FROM animal");
    const animalCount = parseInt(countRes.rows[0].count, 10);

    if (animalCount === 0 || force) {
      console.log(`🌱 Running seed (current animal count: ${animalCount}, force: ${force})...`);
      await seed();
      const updatedCount = await pool.query("SELECT COUNT(*) FROM animal");
      return {
        success: true,
        message: `Database initialized and seeded successfully with ${updatedCount.rows[0].count} animals!`,
      };
    } else {
      console.log(`ℹ️ Database already has ${animalCount} animals. Skipping demo seeding.`);
      return {
        success: true,
        message: `Database already initialized with ${animalCount} animals.`,
      };
    }
  } catch (err) {
    console.error("❌ Database initialization error:", err);
    throw err;
  } finally {
    isInitializing = false;
  }
}

if (require.main === module) {
  initDb({ force: process.argv.includes("--force") })
    .then((res) => {
      console.log("Init result:", res);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = initDb;
