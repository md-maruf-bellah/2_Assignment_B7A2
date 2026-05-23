import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get token
      const token = req.headers.authorization;

      // check token
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!",
        });
      }

      // verify token
      const decoded = jwt.verify(token, config.secret as string) as JwtPayload;

      // check user exists
      const userData = await pool.query(
        `SELECT id, name, email, role FROM users WHERE email=$1`,
        [decoded.email],
      );

      // user not found
      if (userData.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      const user = userData.rows[0];

      // role check
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access!",
        });
      }

      // attach user
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }
  };
};

export default auth;
