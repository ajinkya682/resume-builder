import { generanteAIContent } from "@/lib/geminiAI";
import { generateSkills } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: generateSkills = await req.json();

    const { expressionLevel, jobTitle } = body;

    if (!expressionLevel || !jobTitle) {
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
You are an expert ATS Resume Writer, Technical Recruiter, and Hiring Manager.

Generate a professional list of resume skills for a ${expressionLevel} ${jobTitle}.

Requirements:

* Generate 12-20 highly relevant skills.
* Prioritize skills commonly required in real job descriptions for the ${jobTitle} role.
* Tailor the skills based on the candidate's experience level (${expressionLevel}).
* Include a balanced mix of:

  * Technical Skills
  * Tools & Technologies
  * Industry-Specific Skills
  * Professional Skills
* Focus on ATS-friendly keywords that recruiters actively search for.
* Include modern and in-demand technologies relevant to the role.
* Ensure every skill is directly relevant to the ${jobTitle} position.
* Avoid outdated, generic, or irrelevant skills.
* Do not include duplicate or similar skills.
* Do not add proficiency levels.
* Do not add explanations.
* Do not add categories or headings.
* Return skills as a clean JSON array of strings.

Experience-Level Guidelines:

* Entry Level:
  Focus on foundational technologies, development tools, academic knowledge, projects, and core professional skills.

* Mid Level:
  Focus on implementation, collaboration, debugging, optimization, testing, deployment, and project ownership.

* Senior Level:
  Focus on architecture, leadership, system design, scalability, mentoring, strategy, and advanced technical expertise.

Output Example:

[
"React",
"TypeScript",
"Node.js",
"REST APIs",
"MongoDB",
"Git",
"Responsive Web Design"
]

Return ONLY the JSON array.
`;

    const result = await generanteAIContent(prompt);

    const skills = typeof result === "string" ? JSON.parse(result) : result;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Skills generated successfully",
        data: {
          skills,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log("Error generating Skills", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error generating Skills",
      },
      {
        status: 500,
      },
    );
  }
}
