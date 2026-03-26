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
    })).describe("A detailed preparation plan outlining daily tasks and focus areas for the candidate to follow in order to prepare effectively for the interview."),
    title: z.string().describe("The title of the interview report, summarizing the overall assessment of the candidate's profile and suitability for the job role.")
    
    
});



async function generateInterviewReport(resume, selfDescription, jobDescription) {
    
    const prompt = `
You are an expert interviewer. Analyze the candidate and generate an interview report.

Return ONLY a JSON object with EXACTLY these fields:

{
  "matchScore": <number between 1-100>,
  "technicalQuestions": [
    {
      "question": "<technical question>",
      "intention": "<why interviewer asks this>",
      "answer": "<ideal answer points>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<behavioral question>",
      "intention": "<why interviewer asks this>",
      "answer": "<ideal answer points>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<missing skill>",
      "severity": "<Low | Medium | High>"
    }
  ],
  "preparationPlan": [
    {
      "day": <day number>,
      "focus": "<topic for the day>",
      "tasks": ["<task 1>", "<task 2>"]
    }
  ]
}

STRICT RULES:
- Return ONLY the JSON object, nothing else
- No backticks, no markdown, no extra text  
- severity must be exactly "Low", "Medium", or "High"
- Generate at least 5 technicalQuestions and 3 behavioralQuestions
- tasks must be an array of strings
- day must be a number not a string

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json" // ✅ only this
        }
    });

    console.log("🤖 Raw AI Response:", response.text);

    // Step 1 — Parse JSON
    let parsed;
    try {
        const cleaned = response.text.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(cleaned);
    } catch (err) {
        console.error("❌ JSON Parse Error:", response.text);
        throw new Error("Invalid JSON from AI");
    }

    // Step 2 — Zod Validation
    const result = interviewReportSchema.safeParse(parsed);

    if (!result.success) {
        console.error("❌ Schema Mismatch:", JSON.stringify(result.error.format(), null, 2));
        throw new Error("AI response schema mismatch");
    }

    return result.data;
}


module.exports = generateInterviewReport;