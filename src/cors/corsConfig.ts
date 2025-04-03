import { CorsOptions } from "cors"

export const corsConfig: CorsOptions = {
    origin: [
        `${process.env.CORS_WHITELIST_URL_1}`,
        `${process.env.CORS_WHITELIST_URL_2}`
    ],
    methods: [
        "GET", 
        "POST", 
        "PUT", 
        "DELETE", 
        "PATCH"
    ],
    allowedHeaders: [
        "Content-Type", 
        "Authorization"
    ]
}