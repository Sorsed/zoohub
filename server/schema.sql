-- Schema for zoohub (derived from raw SQL usage in server/controllers)
-- Apply with: psql -h localhost -U postgres -d zoohub -f schema.sql

CREATE TABLE IF NOT EXISTS location (
  location_id   SERIAL PRIMARY KEY,
  location_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
  user_id                   SERIAL PRIMARY KEY,
  user_name                 TEXT NOT NULL,
  user_surname              TEXT,
  user_email                TEXT UNIQUE NOT NULL,
  user_password             TEXT NOT NULL,
  user_phone                TEXT,
  location_id               INTEGER REFERENCES location(location_id),
  user_ava_photo            TEXT,
  user_type                 INTEGER DEFAULT 1,
  user_shelter_description  TEXT,
  user_shelter_site         TEXT,
  user_shelter_address      TEXT,
  shelter_latitude          DOUBLE PRECISION,
  shelter_longitude         DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS animal_type (
  type_id   SERIAL PRIMARY KEY,
  type_name TEXT
);

CREATE TABLE IF NOT EXISTS animal (
  animal_id         SERIAL PRIMARY KEY,
  animal_name       TEXT NOT NULL,
  age               DOUBLE PRECISION,
  breed             TEXT,
  description       TEXT,
  type_id           INTEGER REFERENCES animal_type(type_id),
  is_sterilized     BOOLEAN DEFAULT false,
  is_vaccinated     BOOLEAN DEFAULT false,
  good_with_kids    BOOLEAN DEFAULT false,
  good_with_animals BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS animal_photos (
  animal_photo_id  SERIAL PRIMARY KEY,
  animal_id        INTEGER REFERENCES animal(animal_id) ON DELETE CASCADE,
  animal_photo_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS advertisement (
  advertisement_id   SERIAL PRIMARY KEY,
  user_id            INTEGER REFERENCES "user"(user_id),
  animal_id          INTEGER REFERENCES animal(animal_id),
  type_advertisement INTEGER,
  status             INTEGER DEFAULT 0,
  location_name      TEXT,
  tutor_name         TEXT,
  tutor_number       TEXT,
  tutor_email        TEXT,
  created_at         TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stages (
  stage_id            SERIAL PRIMARY KEY,
  advertisement_id    INTEGER REFERENCES advertisement(advertisement_id) ON DELETE CASCADE,
  stage_name          TEXT,
  stage_description   TEXT,
  stage_date_start    DATE,
  stage_date_finish   DATE
);

CREATE TABLE IF NOT EXISTS favourite (
  favourites_id SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES "user"(user_id)
);

CREATE TABLE IF NOT EXISTS favourite_advertisement (
  favourite_id     INTEGER REFERENCES favourite(favourites_id) ON DELETE CASCADE,
  advertisement_id INTEGER REFERENCES advertisement(advertisement_id) ON DELETE CASCADE
);

-- Seed default location (frontend hardcodes location_id = 1 on registration)
INSERT INTO location (location_id, location_name)
VALUES (1, 'Самара')
ON CONFLICT (location_id) DO NOTHING;

SELECT setval('location_location_id_seq', (SELECT MAX(location_id) FROM location));

-- Seed animal types
INSERT INTO animal_type (type_id, type_name)
VALUES
  (1, 'Собака'),
  (2, 'Кошка'),
  (3, 'Попугай'),
  (4, 'Хомяк'),
  (5, 'Кролик'),
  (6, 'Черепаха'),
  (7, 'Лошадь'),
  (8, 'Рыбка'),
  (9, 'Игуана'),
  (10, 'Другое'),
  (11, 'Птица'),
  (12, 'Грызун')
ON CONFLICT (type_id) DO NOTHING;

SELECT setval('animal_type_type_id_seq', (SELECT MAX(type_id) FROM animal_type));
