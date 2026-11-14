# PageTurn Library

**Backend Development Fundamentals – Group Assignment**  
**Group:** JP-GAI2B-G02  
**Theme:** Book Lending (Theme 2 of 30)  
**Twist:** No Duplicate Book Names (case-insensitive)

---

## Project Description

PageTurn Library is a library management system built with Node.js, Express and SQLite.  
It manages readers, books and loans. The system enforces a special business rule: **two books cannot have the same name**, even if the capital letters are different. A duplicate attempt returns `409 Conflict`.

---

## Technologies Used

- Node.js
- Express.js
- SQLite3
- Postman

---

## How to Run

1. Clone the repository
```bash
git clone https://github.com/maruthi-26/PageTurn_Library.git
cd PageTurn_Library
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
nodemon index.js
```

Server runs at: **http://localhost:3000**

---

## Database

The project uses a SQLite database file: `library.db`

### Tables and Columns

#### 1. `readers`
| Column | Type    | Description              |
|--------|---------|--------------------------|
| id     | INTEGER | Primary Key              |
| name   | TEXT    | Name of the reader       |
| email  | TEXT    | Email of the reader      |

#### 2. `books`
| Column | Type    | Description              |
|--------|---------|--------------------------|
| id     | INTEGER | Primary Key              |
| name   | TEXT    | Name of the book         |
| genre  | TEXT    | Genre of the book        |

#### 3. `loans`
| Column    | Type    | Description                          |
|-----------|---------|--------------------------------------|
| id        | INTEGER | Primary Key                          |
| reader_id | INTEGER | Foreign Key → readers(id)            |
| book_id   | INTEGER | Foreign Key → books(id)              |
| loan_date | TEXT    | Date when the book was loaned        |

---

## API Endpoints

| Method | Endpoint              | Description                                      | Success | Error Cases      |
|--------|-----------------------|--------------------------------------------------|---------|------------------|
| GET    | `/books/`             | Get all books                                    | 200     | -                |
| GET    | `/books/?genre=...`   | Search books by genre (partial match)            | 200     | -                |
| GET    | `/books/:bookId/`     | Get a single book by ID                          | 200     | 404              |
| POST   | `/books/`             | Add a new book                                   | 201     | 400, 409         |
| PUT    | `/books/:bookId/`     | Update an existing book                          | 200     | 400, 404, 409    |
| DELETE | `/books/:bookId/`     | Delete a book                                    | 200     | 404              |
| GET    | `/loans/`             | Get all loans with reader name and book name     | 200     | -                |

### Special Rules

- **Validation (400):** `name` and `genre` are required when creating or updating a book.
- **Twist – No Duplicate Names (409):** Book names must be unique (case-insensitive).  
  Trying to add or rename a book to an existing name returns:
  ```json
  {
    "message": "Book <name> already exists"
  }
  ```

---

## Postman Collection

A ready-to-use Postman collection is included in the repository:

**File:** `New Collection.postman_collection.json`

### How to use it

1. Start the server:
   ```bash
   nodemon index.js
   ```

2. Open Postman → **Import** → select the file  
   `New Collection.postman_collection.json`

3. The collection uses the base URL:
   ```
   http://localhost:3000
   ```

4. Run the requests in order.  
   Each request contains the expected status code.

### Recommended Test Order

| Folder / Request              | Expected Status | Purpose                              |
|-------------------------------|-----------------|--------------------------------------|
| GET All Books                 | 200             | List all books                       |
| Search by Genre               | 200             | Filter books by genre                |
| GET Single Book               | 200             | Get one book                         |
| Create Book (Success)         | 201             | Add a new book                       |
| Create Book (Duplicate)       | 409             | Twist – duplicate name               |
| Create Book (Validation)      | 400             | Missing name or genre                |
| Update Book                   | 200             | Update an existing book              |
| Delete Book                   | 200             | Delete a book                        |
| Book Not Found                | 404             | Invalid / Delete non-existing ID     |
| GET Loans (JOIN)              | 200             | Loans with reader & book names       |

---

## Group Members & Contributions

| Member | Name                              | Contribution                                              |
|--------|-----------------------------------|-----------------------------------------------------------|
| 1      | K. Anirudh                        | Project setup + basic Express server                      |
| 2      | Kushal Suttarai                   | Database design + sample data + GET all books             |
| 3      | L. Kalyan                         | GET one + POST + PUT + DELETE for books                   |
| 4      | N. Sai Kumar                      | Validation + Search by genre + No Duplicate Names (Twist) |
| 5      | N. Maruthi Prasanna Kumar Reddy   | JOIN endpoint + Final integration + README + Postman      |

---

## Project Structure

```
PageTurn_Library/
├── ScreenShots/
│   ├── Book Not Found (404).png
│   ├── Create Book – Success (201).png
│   ├── Delete Success.png
│   ├── Duplicate Name – Twist (409).png
│   ├── JOIN Endpoint – Success.png
│   ├── Search by Genre.png
│   ├── Update Success.png
│   ├── Validation Error (400).png
│   └── dataBase.png
├── .gitignore
├── New Collection.postman_collection.json
├── README.md
├── index.js
├── library.db
├── package-lock.json
└── package.json
```

---