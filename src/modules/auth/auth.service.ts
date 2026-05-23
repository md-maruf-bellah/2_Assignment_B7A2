import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import type { IUser } from "../user/user.interface";

const signUpUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password,  role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *
          `,
    [name, email, hashPassword, role],
  );

  return result.rows[0];
};

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  //1. check if the user exists
  //2. compare the password
  //3. generate token

  //1. check if the user exists
  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  //2. compare the password

  const userSgingleDAta = userData.rows[0];
  const matchPassword = await bcrypt.compare(
    password,
    userSgingleDAta.password,
  );

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }

  //3. generate token
  const user = {
    id: userSgingleDAta.id,
    name: userSgingleDAta.name,
    email: userSgingleDAta.email,
    role: userSgingleDAta.role,
    created_at: userSgingleDAta.created_at,
    updated_at: userSgingleDAta.updated_at,
  };

  const token = jwt.sign(user, config.secret as string, {
    expiresIn: "1d",
  });

  // const refreshToken = jwt.sign(jwtpayload, config.refreshToken as string, {
  //   expiresIn: "10d",
  // });

  //   console.log("accessToken", accessToken);
  return { token, user };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("{Unauthorized");
  }

  const decoded = jwt.verify(
    token as string,
    config.refreshToken as string,
  ) as JwtPayload;

  const userData = await pool.query(
    `
     SELECT * FROM users WHERE email=$1   
        `,
    [decoded.email],
  );

  const user = userData.rows[0];

  if (userData.rows.length === 0) {
    throw new Error("User not found!!");
  }

  if (!user?.is_active) {
    throw new Error("Forbidden!!");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    age: user.age,
    role: user.role,
    is_active: user.is_active,
  };

  const accessToken = jwt.sign(jwtpayload, config.secret as string, {
    expiresIn: "1d",
  });

  // return { accessToken };
};

export const authService = {
  signUpUserIntoDB,
  loginUserIntoDB,
  generateRefreshToken,
};
