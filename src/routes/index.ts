import { Router } from "express";

// importing routers
    // product
    import { productsRouter } from "./products.routes";


// defining endpoints with their respective functions
const allAppRouters = Router();
    // product
    allAppRouters.use('/products', productsRouter);


// exporting all endpoints
export { allAppRouters };