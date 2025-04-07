import { RequestHandler } from "express";

export const deleteProductMiddleware: RequestHandler = (req, res, next) => {
  const productId = parseInt(req.params.id)

  // if there is not a "name", or "name" is not a string
  if(!productId || isNaN(productId)){
    res.status(400).json({
      status: 400,
      error: "Você precisa enviar um ID válido!"
    })
    return;
  }

  // if all right, follow to controller
  next();
};
