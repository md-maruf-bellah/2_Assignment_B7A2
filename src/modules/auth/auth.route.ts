import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/", authController.loginUser);
router.post("/", authController.signUpUser);
router.post("/", authController.refreshToken);

export const authRouter = router;
