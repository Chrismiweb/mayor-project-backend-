const express = require('express');
const connectDb = require('./database/connectDB');
const router = require('./routes/handler');
const dotenv = require('dotenv').config()

const app = express()
const port = process.env.port;


// express usage 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/', router)


 app.listen(port, async()=>{
    console.log(`server is running on port ${port}`);    
    await connectDb(`database is currently running on ${port}`)
 });