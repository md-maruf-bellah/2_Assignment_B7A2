import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";

const createIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.createIssuesIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: unknown) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong in Issues",
      error: error,
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

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues fetched successfully",
      data: result,
    });
  } catch (error: unknown) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong in Issues",
      error: error,
    });
  }
};
const getIssuesById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await issuesService.getIssueByIdFromDB(id as string);

    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Single Issue fetched successfully",
      data: result,
    });
  } catch (error: unknown) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong in Issues",
      error: error,
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
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
        data: null,
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: unknown) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong in Issues",
      error: error,
    });
  }
};

const deleteIssueById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issuesService.deleteIssueByIdFromDB(id as string);
    if (!result) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
      data: {},
    });
  } catch (error: unknown) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong in Issues",
      error: error,
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
