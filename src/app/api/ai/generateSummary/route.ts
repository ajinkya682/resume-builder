import { generanteAIContent } from "@/lib/geminiAI";
import { generateSummary } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: generateSummary = await req.json();

    const { expressionLevel, skills, jobTitle } = body;

    if (!expressionLevel || !skills || !jobTitle) {
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
You are an expert ATS Resume Writer and Professional Career Coach.

Generate a highly professional, ATS-friendly Resume Summary for a ${expressionLevel} ${jobTitle}.

Candidate Skills:
${skills}

Requirements:

1. Write in a professional corporate tone.
2. Create a concise summary between 60-100 words.
3. Optimize for Applicant Tracking Systems (ATS).
4. Naturally incorporate the provided skills and relevant industry keywords.
5. Focus on measurable value, problem-solving, technical expertise, leadership, collaboration, and business impact where applicable.
6. Avoid generic phrases such as:
   - "Hardworking individual"
   - "Team player"
   - "Looking for an opportunity"
   - "Seeking a challenging position"
7. Do not use first-person pronouns such as:
   - I
   - Me
   - My
8. Do not use bullet points.
9. Write as a single professional paragraph.
10. Tailor the summary specifically for the role of ${jobTitle}.
11. Highlight relevant technical skills, tools, and domain expertise.
12. For senior roles, emphasize leadership, mentoring, architecture, strategy, and business outcomes.
13. For entry-level roles, emphasize learning ability, projects, internships, academic achievements, and foundational skills.
14. Include strong ATS keywords related to the role whenever relevant.
15. Ensure the summary sounds natural and human-written, not AI-generated.
16. Avoid exaggeration, fake achievements, or unsupported claims.
17. Maintain proper grammar and professional formatting.
18. Return only the resume summary text with no headings, labels, explanations, markdown, or quotation marks.

Output:
A polished, ATS-optimized resume summary ready to be used directly on a professional resume.
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
