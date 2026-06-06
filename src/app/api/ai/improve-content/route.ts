import { generanteAIContent } from "@/lib/geminiAI";
import { improveContent } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: improveContent = await req.json();

    const { content } = body;

    if (!content) {
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
You are an expert ATS Resume Writer, Technical Recruiter, Career Coach, and Hiring Manager.

Your task is to improve the following resume content while preserving its original meaning.

Resume Content:
${content}

Requirements:

* Rewrite the content to sound more professional, polished, and recruiter-approved.
* Optimize for modern ATS (Applicant Tracking Systems).
* Improve grammar, clarity, readability, and sentence structure.
* Use strong action-oriented language where appropriate.
* Incorporate relevant industry terminology naturally.
* Make the content concise, impactful, and easy to scan.
* Maintain the original meaning and intent.
* Do not invent achievements, metrics, technologies, responsibilities, or experience.
* Do not add information that is not present in the original content.
* Remove repetition, filler words, and weak phrasing.
* Improve professionalism while keeping the content realistic and credible.
* Ensure the result sounds human-written and not AI-generated.
* Preserve any existing technical skills, technologies, and domain-specific terminology.
* Make the content suitable for:

  * ATS Resume Screening
  * Recruiter Review
  * LinkedIn Profiles
  * Professional Portfolios

Output Rules:

* Return only the improved content.
* No explanations.
* No suggestions.
* No headings.
* No markdown.
* No quotation marks.
  `;

    const result = await generanteAIContent(prompt);

    const ImprovedContent = result;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "ImprovedContent generated successfully",
        data: {
          ImprovedContent,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log("Error generating ImprovedContent", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error generating ImprovedContent",
      },
      {
        status: 500,
      },
    );
  }
}
