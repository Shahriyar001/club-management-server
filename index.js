const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dawimtn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const cupCollection = client.db('clubManage').collection('cups');
        const usersCollection = client.db('clubManage').collection('users');
        const playersCollection = client.db('clubManage').collection('players');
        const coachesCollection = client.db('clubManage').collection('coaches');
        const messagesCollection = client.db('clubManage').collection('messages');

        app.get('/cups', async (req, res) => {
            const query = {};
            const options = await cupCollection.find(query).toArray();
            res.send(options);
        });

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });

        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.put('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.get('/players', async (req, res) => {
            const query = {};
            const players = await playersCollection.find(query).toArray();
            res.send(players);
        });

        app.post('/players', async (req, res) => {
            const player = req.body;
            const result = await playersCollection.insertOne(player);
            res.send(result);
        });

        app.get('/coaches', async (req, res) => {
            const query = {};
            const coaches = await coachesCollection.find(query).toArray();
            res.send(coaches);
        })

        app.post('/coaches', async (req, res) => {
            const coach = req.body;
            const result = await coachesCollection.insertOne(coach);
            res.send(result);
        });

        app.get('/messages', async (req, res) => {
            const query = {};
            const messages = await messagesCollection.find(query).toArray();
            res.send(messages);
        })

        app.post('/messages', async (req, res) => {
            const message = req.body;
            const result = await messagesCollection.insertOne(message);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.log);



app.get('/', async (req, res) => {
    res.send('servern is running');
})

app.listen(port, () => console.log(`Server ruuning on port ${port}`))