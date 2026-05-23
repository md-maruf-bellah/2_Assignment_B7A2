import { pool } from "../../db";
import type { TIssueQuery } from "../../types";
import type { IIssues } from "./issues.interface";

const createIssuesIntoDB = async (payload: IIssues) => {
  const { reporter_id, title, description, type, status } = payload;

  const user = await pool.query(
    `
    SELECT * FROM users WHERE id=$1
  `,
    [reporter_id],
  );

  console.log("user", payload);

  if (user.rows.length === 0) {
    throw new Error("User not exists!");
  }
  const result = await pool.query(
    `
    INSERT INTO issues (reporter_id, title, description, type, status) VALUES($1, $2, $3, $4,  COALESCE($5, 'open')) RETURNING*
    
    `,
    [reporter_id, title, description, type, status],
  );

  return result.rows[0];
};

const getAllIssuesFromDB = async (query: TIssueQuery) => {
  let sql = `SELECT * FROM issues`;
  const conditions: string[] = [];
  const values: string[] = [];

  //type filter
  if (query.type) {
    values.push(query.type);
    conditions.push(`type=$${values.length}`);
  }

  // status filter
  if (query.status) {
    values.push(query.status);
    conditions.push(`status=$${values.length}`);
  }

  //where add
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  //sorting
  if (query.sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  // get issues
  const issuesResult = await pool.query(sql, values);

  const issues = issuesResult.rows;

  // reporter ids collect
  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  // get users
  let users: any[] = [];

  if (reporterIds.length > 0) {
    const usersResult = await pool.query(
      `SELECT id, name, role FROM users WHERE id = ANY($1)`,
      [reporterIds],
    );

    users = usersResult.rows;
  }

  // merge reporter data
  const formattedIssues = issues.map((issue) => {
    const reporter = users.find((user) => user.id === issue.reporter_id);

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,

      reporter: reporter
        ? {
            id: reporter.id,
            name: reporter.name,
            role: reporter.role,
          }
        : null,

      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });
  return formattedIssues;
};

const getIssueByIdFromDB = async (id: string) => {
  let singleData = `SELECT * FROM issues WHERE id=$1`;
  const singleId = [id];
  // get issues
  const issuesResult = await pool.query(singleData, singleId);

  const issues = issuesResult.rows;

  // reporter ids collect
  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  // get users
  let users: any[] = [];

  if (reporterIds.length > 0) {
    const usersResult = await pool.query(
      `SELECT id, name, role FROM users WHERE id = ANY($1)`,
      [reporterIds],
    );

    users = usersResult.rows;
  }

  // merge reporter data
  const formattedIssues = issues.map((issue) => {
    const reporter = users.find((user) => user.id === issue.reporter_id);

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,

      reporter: reporter
        ? {
            id: reporter.id,
            name: reporter.name,
            role: reporter.role,
          }
        : null,

      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });
  return formattedIssues;
};

const updateIssueByIdIntoDB = async (id: string, payload: any) => {
  const { title, description, type, status } = payload;
  const result = await pool.query(
    `
    UPDATE issues SET title=$1, description=$2, type=$3, status=$4, updated_at=NOW() WHERE id=$5 RETURNING*
    `,
    [title, description, type, status, id],
  );
  return result.rows[0];
};

const deleteIssueByIdFromDB = async (id: string) => {
  const result = await pool.query(`DELETE FROM issues WHERE id=$1 RETURNING*`, [
    id,
  ]);
  return result.rows[0];
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getIssueByIdFromDB,
  updateIssueByIdIntoDB,
  deleteIssueByIdFromDB,
};
