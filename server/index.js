require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const fs = require("fs");
const path = require("path");

const pool = require("./db");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const fileUpload = require("express-fileupload");

const app = express();
const PORT = process.env.PORT || 5000;

// Доверие прокси (для Render, Heroku и HTTPS-прокси)
app.set("trust proxy", 1);

// ==================== Middleware ====================
app.use(
  cors({
    origin: true, // автоматически разрешает текущий домен и localhost
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static(path.resolve(__dirname, "static")));
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));

// ==================== Сессии ====================
app.use(
  session({
    store: new pgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SECRET_KEY || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "lax",
    },
  })
);

// ==================== Роуты API ====================
const initDb = require("./initDb");

app.get("/api/init-db", async (req, res) => {
  try {
    const force = req.query.force === "true";
    const result = await initDb({ force });
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use("/api", router);

// ==================== Раздача фронтенда (React Build) ====================
const clientBuildPath = path.resolve(__dirname, "../client_/build");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is working" });
  });
}

// ==================== Проверка подключения к БД и автоинициализация ====================
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err.stack);
  } else {
    console.log("Connected to the database:", res.rows);
    initDb().catch((initErr) => {
      console.error("Warning: DB auto-init error on startup:", initErr.message);
    });
  }
});

// ==================== Обработчик ошибок ====================
app.use(errorHandler);

// ==================== Запуск сервера ====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
