import { MongoClient, ServerApiVersion } from 'mongodb';

const express = require('express');
const body = require('body-parser');
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
const uri = 'mongodb+srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/?retryWrites=true&w=majority';

async function start() {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.db("admin").command({ ping: 1 });

        const app = express();
        app.use(cors(corsOptions)) // Use this after the variable declaration


        await client.connect();
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
}

start();