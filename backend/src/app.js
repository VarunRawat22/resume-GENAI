const express=require('express');
const app=express();
const cors=require('cors');
const cookieParser=require('cookie-parser'); // iske bina hum cookies ko read nahi kar payenge

app.use(cookieParser()); // cookie parser middleware ko use krna hoga taki hum cookies ko read kr paye

app.use(express.json());

app.use(cors({
    origin: 'resume-genai-jsioglwdo-varunrawat22s-projects.vercel.app', // frontend ka url
    credentials: true // credentials true krna hoga taki frontend se cookies ko send kr paye
})); // CORS middleware ko use krna hoga taki frontend se backend ko access kr paye


// require all routes here
const authRouter=require('./routes/auth.routes');
const interviewRouter=require('./routes/interview.routes');

// use all routes here
app.use("/api/auth", authRouter); 
app.use("/api/interview", interviewRouter); // isse hoga kya ki jab bhi frontend se /api/interview ke endpoint pe request jayegi, to wo request interviewRouter ke paas jayegi, aur waha se us request ko handle kiya jayega, aur interview report generate karne ka logic waha pe implement kiya jayega, taki hum apne application me interview report generate karne ka feature add kar sake.

module.exports=app;