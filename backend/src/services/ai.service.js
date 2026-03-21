const {GoogleGenAI}= require("@google/genai")

const {z, json}= require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema"); // ye library hume zod schemas ko json schema me convert karne me help karegi, taki hum unhe AI ke prompt me use kar sake, aur AI ko ye samajhne me madad mile ki user se kis type ka input expect kiya ja raha hai, aur AI uske according response generate kar sake.

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// ye chaaro(4) fields humne isliye define kiye hain kyunki jab bhi hum AI se interview report generate karne ke liye bolenge, to hume AI ko candidate ke resume, self description, aur job description dena hoga, taki AI un teeno inputs ke basis pe candidate ke strengths, weaknesses, aur improvement areas ko identify kar sake, aur ek detailed interview report generate kar sake, jisme technical questions, behavioral questions, skill gaps, aur preparation plan include ho.
const interviewReportSchema = z.object({
    matchScore: z.number().min(1).max(100).describe("A numerical score between 1 to 100 representing the overall match between the candidate's profile and the job requirements, calculated based on various factors such as skills, experience, and qualifications."),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this technical question, such as assessing problem-solving skills, evaluating coding proficiency, etc."),
        answer: z.string().describe("The ideal answer or key points that the candidate should cover while answering this technical question like what poionts to cover what approch to take etc."),
    })).describe("A list of technical questions that can be asked in the interview, along with their intentions and ideal answers."),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this behavioral question, such as assessing communication skills, evaluating cultural fit, etc."),
        answer: z.string().describe("The ideal answer or key points that the candidate should cover while answering this behavioral question like what poionts to cover what approch to take etc."),
    })).describe("A list of behavioral questions that can be asked in the interview, along with their intentions and ideal answers."),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The specific skill that the candidate is lacking or needs improvement in."),
        severity: z.enum(["Low", "Medium", "High"]).describe("The severity level of the skill gap, indicating how critical it is for the candidate to address this gap in order to succeed in the interview.")
    })).describe("A list of skill gaps identified for the candidate, along with their severity levels."),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The specific day of the preparation plan, indicating the sequence of tasks to be completed."),
        focus: z.string().describe("The main focus or theme for that particular day of preparation, such as data structures, system design, etc."),
        tasks: z.array(z.string()).describe("A list of specific tasks or activities that the candidate should undertake on that day to effectively prepare for the interview.")
    })).describe("A detailed preparation plan outlining daily tasks and focus areas for the candidate to follow in order to prepare effectively for the interview.")
    
    
});

async function generateInterviewReport(resume,selfDescription,jobDescription){

    // yaha pe hume AI ko ek prompt dena hoga, jisme hum usko candidate ka resume, self description, aur job description denge, aur usse bolenge ki wo in teeno inputs ke basis pe ek detailed interview report generate kare, jisme candidate ke strengths, weaknesses, aur improvement areas ko highlight kiya gaya ho, aur saath hi me ek preparation plan bhi provide kiya gaya ho, taki candidate apni preparation ko effectively plan kar sake.
    // const prompt = `generate a detailed interview report based on the following inputs:
    // Resume: ${resume}
    // Self Description: ${selfDescription}
    // Job Description: ${jobDescription}
    // `;
const prompt = `
You are an expert interviewer.

Return ONLY valid JSON.

Follow this EXACT structure:

Example Output:

{
  "matchScore": 80,
  "technicalQuestions": [
    {
      "question": "What is React?",
      "intention": "Check basics",
      "answer": "React is a JS library..."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a challenge",
      "intention": "Check problem solving",
      "answer": "Explain situation..."
    }
  ],
  "skillGaps": [
    {
      "skill": "TypeScript",
      "severity": "Medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "React Basics",
      "tasks": ["Revise hooks", "Build small project"]
    }
  ]
}

IMPORTANT:
- Do NOT return arrays like ["question", "..."]
- ALWAYS return objects inside arrays

Now generate for:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents:prompt,
        config:{
            responseMimeType:"application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema) // isse hoga kya ki jab bhi hum AI se interview report generate karne ke liye bolenge, to AI ko pata hoga ki hume ek JSON format me response chahiye, jisme resume, selfDescription, aur jobDescription ke fields honge, aur unke andar string values hongi, aur AI uske according apna response format karega, taki hume us response ko easily parse karke apne application me use kar sake.
        }
    });
    
    console.log(response.text); // isse hoga kya ki jab bhi hum AI se response receive karenge, to hum us response ko json.parse karke ek JavaScript object me convert kar denge, taki hum uske andar ke fields ko easily access kar sake, jaise ki resume, selfDescription, aur jobDescription, aur unke basis pe hum apne application me further processing kar sake, jaise ki interview report ko database me store karna ya user ko display karna.

    return response.text;
}


module.exports = generateInterviewReport;