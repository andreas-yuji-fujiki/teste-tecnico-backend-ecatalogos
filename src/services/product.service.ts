import prisma from '../config/database.config';
import { Request, Response } from 'express';
import { ProductWithVariantsTypes } from '../types/product.types';

export class ProductService {
  static async getAll(query?: {
    gender?: string;
    categoryId?: string;
  }): Promise<ProductWithVariantsTypes[]> {
    const filters: any = {};
    
    if (query?.gender) filters.gender = query.gender;
    if (query?.categoryId) filters.categoryId = Number(query.categoryId);
    
    // Adiciona o filtro para garantir que deletedAt seja null
    filters.deletedAt = null;
  
    const products = await prisma.product.findMany({
      where: filters,
      include: {
        variants: {
          where: { deletedAt: null },  // Filtra variantes não deletadas
          include: {
            skus: {
              where: { deletedAt: null },  // Filtra SKUs não deletados
              include: {
                priceTablesSkus: true,
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
      const variants = product.variants.map(variant => {
        const validSkus = variant.skus.filter(sku => sku.priceTablesSkus.length > 0);
  
        if (validSkus.length !== variant.skus.length) {
          return null;
        }
  
        return {
          variant_name: variant.name,
          hex_code: variant.hexCode ?? null,
          skus: validSkus.map(sku => ({
            id: sku.id,
            size: sku.size,
            price: sku.price.toNumber(),
            stock: sku.stock,
            open_grid: product.openGrid ?? false,
            min_quantity: sku.minQuantity ?? 0,
          })),
        };
      }).filter(variant => variant !== null);
  
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
        variants: variants,
        companies: {
          key: product.companyId,
        },
        brand: product.brand?.name ?? "",
      };
    });
  }

  static getById = async (productId: number) => {
    // Verifica se o produto está marcado como deletado
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          where: { deletedAt: null },  // Filtra variantes não deletadas
          include: {
            skus: {
              where: { deletedAt: null },  // Filtra SKUs não deletados
              include: {
                priceTablesSkus: true,
              },
            },
          },
        },
        category: true,
        subcategory: true,
        brand: true,
      },
    });
  
    // Verifica se o produto foi encontrado e se o campo deletedAt é null (não deletado)
    if (!product || product.deletedAt) {
      throw new Error("Produto não encontrado");
    }
  
    const variants = product.variants.map(variant => {
      const validSkus = variant.skus.filter(sku => sku.priceTablesSkus.length > 0);
  
      if (validSkus.length !== variant.skus.length) {
        return null;
      }
  
      return {
        variant_name: variant.name,
        hex_code: variant.hexCode ?? null,
        skus: validSkus.map(sku => ({
          id: sku.id,
          size: sku.size,
          price: sku.price.toNumber(),
          stock: sku.stock,
          open_grid: product.openGrid ?? false,
          min_quantity: sku.minQuantity ?? 0,
        })),
      };
    }).filter(variant => variant !== null);
  
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
      variants,
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

  static delete = async (productId: number) => {
    if (!productId) {
      throw new Error('ID do produto não fornecido');
    }

    const deletedAt = new Date(); // Obtém a data e hora atual

    // Obtém o produto com as variantes
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true
      },
    });

    // Verifica se o produto foi encontrado
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    // Atualiza o produto, marcando a data de deletação
    await prisma.product.update({
      where: { id: productId },
      data: {
        deletedAt: deletedAt
      },
    });

    // Atualiza as variantes associadas ao produto
    await prisma.variant.updateMany({
      where: { productId: productId },
      data: {
        deletedAt: deletedAt
      },
    });

    // Atualiza os SKUs associados às variantes
    await prisma.sku.updateMany({
      where: {
        variantId: { in: product.variants.map(variant => variant.id) }
      },
      data: {
        deletedAt: deletedAt
      },
    });

    return { message: "Produto deletado com sucesso." };
  };

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params; // ID do produto a ser atualizado
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

      // Verificar se o produto existe
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) },
      });

      if (!product) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }

      // Verificar se a marca com o brandId existe
      const brand = await prisma.brand.findUnique({
        where: { id: brandId },
      });

      if (!brand) {
        res.status(400).json({ error: `Marca com ID ${brandId} não existe` });
        return;
      }

      // Verificar se a empresa associada à marca existe
      if (brand.companyId !== companyId) {
        res.status(400).json({ error: `Marca com ID ${brandId} não está associada à empresa fornecida` });
        return;
      }

      // Verificar se a categoria existe
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        res.status(400).json({ error: `Categoria com ID ${categoryId} não existe` });
        return;
      }

      // Verificar se a subcategoria existe (se o subcategoryId foi passado)
      if (subcategoryId) {
        const subcategoryExists = await prisma.subcategory.findUnique({
          where: { id: subcategoryId },
        });

        if (!subcategoryExists) {
          res.status(400).json({ error: `Subcategoria com ID ${subcategoryId} não existe` });
          return;
        }
      }

      // Atualiza o produto no banco de dados
      const updatedProduct = await prisma.product.update({
        where: { id: Number(productId) },
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
            update: variants.map((variant: any) => ({
              where: { id: variant.id }, // ID da variante a ser atualizada
              data: {
                name: variant.name,
                hex_code: variant.hex_code,
                skus: {
                  update: variant.skus.map((sku: any) => ({
                    where: { id: sku.id }, // ID do SKU a ser atualizado
                    data: {
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
                      width: sku.width,
                    },
                  })),
                },
              },
            })),
          },
        },
      });

      res.status(200).json(updatedProduct);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ocorreu um erro ao atualizar o produto" });
    }
  }
}