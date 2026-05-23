import type { NextFunction, Request, Response } from "express";
import fs from "fs";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const log = `\nMethod -> ${req.method} - Time -> ${Date.now()} - URL -> ${req.url}\n`;
  fs.appendFile("./../../logger.txt", log, (err) => {});
  console.log("Time:", Date.now());
  next();
};
