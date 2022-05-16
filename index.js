const express = require("express");
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

    const productCollection = client
      .db("product-collection")
      .collection("product");

    //get data
    //api:http://localhost:5000/products
    app.get("/products", async (req, res) => {
      const q = req.query;
      console.log(q);
      const cursor = productCollection.find(q);
      const result = await cursor.toArray();
      res.send(result);
    });

    //post product
    //API://localhost:5000/product
    http: app.post("/product", async (req, res) => {
      const data = req.body;
      const result = await productCollection.insertOne(data);
      console.log(data);
      res.send(result);
    });

    //delete
    //api://localhost:5000/inventory/6282b84c0b4af063e414a0ce

    http: app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(filter);
      res.send(result);
    });
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