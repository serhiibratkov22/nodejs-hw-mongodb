// src/index.js

import express from "express";

const PORT = 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.use("*", (req, res, next) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
