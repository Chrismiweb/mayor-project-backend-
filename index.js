const express = require('express');
const connectDb = require('./database/connectDB');
const router = require('./routes/handler');
const dotenv = require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.port || 1080;
const fileUpload = require('express-fileupload');


const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

// express usage 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload()); 
app.use('/', router)


 app.listen(port, async()=>{
    console.log(`server is running on port ${port}`);    
    await connectDb(`database is currently running on ${port}`)
 });