import type { Metadata } from "next";
import { PageComingSoon } from "@/components/layout/PageComingSoon";

export const metadata: Metadata = {
  title: "3D Gallery",
  description: "Walk through a first-person art gallery showcasing every House of Musa product.",
};

// The signature first-person WASD/touch gallery is docs/ROADMAP.md phase 3.
export default function GalleryPage() {
  return (
    <PageComingSoon
      eyebrow="3D Gallery"
      title="Step inside our headquarters gallery."
      description="A first-person walkthrough gallery, one frame per product — our signature experience, currently under construction."
    />
  );
}
