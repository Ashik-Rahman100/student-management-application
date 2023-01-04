const { MongoClient,ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Middlewere
app.use(cors());
app.use(express.json())


// USER: restUsers
// PASS: 5zOHnxJH5mZCYjTA



// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://restUsers:5zOHnxJH5mZCYjTA@cluster0.z8svvp5.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    // const database = client.db("insertDB");
    // const haiku = database.collection("haiku");
    const students_collection = client.db("p_hero").collection("students");

    // POST API
    app.post('/students', async(req, res) =>{
        const newStudent = req.body;
        const result = await students_collection.insertOne(newStudent);
        res.json(result)
    });

    // GET API
    app.get('/students', async(req, res) =>{
        const query = {};
        const cursor = students_collection.find(query);
        const students = await cursor.toArray();
        res.send(students);
    });

    // GET Particular API(Student)
    app.get('/students/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const student = await students_collection.findOne(query);
      res.send(student);
    });

    // UPDATE/PUT  API 
    app.put('/students/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const student = req.body;
      const options = {upsert:true};
      const updatedDoc = {
        $set:{
          name:student.name,
          roll:student.roll,
          reg:student.reg,
          dep:student.dep,
          session:student.session,
          address:student.address,
          email:student.email,
          phone:student.phone

        }
      }
      
      const result = await students_collection.updateOne(query,updatedDoc,options);
      res.send(result);
    })

    // DELETE Api
    app.delete('/students/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await students_collection.deleteOne(query);
      res.send(result);

    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) =>{
    res.send('Hello Js ');
});

app.listen(port, () =>{
    console.log('Server running port is:', port);
})