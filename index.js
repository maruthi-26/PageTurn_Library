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
app.get("/books/", async (request, response) => {
  const { genre = "" } = request.query;

  let getBooksQuery = `SELECT * FROM books`;
  let params = [];

  if (genre) {
    getBooksQuery += ` WHERE genre LIKE ?`;
    params.push(`%${genre}%`);
  }

  getBooksQuery += ` ORDER BY id;`;

  const books = await db.all(getBooksQuery, params);
  response.status(200).send(books);
});

// GET one book by ID
app.get("/books/:bookId/", async (req, res) => {
  const { bookId } = req.params;
  const book = await db.get("SELECT * FROM books WHERE id = ?;", [bookId]);
  if (!book) return res.status(404).send({ message: "Book not found" });
  res.status(200).send(book);
});

// POST - Add a new book
app.post("/books/", async (request, response) => {
  const { name, genre } = request.body;

  if (!name || !genre) {
    return response.status(400).send({
      message: "Name and genre are required",
    });
  }

  const existingBook = await db.get(
    `SELECT * FROM books WHERE LOWER(name) = LOWER(?);`,
    [name]
  );

  if (existingBook) {
    return response.status(409).send({
      message: `Book ${name} already exists`,
    });
  }

  const addBookQuery = `
    INSERT INTO books (name, genre)
    VALUES (?, ?);
  `;
  const dbResponse = await db.run(addBookQuery, [name, genre]);

  response.status(201).send({
    message: "Book added successfully",
    bookId: dbResponse.lastID,
  });
});

app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { name, genre } = request.body;


  if (!name || !genre) {
    return response.status(400).send({
      message: "Name and genre are required",
    });
  }

  // Check if book exists
  const book = await db.get(`SELECT * FROM books WHERE id = ?;`, [bookId]);
  if (book === undefined) {
    return response.status(404).send({ message: "Book not found" });
  }

  const existingBook = await db.get(
    `SELECT * FROM books WHERE LOWER(name) = LOWER(?) AND id != ?;`,
    [name, bookId]
  );

  if (existingBook) {
    return response.status(409).send({
      message: `Book ${name} already exists`,
    });
  }

  const updateBookQuery = `
    UPDATE books
    SET name = ?, genre = ?
    WHERE id = ?;
  `;
  await db.run(updateBookQuery, [name, genre, bookId]);
  response.status(200).send({ message: "Book updated successfully" });
});

// DELETE a book
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const book = await db.get(`SELECT * FROM books WHERE id = ?;`, [bookId]);
  if (book === undefined) {
    return response.status(404).send({ message: "Book not found" });
  }

  const deleteBookQuery = `DELETE FROM books WHERE id = ?;`;
  await db.run(deleteBookQuery, [bookId]);
  response.status(200).send({ message: "Book deleted successfully" });
});

// GET all loans with reader name and book name 
app.get("/loans/", async (req, res) => {
  const query = `
  SELECT loans.id, readers.name AS reader_name,
  books.name AS book_name, loans.loan_date
  FROM loans
  INNER JOIN readers ON loans.reader_id = readers.id
  INNER JOIN books ON loans.book_id = books.id
  ORDER BY loans.id;
  `;
  const loans = await db.all(query);
  res.status(200).send(loans); });