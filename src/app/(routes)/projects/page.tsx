import FilterSort from "@/components/pm/common/filter-sort";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "/projects",
  description: "The most awesome project manager ever",
};

export default function Projects() {
  return (
    <>
      <FilterSort />
    </>
  );
}
