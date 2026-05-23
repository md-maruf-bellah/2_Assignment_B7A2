import type { Request, Response } from "express";
import { issuesService } from "./issues.service";

const createIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.createIssuesIntoDB(req.body);

    res.status(201).json({
      status: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
      data: error,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.getAllIssuesFromDB({
      sort: req.query.sort as string,
      type: req.query.type as string,
      status: req.query.status as string,
    });
    res.status(200).json({
      status: true,
      message: "Issues fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
      data: error,
    });
  }
};

const getIssuesById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issuesService.getIssueByIdFromDB(id as string);

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Issue not found",
        data: null,
      });
    }
    res.status(200).json({
      status: true,
      message: "Single Issue fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
      data: error,
    });
  }
};

const updateIssueById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issuesService.updateIssueByIdIntoDB(
      id as string,
      req.body,
    );

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Issue not found",
        data: null,
      });
    }
    res.status(200).json({
      status: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
      data: error,
    });
  }
};

const deleteIssueById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issuesService.deleteIssueByIdFromDB(id as string);
    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Issue not found",
        data: null,
      });
    }
    res.status(200).json({
      status: true,
      message: "Issue deleted successfully",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
      data: error,
    });
  }
};

export const issuesController = {
  createIssues,
  getAllIssues,
  getIssuesById,
  updateIssueById,
  deleteIssueById,
};
