const express = require('express');
const app = express();
const connectDB =require('./db/connect');
require('dotenv').config();
const User = require('./models/user');
const Tweet = require('./models/tweets');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const {SECRET_KEY} = process.env;
const {isAuthenticated} = require('./middleware/authentication');

app.use(express.static('public'));
app.use(express.json());
// app.use(cors());

//homepage
app.get('/home',isAuthenticated,(req,res)=>{
    res.status(201).send({msg:"Welcome"});
})

// Generate a JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email , name:user.name}, SECRET_KEY, {
      expiresIn: "1h", // Token expires in 1 hour
    });
};

//signup
app.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;
    try {
        //checking if user exists already
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).send({ error: 'Username already exists' });
        }

        //hashing the password
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

        const user = await User.create({name,email,password:hashedPassword});

        const token = generateToken(user);
        console.log({token});
        if(user){
            res.status(201).send({token});
        }
        
    } catch (error) {
        res.status(401).send(`Error: ${error}`);
    }
})

// login
app.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try {
        //check for user exists or not...
        const user = await User.findOne({email});
        if(!user){
            res.status(404).send({ error: 'User not found' });
        }

        // Compare hashed passwords
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid credentials." });
        }

        //generate token
        const token = generateToken(user);

        console.log({token});
        res.status(201).send({token});
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/tweet',async (req,res)=>{
    try {
        const {email,name,msg} = req.body;
        const Tweetx = await Tweet.create({email,name,msg});
    
        if(!Tweetx){
            res.status(401).send({message:'Tweet not posted successfully'});
        }
        res.status(201).send({email,name,msg});
    } catch (error) {
        res.status(404).send(`Error: ${error}`);
    }
})

app.get('/allTweets',async(req,res)=>{ //get all msg on page
    try {
        const Tweets = await Tweet.find({});
        res.status(201).json({Tweets});
    }catch (error) {
        res.status(500).json({msg:error});
    }
})


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