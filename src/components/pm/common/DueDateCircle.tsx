import { cn } from "@/lib/utils";

interface DueDateCircleProps {
  dateString: string;
  className?: string;
}

function DueDateCircle({
  dateString,
  className,
}: DueDateCircleProps): JSX.Element {
  const targetDate = new Date(dateString);
  const currentDate = new Date();

  const timeDiff = targetDate.getTime() - currentDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Normalize the intensity (closer to 255 as the absolute daysDiff increases)
  const intensity = Math.min(Math.abs(daysDiff) * 5, 255);

  let color: string;

  if (daysDiff < -1) {
    // Past dates (darker red the further in the past)
    color = `rgb(255, ${255 - intensity}, ${255 - intensity})`;
  } else if (daysDiff >= -1 && daysDiff <= 1) {
    // Near-current dates (green, with slight intensity adjustment)
    color = `rgb(${255 - Math.abs(daysDiff) * 50}, 255, ${
      255 - Math.abs(daysDiff) * 50
    })`;
  } else {
    // Future dates (darker blue the further in the future)
    color = `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
  }

  return (
    <div
      className={cn("w-5 h-5 rounded-full", className)}
      style={{ backgroundColor: color }}
    ></div>
  );
}

export default DueDateCircle;
