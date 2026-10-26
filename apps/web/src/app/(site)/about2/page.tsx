import type { Metadata } from "next";
import { About2Experience } from "@/components/about/About2Experience";

export const metadata: Metadata = {
  title: "About 2",
  description: "A cinematic Haus of Musa about page focused on systems, products, and digital legacies.",
};

export default function About2Page() {
  return <About2Experience />;
}
