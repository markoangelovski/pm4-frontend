"use client";

import { useUserQuery } from "@/hooks/use-auth";
import ProfileSettings from "@/components/pm/profile/profile-settings";
import UsersTable from "@/components/pm/profile/UsersTable";

export default function Profile() {
  const userAccessData = JSON.parse(sessionStorage.getItem("access") || "{}");

  const { data: usersData } = useUserQuery();

  return (
    <>
      <ProfileSettings userAccessData={userAccessData} />
      <UsersTable
        userAccessData={userAccessData}
        users={usersData?.results || []}
      />
    </>
  );
}
