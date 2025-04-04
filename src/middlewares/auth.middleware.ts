import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  
  if (!token) {
    res.status(401).json({ message: "Não autorizado" });
    return;
  }
  
  if (token !== "meuTokenSecreto") {
    res.status(403).json({ message: "Token inválido" });
    return;
  }

  next();
};

export default authMiddleware;
