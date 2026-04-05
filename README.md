# Logistic Hackathon

Монорепозиторій для логістичного застосунку з поділом на три сервіси:
- **Frontend** на Next.js
- **Backend API** на NestJS + Prisma
- **Python Service** на FastAPI

## Демо

- **Frontend:** [https://logistic-hackaton.vercel.app](https://logistic-hackaton.vercel.app)
- **Backend API та Python service:** задеплоєні на Render.

**Увага щодо cold start:**
Render може "засинати" на free-tier або в режимі low-traffic. Перший запит після простою може бути повільнішим або завершитися із затримкою. Це нормальна поведінка.

**Статус фронтенду:**
- Динамічний reroute замовлень знаходиться в розробці.
- Екстренні алерти знаходяться в розробці.
- Інші базові сценарії (мапа, замовлення, бригади, ресурси) вже зібрані в поточній версії.

## Архітектура

```mermaid
flowchart LR
  U[User Browser]
  FE[Frontend - Next.js]
  BE[Backend API - NestJS]
  ALG[Python Service - FastAPI]
  DB[(PostgreSQL)]

  U --> FE
  FE --> BE
  BE --> DB
  BE --> ALG
```

### Основні архітектурні рішення

1. **Монорепозиторій з трьома сервісами**
   *Плюс:* одна кодова база для швидкої синхронізації змін між клієнтом, API та алгоритмами.
2. **Винесений Python service**
   *Плюс:* ізоляція обчислювальної логіки в окремий сервіс, який можна масштабувати незалежно від API.
3. **Backend як єдина точка доступу до БД**
   *Плюс:* централізована валідація, контроль доступу та стабільний контракт для фронтенду.
4. **Prisma як ORM-шар**
   *Плюс:* типобезпечна робота з БД, контроль схеми через міграції.
5. **Роздільний деплой**
   *Плюс:* швидкий CDN-деплой UI (Vercel) та незалежні цикли релізів для серверних сервісів (Render).

## Технологічний стек

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, React-Leaflet
- **Backend:** NestJS 11, TypeScript, Prisma 6, PostgreSQL
- **Python Service:** FastAPI, Pydantic, Uvicorn, Python 3.11+

## Локальний запуск (додатково)

Найзручніший спосіб розгорнути проект локально — використати Docker для бази даних.

### 1. Передумови

Впевніться, що у вас встановлено:
- Node.js 20+
- npm 10+
- Python 3.11+
- Docker та Docker Compose (для локальної БД)

### 2. Запуск бази даних через Docker

```bash
cd backend
docker-compose up -d
```
*Це підніме локальний інстанс PostgreSQL на порту 5432.*

### 3. Налаштування змінних середовища

**Backend:**
Створіть файл `backend/.env` (можна скопіювати з `.env.example`, якщо він є) та додайте наступні значення:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/logistic_db"
DIRECT_URL="postgresql://postgres:password@localhost:5432/logistic_db"
PYTHON_MICROSERVICE_URL="http://localhost:8000/optimize"
PORT=8080
```
*(Порт 8080 використовується, щоб уникнути конфлікту з фронтендом).*

**Frontend:**
Створіть файл `frontend/.env.local`:

```env
NEXT_PUBLIC_BASE_URL="http://localhost:8080"
```

### 4. Встановлення залежностей та ініціалізація БД

Виконайте команди для кожного сервісу:

```bash
# Frontend
cd frontend
npm install

# Backend (встановлення, міграції та наповнення тестовими даними)
cd ../backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Algorithm Service
cd ../algorithm-service
python3 -m venv .venv
source .venv/bin/activate  # Для Windows: .venv\Scripts\activate
pip install -r requirements.txt
```
*Команда `npx prisma db seed` наповнить базу початковими тестовими даними для зручного тестування.*

### 5. Запуск сервісів

Відкрийте 3 окремих термінали:

**Термінал 1 (Algorithm Service):**
```bash
cd algorithm-service
source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Термінал 2 (Backend):**
```bash
cd backend
npm run start:dev
```

**Термінал 3 (Frontend):**
```bash
cd frontend
npm run dev
```

### 6. Локальні URL для перевірки

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Python Service (Swagger UI):** http://localhost:8000/docs

## Команди для розробки

### Frontend
- `npm run dev` — запуск локального сервера
- `npm run build` — збірка для продакшену
- `npm run lint` — перевірка коду

### Backend
- `npm run start:dev` — запуск у режимі розробки
- `npx prisma studio` — зручний UI для перегляду локальної бази даних

### Python Service
- `uvicorn main:app --reload` — запуск з автоперезавантаженням
