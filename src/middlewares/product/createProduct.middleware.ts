import { Request, Response, NextFunction } from "express";

const createProductMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  next();
};

export default createProductMiddleware;
