import { Router } from "express";
import userController from "../controllers/user.controller.js";

const userRouter = Router();
const controller = new userController();

userRouter.post("/auth/register", (req, res) =>
  controller.registerController(req, res)
);
userRouter.post("/auth/login", (req, res) =>
  controller.loginController(req, res)
);

export default userRouter;
