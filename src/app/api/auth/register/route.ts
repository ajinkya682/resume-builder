import { connectToDB } from "@/lib/mongodb";
import { RegisterBody } from "@/types/user.types";
import { NextRequest } from "next/server";

async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body: RegisterBody = await req.json();

    const { name, email, password, mobile } = body;

    if (!name || !email || !password) {
      return new Response("All fields are required", { status: 400 });
    }
  } catch (error) {
    console.log("Error in Register API", error);
  }
}
