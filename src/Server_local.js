"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const express = require('express');
const body = require('body-parser');
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};
const uri = 'mongodb+srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/?retryWrites=true&w=majority';
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new mongodb_1.MongoClient(uri, {
                serverApi: {
                    version: mongodb_1.ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            });
            yield client.db("admin").command({ ping: 1 });
            const app = express();
            app.use(cors(corsOptions)); // Use this after the variable declaration
            yield client.connect();
            client.db("lavidaWeb").collection("users");
            app.db = client.db("lavidaWeb");
            // body parser
            app.use(body.json({
                limit: '500kb'
            }));
            // Routes
            app.use('/login', require('./RoutesServer.ts'));
            // Start server
            app.listen(3000, () => {
                console.log('Server is running on port 3000');
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
start();
