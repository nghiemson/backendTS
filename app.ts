import dotenv from "dotenv";
dotenv.config()

import express from "express"
import { connectToDb } from "./db/connect";
import jwt from "jsonwebtoken";
const token  = jwt.sign(
    {
        userId: "SOME USER ID", email: "SOME EMAIL"
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES,
        issuer: process.env.JWT_ISSUER,
        jwtid: "SOME ID",
    }
);
console.log(token);
const app = express();
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