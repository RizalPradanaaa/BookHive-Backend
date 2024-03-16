import express from "express";
import router from "./routes/BookRoute.js";

const app = express();

app.use(router);
app.listen(8080, () => console.log("App is listen in port 8080"));
