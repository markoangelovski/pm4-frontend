import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter, useSearchParams } from "next/navigation";

export default function StatusSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`?${params.toString()}`);
  };

  return (
    <RadioGroup
      defaultValue="in-progress"
      className="flex mb-6 text-gray-500 space-x-2 "
      onValueChange={handleChange}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="upcoming" id="upcoming" />
        <Label htmlFor="upcoming">Upcoming</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="in-progress" id="in-progress" />
        <Label htmlFor="in-progress">In Progress</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="completed" id="completed" />
        <Label htmlFor="completed">Completed</Label>
      </div>
    </RadioGroup>
  );
}
