import { RequestHandler } from "express";

export const getProductByIdMiddleware: RequestHandler = (req, res, next) => {
  const { id } = req.params;

  // if id is not a number
  if (isNaN(Number(id))) {
    res.status(400).json({
      status: 400,
      error: "ID inválido! (Deve ser um número inteiro.)",
    });
    return;
  }

  // if all right, follow to controller
  next();
};
