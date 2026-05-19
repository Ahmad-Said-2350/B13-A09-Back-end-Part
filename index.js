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



//  my-ideas 
    app.get("/ideas/my-ideas", async (req, res) => {
      const email = req.query.email;
      const ideas = await ideasCollection
        .find({ postedBy: email })
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


// PUT /ideas/:id  idea update
app.put("/ideas/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  delete updatedData._id;
  const result = await ideasCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData }
  );
  res.send(result);
});

// DELETE /ideas/:id  idea delete
app.delete("/ideas/:id", async (req, res) => {
  const id = req.params.id;
  const result = await ideasCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// POST /comments  comment add
app.post("/comments", async (req, res) => {
  const comment = req.body;
  comment.createdAt = new Date();
  const result = await commentsCollection.insertOne(comment);
  res.send(result);
});


// GET /comments/:ideaId   idea র সব comment
app.get("/comments/:ideaId", async (req, res) => {
  const ideaId = req.params.ideaId;
  const comments = await commentsCollection
    .find({ ideaId: ideaId })
    .sort({ createdAt: 1 })
    .toArray();
  res.send(comments);
});

// PUT /comments/:id comment edit
app.put("/comments/:id", async (req, res) => {
  const id = req.params.id;
  const { text } = req.body;
  const result = await commentsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { text: text, updatedAt: new Date() } }
  );
  res.send(result);
});

// DELETE /comments/:id  comment delete
app.delete("/comments/:id", async (req, res) => {
  const id = req.params.id;
  const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// GET /comments/my-comments/all  My Interactions

app.get("/comments/user/all", async (req, res) => {
  const email = req.query.email;
  const comments = await commentsCollection
    .find({ userEmail: email })
    .sort({ createdAt: -1 })
    .toArray();

  const commentedIdeas = await Promise.all(
    comments.map(async (comment) => {
      const idea = await ideasCollection.findOne({
        _id: new ObjectId(comment.ideaId),
      });
      return { comment, idea };
    })
  );
  res.send(commentedIdeas);
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




    
