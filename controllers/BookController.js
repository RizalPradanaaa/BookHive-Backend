import path from "path";
import { Book } from "../model/BookModel.js";
import { Types } from "mongoose";
import fs from "fs";

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

export const saveBook = async (request, response) => {
  try {
    // Validasi
    if (request.files === null)
      return response.status(400).json({ msg: "No File Uploaded" });

    // Cover handle
    const file = request.files.cover;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${request.protocol}://${request.get(
      "host"
    )}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    // Validation cover Type and Size
    if (!allowedType.includes(ext.toLowerCase()))
      return response.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 2000000)
      return response.status(422).json({ msg: "Image must be less than 2 MB" });

    // save value
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
      description: request.body.description,
      cover: url,
    };

    // Save cover and book
    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return response.status(500).json({ msg: err.message });
      try {
        const book = await Book.create(newBook);
        return response.status(201).send(book);
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error.message });
  }
};

export const getBookById = async (request, response) => {
  try {
    const id = request.params.id;

    // Periksa apakah ID yang diberikan adalah ObjectId yang valid
    if (!Types.ObjectId.isValid(id)) {
      return response.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(id);

    if (!book) return response.status(404).json({ message: "Book not found" });

    return response.status(200).json(book);
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
};

export const updateBook = async (request, response) => {
  const { id } = request.params;

  // Periksa apakah ID yang diberikan adalah ObjectId yang valid
  if (!Types.ObjectId.isValid(id))
    return response.status(400).json({ message: "Invalid book ID" });

  const book = await Book.findById(id);
  if (!book) return response.status(404).json({ message: "Book not found" });

  let coverUrl = "";
  // jika tidak update cover
  if (request.files === null) {
    coverUrl = book.cover;
  } else {
    // Cover handle
    const file = request.files.cover;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    coverUrl = `${request.protocol}://${request.get(
      "host"
    )}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    // Validation cover Type and Size
    if (!allowedType.includes(ext.toLowerCase()))
      return response.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 2000000)
      return response.status(422).json({ msg: "Image must be less than 2 MB" });

    let oldfile = book.cover;
    const oldfileName = oldfile.split("/").pop();
    const filepath = `./public/images/${oldfileName}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  // save value
  const newBook = {
    title: request.body.title,
    author: request.body.author,
    publishYear: request.body.publishYear,
    description: request.body.description,
    cover: coverUrl,
  };

  try {
    const result = await Book.findByIdAndUpdate(id, newBook);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }

    return response.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
};

export const deleteBook = async (request, response) => {
  const { id } = request.params;

  // Periksa apakah ID yang diberikan adalah ObjectId yang valid
  if (!Types.ObjectId.isValid(id))
    return response.status(400).json({ message: "Invalid book ID" });

  const book = await Book.findById(id);
  if (!book) return response.status(404).json({ message: "Book not found" });

  try {
    // Delete imaage
    let oldfile = book.cover;
    const oldfileName = oldfile.split("/").pop();
    const filepath = `./public/images/${oldfileName}`;
    fs.unlinkSync(filepath);

    // Delete book
    await Book.findByIdAndDelete(id);

    return response.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};
