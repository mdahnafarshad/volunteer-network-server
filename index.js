const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

// middleware cors
require('dotenv').config()
app.use(cors());

// express middleware is added.......... then data is send to the server.
app.use(express.json());



// test this connection server 
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



console.log(process.env.pass);


// mongo db connect code starts here
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.pass}@cluster0.7vupqqk.mongodb.net/?retryWrites=true&w=majority`;

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
    const database = await client.db("volunteerNetwork");



    // collections ................
    const cards = database.collection("cardList")
    const registerUserCollection = database.collection("registerUser");
    // collections the data



    // find the  all  documents in there collection
    app.get('/cards', async (req, res) => {
      const cursor = cards.find()
      const results = await cursor.toArray();
      console.log(results);
      res.send(results);
    })



    //find a single document in the collection
    app.get('/donate/:id', async (req, res) => {
      const id = req.params.id;
      console.log("line no 62" + id);
      const query = { _id: new ObjectId(id) };
      const option = {
        projection: { title: 1, photoURL: 1 },
      }
      const result = await cards.findOne(query, option);
      res.send(result);
    });


    // user email base data....
    app.get('/donationList', async (req, res) => {
      console.log(req.query?.email, "line 94");
      let query = {};
      if (req.query?.email) {
        query = { email: req.query?.email };
      }
      console.log(query, 'line 101');
      const result = await registerUserCollection.find(query).toArray();
      res.send(result);


    })




    // create a new document / insert a document into the database
    app.post('/registerUser/', async (req, res) => {
      const register = req.body;
      console.log('83 line-', register);
      const result = await registerUserCollection.insertOne(register);
      console.log('85' + result);
      res.send(result);
    })


    // create a delete operation
    app.delete('/donationList/:id', async (req, res) => {
      // console.log(req.params.id)
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await registerUserCollection.deleteOne(query);
      // console.log(result);
      res.send(result);
    })


    // create a update operation
    app.patch('/donationList/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id,'120 line');
      const filter = { _id: new ObjectId(id) };
      const updatedList = req.body;
      console.log(updatedList, 'line 120');
      const updateDoc = {
        $set: {
          status: updatedList.status
        },
      };
      const result = await registerUserCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
