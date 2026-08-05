import { contactBudgetValues, projectTypeValues } from "@houseofmusa/schemas";

export const BUDGET_LABELS: Record<(typeof contactBudgetValues)[number], string> = {
  "under-10k": "Under $10k",
  "10k-50k": "$10k – $50k",
  "50k-150k": "$50k – $150k",
  "150k-plus": "$150k+",
  "not-sure": "Not sure yet",
};

export const CONTACT_PROJECT_TYPE_LABELS: Record<(typeof projectTypeValues)[number], string> = {
  erp: "ERP",
  saas: "SaaS",
  "enterprise-software": "Enterprise Software",
  "custom-software": "Custom Software",
  "ai-infrastructure": "AI Infrastructure",
  "digital-transformation": "Digital Transformation",
  "cloud-solutions": "Cloud Solutions",
  "web-mobile": "Web & Mobile",
  other: "Other",
};
