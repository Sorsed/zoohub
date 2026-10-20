# ZooHub — Платформа помощи бездомным животным

<div align="center">

![ZooHub Banner](client_/src/assets/hero-pets.jpg)

**Современный веб-сервис для поиска питомцев, поддержки приютов и координации волонтёров.**

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Bootstrap%20%7C%20MobX-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg)](https://www.postgresql.org/)

</div>

---

## 🌟 Основные возможности

1. **Каталог питомцев с умной фильтрацией**:
   - Фильтры по виду животного (собаки, кошки, птицы, грызуны, другие), возрасту, городу и категории объявления (*Ищет дом*, *Потерялся*, *Найден*, *Нужна передержка*).
   - Блок быстрых бытовых тегов **«Важно для дома»**: *Стерилизован / кастрирован*, *Привит*, *Ладит с детьми*, *Ладит с другими животными*.
   - Текстовый живой поиск по кличке, породе и описанию.
   - Сортировка по новизне и возрасту.

2. **Интерактивный тест-подбор питомца (`/quiz`)**:
   - 8 продуманных вопросов об образе жизни (свободное время, жильё, активность, аллергии, дети, другие питомцы, опыт).
   - Определение 5 ключевых архетипов: *«Верный компаньон для прогулок»*, *«Кот-философ»*, *«Золотой друг для семьи»*, *«Компактный хвостик для квартиры»*, *«Самостоятельный пушистик»*.
   - Персональные советы кинолога и кнопка прямого перехода в каталог с предустановленными фильтрами.

3. **Режим доступности для слабовидящих**:
   - Быстрое переключение в шапке сайта.
   - Увеличение шрифта (3 размера: нормальный, крупный, очень крупный).
   - Цветовые схемы повышенной контрастности (стандартная, черным по белому, белым по черному, синяя).
   - Управление интервалами и скрытие декоративных изображений.

4. **Панель модератора (`/moderation` или `/admin`)**:
   - Доступна для пользователей с ролью `user_type = 4`.
   - Живой поиск по кличке, автору, телефону, email и номеру объявления.
   - Быстрое редактирование любых объявлений и безопасное удаление с подтверждением.

5. **Личные кабинеты и роли**:
   - Частные лица (`user_type = 1`).
   - Официальные приюты (`user_type = 2`) с отображением реквизитов и этапов адаптации.
   - Волонтёры (`user_type = 3`) со специальными бейджами и контактами.
   - Модераторы (`user_type = 4`).

---

## 🛠 Технологический стек

- **Frontend**: React (Create React App), React-Bootstrap, React Router v6, MobX (`mobx-react-lite`), `lucide-react`, `react-toastify`, Axios.
- **Backend**: Node.js, Express, `pg` (PostgreSQL пул), `express-fileupload`, сессии через `connect-pg-simple` и cookies.
- **База данных**: PostgreSQL 14+ (нормализованная схема с таблицами `user`, `animal`, `animal_type`, `advertisement`, `animal_photos`, `favourite`, `stages`, `location`).

---

## 🚀 Быстрый запуск локально

### 1. Клонирование и установка зависимостей

```bash
git clone https://github.com/Sorsed/zoohub.git
cd zoohub

# Установка зависимостей сервера и клиента
npm install --prefix server
npm install --prefix client_
```

### 2. Настройка переменных окружения

Создайте файл `server/.env`:

```env
PORT=5000
DB_NAME=zoohub
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your_secret_key
```

### 3. Инициализация базы данных

```bash
npm run seed
```

### 4. Запуск в режиме разработки

```bash
# В первом терминале (сервер на порту 5000)
npm run server

# Во втором терминале (клиент на порту 3000)
npm run client
```

---

## ☁️ Развертывание на Render.com

1. Создайте **PostgreSQL Database** на [Render.com](https://render.com) (Тариф *Free*). Скопируйте строку подключения `Internal Database URL`.
2. Создайте **Web Service** на Render из этого репозитория:
   - **Build Command:** `npm run render-build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `DATABASE_URL` = `<скопированная строка подключения>`
     - `SECRET_KEY` = `<любой секретный ключ>`
     - `NODE_ENV` = `production`
3. Во вкладке **Shell** сервиса на Render запустите `npm run seed` для создания таблиц и демо-данных.
