const express=require('express');
const app=express();
const cors=require('cors');
const cookieParser=require('cookie-parser'); // iske bina hum cookies ko read nahi kar payenge

app.use(cookieParser()); // cookie parser middleware ko use krna hoga taki hum cookies ko read kr paye

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // frontend ka url
    credentials: true // credentials true krna hoga taki frontend se cookies ko send kr paye
})); // CORS middleware ko use krna hoga taki frontend se backend ko access kr paye


// require all routes here
const authRouter=require('./routes/auth.routes');

// use all routes here
app.use("/api/auth", authRouter); 

module.exports=app;