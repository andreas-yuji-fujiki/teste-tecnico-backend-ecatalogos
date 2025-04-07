// imports
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import corsConfig from "../config/cors.config";
// import routes from "./routes/index";
// import { errorMiddleware } from "./middlewares/error.middleware";

// dotenv can be used in here
dotenv.config()

// app class
class ExpressApp {
    public app: Application;
    private port: number | string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;

        this.middlewares();
        // this.routes();
        // this.errorHandling();
    }

    private middlewares(): void {
        this.app.use(express.json());
        this.app.use(cors(corsConfig));
        this.app.use(helmet());
        
        // morgan is not suposed to be used in production app enviroment
        if (process.env.NODE_ENV !== "production") {
        this.app.use(morgan("dev"));
        }      
    }

    // private routes(): void {
    //   this.app.use("/api/users", userRoutes);
    // }

    // private errorHandling(): void {
    //   this.app.use(errorMiddleware);
    // }

    public listen(): void {
        this.app.listen(this.port, () => {
        console.log(`API running on http://localhost:${this.port}`);
        });
    }
}
  
  export default ExpressApp;