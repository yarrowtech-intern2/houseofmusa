import type { ProjectType } from "@hausofmusa/types";

export const CATEGORY_LABELS: Record<Exclude<ProjectType, never>, string> = {
  erp: "ERP",
  saas: "SaaS",
  "enterprise-software": "Enterprise Software",
  "custom-software": "Custom Software",
  "ai-infrastructure": "AI Infrastructure",
  "digital-transformation": "Digital Transformation",
  "cloud-solutions": "Cloud Solutions",
  "web-mobile": "Web & Mobile",
};
