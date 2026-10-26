import type { Contact } from "@hausofmusa/types";

export const CONTACT_STATUS_LABELS: Record<Contact["status"], string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};

export const CONTACT_BUDGET_LABELS: Record<Contact["budget"], string> = {
  "under-10k": "Under $10k",
  "10k-50k": "$10k-$50k",
  "50k-150k": "$50k-$150k",
  "150k-plus": "$150k+",
  "not-sure": "Not sure",
};

export const CONTACT_PROJECT_TYPE_LABELS: Record<Contact["projectType"], string> = {
  erp: "ERP",
  saas: "SaaS",
  "enterprise-software": "Enterprise software",
  "custom-software": "Custom software",
  "ai-infrastructure": "AI infrastructure",
  "digital-transformation": "Digital transformation",
  "cloud-solutions": "Cloud solutions",
  "web-mobile": "Web/mobile",
  other: "Other",
};
