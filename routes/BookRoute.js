import express from "express";

const router = express.Router();

router.get("/", (request, response) => {
  // console.log(request);
  return response.status(200).send("BookHave API Connected");
});

export default router;
