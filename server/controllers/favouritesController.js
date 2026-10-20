const pool = require("../db");
const ApiError = require("../error/ApiError");

// Helper: получить или создать ID избранного для пользователя
async function getOrCreateFavouriteId(userId) {
  const existing = await pool.query(
    "SELECT favourites_id FROM favourite WHERE user_id = $1",
    [userId]
  );
  if (existing.rows.length > 0) {
    return existing.rows[0].favourites_id;
  }
  const created = await pool.query(
    "INSERT INTO favourite (user_id) VALUES ($1) RETURNING favourites_id",
    [userId]
  );
  return created.rows[0].favourites_id;
}

class FavouritesController {
  // 📋 Получить все избранные объявления текущего пользователя
  async getAll(req, res, next) {
    try {
      const user_id = req.user.id;
      // Гарантируем, что запись пользователя в favourite существует
      await getOrCreateFavouriteId(user_id);

      const favourites = await pool.query(
        `
          SELECT 
            a.advertisement_id,
            an.animal_name,
            an.breed,
            an.description,
            an.age,
            a.location_name,
            COALESCE(
              MAX(ap.animal_photo_url)
            ) AS preview_photo
          FROM favourite_advertisement f
          INNER JOIN favourite ON f.favourite_id = favourite.favourites_id
          JOIN advertisement a ON f.advertisement_id = a.advertisement_id
          JOIN animal an ON a.animal_id = an.animal_id
          LEFT JOIN animal_photos ap ON an.animal_id = ap.animal_id
          WHERE favourite.user_id = $1
          GROUP BY 
            a.advertisement_id, 
            an.animal_name, 
            an.breed, 
            an.description, 
            an.age, 
            a.location_name
          ORDER BY a.created_at DESC;
        `,
        [user_id]
      );

      res.json(favourites.rows);
    } catch (err) {
      console.error("Ошибка при получении избранных:", err);
      next(ApiError.internal("Ошибка при получении избранных объявлений"));
    }
  }

  // ➕ Добавить объявление в избранное
  async addFav(req, res, next) {
    try {
      const user_id = req.user.id;
      const { advertisement_id } = req.body;

      if (!advertisement_id) {
        return next(ApiError.badRequest("Не указан ID объявления"));
      }

      const favId = await getOrCreateFavouriteId(user_id);

      // Проверка на дубликаты
      const exists = await pool.query(
        "SELECT 1 FROM favourite_advertisement WHERE favourite_id = $1 AND advertisement_id = $2",
        [favId, parseInt(advertisement_id)]
      );

      if (exists.rows.length === 0) {
        await pool.query(
          "INSERT INTO favourite_advertisement (favourite_id, advertisement_id) VALUES ($1, $2)",
          [favId, parseInt(advertisement_id)]
        );
      }

      res.json({ message: "Добавлено в избранное" });
    } catch (err) {
      console.error("Ошибка при добавлении в избранное:", err);
      next(ApiError.internal("Ошибка при добавлении в избранное"));
    }
  }

  // ➖ Удалить из избранного
  async delFav(req, res, next) {
    try {
      const user_id = req.user.id;
      const { advertisement_id } = req.body;

      if (!advertisement_id) {
        return next(ApiError.badRequest("Не указан ID объявления"));
      }

      const favId = await getOrCreateFavouriteId(user_id);

      await pool.query(
        "DELETE FROM favourite_advertisement WHERE favourite_id = $1 AND advertisement_id = $2",
        [favId, parseInt(advertisement_id)]
      );

      res.json({ message: "Удалено из избранного" });
    } catch (err) {
      console.error("Ошибка при удалении из избранного:", err);
      next(ApiError.internal("Ошибка при удалении из избранного"));
    }
  }

  // 🔍 Проверить, находится ли объявление в избранном
  async getOne(req, res) {
    try {
      const userId = req.user?.id || req.session?.userId;
      const adId = req.params.id;

      if (!userId || !adId) {
        return res.json({ isFavourite: false });
      }

      const check = await pool.query(
        `SELECT 1 FROM favourite_advertisement fa
         INNER JOIN favourite f ON fa.favourite_id = f.favourites_id
         WHERE f.user_id = $1 AND fa.advertisement_id = $2`,
        [userId, parseInt(adId)]
      );

      res.json({ isFavourite: check.rows.length > 0 });
    } catch (err) {
      console.error("Ошибка при проверке избранного:", err);
      res.json({ isFavourite: false });
    }
  }
}

module.exports = new FavouritesController();
