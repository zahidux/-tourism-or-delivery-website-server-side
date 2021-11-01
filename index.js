const express = require('express');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config()

const app = express();

//middleware
app.use(cors());
app.use(express.json())


// PORT
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Turista is running');
});

const uri = "mongodb+srv://hotelbooking:CyZDoopNG5MFw3uW@cluster0.q8zce.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('databas Connected');

        const database = client.db('hotel');
        const userCollection = database.collection('users');


        const bookingCollection = database.collection('bookings');

        // GET API
        app.get('/all-booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const allBooking = await cursor.toArray();
            res.json(allBooking);
        })

        // GET API
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        // POST API
        app.post('/order', async (req, res) => {
            const addUser = req.body;
            const result = await userCollection.insertOne(addUser)
            res.json(result)
        })

        // POST API
        app.post('/all-package', async (req, res) => {
            const addNewPackage = req.body;
            const result = await packageCollection.insertOne(addNewPackage)
            res.json(result)
        })

        // Delete API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await userCollection.deleteOne(query)
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('Listening port is:', port);
});