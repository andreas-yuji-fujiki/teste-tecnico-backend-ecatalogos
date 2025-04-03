import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: "Não autorizado" });
  }
  
  if (token !== "meuTokenSecreto") {
    return res.status(403).json({ message: "Token inválido" });
  }

  next();
};

export default authMiddleware;
