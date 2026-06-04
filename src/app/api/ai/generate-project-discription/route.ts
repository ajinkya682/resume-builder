import { generanteAIContent } from "@/lib/geminiAI";
import { generateProjectDescription } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: generateProjectDescription = await req.json();

    const { projectName, technologies, features } = body;

    if (!projectName || !technologies || !features) {
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
You are an expert Technical Resume Writer, Software Engineering Recruiter, and Portfolio Consultant.

Generate a professional project description using the following information:

Project Name: ${projectName}
Technologies Used: ${technologies}
Project Features: ${features}

Requirements:

* Write a professional project description between 80 and 120 words.
* Write exactly one paragraph.
* Clearly explain what the project does.
* Naturally incorporate the provided technologies and features.
* Highlight technical implementation and functionality.
* Use ATS-friendly technical keywords.
* Focus on the project's purpose, features, and technical stack.
* Make the description suitable for:

  * Resume
  * Portfolio
  * LinkedIn
  * Job Applications
* Avoid marketing language and hype.
* Avoid phrases such as:

  * Amazing project
  * Best project
  * Innovative solution
  * Cutting-edge technology
  * Revolutionary platform
* Do not invent features, technologies, or achievements.
* Do not use first-person pronouns (I, Me, My, We).
* Ensure the description sounds professional and written by an experienced software engineer.

Output Rules:

* Return only the final project description.
* No headings.
* No bullet points.
* No markdown.
* No quotation marks.
  `;

    const result = await generanteAIContent(prompt);

    const summary = result;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Summary generated successfully",
        data: {
          summary,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log("Error generating summary", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error generating summary",
      },
      {
        status: 500,
      },
    );
  }
}
