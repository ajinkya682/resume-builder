import { getCorrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import resumeModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const userId = await getCorrentUser();

    const newResume = await resumeModel.create({
      user_id: userId,
      title: "",
      summary: "",
      personalInfo: {},
      workExperience: [],
      projects: [],
      education: [],
      skills: [],
      certification: [],
      acheivements: [],
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume created successfully",
        data: newResume,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error creating resume", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error creating resume",
      },
      { status: 500 },
    );
  }
}
