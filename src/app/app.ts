// imports
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import corsConfig from "../config/cors.config";
// import { errorMiddleware } from "./middlewares/error.middleware";

import { allAppRouters } from "../routes";

// dotenv can be used in here
dotenv.config();

// app class
class ExpressApp {
    public app: Application;
    private port: number | string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;

        this.essentialMiddlewares();
        // this.errorHandling();

        // defining to use all routers
        this.app.use(allAppRouters);
    };

    private essentialMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(cors(corsConfig));
        this.app.use(helmet());
        
        // morgan is not suposed to be used in production app enviroment
        if (process.env.NODE_ENV !== "production") {
        this.app.use(morgan("dev"));
        }; 
    };

    // private errorHandling(): void {
    //   this.app.use(errorMiddleware);
    // }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`API running on http://localhost:${this.port}`);
        });
    };
};
  
  export default ExpressApp;