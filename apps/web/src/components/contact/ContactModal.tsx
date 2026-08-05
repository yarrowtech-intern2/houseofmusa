"use client";

import type { ContactDetails } from "@houseofmusa/types";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@houseofmusa/ui";
import { ConsultationForm } from "@/components/contact/ConsultationForm";

export function ContactModal({
  open,
  onOpenChange,
  contactDetails,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactDetails?: ContactDetails;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>Book a Consultation</DialogTitle>
        <DialogDescription>Tell us about your project - every request is reviewed personally.</DialogDescription>
        <ConsultationForm contactDetails={contactDetails} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
