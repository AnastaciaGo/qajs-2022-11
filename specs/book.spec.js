import account from "../services/user";
import config from "../config";
import book from "../services/book";

describe("Get books info tests", () => {
  test("Get book info with valid book => success", async () => {
    const allBooks = await book.getBooks();
    const bookInfo = allBooks.body.books[0];
    const res = await book.getBookInfo(bookInfo["isbn"]);
    const isSchemaValid = Object.keys(res.body).every((item) =>
      Object.keys(book.bookSchema).includes(item),
    );
    expect(res.status).toBe(200);
    expect(isSchemaValid).toBeTruthy();
    expect(res.body.isbn).toBe(bookInfo.isbn);
  });
  test("Get book info with invalid book => fail", async () => {
    const allBooks = await book.getBooks();
    const bookInfo = allBooks.body.books[0];
    const invalidIsbn = bookInfo["isbn"] + "1";
    const res = await book.getBookInfo(invalidIsbn);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("1205");
    expect(res.body.message).toBe(
      "ISBN supplied is not available in Books Collection!",
    );
  });
});

describe("Create book tests", () => {
  test("Create book authorized with exists book => success", async () => {
    const token = await account.getTokenInCache(config.credentials);
    const allBooks = await book.getBooks();
    const bookInfo = allBooks.body.books[0];
    const res = await book.createBook(bookInfo.isbn, config.id, token);
    const userInfo = await account.getUserInfo(config.id, token);
    expect(res.status).toBe(201);
    expect(res.body.books[0]["isbn"]).toBe(bookInfo.isbn);
    expect(userInfo.body.books[0]["isbn"]).toBe(bookInfo.isbn);
    await book.deleteBookAfterTest(bookInfo.isbn, config.id, token);
  });
  test("Create book authorized with invalid book => fail", async () => {
    const token = await account.getTokenInCache(config.credentials);
    const allBooks = await book.getBooks();
    const bookInfo = allBooks.body.books[0];
    const invalidIsbn = bookInfo["isbn"] + "1";
    const res = await book.createBook(invalidIsbn, config.id, token);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("1205");
    expect(res.body.message).toBe(
      "ISBN supplied is not available in Books Collection!",
    );
  });
  test("Create book unauthorized => fail", async () => {
    const token = "";
    const allBooks = await book.getBooks();
    const bookInfo = allBooks.body.books[0];
    const res = await book.createBook(bookInfo.isbn, config.id, token);
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("1200");
    expect(res.body.message).toBe("User not authorized!");
  });
});

describe("Update book tests", () => {
  test("Update book authorized with added book => success", async () => {
    const token = await account.getTokenInCache(config.credentials);
    const allBooks = await book.getBooks();
    const bookInfoFirst = allBooks.body.books[0];
    const bookInfoSecond = allBooks.body.books[1];
    await book.createBook(bookInfoFirst.isbn, config.id, token);
    const res = await book.updateBook(
      bookInfoFirst.isbn,
      bookInfoSecond.isbn,
      config.id,
      token,
    );
    const isSchemaValid = Object.keys(res.body.books[0]).every((item) =>
      Object.keys(book.bookSchema).includes(item),
    );
    const userInfo = await account.getUserInfo(config.id, token);
    expect(res.status).toBe(200);
    expect(res.body.books[0]["isbn"]).toBe(bookInfoSecond.isbn);
    expect(userInfo.body.books[0]["isbn"]).toBe(bookInfoSecond.isbn);
    expect(isSchemaValid).toBeTruthy();
    await book.deleteBookAfterTest(bookInfoSecond.isbn, config.id, token);
  });
  test("Update book unauthorized => fail", async () => {
    const token = await account.getTokenInCache(config.credentials);
    const allBooks = await book.getBooks();
    const bookInfoFirst = allBooks.body.books[0];
    const bookInfoSecond = allBooks.body.books[1];
    await book.createBook(bookInfoFirst.isbn, config.id, token);
    const res = await book.updateBook(
      bookInfoFirst.isbn,
      bookInfoSecond.isbn,
      config.id,
      "",
    );
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("1200");
    expect(res.body.message).toBe("User not authorized!");
    await book.deleteBookAfterTest(bookInfoFirst.isbn, config.id, token);
  });
  test("Update book wich is not added to user => fail", async () => {
    const token = await account.getTokenInCache(config.credentials);
    const allBooks = await book.getBooks();
    const bookInfoFirst = allBooks.body.books[0];
    const bookInfoSecond = allBooks.body.books[1];
    const res = await book.updateBook(
      bookInfoFirst.isbn,
      bookInfoSecond.isbn,
      config.id,
      token,
    );
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("1206");
    expect(res.body.message).toBe(
      "ISBN supplied is not available in User's Collection!",
    );
  });
});

describe("Delete book tests", () => {
  test("Delete book authorized with book is added to user => success", async () => {
    const token = await account.getTokenInCache(config.credentials);
    const allBooks = await book.getBooks();
    const bookInfo = allBooks.body.books[0];
    await book.createBook(bookInfo.isbn, config.id, token);
    const res = await book.deleteBook(bookInfo.isbn, config.id, token);
    const userInfo = await account.getUserInfo(config.id, token);
    expect(res.status).toBe(204);
    expect(userInfo.body.books.length).toBe(0);
  });
  test("Delete book unauthorized => fail", async () => {
    const token = await account.getTokenInCache(config.credentials);
    const allBooks = await book.getBooks();
    const bookInfo = allBooks.body.books[0];
    await book.createBook(bookInfo.isbn, config.id, token);
    const res = await book.deleteBook(bookInfo.isbn, config.id, "");
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("1200");
    expect(res.body.message).toBe("User not authorized!");
    await book.deleteBookAfterTest(bookInfo.isbn, config.id, token);
  });
  test("Delete book which is not added to user => fail", async () => {
    const token = await account.getTokenInCache(config.credentials);
    const allBooks = await book.getBooks();
    const bookInfo = allBooks.body.books[0];
    const res = await book.deleteBook(bookInfo.isbn, config.id, token);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("1206");
    expect(res.body.message).toBe(
      "ISBN supplied is not available in User's Collection!",
    );
  });
});
