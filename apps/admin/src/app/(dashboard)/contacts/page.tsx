import { SectionPlaceholder } from "@/components/layout/SectionPlaceholder";

// GET /api/contacts already works server-side — this page just needs a
// table/search/pagination UI wired to it (docs/ROADMAP.md phase 6).
export default function ContactsPage() {
  return (
    <SectionPlaceholder
      title="Contacts"
      description="Consultation requests submitted through the site will list here with search, filtering, and CSV export."
    />
  );
}
