const express = require("express");

// since access private h hai to hume auth middleware ko bhi import karna hoga taki hum us middleware ko apne route pe apply kar sake, aur sirf authenticated users hi us route ko access kar sake, taki unauthorized access se bach sake, aur apne application ki security ko enhance kar sake.
const authMiddleware = require("../middlewares/auth.middleware"); // is middleware ko hum isliye use karenge taki interview report generate karne ke endpoint ko secure kar sake, aur sirf authenticated users hi us endpoint ko access kar sake, taki unauthorized users us endpoint ko access na kar sake, aur hum apne application ki security ko enhance kar sake.

const interviewController = require("../controllers/interview.controller"); // is controller ko hum isliye import karenge taki hum apne interview report generate karne ke logic ko us controller ke andar implement kar sake, aur apne route file ko clean aur organized rakh sake, taki hum apne application ke code ko easily maintain kar sake, aur future me agar hume interview report generate karne ke logic me koi changes karne ho to hum easily us controller file me jaake changes kar sake, bina route file ko mess kiye.

const interviewRouter = express.Router();

const upload = require("../middlewares/file.middleware"); // is middleware ko hum isliye import karenge taki hum apne route pe file upload ka functionality add kar sake, aur users ko apna resume upload karne ka option de sake, taki hum us resume ke basis pe interview report generate kar sake, aur users ko personalized feedback de sake, taki unhe apne interview preparation me madad mil sake.



/**
 * @route POST /api/interview/
 * @description Generate interview report based on resume, self description, and job description
 * @access Private (for now, we can make it public for testing)
 * @body { resume: string, selfDescription: string, jobDescription: string }
 * @response { matchScore: number, technicalQuestions: [{ question: string, intention: string, answer: string }], behavioralQuestions: [{ question: string, intention: string, answer: string }], skillGaps: [{ skill: string, severity: "Low" | "Medium" | "High" }], preparationPlan: [{ day: number, focus: string, tasks: [string] }] }
 */


interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController); // is route ka endpoint h /api/interview/ aur method h POST, aur is route pe hum authMiddleware.authUser middleware ko apply karenge taki sirf authenticated users hi is route ko access kar sake, aur interviewController.generateInterviewController function ko is route ke handler ke roop me use karenge taki jab bhi koi request is route pe aayegi to wo function execute hoga, aur us function ke andar hum interview report generate karne ka logic implement karenge, taki jab bhi koi user apna resume, self description, aur job description bheje to uske basis pe AI se interview report generate karke user ko response me bhej sake.


module.exports = interviewRouter;

