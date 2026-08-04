import type { Metadata } from "next";
import { PageComingSoon } from "@/components/layout/PageComingSoon";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at House of Musa.",
};

// Full listings + application flow build is docs/ROADMAP.md phase 4.
export default function CareersPage() {
  return (
    <PageComingSoon
      eyebrow="Careers"
      title="Open roles are being finalized."
      description="Job listings and the full application flow are arriving in the next build phase."
    />
  );
}
