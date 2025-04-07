import { RequestHandler } from "express";

export const getAllProductsMiddleware: RequestHandler = (req, res, next) => {
  const { name } = req.query;

  // if there is not a "name", or "name" is not a string
  if (!name || typeof name !== "string") {
    res.status(400).json({
      status: 400,
      error: "Filtro inválido!",
    });
    return;
  }

  // if all right, follow to controller
  next();
};
