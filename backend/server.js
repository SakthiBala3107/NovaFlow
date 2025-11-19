import express from "express";
import { ENV } from "./config/env.js";
import path from "path";
import cors from "cors";
import { connectDB } from "./config/db.js";

const app = express();

const PORT = ENV?.PORT;

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("Server running...");
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log("Server started on port ", PORT);
  });
};

startServer();
