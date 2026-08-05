import fs from "node:fs";
import path from "node:path";
import { HomeExperience } from "@/components/home/HomeExperience";

export default function HomePage() {
  const hasModel = fs.existsSync(path.join(process.cwd(), "public/models/house.glb"));
  return (
    <>
      {hasModel && <link rel="preload" href="/models/house.glb" as="fetch" crossOrigin="anonymous" />}
      <HomeExperience hasModel={hasModel} />
    </>
  );
}
