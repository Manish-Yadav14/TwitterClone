require('dotenv').config();
const express = require('express');
const app = express();
const connectDB =require('./db/connect');
const User = require('./models/user');
const Tweet = require('./models/tweets');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const {SECRET_KEY} = process.env;
const {isAuthenticated} = require('./middleware/authentication');

//middleware
app.use(express.static('public'));
app.use(express.json());

//homepage
app.get('/home',isAuthenticated,(req,res)=>{
    return res.status(201).send({msg:"Welcome"});
})

// Generate a JWT token
const generateToken = (user) => {
    return jwt.sign({email: user.email , name:user.name}, SECRET_KEY, {
      expiresIn: "2h", // Token expires in 1 hour
    });
};

//signup
app.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;
    try {
        //checking if user exists already
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'Username already exists' });
        }

        //hashing the password
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

        const user = await User.create({name,email,password:hashedPassword});

        const token = generateToken(user);
        console.log({token});
        if(user){
            return res.status(201).send({token});
        }
        
    } catch (error) {
        return res.status(401).send(`Error: ${error}`);
    }
})

// login
app.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try {
        //check for user exists or not...
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send({ error: 'User not found' });
        }

        // Compare hashed passwords
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        //generate token
        const token = generateToken(user);

        console.log({token});
        return res.status(201).send({token});
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

//post tweet
app.post('/tweet',async (req,res)=>{
    try {
        const {email,name,msg} = req.body;
        const Tweetx = await Tweet.create({email,name,msg});
    
        if(!Tweetx){
            res.status(401).send({message:'Tweet not posted successfully'});
        }
        return res.status(201).send({email,name,msg});
    } catch (error) {
        return res.status(404).send(`Error: ${error}`);
    }
})

//show all tweets
app.get('/allTweets',async(req,res)=>{ //get all msg on page
    try {
        const Tweets = await Tweet.find({});
        return res.status(201).json({Tweets});
    }catch (error) {
        return res.status(500).json({msg:error});
    }
})

// show user Tweets only
app.post('/userTweets',async(req,res)=>{
    try {
        const {email} = req.body;
        const tweets = await Tweet.find({email});
        return res.status(201).json({tweets});
    } catch (error) {
        return res.status(500).json({msg:error});console.log(error);
    }
})

//for like count 
app.patch('/userTweets/:id', async (req, res) => {
    try {
      const id = req.params.id;
    //   console.log(id);
      const tweet = await Tweet.findById(id)
    //   console.log(tweet);
      if (!tweet) {
        return res.status(404).json({ message: 'Tweet not found' });
      }

      tweet.likes += 1;
      await tweet.save();
  
      return res.status(200).json(tweet);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error liking tweet' });
    }
  });


// -------------------------------------- Server Initialisation----------------------------------------
const port = process.env.Port || 3000;
const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log(`Server is Listening on Port ${port}...`);
        });    
    } catch (error) {
        console.log(error);
    }
}
start();