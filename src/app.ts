import express from "express";
import type { Application } from "express";
import cors from 'cors';
import helmet from "helmet";
import morgan from "morgan";
import dotenv from 'dotenv';
import { corsConfig } from "./cors/corsConfig";

import router from "./routes/user.routes";
import { globalErrorMiddleware } from "./middlewares/globalErrorMiddlewares";

dotenv.config();

class App {
    public app: Application;
    private port: number | string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3444

        this.middlewares();
        this.routes();
        this.errorHandling();
    }

    private middlewares(): void {
        this.app.use(express.json())
        this.app.use(cors(corsConfig))
        this.app.use(helmet())
        this.app.use(morgan("dev"))
    }

    private routes(): void {
        this.app.use('/api/users', router)
    }

    private errorHandling(): void {
        this.app.use(globalErrorMiddleware)
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`)
        })
    }
}

export default new App()