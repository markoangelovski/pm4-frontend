import FilterSort from "@/components/pm/common/filter-sort";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "/tasks",
  description: "The most awesome project manager ever",
};

export default function Tasks() {
  return (
    <>
      <FilterSort />
    </>
  );
}
