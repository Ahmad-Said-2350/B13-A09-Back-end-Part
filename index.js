// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const env = require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
console.log(process.env.MONGODB_URI)
async function run() {
  try {
    
    await client.db("admin").command({ ping: 1 });
   

    const db = client.db("IdeaVault");
    const ideasCollection = db.collection("collectionIdeaVault");
    const commentsCollection = db.collection("comments");
 
 
  

 

console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
      res.send("IdeaVault Server is running! ");
    });



app.listen(port, () => {
  console.log(` IdeaVault server running on port ${port}`);
});




    
