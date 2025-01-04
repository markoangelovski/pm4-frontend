import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StatusSelect() {
  const [defaultValue, setDefaultValue] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const status = searchParams.get("status");
    if (status) {
      setDefaultValue(status);
    } else {
      params.set("status", "in-progress");
      router.push(`?${params.toString()}`);
    }
  }, [searchParams, router]);

  return (
    <RadioGroup
      defaultValue="in-progress"
      value={defaultValue}
      className="flex mb-6 text-gray-500 space-x-2 "
      onValueChange={handleChange}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="upcoming" id="upcoming" />
        <Label htmlFor="upcoming" className="cursor-pointer">
          Upcoming
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="in-progress" id="in-progress" />
        <Label htmlFor="in-progress" className="cursor-pointer">
          In Progress
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="completed" id="completed" />
        <Label htmlFor="completed" className="cursor-pointer">
          Completed
        </Label>
      </div>
    </RadioGroup>
  );
}
