import dotenv from "dotenv";
dotenv.config()

import express, { json, urlencoded } from "express"
import { connectToDb } from "./db/connect";

const app = express();

// middleware for json parsing of request body

app.use(urlencoded({ extended: true }));
app.use(json());

// swagger UI
import * as swaggerUI from "swagger-ui-express";
import * as swaggerJson from "./tsoa/tsoa.json";

// serve Swagger UI
app.use(
    ["/openapi", "/docs", "/swagger"],
    swaggerUI.serve,
    swaggerUI.setup(swaggerJson)
  );
  
  // serve swagger JSON
  app.get("/swagger.json", (_, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendFile(__dirname + "/tsoa/tsoa.json");
  });

// tsoa routes
import { RegisterRoutes } from "./routes/routes";
RegisterRoutes(app);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is missing in .env file");
        }
        console.log("Connnecting to db...");
        await connectToDb(mongoUri);
        console.log("Connnected to db");
        console.log("Starting server...");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();