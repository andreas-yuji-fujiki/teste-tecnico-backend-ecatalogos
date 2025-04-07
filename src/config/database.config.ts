import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config()

const prisma = new PrismaClient({
    log: process.env.NODE_ENV !== "production" 
        ? 
            [ "query", "error", "warn" ]
        :
            []
        ,
});

export default prisma;