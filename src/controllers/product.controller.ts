import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export const ProductController = {
  async getAll(req:Request, res:Response) {
    const data = await ProductService.getAll();
    res.json(data);
  },

  async getById(req: Request, res: Response) {
    const data = await ProductService.getById(Number(req.params.id));
    if (!data) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }
  
    res.json(data);
  },  

  async create(req: Request, res: Response) {
      const companyId = req.body.companyId;
      const data = await ProductService.create(req.body, companyId);
      res.status(201).json(data);  // Retorna o produto criado com status 201
  }
};
