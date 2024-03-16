import { Book } from "../model/BookModel.js";

export const getAllBooks = async (request, response) => {
  try {
    const books = await Book.find();
    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
};
