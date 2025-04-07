import { Router } from "express";


// controller:
    import { ProductController } from "../controllers/product.controller";
// middlewares import:
    import { getAllProductsMiddleware } from "../middlewares/product/getAllProducts.middleware";    
    import { getProductByIdMiddleware } from "../middlewares/product/getProductById.middleware";
    import { deleteProductMiddleware } from "../middlewares/product/deleteProduct.middleware";
    import { updateProductMiddleware } from "../middlewares/product/updateProduct.middleware";
    // import createProductMiddleware from "../middlewares/product/createProduct.middleware";


// defining product router
const productsRouter = Router();


// defining endpoints
    // get all products
    productsRouter.get('/', getAllProductsMiddleware, ProductController.getAll);
    
    // get product by id
    productsRouter.get('/:id', getProductByIdMiddleware, ProductController.getById);
    
    // create product
    // productsRouter.post('/create', createProductMiddleware, ProductController.create)
    
    // delete product
    productsRouter.post('/delete/:id', deleteProductMiddleware, ProductController.delete)

    // update product
    productsRouter.post('/update', updateProductMiddleware, ProductController.update)


// exporting all product routes
export { productsRouter };