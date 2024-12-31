"use client";

import { useProfileQuery } from "@/hooks/use-auth";

export default function Profile() {
  const {
    data: { results },
  } = useProfileQuery();

  return (
    <div>
      <div>{results[0].username}</div>
      <div>{results[0].userId}</div>
    </div>
  );
}
