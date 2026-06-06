import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import resumeModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();

    const resumes = await resumeModel
      .find({ user_id: userId })
      .select("_id title personalInfo createdAt updatedAt")
      .sort({ updatedAt: -1 });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resumes fetched successfully",
        data: { resumes },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error fetching resumes",
      },
      { status: 500 },
    );
  }
}
