const express = require("express");
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app=express();
const port=process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
//connection


const uri = `mongodb+srv://${process.env.DB_USR}:${process.env.DB_PASS}@warehouse.h6xxn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const smartphoneCollection = client.db("smartphone-warehouse").collection("smartphones");
  console.log('database connected');
  // perform actions on the collection object
  client.close();
});


app.get('/',(req,res)=>{
  res.send("warehouse server running");
});
app.listen(port,()=>{
  console.log(`listening to the port ${port}`);
})