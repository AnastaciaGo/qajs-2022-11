import supertest from "supertest";
import config from "../config";

const book = {
  async getBooks() {
    return await supertest(config.url)
      .get("/BookStore/v1/Books")
      .set("accept", "application/json");
  },
  async createBook(isbn, id, token) {
    return await supertest(config.url)
      .post("/BookStore/v1/Books")
      .set({ accept: "application/json", Authorization: `Bearer ${token}` })
      .send({
        userId: id,
        collectionOfIsbns: [
          {
            isbn: isbn,
          },
        ],
      });
  },
  async updateBook(isbnAdded, isbnToUpdate, id, token) {
    return await supertest(config.url)
      .put(`/BookStore/v1/Books/${isbnAdded}`)
      .set({ accept: "application/json", Authorization: `Bearer ${token}` })
      .send({
        userId: id,
        isbn: isbnToUpdate,
      });
  },
  async getBookInfo(isbn) {
    return await supertest(config.url)
      .get(`/BookStore/v1/Book?ISBN=${isbn}`)
      .set("accept", "application/json");
  },
  async deleteBook(isbn, id, token) {
    return await supertest(config.url)
      .delete("/BookStore/v1/Book")
      .set({ accept: "application/json", Authorization: `Bearer ${token}` })
      .send({
        userId: id,
        isbn: isbn,
      });
  },
  async deleteBookAfterTest(isbn, id, token) {
    await this.deleteBook(isbn, id, token);
  },
  bookSchema: {
    isbn: "string",
    title: "string",
    subTitle: "string",
    author: "string",
    publish_date: "string",
    publisher: "string",
    pages: "number",
    description: "string",
    website: "string",
  },
};

export default book;
