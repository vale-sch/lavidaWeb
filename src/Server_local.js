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
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            yield client.connect();
            // Send a ping to confirm a successful connection
            yield client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            const database = client.db('lavida');
            const collection = database.collection('your-collection-name');
        }
        catch (_a) {
            console.log("error");
        }
    });
}
// let user: string = document.getElementById("loginUser").innerHTML;
// let pw: string = document.getElementById("loginPW").innerHTML;
// document.getElementById("loginBtn").addEventListener("click", checkDB);
// async function checkDB() {
//     // Insert a single document into the collection using insertOne
//     //  const documentToInsert = { name: user, age: pw };
//     // const result = await collection.insertOne(documentToInsert);
//     // console.log(`Inserted ${result.insertedCount} document`);
// }
run().catch(console.dir);
