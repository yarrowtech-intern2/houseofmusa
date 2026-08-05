"use client";

import { useState } from "react";
import type { ContactDetails } from "@houseofmusa/types";
import { Button } from "@houseofmusa/ui";
import type { ButtonProps } from "@houseofmusa/ui";
import { ContactModal } from "@/components/contact/ContactModal";

export function BookConsultationButton({
  label = "Book Consultation",
  contactDetails,
  className,
  size = "lg",
  variant = "primary",
}: {
  label?: string;
  contactDetails?: ContactDetails;
  className?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" size={size} variant={variant} className={className} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <ContactModal open={open} onOpenChange={setOpen} contactDetails={contactDetails} />
    </>
  );
}
