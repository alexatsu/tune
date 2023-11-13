import { db } from "@/shared/services";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = body;
    
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return Response.json(
        {
          user: null,
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    });

    if (existingUserByUsername) {
      return Response.json(
        {
          user: null,
          message: "User with that username already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: { username, email, password: hashedPassword },
    });

    const { password: newUserPassword, ...user } = newUser;

    return Response.json({ user, message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        user: null,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
