import { NextResponse } from "next/server";

import { projects } from "@/mocks/index";

export const dynamic = "force-static";

export async function GET(req: Request) {
  return NextResponse.json({
    hasErrors: false,
    statusCode: 200,
    message: "Projects retrieved successfully",
    data: projects
  });
}
