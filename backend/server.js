import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import fileRouter from "./routes/fileRoutes.js";
import cors from "cors";


const port = process.env.PORT || 5000;

connectDB();

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));


app.use("/api/users", userRouter);
app.use("/api/files", fileRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});