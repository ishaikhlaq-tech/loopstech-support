# 🎧 LoopTech Support

A modern, full-stack customer support platform engineered with a responsive React frontend, a Node.js/Express backend API, and powered by **Supabase** for database management and authentication.

---

## 🛠️ Tech Stack

- **Frontend:** React, HTML5, CSS3, JavaScript (ES6+), Vite
- **Backend:** Node.js, Express.js
- **Database & Auth:** Supabase (PostgreSQL)
- **Version Control:** Git, GitHub
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 📁 Repository Structure

```text
loopstech-support/
├── backend/                # Server application (Node.js/Express)
│   ├── index.js            # Entry point for the server
│   ├── package.json        # Backend dependencies & scripts
│   └── .env                # Secret keys (ignored by Git)
│
├── frontend/               # Client application (React)
│   ├── src/                # UI components & assets
│   ├── package.json        # Frontend dependencies & scripts
│   └── .env                # Frontend environment config (ignored by Git)
│
├── .gitignore              # Prevents sensitive/heavy files from uploading
└── README.md               # Project documentation

```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* A free [Supabase](https://supabase.com/) account and project setup

---

### 1. Clone the Repository

```bash
git clone https://github.com/ishaikhlaq-tech/loopstech-support.git
cd loopstech-support

```

---

### 2. Configure & Run Backend

1. Navigate into the `backend` folder:
```bash
cd backend

```


2. Install server dependencies:
```bash
npm install

```


3. Create a `.env` file in the `backend/` directory and insert your Supabase credentials:
```env
PORT=5000
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_role_key
# DATABASE_URL=your_postgres_connection_string

```


4. Start the backend server:
```bash
npm start

```


*(Server running on `http://localhost:5000`)*

---

### 3. Configure & Run Frontend

1. Open a new terminal tab and navigate into the `frontend` folder:
```bash
cd frontend

```


2. Install client dependencies:
```bash
npm install

```


3. Create a `.env` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000
# Optional: If your frontend connects directly to Supabase client
# VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```


4. Start the frontend development server:
```bash
npm run dev

```



---

## 🔒 Security & Environment Variables

> **Note:** Sensitive configuration details (`.env` files including Supabase keys) and dependencies (`node_modules/`) are intentionally excluded from this repository to protect secrets and optimize code distribution.

Always set up your Supabase keys directly in your hosting platform's (Render/Vercel) Environment Variables dashboard when deploying to production.

---

## 👨💻 Author

**Ishaikhlaq Tech**

* **GitHub:** [@ishaikhlaq-tech](https://github.com/ishaikhlaq-tech)