const express = require("express");
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
const { decode } = require("jsonwebtoken");
const app=express();
const port=process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


function verifyJWT(req,res,next){
  const headerAuth=req.headers.authorization;
  if(!headerAuth){
    return res.status(401).send({message:"unauthorized access"});
  }
  const token=headerAuth.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRATE, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden Acccess" });
    }
  });
  console.log("decoded",decoded);
  req.decoded=decoded;
  next();
}
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

    //jwt
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRATE, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

    //post product
    //API:http://localhost:5000/product
    app.post("/product", async (req, res) => {
      const data = req.body;
      const result = await productCollection.insertOne(data);
      console.log(data);
      res.send(result);
    });
    //user items
    app.get("/myitems", verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      if (email === decodedEmail) {
        const query = { email: email };

        const cursor = productCollection.find(query);
        const items = await cursor.toArray();
        res.send(items);
      } else {
        res.status(403).send({ message: "forbidden access" });
      }
    });
    //service details

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    //delete
    //api: http://localhost:5000/inventory/6282b84c0b4af063e414a0ce

    app.delete("/inventory/:id", async (req, res) => {
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