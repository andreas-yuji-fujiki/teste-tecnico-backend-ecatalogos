import { CorsOptions } from "cors";
import dotenv from "dotenv";

dotenv.config()

const corsConfig: CorsOptions = {
  
  origin: [
    `${process.env.CORS_ALLOWED_URL_1}`,
    `${process.env.CORS_ALLOWED_URL_2}`
  ].filter(Boolean),

  methods: [
    "GET", 
    "POST", 
    "PUT", 
    "DELETE"],

  allowedHeaders: [
    "Content-Type", 
    "Authorization"
  ]
};

export default corsConfig;
