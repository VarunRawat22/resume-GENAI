const express=require('express');
const app=express();
const cookieParser=require('cookie-parser'); // iske bina hum cookies ko read nahi kar payenge

app.use(cookieParser()); // cookie parser middleware ko use krna hoga taki hum cookies ko read kr paye

app.use(express.json());

// require all routes here
const authRouter=require('./routes/auth.routes');

// use all routes here
app.use("/api/auth", authRouter); 

module.exports=app;