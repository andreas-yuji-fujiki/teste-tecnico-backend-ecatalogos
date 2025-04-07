import { RequestHandler } from "express";

export const createProductMiddleware: RequestHandler = (req, res, next) => {
  const { name, price } = req.body;

  // if there is not an "id" or "id" is not a string
  if (!name || typeof name !== "string") {
    res.status(400).json({
      status: 400,
      error: "Nome é obrigatório",
    });
    return;
  }

  // if there is not price, or price is not a number
  if (price === undefined || typeof price !== "number") {
    res.status(400).json({
      status: 400,
      error: "Preço inválido",
    });
    return;
  }

  // if all right, follow to controller
  next();
};