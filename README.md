# Bogdanov FitTrack

Веб-приложение для учета тренировок, целей и динамики физической активности.

## Стек

- **Frontend:** React, Tailwind CSS, Chart.js, Axios
- **Backend:** Node.js, Express, Mongoose, JWT
- **DB:** MongoDB

## Ключевые возможности

- Регистрация и авторизация пользователя (JWT)
- Календарь тренировок с добавлением записей
- Управление фитнес-целями и отслеживание прогресса
- Профиль пользователя и графики динамики веса/активности
- Блок рекомендаций по тренировкам
- Светлая/темная тема интерфейса

## Структура проекта

```text
fitness-track/
├── client/                # React-приложение
├── server/                # Express API
├── Метод_указ_...md       # Методические указания для ВКР
└── v1_Bogdanov09-253.*    # Черновики дипломной работы
```

## Установка и запуск

### 1) Установить зависимости

```bash
cd client
npm install

cd ../server
npm install
```

### 2) Настроить переменные окружения (backend)

Создайте файл `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/fitness-tracker
JWT_SECRET=replace_with_strong_secret
PORT=5001
```

### 3) Запуск приложения

В двух терминалах:

```bash
cd server
npm run dev
```

```bash
cd client
npm start
```

Frontend: `http://localhost:3000`  
Backend API: `http://localhost:5001`

## Скрипты

### Frontend (`client/package.json`)

- `npm start` — dev-сервер
- `npm run build` — production-сборка
- `npm test -- --watchAll=false --passWithNoTests` — запуск тестов в CI-режиме

### Backend (`server/package.json`)

- `npm start` — запуск сервера
- `npm run dev` — запуск с nodemon
- `npm run init-recommendations` — инициализация коллекции рекомендаций

## API (основные маршруты)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/user`
- `POST /api/auth/logout`
- `GET/POST/PUT/DELETE /api/workouts...`
- `GET/POST/PUT/DELETE /api/goals...`
- `GET /api/users/weight-history`
- `GET /api/recommendations/:goal/:level`

## Проверка качества

Минимальная локальная проверка:

```bash
cd client
npm run build
npm test -- --watchAll=false --passWithNoTests
```

## Автор

Богданов Артур Владимирович  
КФУ, направление «Прикладная информатика»
