import prisma from '../config/database.config';
import { Request, Response } from 'express';
import { Variant, Sku, Brand } from '@prisma/client';
import { ProductWithVariantsTypes } from '../types/product.types';

export class ProductService {
  static async getAll(query?: {
    gender?: string;
    categoryId?: string;
  }): Promise<ProductWithVariantsTypes[]> {
    const filters: any = {};
    
    if (query?.gender) filters.gender = query.gender;
    if (query?.categoryId) filters.categoryId = Number(query.categoryId);
    
    const products = await prisma.product.findMany({
      where: filters,
      include: {
        variants: {
          include: {
            skus: {
              include: {
                priceTablesSkus: true, // Garantir que o SKU tenha a tabela de preços vinculada
              },
            },
          },
        },
        brand: true,
        category: true,
        subcategory: true,
      },
    });
  
    return products.map(product => {
      // Mapeia as variantes do produto
      const variants = product.variants.map(variant => {
        // Filtra os skus válidos que possuem a tabela de preço
        const validSkus = variant.skus.filter(sku => sku.priceTablesSkus.length > 0);
  
        // Se não tiver todos os skus válidos, não retorna a variante
        if (validSkus.length !== variant.skus.length) {
          return null; // Retorna null para variantes inválidas
        }
  
        // Mapeia a variante com seus skus válidos
        return {
          variant_name: variant.name,
          hex_code: variant.hexCode ?? null,  // Usa null se não houver hexCode
          skus: validSkus.map(sku => ({
            id: sku.id,
            size: sku.size,
            price: sku.price.toNumber(),  // Converte Decimal para number
            stock: sku.stock,
            open_grid: product.openGrid ?? false,  // Assume false se openGrid for undefined
            min_quantity: sku.minQuantity ?? 0,  // Assume 0 se minQuantity for null
          })),
        };
      }).filter(variant => variant !== null); // Remove variantes inválidas
  
      // Retorna o produto com as variantes agrupadas
      return {
        id: product.id,
        name: product.name,
        reference: product.reference,
        gender: product.gender,
        category: product.category?.name ?? null,
        subcategory: product.subcategory?.name ?? null,
        prompt_delivery: product.promptDelivery,
        description: product.description ?? null,
        type: product.type ?? null,
        variants: variants,  // Adiciona as variantes no produto
        companies: {
          key: product.companyId,
        },
        brand: product.brand?.name ?? "",
      };
    });
  }  

  static getById = async (productId: number) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          include: {
            skus: {
              include: {
                priceTablesSkus: true,  // Inclui as tabelas de preço para os SKUs
              },
            },
          },
        },
        category: true,  // Inclui a categoria
        subcategory: true,  // Inclui a subcategoria
        brand: true,  // Inclui a marca
      },
    });
  
    if (!product) {
      throw new Error("Produto não encontrado");
    }
  
    // Mapeia as variantes do produto
    const variants = product.variants.map(variant => {
      // Filtra os SKUs válidos que possuem a tabela de preço
      const validSkus = variant.skus.filter(sku => sku.priceTablesSkus.length > 0);
  
      // Se não tiver todos os skus válidos, não retorna a variante
      if (validSkus.length !== variant.skus.length) {
        return null; // Retorna null para variantes inválidas
      }
  
      // Mapeia a variante com seus skus válidos
      return {
        variant_name: variant.name,
        hex_code: variant.hexCode ?? null,  // Usa null se não houver hexCode
        skus: validSkus.map(sku => ({
          id: sku.id,
          size: sku.size,
          price: sku.price.toNumber(),  // Converte Decimal para number
          stock: sku.stock,
          open_grid: product.openGrid ?? false,  // Assume false se openGrid for undefined
          min_quantity: sku.minQuantity ?? 0,  // Assume 0 se minQuantity for null
        })),
      };
    }).filter(variant => variant !== null);  // Remove variantes inválidas
  
    // Retorna o produto com as variantes agrupadas
    return {
      id: product.id,
      name: product.name,
      reference: product.reference,
      gender: product.gender,
      category: product.category?.name ?? null,
      subcategory: product.subcategory?.name ?? null,
      prompt_delivery: product.promptDelivery,
      description: product.description ?? null,
      type: product.type ?? null,
      variants,  // Adiciona as variantes no produto
      companies: {
        key: product.companyId,
      },
      brand: product.brand?.name ?? "",
    };
  };
  
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        reference,
        gender,
        categoryId,
        subcategoryId,
        promptDelivery,
        description,
        type,
        variants,
        companyId,
        brandId
      } = req.body;

      // Verificar se a marca com o brandId existe
      const brand = await prisma.brand.findUnique({
        where: { id: brandId }
      });

      if (!brand) {
        res.status(400).json({ error: `Brand with ID ${brandId} does not exist` });
        return;
      }

      // Verificar se a empresa associada à marca existe
      if (brand.companyId !== companyId) {
        res.status(400).json({ error: `Brand with ID ${brandId} is not associated with the provided companyId` });
        return;
      }

      // Verificar se a categoria existe
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!categoryExists) {
        res.status(400).json({ error: `Category with ID ${categoryId} does not exist` });
        return;
      }

      // Verificar se a subcategoria existe (se o subcategoryId foi passado)
      if (subcategoryId) {
        const subcategoryExists = await prisma.subcategory.findUnique({
          where: { id: subcategoryId }
        });

        if (!subcategoryExists) {
          res.status(400).json({ error: `Subcategory with ID ${subcategoryId} does not exist` });
          return;
        }
      }

      // Criar o produto no banco de dados usando Prisma
      const createdProduct = await prisma.product.create({
        data: {
          name,
          reference,
          gender,
          categoryId,
          subcategoryId,
          promptDelivery,
          description,
          type,
          companyId,
          brandId,
          variants: {
            create: variants.map((variant: any) => ({
              name: variant.name,  // Corrigido para 'name'
              hex_code: variant.hex_code,
              skus: {
                create: variant.skus.map((sku: any) => ({
                  size: sku.size,
                  price: sku.price,
                  stock: sku.stock,
                  min_quantity: sku.min_quantity,
                  multiple_quantity: sku.multiple_quantity,
                  cest: sku.cest,
                  height: sku.height,
                  length: sku.length,
                  ncm: sku.ncm,
                  weight: sku.weight,
                  width: sku.width
                }))
              }
            }))
          }
        }
      });

      res.status(201).json(createdProduct);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while creating the product" });
    }
  }
}