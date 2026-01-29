# Express TypeScript CRUD API

A simple backend service built with **Express.js**, **TypeScript**, and **SQLite** that provides full CRUD (Create, Read, Update, Delete) functionality.

---

## 🚀 Features

- Express.js REST API
- TypeScript support
- SQLite database for data persistence
- CRUD operations
- Basic filtering
- Easy to run locally

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- SQLite (better-sqlite3)

---

## Prerequisites

Make sure you have installed:

- **Node.js** (v18 or later)
- **npm**

Check installation:
```bash
node -v
npm -v
```
---

## 📦 Installation

1. Clone or download the project

2. Open the project folder in Visual Studio Code

3. Install dependencies:
 ```bash
    npm install
```
---

## 📁 Project Structure
```bash
src/
├── app.ts
├── server.ts
├── database.ts
├── routes/
│ └── items.routes.ts
├── controllers/
│ └── items.controller.ts
└── models/
└── item.model.ts

```


## ⚙️ Configuration
-TypeScript is configured using tsconfig.json.


## Database

- Uses SQLite
- Database file: database.db
- The database and tables are created automatically on first run
- No manual configuration is required.

## ▶️ Running the Application
Development Mode
```bash
npm run dev
```

Server will start at:
http://localhost:3000

Production Mode
```bash
npm run build
```
```bash
npm start
```
## 🔗 API Endpoints

- Create Item: POST 
```bash
/items
```
```bash
{
  "name": "Item name",
  "description": "Optional description"
}
```

- List Items: GET 
```bash
/items
```
- Optional filter:
```bash
/items?name=keyword
```

Get Item by ID: GET 
```bash
/items/:id
```

Update Item: PUT 
```bash
/items/:id
```
```bash
{
  "name": "Updated name",
  "description": "Updated description"
}
```

Delete Item: DELETE 
```bash
/items/:id
```
## 🧪 API Testing

You can test the API using:

- Postman
- Browser (for GET requests)

Example:

http://localhost:3000/items
