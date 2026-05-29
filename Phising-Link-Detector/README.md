#  Phising Link Detector

Welcome to **Phising Link Detector** — a modern, full-stack web application featuring a robust Node.js/Express backend (with Prisma ORM) and a lightning-fast React (Vite) frontend. Easily run locally or with Docker!

---

## 📁 Project Structure

```text
vansh Webite 2/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── routes/
│   │   └── scan.js
│   ├── tests/
│   │   └── analyzer.test.js
│   └── utils/
│       └── analyzer.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── App.css
│       ├── index.css
│       ├── assets/
│       └── components/
│           ├── History.jsx
│           └── ResultCard.jsx
├── package.json
└── sample_data.sql
```

---

## 🛠️ Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **Docker & Docker Compose** (optional, for containerized setup)

---

## ⚡ Quick Start (Local Development)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Backend Setup

- Configure your database in `backend/prisma/schema.prisma` and set environment variables as needed.
- If using Prisma, run:
  ```bash
  npx prisma generate
  npx prisma migrate dev
  ```
- Start the backend server:
  ```bash
  npm start
  # or
  npm run dev
  ```

### 3. Frontend Setup

```bash
cd frontend
npm run dev
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.



## 🧪 Testing

- Backend tests are in `backend/tests/`.
- Run tests with:
  ```bash
  cd backend
  npm test
  ```


## 🗃️ Sample Data

- Use `sample_data.sql` to initialize your database with example data.


## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.


## 📄 License

This project is licensed under the MIT License.

---
