const pool = require("../db"); // твое подключение к БД
const ApiError = require("../error/ApiError");

class FavouritesController {
  // 📋 Получить все избранные объявления текущего пользователя
  async getAll(req, res, next) {
    try {
      const user_id = req.user.id;

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
      console.error(err);
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

      /*// Проверка, есть ли уже в избранном
      const exists = await pool.query(
        "SELECT * FROM favourite WHERE user_id = $1 AND advertisement_id = $2",
        [user_id, advertisement_id]
      );
      if (exists.rows.length > 0) {
        return res.json({ message: "Уже в избранном" });
      }*/
      const tmp = await pool.query(
        "Select favourite.favourites_id as tem from favourite where user_id=$1 ",
        [user_id]
      );
      console.log(advertisement_id);
      console.log(tmp.rows[0].tem);

      await pool.query(
        "INSERT INTO favourite_advertisement (favourite_id, advertisement_id) VALUES ($1, $2)",
        [tmp.rows[0].tem, advertisement_id]
      );

      res.json({ message: "Добавлено в избранное" });
    } catch (err) {
      console.error(err);
      next(ApiError.internal("Ошибка при добавлении в избранное"));
    }
  }

  //  Удалить из избранного
  async delFav(req, res, next) {
    try {
      const user_id = req.user.id;
      const { advertisement_id } = req.body;

      if (!advertisement_id) {
        return next(ApiError.badRequest("Не указан ID объявления"));
      }

      const tmp = await pool.query(
        "Select favourite.favourites_id as tem from favourite where user_id=$1 ",
        [user_id]
      );
      console.log(advertisement_id);
      console.log(tmp.rows[0].tem);

      await pool.query(
        "Delete from favourite_advertisement where favourite_id=$1 and advertisement_id=$2",
        [tmp.rows[0].tem, advertisement_id]
      );

      res.json({ message: "Удалено из избранного" });
    } catch (err) {
      console.error(err);
      next(ApiError.internal("Ошибка при удалении из избранного"));
    }
  }

  // Проверить, находится ли объявление в избранном
  async getOne(req, res) {
    const userId = req.user.id;
    const adId = req.params.id;
    const check = await pool.query(
      `SELECT 1 FROM favourite_advertisement 
    inner join favourite on favourite_advertisement.favourite_id=favourite.favourites_id
      WHERE user_id = $1 AND advertisement_id = $2`,
      [userId, adId]
    );
    res.json({ isFavourite: check.rows.length > 0 });
  }
}

module.exports = new FavouritesController();
