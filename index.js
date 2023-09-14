const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, } = require('mongodb');

//middle ware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.dracezw.mongodb.net/?retryWrites=true&w=majority`;

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
    const userCollection = client.db("CarBoss").collection("user")
    const serviceCollection = client.db("CarBoss").collection("services")

    app.post('/users', async (req, res) => {
      const users = req.body;
      console.log(users)
      const result = await userCollection.insertOne(users)
      res.send(result);

    })
    app.get('/users', async (req, res) => {

      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)

    })
    // services data get from mongodb
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result)

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('We are on going in the path')
})


app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`)
})