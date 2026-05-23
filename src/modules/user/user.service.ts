import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcrypt";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password,  role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *
          `,
    [name, email, hashPassword, role],
  );

  return result.rows[0];
};

const getUsersFromDB = async () => {
  const getUsersQuery = `SELECT * FROM users`;
  const result = await pool.query(getUsersQuery);

  return result.rows;
};

const getUserByIdFromDB = async (id: string) => {
  const getUserByIdQuery = `SELECT * FROM users WHERE id =$1 `;
  const result = await pool.query(getUserByIdQuery, [id]);

  return result.rows[0];
};

const updateUserIntoDB = async (payload: IUser, id: string) => {
  const { name, email, password, role } = payload;

  const updateUserQuery = `UPDATE users SET name=$1,email=$2, password=$3,  role=$4, updated_at=NOW() WHERE id=$5 RETURNING *`;

  const result = await pool.query(updateUserQuery, [
    name,
    email,
    password,
    role,
    id,
  ]);

  return result;
};

const deleteUserIntoDB = async (id: string) => {
  const deleteUserQuery = `DELETE FROM users WHERE id=$1 RETURNING*`;
  const result = await pool.query(deleteUserQuery, [id]);

  return result;
};

export const userService = {
  createUserIntoDB,
  getUsersFromDB,
  getUserByIdFromDB,
  updateUserIntoDB,
  deleteUserIntoDB,
};
