import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./modules/user/user.route";

import { authRouter } from "./modules/auth/auth.route";
import { logger } from "./middleware/logger";
import { issuesRouter } from "./modules/issues/issues.route";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/issues", issuesRouter);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Assignment @",
    status: true,
    data: {
      name: "Maruf Bellah",
      email: "maruf@gmail.com",
    },
  });
});
// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
