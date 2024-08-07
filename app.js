const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.error("Failed to connect to DB",err);
})



app.use('/users', require('./routes/auth'));

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})

