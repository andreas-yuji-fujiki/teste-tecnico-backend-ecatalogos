import { Router } from "express";


// controller:

// middlewares import:
    import { getAllProductsMiddleware } from "../middlewares/product/getAllProducts.middleware";    
    import { getProductByIdMiddleware } from "../middlewares/product/getProductById.middleware";
    import { createProductMiddleware } from "../middlewares/product/createProduct.middleware";


// defining product router
const productsRouter = Router();


// defining endpoints
    // get all products
    productsRouter.get('/', getAllProductsMiddleware);
    // get product by id
    productsRouter.get('/:id', getProductByIdMiddleware);
    // create product
    productsRouter.post('/', createProductMiddleware)


// exporting all product routes
export { productsRouter };