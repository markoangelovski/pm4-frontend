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
import { User } from "@/types";
import { Card } from "@/components/ui/card";

export default function UsersTable({
  users,
  userAccessData,
}: {
  users: User[];
  userAccessData: { username: string };
}) {
  return (
    <Card className="w-full my-6 p-6">
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.username}{" "}
                {user.username === userAccessData.username && (
                  <span className="text-red-500">&#60;-current user</span>
                )}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.id}</TableCell>
              <TableCell className="" title={user.createdAt}>
                {format(user.createdAt, "yyyy-MM-dd")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
