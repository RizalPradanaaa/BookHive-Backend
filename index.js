import express from "express";
import dotenv from "dotenv";
import router from "./routes/BookRoute.js";

dotenv.config();
const Port = process.env.PORT;

const app = express();

app.use(router);
app.listen(Port, () => console.log(`Server is running on port ${Port}`));
