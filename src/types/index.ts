export const USER_ROLE = {
  maintainer: "maintainer",
  contributor: "contributor",
} as const;

export type ROLES = "maintainer" | "contributor";

export interface TIssueQuery {
  sort?: string;
  type?: string;
  status?: string;
  reporter_id?: string;
  title?: string;
  description?: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: ROLES;
}

export const TYPES = {
  bug: "bug",
  feature_request: "feature_request",
} as const;

export type ISSUE_TYPE = "bug" | "feature_request";

export const STATUS = {
  open: "open",
  in_progress: "in_progress",
  resolved: "resolved",
} as const;

export type ISSUE_STATUS = "open" | "in_progress" | "resolved";
