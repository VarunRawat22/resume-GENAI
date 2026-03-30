
const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    title: z.string().describe("Short title summarizing the job role being applied for, e.g. 'Senior Frontend Engineer at Google'"),

    matchScore: z.number().min(1).max(100).describe("A numerical score between 1 to 100 representing the overall match between the candidate's profile and the job requirements."),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this technical question"),
        answer: z.string().describe("The ideal answer or key points that the candidate should cover"),
    })).describe("A list of at least 5 technical questions with intentions and ideal answers."),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this behavioral question"),
        answer: z.string().describe("The ideal answer or key points that the candidate should cover"),
    })).describe("A list of at least 3 behavioral questions with intentions and ideal answers."),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The specific skill that the candidate is lacking or needs improvement in."),
        severity: z.enum(["Low", "Medium", "High"]).describe("The severity level of the skill gap.")
    })).describe("A list of skill gaps identified for the candidate."),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The specific day number of the preparation plan."),
        focus: z.string().describe("The main focus or theme for that particular day."),
        tasks: z.array(z.string()).describe("A list of specific tasks for that day.")
    })).describe("A detailed day-by-day preparation plan."),
});


// ✅ Fixed: accepts object instead of 3 separate args
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are an expert interviewer. Analyze the candidate and generate an interview report.

Return ONLY a JSON object with EXACTLY these fields:

{
  "title": "<short title summarizing the job role, e.g. 'Senior Frontend Engineer at Google'>",
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
      "day": <day number as integer>,
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
- title must be a short descriptive string summarizing the role

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
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


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })
    await browser.close()
    return pdfBuffer
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {

  const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume PDF")
  });
  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

      const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(resumePdfSchema)

    }
    });

    const jsonContent = JSON.parse(response.text);

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
}




module.exports = { generateInterviewReport, generateResumePdf };