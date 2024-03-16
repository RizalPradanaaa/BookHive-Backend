import express from "express";
import { getAllBooks } from "../controllers/BookController.js";

const router = express.Router();

router.get("/", (request, response) => {
  // console.log(request);
  return response.status(200).send("BookHave API Connected");
});

router.get("/books", getAllBooks);

export default router;
