import { generanteAIContent } from "@/lib/geminiAI";
import { generateExperienceDescription } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: generateExperienceDescription = await req.json();

    const { jobRole, experienceLevel, yearsOfExperience, techStack } = body;

    if (!jobRole || !experienceLevel || !yearsOfExperience || !techStack) {
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
You are an expert Resume Writer, Technical Recruiter, and Hiring Manager.

Generate a professional work experience description for the following candidate.

Candidate Information:

* Job Title: ${jobRole}
* Experience Level: ${experienceLevel}
* Years of Experience: ${yearsOfExperience}
* Tech Stack: ${techStack}

Requirements:

* Write a professional experience description between 80 and 150 words.
* Write exactly one paragraph.
* Tailor the description specifically to the ${jobRole} role.
* Naturally incorporate the technologies from the provided tech stack.
* Focus on responsibilities, technical contributions, software development practices, collaboration, and problem-solving.
* Use ATS-friendly keywords commonly found in real job descriptions.
* Highlight increasing responsibility based on the candidate's experience level.

Experience Level Guidelines:

* Entry Level:
  Focus on hands-on development, learning, debugging, testing, project implementation, and collaboration.

* Mid Level:
  Focus on feature ownership, application development, performance optimization, API integration, code reviews, and cross-functional collaboration.

* Senior Level:
  Focus on system architecture, scalability, mentoring, technical leadership, strategic decision-making, and engineering best practices.

* Lead/Principal Level:
  Focus on technical vision, architecture decisions, team leadership, stakeholder communication, and large-scale system design.

Additional Rules:

* Use strong action-oriented language.
* Do not invent specific achievements, metrics, or projects.
* Do not use first-person pronouns (I, Me, My, We).
* Avoid generic buzzwords such as:

  * Hardworking
  * Team Player
  * Highly Motivated
  * Results-Driven
  * Dedicated Professional
* Ensure the description sounds realistic and recruiter-approved.
* Make the description suitable for:

  * Resume Experience Section
  * LinkedIn Experience
  * Professional Portfolio

Output Rules:

* Return only the final experience description.
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
