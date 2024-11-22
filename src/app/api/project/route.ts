import { NextResponse } from "next/server";

import { projects, tasks } from "@/mocks/index";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");

  if (id) {
    const project = projects.find((p) => p.id === id);
    if (project) {
      return NextResponse.json({
        hasErrors: false,
        statusCode: 200,
        message: "Project retrieved successfully",
        data: [
          {
            ...project,
            tasks: tasks.filter((task) => task.projectId === project.id)
          }
        ]
      });
    } else {
      return NextResponse.json({
        hasErrors: true,
        statusCode: 404,
        message: "Project not found",
        data: null
      });
    }
  } else {
    return NextResponse.json({
      hasErrors: true,
      statusCode: 420,
      message: "Project ID required.",
      data: null
    });
  }
}
