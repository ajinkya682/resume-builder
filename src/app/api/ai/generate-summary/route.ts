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
You are a world-class Resume Writer, ATS Optimization Specialist, Technical Recruiter, and Hiring Manager.

Your task is to create a highly professional, ATS-optimized Resume Summary that could appear on a top-tier candidate's resume.

Candidate Information:

* Job Title: ${jobTitle}
* Experience Level: ${expressionLevel}
* Skills: ${skills}

Instructions:

1. Write a compelling resume summary in a professional corporate tone.
2. Length should be between 80 and 120 words.
3. Write exactly one paragraph.
4. Optimize for modern ATS systems while remaining natural and human-written.
5. Seamlessly integrate the provided skills and role-specific keywords.
6. Highlight:

   * Technical expertise
   * Problem-solving ability
   * Business impact
   * Collaboration and communication
   * Leadership (if applicable)
   * Innovation and continuous learning
7. Tailor the summary specifically for the role of ${jobTitle}.
8. Emphasize the candidate's ability to contribute to organizational goals and deliver measurable value.
9. For entry-level candidates:

   * Focus on projects, internships, academic achievements, practical experience, and learning agility.
10. For mid-level candidates:

* Focus on ownership, execution, cross-functional collaboration, and project delivery.

11. For senior candidates:

* Focus on leadership, architecture, mentoring, strategic decision-making, scalability, and business outcomes.

12. Prioritize the most relevant and in-demand technologies related to the role.
13. Include strong ATS keywords naturally without keyword stuffing.
14. Ensure the summary sounds confident, credible, and recruiter-approved.
15. Avoid generic, overused, or weak phrases such as:

* Hardworking individual
* Team player
* Quick learner
* Dedicated professional
* Looking for an opportunity
* Seeking a challenging position

16. Do not use first-person pronouns:

* I
* Me
* My
* We

17. Do not use bullet points, headings, labels, markdown, or quotation marks.
18. Do not invent certifications, achievements, years of experience, or accomplishments that were not provided.
19. Use strong action-oriented language and industry terminology.
20. The final output should be polished enough to be used directly in a professional resume.
Additional Requirements:

21. Never use the following phrases:

* Demonstrated ability to
* Proven track record
* Results-driven
* Highly motivated
* Team player
* Hardworking
* Dedicated professional
* Fast learner
* Business value
* Engineering excellence
* Continuous learning agility

22. Write naturally as a real recruiter would describe a candidate.

23. Focus on actual technical capabilities rather than generic soft skills.

24. If experience is not provided, emphasize:

* Projects
* Technologies
* Practical development experience
* Academic work
* Open-source contributions

25. Avoid empty corporate buzzwords.

26. Start with the candidate's strongest technical identity.

27. Mention the most important technologies within the first sentence.

28. Use concise, impactful language.

29. Every sentence must communicate a skill, technology, responsibility, or achievement.

30. Prefer concrete technical terms over abstract qualities.

31. Make the summary sound like it belongs on a resume that would pass a technical recruiter's 10-second scan.

32. Return only the final summary text.


Quality Standard:

The summary should immediately communicate:

* Who the candidate is
* What expertise they possess
* What technologies they use
* What value they bring
* Why a recruiter should consider them

Return ONLY the final resume summary text.
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
