const express=require("express");
const mysql=require("mysql2");
const {v4: uuidv4}=require("uuid");
const app=express(); 
const cors = require("cors"); // Import the CORS package
app.use(cors({ origin: "http://localhost:3000" })); // to allow request from frontend
const http = require("http");
const {Server}=require("socket.io");
const port= 3001;
const db=require("./db");



// create a http server
const server=http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend origin
    methods: ["GET", "POST"],         
  },
});

app.use(express.json());
io.on("connection",(socket)=>{ // socket for client
  console.log("new entry");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
})



app.post("/api/login", (req, res) => {
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    const sessionId = uuidv4();
  
    // Insert session into the database
    db.query("INSERT INTO sessions (id, username) VALUES (?, ?)", [sessionId, username], (err) => {
      if (err) {
        console.error("Error inserting session:", err);
        return res.status(500).json({ error: "Failed to create session" });
      }
  
      // Respond with the session ID
      res.status(200).json({ sessionId });
    });
  });
  
app.get("/api/comments",(req,res)=>{
    db.query("SELECT * FROM comments ORDER BY timestamp DESC",(err,results)=>{
      if(err){
        console.log("There is a error",err);
        return res.status(500).json({ error: "Failed to fetch comments" });
      }
      return res.status(200).json(results);
    });
    
});

app.post("/api/comments",(req,res)=>{
  const { username, content } = req.body;
  if (!username || !content) {
    return res.status(400).json({ error: "Username and content are required" });
  }
  db.query("INSERT INTO comments (username, content) VALUES (?, ?)",[username, content], (err, results) => {
      if (err) {
        console.error("Error inserting comment:", err);
        return res.status(500).json({ error: "Failed to store comment" });
      }
      const newcomment={id:results.insertId,username,content};
      // emit comment to all connected clients
      io.emit("newcomment",newcomment);
    res.status(201).json({ message: "Comment added successfully", comment:newcomment });
    }
  );

})

 
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

app.use(express.json());