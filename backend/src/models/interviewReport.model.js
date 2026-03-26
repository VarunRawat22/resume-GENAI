const mongoose = require('mongoose');


/**
 * - job decription schema : String
 * - resume : String
 * - self description : String
 * -matchScore:number
 * 
 * Ab jo AI response m aayega usko bhi store karna hai, taki future me usko access kar sake, aur uske basis pe aur bhi insights nikal sake
 * - Technical Questions: [{
 *                  question: "String",
 *                  answer: "String",
 *                  intention: "String" // isme ye store karenge ki question interview ke kis stage pe pucha gaya tha, jaise ki initial screening, technical round, HR round etc.
 *                  }]
 * - Behavioral Questions: [{
 *   question: "String",
 *   answer: "String"
 *   intention: "String"
 * }]
 * - Skill Gaps: [{
 *              skill: "String",
 *               severity:{
 *                  type: String,
 *                 enum: ["Low", "Medium", "High"]},
 * 
 * }]
 * - Prepration Plan:[{
 *                    day: Number,
 *                    focus:String.
 *                    tasks:[String]
 * }]  since ye multiple days k hoga like day 1 p kya krna h day2 p kya krna h, isliye isko array of objects me store karenge, jisme har object me day aur uske corresponding tasks honge
 */


const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    },
},{
    _id:false // isse hoga kya ki jab bhi hum interview report create karenge, to technical questions ke andar jo question-answer pairs honge, unke apne unique _id nahi honge, kyunki wo sirf interview report ke context me hi relevant honge, aur unko alag se identify karne ki zarurat nahi hai
});


const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
},{
    _id:false
});

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:["Low","Medium","High"],
        required:[true,"Severity is required"]
    }
},{
    _id:false
});


const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"Focus is required"]
    },
    tasks:[{
        type:String,
        required:[true,"Task is required"]
    }]
},{
    _id:false
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"Job description is required"]
    },
    resume:{
        type:String,
        // required:[true,"Resume is required"]
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String,
        required:[true,"Title is required"]
    }

},{timestamps:true});



const interviewReportModel= mongoose.model("InterviewReport",interviewReportSchema);

module.exports=interviewReportModel;