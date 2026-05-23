import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import type { IUser } from "../user/user.interface";

const signUpUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
    RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashedPassword, role],
  );

  return result.rows[0];
};

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
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

  return { token, user };
};

export const authService = {
  signUpUserIntoDB,
  loginUserIntoDB,
};
