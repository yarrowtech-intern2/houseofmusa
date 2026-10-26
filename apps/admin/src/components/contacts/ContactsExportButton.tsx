"use client";

import { Download } from "lucide-react";
import type { Contact } from "@hausofmusa/types";
import { Button } from "@hausofmusa/ui";
import { CONTACT_BUDGET_LABELS, CONTACT_PROJECT_TYPE_LABELS, CONTACT_STATUS_LABELS } from "@/lib/contactLabels";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function ContactsExportButton({ contacts }: { contacts: Contact[] }) {
  const handleExport = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Budget", "Project Type", "Status", "Message", "Created"];
    const rows = contacts.map((contact) => [
      contact.name,
      contact.email,
      contact.phone,
      contact.company,
      CONTACT_BUDGET_LABELS[contact.budget],
      CONTACT_PROJECT_TYPE_LABELS[contact.projectType],
      CONTACT_STATUS_LABELS[contact.status],
      contact.message,
      new Date(contact.createdAt).toISOString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "contacts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={contacts.length === 0}>
      <Download className="h-4 w-4" />
      CSV
    </Button>
  );
}
