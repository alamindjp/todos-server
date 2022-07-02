
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.Db_USER}:${process.env.Db_PASS}@cluster0.5oyor.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const todoCollection = client.db('todo_app').collection('todos');

        app.get('/todo', async (req, res) => {
            const todo = await todoCollection.find().toArray();
            res.send(todo)
        })
        app.post('/todo', async (req, res) => {
            const newTodo = req.body;
            const result = await todoCollection.insertOne(newTodo);
            res.send(result)
        })
        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const quarry = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(quarry);
            res.send(result)
        })
        app.get('/todo/pending', async (req, res) => {
            const quarry = { select: 'pending' }
            const todo = await todoCollection.find(quarry).toArray();
            res.send(todo)
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World! From ToDo App');
})

app.listen(port, () => {
    console.log(`ToDo app listening on port ${port}`);
});