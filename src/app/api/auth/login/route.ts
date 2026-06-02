import { generateToken } from "@/lib/generateToken";
import { connectToDB } from "@/lib/mongodb";
import userModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { LoginBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body: LoginBody = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: " email and password are required",
        },
        { status: 400 },
      );
    }

    const isExisted = await userModel.findOne({ email });

    if (!isExisted) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 404 },
      );
    }

    const matchPass = isExisted.comparePassword(password);

    if (!matchPass) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      );
    }

    const token = generateToken({ userId: isExisted._id.toString() });

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User Logged in successfully",
        data: {
          user: {
            _id: isExisted._id,
            name: isExisted.name,
            email: isExisted.email,
          },
        },
      },
      {
        status: 200,
      },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return response;
  } catch (error) {
    console.log("Error in Register API", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
        error: { error },
      },
      { status: 500 },
    );
  }
}
