import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import resumeModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { promises } from "dns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> },
) {
  try {
    await connectToDB();

    const user = await getCurrentUser();

    const { resumeId } = await params;

    const resume = await resumeModel.findOne({
      _id: resumeId,
      user_id: user.user_id,
    });

    if (!resume) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume fetched successfully",
        data: resume,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error fetching resume",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> },
) {
  try {
    await connectToDB();

    const user = await getCurrentUser();

    const body = await req.json();

    const { resumeId } = await params;

    const updatedResume = await resumeModel.findOneAndUpdate(
      { _id: resumeId, user_id: user.user_id },
      { $set: body },
      { new: true },
    );

    if (!updatedResume) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume Updated failed",
        },
        { status: 400 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume Updated successfully",
        data: updatedResume,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error Updated resume",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> },
) {
  try {
    await connectToDB();

    const user = await getCurrentUser();

    const { resumeId } = await params;

    const deletedResume = await resumeModel.findOneAndDelete({
      _id: resumeId,
      user_id: user.user_id,
    });

    if (!deletedResume) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume deleted successfully",
        data: deletedResume,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting resume:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error deleting resume",
      },
      { status: 500 },
    );
  }
}
