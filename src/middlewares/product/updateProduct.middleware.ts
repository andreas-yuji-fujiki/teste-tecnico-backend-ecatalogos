import { Request, Response, NextFunction } from "express";

export const updateProductMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;  // Pega o id do produto na URL
  const { name, price, description } = req.body;  // Dados do produto no corpo da requisição

  // Verifica se o ID do produto é válido
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID do produto inválido" });
  }

  // Verifica se os dados necessários estão presentes no corpo da requisição
  if (!name || !price || typeof description !== 'string') {
    return res.status(400).json({ error: "Dados do produto incompletos ou inválidos" });
  }

  // Se os dados estiverem válidos, continua para o próximo middleware ou controller
  next();
};
