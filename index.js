import express from "express";
import dotenv from "dotenv";
import router from "./routes/BookRoute.js";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";

const app = express();
app.use(fileUpload());
app.use(express.static("public"));
app.use(router);

dotenv.config();
const Port = process.env.PORT;
// Membuat koneksi ke database MongoDB
const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env;
const dbUrl = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}=${DB_NAME}`;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to database");
    // Setelah berhasil terhubung ke database, jalankan server Express
    app.listen(Port, () => console.log(`Server is running on port ${Port}`));
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
