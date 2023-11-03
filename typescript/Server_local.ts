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

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const database = client.db('lavida');
        const collection = database.collection('your-collection-name');


    } catch {
        console.log("error");
    }
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
