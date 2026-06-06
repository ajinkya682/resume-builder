import { generanteAIContent } from "@/lib/geminiAI";
import { resumeText } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: resumeText = await req.json();

    const { resumeText } = body;

    if (!resumeText) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `
You are an expert ATS Resume Reviewer, Technical Recruiter, and Hiring Manager.

Analyze the following resume and provide an ATS evaluation.

Resume:

${resumeText}

Evaluation Criteria:

1. Resume Summary Quality
2. Skills Relevance
3. Keyword Optimization
4. Work Experience Quality
5. Project Descriptions
6. Education Section
7. Technical Skills
8. Formatting & Readability
9. Action Verbs & Impact
10. Overall ATS Compatibility

Instructions:

* Carefully analyze the resume content.
* Estimate an ATS score from 0 to 100.
* Identify strengths.
* Identify weaknesses.
* Suggest specific improvements.
* Do not invent information.
* Base the analysis only on the provided resume.

Return ONLY valid JSON in the following format:

{
"score": 85,
"strengths": [
"Strong technical skills section",
"Relevant project descriptions"
],
"weaknesses": [
"Limited measurable achievements",
"Missing role-specific keywords"
],
"suggestions": [
"Add quantifiable results where possible",
"Improve keyword alignment with target roles"
]
}

Return ONLY the JSON object.
`;

    const result = await generanteAIContent(prompt);

    const ATSScore = result;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "ATSScore generated successfully",
        data: {
          ATSScore,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log("Error generating ATSScore", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error generating ATSScore",
      },
      {
        status: 500,
      },
    );
  }
}
