import sendResponse from "../../utility/sendResponse";
import { userService } from "./user.service";
import { type Request, type Response } from "express";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User create successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsersFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.getUserByIdFromDB(id as string);

    if (!result) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: {},
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User fetched succesfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.updateUserIntoDB(req.body, id as string);

    if (result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: {},
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User update succesfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserIntoDB(id as string);
    if (result.rows.length === 0) {
      res.status(404).json({
        status: false,
        message: "User not found",
        data: {},
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted successfully",
      data: {},
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
