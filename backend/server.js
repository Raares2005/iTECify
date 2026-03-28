import path from "path"
import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import connectDB from "./config/db.js"
const port = process.env.PORT || 5000
import userRouter from "./routes/userRoutes.js"

const app = express() 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

// app.use("/api/users", userRouter);
// app.use("/api/services", serviceRouter);
// app.use("/api/email", emailRouter);
// app.use("/api/categories", categoryRouter);

app.listen(5000, () => {console.log("Server started on port 5000")})

