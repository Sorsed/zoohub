require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const pool = require("./db");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// ==================== Middleware ====================

app.use(
  cors({
    origin: "http://localhost:3000", // ваш фронтенд
    credentials: true, // разрешаем cookies
  })
);
app.use(express.urlencoded({ extended: true })); // для форм

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
// ==================== Сессии ====================
app.use(
  session({
    store: new pgSession({
      pool: pool,
      createTableIfMissing: true, // автоматически создаёт таблицу session
    }),
    secret: "super-secret-key", // лучше хранить в .env
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 день
  })
);

// ==================== Роуты ====================
app.use("/api", router);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is working" });
});

// ==================== Проверка подключения к БД ====================
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err.stack);
  } else {
    console.log("Connected to the database:", res.rows);
  }
});

// ==================== Обработчик ошибок ====================
app.use(errorHandler);

// ==================== Запуск сервера ====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
