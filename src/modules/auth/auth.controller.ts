import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

const signUpUser = async (req: Request, res: Response) => {
  const result = await authService.signUpUserIntoDB(req.body);

  try {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User SignUp successfully",
      data: result,
    });
  } catch (error: unknown) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong in Login",
      error: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User login successfully",
      data: result,
    });
  } catch (error: unknown) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong in SignUp",
      error: error,
    });
  }
};

export const authController = {
  loginUser,
  signUpUser,
};
