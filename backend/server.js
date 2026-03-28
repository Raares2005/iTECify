import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";


const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(notFound);
app.use(errorHandler);
app.use(cookieParser());

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});