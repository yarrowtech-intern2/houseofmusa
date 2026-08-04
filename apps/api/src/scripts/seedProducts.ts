import mongoose from "mongoose";
import { connectDatabase } from "../config/db";
import { Product } from "../models/Product";

/**
 * Placeholder catalog — one product per category so Products/Gallery have
 * something real to render against. Clearly generic copy, meant to be
 * replaced via the admin Products CRUD once real content exists (see
 * docs/ROADMAP.md phase 2).
 */
const PRODUCTS = [
  {
    slug: "atlas-erp",
    name: "Atlas ERP",
    tagline: "Enterprise resource planning built for scale.",
    description:
      "Atlas unifies inventory, finance, HR, and procurement into a single system of record, built for organizations that have outgrown spreadsheets and disconnected tools. Modular by design, so teams adopt what they need without a disruptive all-at-once rollout.",
    category: "erp",
    techStack: ["Node.js", "PostgreSQL", "React", "Kubernetes"],
    featured: true,
    order: 0,
  },
  {
    slug: "orbit-saas",
    name: "Orbit",
    tagline: "Multi-tenant SaaS platform for subscription businesses.",
    description:
      "Orbit handles the parts of running a SaaS business that aren't the product itself — billing, plan management, usage metering, and tenant isolation — so teams can focus on what makes their product different.",
    category: "saas",
    techStack: ["Next.js", "Stripe", "PostgreSQL", "Redis"],
    featured: true,
    order: 1,
  },
  {
    slug: "ledger-enterprise",
    name: "Ledger Enterprise",
    tagline: "Financial operations software for regulated industries.",
    description:
      "Ledger brings audit trails, approval workflows, and compliance reporting to financial operations teams working under regulatory scrutiny, without forcing a switch away from existing accounting systems.",
    category: "enterprise-software",
    techStack: [".NET", "SQL Server", "Azure", "React"],
    featured: false,
    order: 2,
  },
  {
    slug: "forge-custom",
    name: "Forge",
    tagline: "Bespoke software engineered around your workflow.",
    description:
      "Forge is our custom software practice's flagship engagement model: purpose-built internal tools designed around how a team actually works, rather than adapting the team's process to fit off-the-shelf software.",
    category: "custom-software",
    techStack: ["TypeScript", "GraphQL", "MongoDB", "AWS"],
    featured: false,
    order: 3,
  },
  {
    slug: "cortex-ai",
    name: "Cortex",
    tagline: "AI-ready infrastructure for production ML workloads.",
    description:
      "Cortex provides the infrastructure layer between a trained model and a production application — serving, versioning, monitoring, and scaling inference workloads without a dedicated ML platform team.",
    category: "ai-infrastructure",
    techStack: ["Python", "PyTorch", "Kubernetes", "Vector DB"],
    featured: true,
    order: 4,
  },
  {
    slug: "shift-transformation",
    name: "Shift",
    tagline: "A framework for modernizing legacy systems without downtime.",
    description:
      "Shift is our digital transformation methodology for organizations running critical operations on aging systems — incremental migration paths that keep the business running while the foundation underneath it changes.",
    category: "digital-transformation",
    techStack: ["Node.js", "Kafka", "Docker", "Terraform"],
    featured: false,
    order: 5,
  },
  {
    slug: "nimbus-cloud",
    name: "Nimbus",
    tagline: "Cloud infrastructure and DevOps automation platform.",
    description:
      "Nimbus codifies infrastructure provisioning, CI/CD, and observability into a single reviewable configuration, so environments stay reproducible instead of drifting apart over time.",
    category: "cloud-solutions",
    techStack: ["AWS", "Terraform", "Kubernetes", "Go"],
    featured: false,
    order: 6,
  },
  {
    slug: "pulse-app",
    name: "Pulse",
    tagline: "Cross-platform web and mobile app framework.",
    description:
      "Pulse is our shared foundation for client-facing web and mobile apps — one codebase, consistent design system, and native performance on iOS, Android, and the web.",
    category: "web-mobile",
    techStack: ["React Native", "Next.js", "GraphQL", "Expo"],
    featured: false,
    order: 7,
  },
] as const;

async function main() {
  await connectDatabase();

  for (const product of PRODUCTS) {
    await Product.findOneAndUpdate(
      { slug: product.slug },
      { ...product, published: true },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  console.log(`[seed] ${PRODUCTS.length} products ready`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
