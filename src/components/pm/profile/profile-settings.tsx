"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSettings({
  userAccessData,
}: {
  userAccessData: { username: string; secret: string };
}) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const copyAccessKey = async () => {
    try {
      await navigator.clipboard.writeText(userAccessData.secret);
      setIsCopied(true);
      toast({
        title: "Access key copied",
        description: "Your access key has been copied to the clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy access key: ", err);
      toast({
        title: "Failed to copy",
        description:
          "There was an error copying your access key. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
        <CardDescription>
          View and manage your account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={userAccessData.username} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accessKey">Access Key</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="accessKey"
              type="password"
              value={userAccessData.secret}
              readOnly
              className="flex-grow"
            />
            <Button
              onClick={copyAccessKey}
              className="flex items-center space-x-2"
              aria-label={isCopied ? "Access key copied" : "Copy access key"}
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Your access key is a sensitive piece of information. Do not share it
          with others.
        </p>
      </CardFooter>
    </Card>
  );
}
