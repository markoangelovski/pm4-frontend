"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserQuery } from "@/hooks/use-auth";

export default function Profile() {
  const userData = JSON.parse(sessionStorage.getItem("access") || "{}");

  const { data: usersData } = useUserQuery();

  return (
    <Table>
      <TableCaption>A list of available users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>ID</TableHead>
          <TableHead className="">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usersData?.results.map((result) => (
          <TableRow key={result.id}>
            <TableCell className="font-medium">
              {result.username}{" "}
              {result.username === userData.username && (
                <span className="text-red-500">&#60;-current user</span>
              )}
            </TableCell>
            <TableCell>{result.email}</TableCell>
            <TableCell>{result.id}</TableCell>
            <TableCell className="" title={result.createdAt}>
              {format(result.createdAt, "yyyy-MM-dd")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
