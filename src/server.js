// src/server.js

import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";

import { getAllStudents, getStudentById } from "./services/students.js";

dotenv.config(); // завантажує .env

const PORT = process.env.PORT || 3000;

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  // Тестовий роут
  app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
  });

  // Отримати всіх студентів
  app.get("/students", async (req, res, next) => {
    try {
      const students = await getAllStudents();
      res.status(200).json({ data: students });
    } catch (err) {
      next(err);
    }
  });

  // Отримати студента по id
  app.get("/students/:studentId", async (req, res, next) => {
    try {
      const { studentId } = req.params;
      const student = await getStudentById(studentId);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json({ data: student });
    } catch (err) {
      next(err);
    }
  });

  // 404
  app.use("*", (req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  // 500
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
