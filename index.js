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
async function run(){
  try{
    await client.connect();

    const productCollection=client.db("product-collection").collection("product");


    //post product
    app.post("/product",async(req,res)=>{
      const data=req.body;
      const result=await productCollection.insertOne(data);
      console.log(data);
      res.send(result);
    })

    console.log("Database connected");
  }
  finally{

  }
 
}
run().catch(console.dir);

app.get('/',(req,res)=>{
  res.send("warehouse server running");
});
app.listen(port,()=>{
  console.log(`listening to the port ${port}`);
})