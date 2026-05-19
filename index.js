// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const env = require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
 
 
  
    // POST 
    app.post("/ideas", async (req, res) => {
      const idea = req.body;
      idea.createdAt = new Date();
      const result = await ideasCollection.insertOne(idea);
      res.send(result);
    });
 



    // GET /ideas 
    app.get("/ideas", async (req, res) => {
      const { search, category, startDate, endDate } = req.query;
 
      const filter = {};
 
     
      if (search) {
        filter.title = { $regex: search, $options: "i" };
      }
 
      
      if (category) {
        filter.category = category;
      }
 
      
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
 
      const ideas = await ideasCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();
 
      res.send(ideas);
    }); 


 // GET /ideas/:id  details
    app.get("/ideas/:id", async (req, res) => {
      const id = req.params.id;
      const idea = await ideasCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!idea) {
        return res.status(404).send({ message: "Idea not found" });
      }
      res.send(idea);
    });




    


 

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




    
