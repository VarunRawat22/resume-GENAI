const pdfParse = require("pdf-parse"); // is library ko hum isliye import karenge taki hum PDF files ko parse kar sake, aur unke content ko extract kar sake, taki jab bhi koi user apna resume upload kare to hum us resume ke content ko extract karke uske basis pe interview report generate kar sake, aur users ko personalized feedback de sake, taki unhe apne interview preparation me madad mil sake.
const generateInterviewReport=require("../services/ai.service"); // is service ko hum isliye import karenge taki hum apne interview report generate karne ke logic ko us service ke andar implement kar sake, aur apne controller file ko clean aur organized rakh sake, taki hum apne application ke code ko easily maintain kar sake, aur future me agar hume interview report generate karne ke logic me koi changes karne ho to hum easily us service file me jaake changes kar sake, bina controller file ko mess kiye.
const interviewReportModel = require("../models/interviewReport.model"); // is model ko hum isliye import karenge taki hum apne interview report ko database me store kar sake, taki jab bhi koi user apna resume, self description, aur job description bheje to uske basis pe AI se interview report generate karke us report ko database me save kar sake, taki future me hum us report ko access kar sake, aur users ko unki previous reports dekhne ka option de sake, taki unhe apne interview preparation me madad mil sake, aur wo apni progress track kar sake.

async function generateInterviewReportController(req,res){
    const resumeFile=req.file;

    const resumeContent= await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText(); // isse hoga kya ki jab bhi koi user apna resume upload kare to hum us resume file ko pdfParse library ke through parse karenge, aur uske content ko extract karenge, taki hum us content ko interview report generate karne ke logic me use kar sake, aur users ko personalized feedback de sake, taki unhe apne interview preparation me madad mil sake, aur wo apni progress track kar sake.
    const { selfDescription, jobDescription }= req.body;

    const interviewReportByAi = await generateInterviewReport(
    resumeContent.text,
    selfDescription,
    jobDescription
); // is function ko hum isliye call karenge taki jab bhi koi user apna resume, self description, aur job description bheje to uske basis pe AI se interview report generate kar sake, aur us report ko interviewReportByAi variable me store kar sake, taki hum us report ke andar ke fields ko easily access kar sake, jaise ki matchScore, technicalQuestions, behavioralQuestions, skillGaps, aur preparationPlan, aur unke basis pe hum apne application me further processing kar sake, jaise ki interview report ko database me store karna ya user ko display karna.


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
      try {
        // 🔥 FIX: wrap broken JSON
        const fixed = `{${item}}`;
        return JSON.parse(fixed);
      } catch (err2) {
        console.log("❌ Parse failed for:", item);
        return null;
      }
    }
  }).filter(Boolean);

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
  ...interviewReportByAi
});



    res.status(200).json({
        success:true,
        message:"Interview report generated successfully",
        interviewReport
    })

}



module.exports={generateInterviewReportController}



// const pdfParse = require("pdf-parse")
// const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
// const interviewReportModel = require("../models/interviewReport.model")




// /**
//  * @description Controller to generate interview report based on user self description, resume and job description.
//  */
// async function generateInterViewReportController(req, res) {

//     const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
//     const { selfDescription, jobDescription } = req.body

//     const interViewReportByAi = await generateInterviewReport({
//         resume: resumeContent.text,
//         selfDescription,
//         jobDescription
//     })

//     const interviewReport = await interviewReportModel.create({
//         user: req.user.id,
//         resume: resumeContent.text,
//         selfDescription,
//         jobDescription,
//         ...interViewReportByAi
//     })

//     res.status(201).json({
//         message: "Interview report generated successfully.",
//         interviewReport
//     })

// }

// /**
//  * @description Controller to get interview report by interviewId.
//  */
// async function getInterviewReportByIdController(req, res) {

//     const { interviewId } = req.params

//     const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

//     if (!interviewReport) {
//         return res.status(404).json({
//             message: "Interview report not found."
//         })
//     }

//     res.status(200).json({
//         message: "Interview report fetched successfully.",
//         interviewReport
//     })
// }


// /** 
//  * @description Controller to get all interview reports of logged in user.
//  */
// async function getAllInterviewReportsController(req, res) {
//     const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

//     res.status(200).json({
//         message: "Interview reports fetched successfully.",
//         interviewReports
//     })
// }


// /**
//  * @description Controller to generate resume PDF based on user self description, resume and job description.
//  */
// async function generateResumePdfController(req, res) {
//     const { interviewReportId } = req.params

//     const interviewReport = await interviewReportModel.findById(interviewReportId)

//     if (!interviewReport) {
//         return res.status(404).json({
//             message: "Interview report not found."
//         })
//     }

//     const { resume, jobDescription, selfDescription } = interviewReport

//     const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

//     res.set({
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
//     })

//     res.send(pdfBuffer)
// }

// module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
