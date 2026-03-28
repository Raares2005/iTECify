import express from "express"

const app = express() 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// app.use("/api/users", userRouter);
// app.use("/api/services", serviceRouter);
// app.use("/api/email", emailRouter);
// app.use("/api/categories", categoryRouter);

app.listen(5000, () => {console.log("Server started on port 5000")})

