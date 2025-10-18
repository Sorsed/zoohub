const pool = require("../db");
const ApiError = require("../error/ApiError");

class ShelterController {
  async allShelters(req, res, next) {
    try {
      const sheltersQuery = await pool.query(
        `SELECT user_id, user_name, user_surname, user_phone, user_email,
                user_ava_photo, user_shelter_description, user_shelter_site,
                user_shelter_address, shelter_latitude, shelter_longitude
         FROM "user"
         WHERE user_type = 2` // приюты
      );

      res.json(sheltersQuery.rows);
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при получении приютов"));
    }
  }
}

module.exports = new ShelterController();
