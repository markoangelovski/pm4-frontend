import { NextResponse } from "next/server";

import { tasks } from "@/mocks/index";

export const dynamic = "force-static";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;

  let status = params.get("status")?.split(",");
  const projectId = params.get("projectId");

  if (!status) status = ["in-progress"];
  const statusFilter = status.length > 0 ? status : ["in-progress"];

  const projectIdFilter = projectId ? projectId : "";

  return NextResponse.json({
    hasErrors: false,
    statusCode: 200,
    message: "Tasks retrieved successfully",
    data: tasks.filter(
      (task) =>
        statusFilter.includes(task.status) &&
        (projectIdFilter === "" || task.projectId === projectIdFilter)
    )
  });
}
