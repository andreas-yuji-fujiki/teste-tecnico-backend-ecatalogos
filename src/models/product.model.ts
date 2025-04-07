import prisma from "../config/database.config";
import { Prisma } from "@prisma/client";

export const ProductModel = {
  async findAll(filters: Prisma.ProductWhereInput) {
    return await prisma.product.findMany({ where: filters });
  },

  async findById(id: number) {
    return await prisma.product.findUnique({
      where: { id }
    });
  },

  async createProduct(data: Prisma.ProductCreateInput) {
    return await prisma.product.create({ data });
  }
};