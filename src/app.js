import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import Routes from "./routes/routes.js";

const server = express();

server.use(express.json());
server.use("/api", Routes());

const Port = process.env.PORT || 8080;

const bootstrap = async () => {
  try {
    await connectDB();
    console.log("Database connected");
    server.listen(Port, () => console.log("Server is running port", Port));
  } catch ({ message }) {
    console.error(message);
  }
};
bootstrap();
