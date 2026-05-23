import { Router } from "express";
import { issuesController } from "./issues.controller";
import { USER_ROLE } from "../../types";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", issuesController.createIssues);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getIssuesById);
router.put(
  "/:id",
  auth(USER_ROLE.maintainer),
  issuesController.updateIssueById,
);
router.delete(
  "/:id",
  auth(USER_ROLE.maintainer),
  issuesController.deleteIssueById,
);

export const issuesRouter = router;
