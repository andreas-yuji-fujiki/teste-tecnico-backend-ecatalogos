import { ProductModel } from "../models/product.model";
import { Prisma } from "@prisma/client";

export const ProductService = {
    async getAll(filters: Prisma.ProductWhereInput) {
      return await ProductModel.findAll(filters);
    },
  
    async getById(id: number) {
      return await ProductModel.findById(id); // já passamos o número direto
    },
  
    async create(data: Prisma.ProductCreateInput) {
      return await ProductModel.createProduct(data);
    }
  };
  
