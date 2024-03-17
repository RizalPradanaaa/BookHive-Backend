import express from "express";
import {
  getAllBooks,
  getBookById,
  saveBook,
} from "../controllers/BookController.js";

const router = express.Router();

router.get("/", (request, response) => {
  // console.log(request);
  return response.status(200).send("BookHave API Connected");
});

router.get("/books", getAllBooks);
router.post("/books", saveBook);
router.get("/books/:id", getBookById);

export default router;
