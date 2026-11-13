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

// GET all books
app.get("/books/", async (req, res) => {
  const books = await db.all("SELECT * FROM books ORDER BY id;");
  res.status(200).send(books);
});

// GET one book by ID
app.get("/books/:bookId/", async (req, res) => {
  const { bookId } = req.params;
  const book = await db.get("SELECT * FROM books WHERE id = ?;", [bookId]);
  if (!book) return res.status(404).send({ message: "Book not found" });
  res.status(200).send(book);
});

// POST - Add a new book
app.post("/books/", async (req, res) => {
  const { name, genre } = req.body;
  const result = await db.run(
    "INSERT INTO books (name, genre) VALUES (?, ?);", [name, genre]
  );
  res.status(201).send({ message: "Book added successfully", bookId: result.lastID });
});

// PUT - Update a book
app.put("/books/:bookId/", async (req, res) => {
  const { bookId } = req.params;
  const { name, genre } = req.body;
  const book = await db.get("SELECT * FROM books WHERE id = ?;", [bookId]);
  if (!book) return res.status(404).send({ message: "Book not found" });
  await db.run("UPDATE books SET name = ?, genre = ? WHERE id = ?;", [name, genre, bookId]);
  res.status(200).send({ message: "Book updated successfully" });
});

// DELETE a book
app.delete("/books/:bookId/", async (req, res) => {
  const { bookId } = req.params;
  const book = await db.get("SELECT * FROM books WHERE id = ?;", [bookId]);
  if (!book) return res.status(404).send({ message: "Book not found" });
  await db.run("DELETE FROM books WHERE id = ?;", [bookId]);
  res.status(200).send({ message: "Book deleted successfully" });
});
