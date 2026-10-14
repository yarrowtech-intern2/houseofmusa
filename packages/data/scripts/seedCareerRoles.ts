import { fromCareerRoleInput } from "../src/mappers";
import { getAdminClient } from "./lib";

/**
 * Placeholder job listings — clearly generic, meant to be replaced via the
 * admin CareerRole CRUD once real openings exist (see docs/ROADMAP.md
 * phase 4). Spans the departments a company doing ERP/SaaS/cloud/AI
 * infrastructure work would realistically have.
 */
const ROLES = [
  {
    slug: "senior-fullstack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    employmentType: "full-time",
    description:
      "You'll work across our product lines — ERP, SaaS platforms, and client engagements — owning features end to end, from schema design through the UI that ships to production.",
    responsibilities: [
      "Design and build features across the stack, from API to UI",
      "Review code and mentor engineers earlier in their career",
      "Participate in architecture decisions for new product work",
    ],
    requirements: [
      "5+ years building production web applications",
      "Strong TypeScript, React/Next.js, and Node.js experience",
      "Comfortable owning a feature from design through deployment",
    ],
  },
  {
    slug: "cloud-infrastructure-engineer",
    title: "Cloud & DevOps Infrastructure Engineer",
    department: "Engineering",
    location: "Remote",
    employmentType: "full-time",
    description:
      "Own the infrastructure that keeps client deployments reliable — CI/CD, provisioning, observability — across a portfolio of enterprise systems that can't go down.",
    responsibilities: [
      "Build and maintain CI/CD pipelines and infrastructure-as-code",
      "Improve observability and incident response across client environments",
      "Partner with engineering teams on deployment architecture",
    ],
    requirements: [
      "Experience with AWS or comparable cloud providers",
      "Strong Terraform/Docker/Kubernetes background",
      "Comfortable being part of an on-call rotation",
    ],
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "Hybrid",
    employmentType: "full-time",
    description:
      "Design the interfaces for enterprise software that has to be both powerful and usable — dense data, real workflows, and a bar for craft that doesn't drop just because the user is at work.",
    responsibilities: [
      "Own design for one or more product areas from concept to shipped UI",
      "Maintain and extend our shared design system",
      "Work directly with engineers through implementation",
    ],
    requirements: [
      "A portfolio showing complex, real-world product work",
      "Comfortable with ambiguity in enterprise/B2B workflows",
      "Strong collaboration with engineering",
    ],
  },
  {
    slug: "ai-ml-engineer",
    title: "AI / ML Infrastructure Engineer",
    department: "Engineering",
    location: "Remote",
    employmentType: "full-time",
    description:
      "Help build the infrastructure layer between trained models and production applications for our AI-readiness practice — serving, versioning, and monitoring inference at client scale.",
    responsibilities: [
      "Build and operate model-serving infrastructure",
      "Work with client teams to integrate ML into existing systems",
      "Establish monitoring and evaluation practices for production models",
    ],
    requirements: [
      "Experience deploying ML models to production, not just training them",
      "Strong Python background; comfortable in a polyglot stack",
      "Interest in the infrastructure side of AI, not just modeling",
    ],
  },
  {
    slug: "enterprise-account-executive",
    title: "Enterprise Account Executive",
    department: "Sales",
    location: "Remote",
    employmentType: "full-time",
    description:
      "Own the full sales cycle for enterprise clients evaluating ERP, custom software, and digital transformation engagements — long sales cycles, technical buyers, real relationships.",
    responsibilities: [
      "Manage a pipeline of enterprise prospects from first call to close",
      "Work closely with engineering leadership on scoping technical engagements",
      "Build long-term relationships with existing clients for expansion work",
    ],
    requirements: [
      "3+ years selling technical/enterprise software or services",
      "Comfortable navigating long, multi-stakeholder sales cycles",
      "Genuine interest in understanding the technical product",
    ],
  },
  {
    slug: "technical-recruiter",
    title: "Technical Recruiter",
    department: "People",
    location: "Remote",
    employmentType: "contract",
    description:
      "Help us hire the engineers, designers, and technical staff behind our product and client work — a technical enough recruiter to have a real conversation about the roles you're filling.",
    responsibilities: [
      "Own full-cycle recruiting for engineering and design roles",
      "Partner with hiring managers to define role requirements",
      "Build and maintain a healthy, respectful candidate experience",
    ],
    requirements: [
      "Experience recruiting for technical/engineering roles",
      "Comfortable evaluating technical resumes at a basic level",
      "Strong written communication",
    ],
  },
] as const;

async function main() {
  const db = getAdminClient();

  const rows = ROLES.map((role) => ({
    ...fromCareerRoleInput({
      ...role,
      responsibilities: [...role.responsibilities],
      requirements: [...role.requirements],
    }),
    published: true,
  }));
  const { error } = await db.from("career_roles").upsert(rows, { onConflict: "slug" });
  if (error) throw error;

  console.log(`[seed] ${ROLES.length} career roles ready`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
