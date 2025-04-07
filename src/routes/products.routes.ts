import { Router } from "express";


// defining product router
const productsRouter = Router();


// defining endpoints
productsRouter.get('/');
productsRouter.get('/:id');


// exporting all product routes
export { productsRouter };