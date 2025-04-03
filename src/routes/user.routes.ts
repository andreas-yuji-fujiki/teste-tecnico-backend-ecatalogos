import { Router } from "express";
import UserController from "../controllers/UserController";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/", UserController.getAll);
router.get("/:id", UserController.getOne);
router.post("/", authMiddleware, UserController.create);
router.put("/:id", authMiddleware, UserController.update);
router.delete("/:id", authMiddleware, UserController.delete);

export default router;
