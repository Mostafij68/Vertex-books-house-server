const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a9plm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const booksCollection = client.db('vertexBooks').collection('books');

        app.get('/inventory', async(req, res)=>{
            const query = {};
            const cursor = booksCollection.find(query);
            const books = await cursor.toArray();
            res.send(books);
        });

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const books = await booksCollection.findOne(query);
            res.send(books);
        });

        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    quantity: updateQuantity.number
                }
            };
            console.log(updateDoc)
            const result = await booksCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.delete('/inventory/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await booksCollection.deleteOne(query);
            res.send(result)
        });

        app.post('/inventory', async(req, res) =>{
            const addItem = req.body;
            const result = await booksCollection.insertOne(addItem);
            res.send(result)
        })
    }
    finally{}
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('hello world')
});

app.listen(port);