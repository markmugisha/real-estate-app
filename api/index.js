import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Port is running on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

//Serve static assets if in production. Must come after routes.
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Error handling middleware
/*
When you call next(error) within a route handler, middleware function, or asynchronous operation, Express.js looks for the next middleware function in the chain that is capable of handling errors. This includes the error-handling middleware that is defined with the (err, req, res, next) signature. So, calling next(error) effectively triggers the execution of the error-handling middleware.
*/
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
