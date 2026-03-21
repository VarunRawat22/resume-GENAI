require("dotenv").config();
const app=require("./src/app");
const connectDB=require("./src/config/database");
const {resume,selfDescription,jobDescription} = require("./src/services/temp"); // ye temporary data hai jo hum AI ko interview report generate karne ke liye denge, taki AI uske basis pe candidate ke strengths, weaknesses, aur improvement areas ko identify kar sake, aur ek detailed interview report generate kar sake, jisme technical questions, behavioral questions, skill gaps, aur preparation plan include ho.
const generateInterviewReport = require("./src/services/ai.service");



connectDB();
generateInterviewReport(resume,selfDescription,jobDescription);

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})