# ZooHub — Контекст проекта и системный промпт для ИИ-ассистента

> **Инструкция для пользователя:**  
> Если в новом диалоге с ИИ вы хотите продолжить работу над ZooHub, просто напишите:  
> `«Прочитай файл AI_CONTEXT.md в корне проекта zoohub и помоги мне с...»`

---

## 📌 1. О проекте (ZooHub)
**ZooHub** — полнофункциональный веб-сервис для поиска, усыновления и помощи бездомным животным.
- **Целевая аудитория:** приюты, волонтёры, люди, желающие завести питомца или нашедшие потерявшееся животное.
- **Ключевой функционал:**
  - 🐶 Каталог питомцев с расширенной фильтрацией (вид, возраст, пол, особенности).
  - 🎯 Интерактивный квиз «Подбор питомца» с персональными рекомендациями.
  - 🗺️ Интерактивная карта Яндекс Карт с приютами и местами нахождения животных.
  - 🛡️ Панель модерации объявлений (одобрение / отклонение, управление статусами).
  - ⭐ Избранное, отзывы и рейтинги, форма обратной связи.

---

## 🏗️ 2. Архитектура и стек технологий

### Frontend (`/client_`)
- **React 19**, `react-router-dom` v6, `react-bootstrap`, Bootstrap 5.
- **Библиотеки:** `@fortawesome/react-fontawesome`, `react-yandex-maps`.
- **Особенности сборки:**
  - Создан на Create React App (`react-scripts`).
  - Для сборки используется флаг `CI=false` (предотвращает падение билда из-за warning'ов linter'а).
  - Конфликт peer-зависимостей `react-yandex-maps` с React 19 решён через `--legacy-peer-deps` и файл `.npmrc` (`legacy-peer-deps=true`).

### Backend (`/server`)
- **Node.js** (v24 LTS), **Express 5**.
- **БД-драйвер:** `pg` (Pool) с поддержкой SSL (`rejectUnauthorized: false` для облачных БД).
- **Раздача статики:** В продакшене Express раздаёт билд фронтенда из `client_/build`.
- **Важный нюанс Express 5:** В Express 5 обновлен `path-to-regexp` v8, поэтому `app.get('*')` вызывает фатальную ошибку `PathError: Missing parameter name at index 1: *`. Вместо этого SPA catch-all реализован через middleware `app.use((req, res, next) => { ... })`.

### База данных (PostgreSQL)
- Подключение настраивается в [server/db.js](file:///home/sors/zoohub/server/db.js).
- Поддерживает как строку подключения `DATABASE_URL`, так и отдельные переменные: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
- **Скрипт инициализации и демо-данных:** [server/seed.js](file:///home/sors/zoohub/server/seed.js) (`npm run seed`). Создаёт таблицы (`users`, `pets`, `shelters`, `reviews` и др.) и наполняет их реалистичными карточками животных.

---

## 🌐 3. Репозиторий и продакшен деплой

| Ресурс | Ссылка / Идентификатор | Примечание |
|---|---|---|
| **GitHub Репозиторий** | [github.com/Sorsed/zoohub](https://github.com/Sorsed/zoohub) | Ветка `master`, аккаунт `Sorsed` |
| **Хостинг Web Service** | [zoohub.onrender.com](https://zoohub.onrender.com) | Render.com (Free tier, ID: `srv-dbbfigjrjlhs73e3mlc0`) |
| **База данных Render** | `zoohub-db` (PostgreSQL 18) | ID: `dpg-dbbfdvnavr4c73dml77g-a` (Франкфурт) |

### Специфика бесплатного тарифа Render:
1. **Web Service:** Живёт бессрочно. При отсутствии трафика более 15 минут засыпает (холодный старт при следующем заходе ~40-50 секунд).
2. **База данных PostgreSQL:** Бесплатный инстанс на Render создаётся на 30 дней (до 19 ноября 2026).
   - *Для вечной бесплатной работы:* можно подключить [Neon.tech](https://neon.tech) или [Supabase.com](https://supabase.com), скопировав строку подключения в `DATABASE_URL`.

---

## 🔑 4. Тестовые аккаунты (после `npm run seed`)

- **Модератор / Администратор:**
  - Email: `admin@zoohub.ru`
  - Пароль: `password123`
- **Обычный пользователь:**
  - Email: `user@zoohub.ru`
  - Пароль: `password123`

---

## 🛠️ 5. Команды для локальной разработки и деплоя

```bash
# Установка всех зависимостей
npm run render-build

# Локальный запуск бэкенда
npm run start:server   # или: cd server && npm start

# Локальный запуск фронтенда
npm run start:client   # или: cd client_ && npm start

# Скрипт инициализации и демо-данных
npm run init-db        # или node server/initDb.js
# Также есть эндпоинт в браузере: https://zoohub.onrender.com/api/init-db (автоматически создаёт таблицы и наполняет данными)
```

---

## 🤖 6. Промпт для ИИ-ассистента (AI Prompt)

```text
Ты — опытный Fullstack разработчик (Node.js/Express, React, PostgreSQL).
Мы работаем над проектом ZooHub (https://github.com/Sorsed/zoohub).

Ключевой контекст:
1. Фронтенд: React 19 в папке `client_`. При сборке обязательно учитывать `--legacy-peer-deps` и `CI=false`.
2. Бэкенд: Express 5 в папке `server`. Не используй `app.get('*')` из-за path-to-regexp v8 в Express 5, используй middleware fallback `app.use((req, res, next) => ...)`.
3. База данных: PostgreSQL с `pg` Pool в `server/db.js`. При наличии `DATABASE_URL` всегда включать SSL с `rejectUnauthorized: false`.
4. Деплой настроен на Render.com (Web Service `zoohub`, URL: https://zoohub.onrender.com).
5. GitHub пользователя: Sorsed (репозиторий: https://github.com/Sorsed/zoohub, ветка master).
6. Структура проекта:
   - client_/src/components — интерфейсные компоненты (Header, Footer, AnimalCard, Quiz, Map, etc.)
   - client_/src/pages — страницы (Home, Catalog, AnimalDetail, ShelterList, Moderation, etc.)
   - server/routes — API эндпоинты (/api/pets, /api/auth, /api/quiz, /api/shelters)
   - server/db.js — подключение к БД
   - server/seed.js — миграция и демо-данные

Перед внесением изменений всегда проверяй целостность зависимостей и совместимость с продакшен-деплоем на Render.
Отвечай кратко, по делу и на русском языке.
```
