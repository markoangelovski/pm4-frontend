// File: components/PixelArtCircle.tsx
import { cn } from "@/lib/utils";
import React, { FC } from "react";

interface PixelArtCircleProps {
  input: string;
  className?: string;
}

const stringToColor = (string: string, index: number): string => {
  const hash =
    Array.from(string).reduce((acc, char) => acc + char.charCodeAt(0), 0) +
    index;
  const r = (hash * 137) % 255;
  const g = (hash * 251) % 255;
  const b = (hash * 193) % 255;
  return `rgb(${r}, ${g}, ${b})`;
};

const PixelArtCircle: FC<PixelArtCircleProps> = ({ input, className }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-3 grid-rows-3 w-5 h-5 rounded-full overflow-hidden mr-4",
        className
      )}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="w-full h-full"
          style={{ backgroundColor: stringToColor(input, i) }}
        ></div>
      ))}
    </div>
  );
};

export default PixelArtCircle;
