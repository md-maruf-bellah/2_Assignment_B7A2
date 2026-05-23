import express, { type Request, type Response } from "express";
import config from "./config";
import { initDB, pool } from "./db";
import app from "./app";

initDB();

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
