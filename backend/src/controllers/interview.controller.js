const pdfParse = require("pdf-parse"); // is library ko hum isliye import karenge taki hum PDF files ko parse kar sake, aur unke content ko extract kar sake, taki jab bhi koi user apna resume upload kare to hum us resume ke content ko extract karke uske basis pe interview report generate kar sake, aur users ko personalized feedback de sake, taki unhe apne interview preparation me madad mil sake.
const generateInterviewReport=require("../services/ai.service"); // is service ko hum isliye import karenge taki hum apne interview report generate karne ke logic ko us service ke andar implement kar sake, aur apne controller file ko clean aur organized rakh sake, taki hum apne application ke code ko easily maintain kar sake, aur future me agar hume interview report generate karne ke logic me koi changes karne ho to hum easily us service file me jaake changes kar sake, bina controller file ko mess kiye.
const interviewReportModel = require("../models/interviewReport.model"); // is model ko hum isliye import karenge taki hum apne interview report ko database me store kar sake, taki jab bhi koi user apna resume, self description, aur job description bheje to uske basis pe AI se interview report generate karke us report ko database me save kar sake, taki future me hum us report ko access kar sake, aur users ko unki previous reports dekhne ka option de sake, taki unhe apne interview preparation me madad mil sake, aur wo apni progress track kar sake.

async function generateInterviewReportController(req,res){
    const resumeFile=req.file;

    const resumeContent= await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText(); // isse hoga kya ki jab bhi koi user apna resume upload kare to hum us resume file ko pdfParse library ke through parse karenge, aur uske content ko extract karenge, taki hum us content ko interview report generate karne ke logic me use kar sake, aur users ko personalized feedback de sake, taki unhe apne interview preparation me madad mil sake, aur wo apni progress track kar sake.
    const { selfDescription, jobDescription }= req.body;

    const interviewReportByAi= await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    }); // is function ko hum isliye call karenge taki jab bhi koi user apna resume, self description, aur job description bheje to uske basis pe AI se interview report generate kar sake, aur us report ko interviewReportByAi variable me store kar sake, taki hum us report ke andar ke fields ko easily access kar sake, jaise ki matchScore, technicalQuestions, behavioralQuestions, skillGaps, aur preparationPlan, aur unke basis pe hum apne application me further processing kar sake, jaise ki interview report ko database me store karna ya user ko display karna.


    // const interviewReport= await interviewReportModel.create({
    //     user:req.user._id,
    //     resume: resumeContent.text,
    //     selfDescription,
    //     jobDescription,
    //     ...interviewReportByAi
    // })


    // 🔥 helper function
const deepParseArray = (arr) =>
  arr.map(item => {
    if (typeof item === "object") return item;

    try {
      return JSON.parse(item);
    } catch (err) {
      console.log("❌ Parse failed for:", item);
      return null; // explicitly null
    }
  }).filter(Boolean); // 🔥 removes null values

// 🔥 clean AI response
const cleanedData = {
  ...interviewReportByAi,
  technicalQuestions: deepParseArray(interviewReportByAi.technicalQuestions || []),
  behavioralQuestions: deepParseArray(interviewReportByAi.behavioralQuestions || []),
  skillGaps: deepParseArray(interviewReportByAi.skillGaps || []),
  preparationPlan: deepParseArray(interviewReportByAi.preparationPlan || [])
};

// 🔥 now save clean data
const interviewReport = await interviewReportModel.create({
  user: req.user._id,
  resume: resumeContent.text,
  selfDescription,
  jobDescription,
  ...cleanedData
});



    res.status(200).json({
        success:true,
        message:"Interview report generated successfully",
        interviewReport
    })

}



module.exports={generateInterviewReportController}