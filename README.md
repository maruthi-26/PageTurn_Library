# PageTurn Library

**Backend Development Fundamentals – Group Assignment**  
**Group:** JP-GAI2B-G02  
**Theme:** Book Lending (Theme 2 of 30)  
**Twist:** No Duplicate Book Names (case-insensitive)

---

## Project Description

PageTurn Library is a simple library management system built with Node.js, Express and SQLite.  
It allows managing books, readers and loans. The system enforces a special rule that **no two books can have the same name** (even if the capital letters are different).

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
npx nodemon index.js
```

Server will run at: `http://localhost:3000`

---

## Database Tables

- `readers` (id, name, email)
- `books` (id, name, genre)
- `loans` (id, reader_id, book_id, loan_date)

---

## API Endpoints

| Method | Endpoint              | Description                              | Status Codes          |
|--------|-----------------------|------------------------------------------|-----------------------|
| GET    | `/books/`             | Get all books (supports `?genre=`)       | 200                   |
| GET    | `/books/:bookId/`     | Get a single book                        | 200 / 404             |
| POST   | `/books/`             | Add a new book                           | 201 / 400 / 409       |
| PUT    | `/books/:bookId/`     | Update a book                            | 200 / 400 / 404 / 409 |
| DELETE | `/books/:bookId/`     | Delete a book                            | 200 / 404             |
| GET    | `/loans/`             | Get all loans with reader & book names   | 200                   |

### Query Parameter
- `GET /books/?genre=Finance` → returns only books of that genre

### Special Twist Rule
- Two books cannot have the same name (case-insensitive).
- Attempting to add or rename to an existing name returns **409** with message:  
  `"Book <name> already exists"`

---

## Group Members & Contributions

| Member | Name                              | Contribution                                      |
|--------|-----------------------------------|---------------------------------------------------|
| 1      | K. Anirudh                        | Project setup + basic Express server              |
| 2      | Kushal Suttarai                   | Database design + sample data + GET all books     |
| 3      | L. Kalyan                         | GET one + POST + PUT + DELETE for books           |
| 4      | N. Sai Kumar                      | Validation + Search by genre + No Duplicate Names |
| 5      | N. Maruthi Prasanna Kumar Reddy   | JOIN endpoint + Final integration + README + Postman |

---

## Testing

All endpoints have been tested using Postman.  
Screenshots of success and error cases are available in the `Screenshots` folder.

---

## Author
