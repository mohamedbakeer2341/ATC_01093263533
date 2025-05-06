import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EventBooker API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
