import { Router } from "express";
import UserController from "../controllers/UserController";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

// Função para lidar com erros de forma automática
const asyncHandler = (func: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(func(req, res, next)).catch(next);
};

router.get("/", asyncHandler(UserController.getAll));
router.get("/:id", asyncHandler(UserController.getOne));
router.post("/", authMiddleware, asyncHandler(UserController.create));
router.put("/:id", authMiddleware, asyncHandler(UserController.update));
router.delete("/:id", authMiddleware, asyncHandler(UserController.delete));

export default router;
