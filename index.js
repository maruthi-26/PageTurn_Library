const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "library.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/books/", async (req, res) => {
  const books = await db.all("SELECT * FROM books ORDER BY id;");
  res.status(200).send(books);
});