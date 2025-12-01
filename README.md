# BizHive - B2B Community & Growth Marketplace

BizHive is a full-stack social platform designed for small business owners to exchange advice and showcase their startups. It solves the "noise" problem of platforms like LinkedIn by strictly separating **Growth/Advice** content from **Self-Promotion** content using a dual-feed system.

## 🚀 Key Features

* **Dual-Feed System:** Users can toggle between "The Growth Hub" (Advice) and "The Showcase" (Promotion).
* **Smart Filtering:** Real-time state management allows instant filtering of content types without page reloads.
* **Categorized Posting:** Users define their post intent (Help vs. Showcase) during creation, with visual color-coding (Green/Purple).
* **RESTful API:** Robust backend handling CRUD operations with validation.
* **SQL Database:** Data persistence using SQLite and Sequelize ORM.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons.
* **Backend:** Node.js, Express.js.
* **Database:** SQLite (SQL), Sequelize ORM.
* **State Management:** React Hooks (useState, useEffect).

## 📂 Project Structure

```text
BizHive/
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI (PostCard, Navbar, etc.)
│   │   └── App.jsx      # Main logic & State
├── server/          # Node.js Backend
│   ├── config/      # Database connection
│   ├── models/      # SQL Table Schemas
│   ├── routes/      # API Endpoints
│   └── index.js     # Server Entry Point