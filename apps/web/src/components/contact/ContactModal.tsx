"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription, Button } from "@houseofmusa/ui";

/**
 * UI shell only for this phase — glassmorphism dialog + field layout are in
 * place, but submission isn't wired to POST /api/contacts yet (see
 * docs/ROADMAP.md, phase 5). Keeps the "Book Consultation" CTA functional
 * today without half-finishing the real booking flow.
 */
export function ContactModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Book a Consultation</DialogTitle>
        <DialogDescription>
          Tell us about your project. This form is a preview — full booking submission ships in the next phase.
        </DialogDescription>
        <div className="mt-6 flex flex-col gap-3 text-sm text-foreground/60">
          <p>In the meantime, reach us directly:</p>
          <a href="mailto:hello@houseofmusa.com" className="font-medium text-secondary hover:text-primary">
            hello@houseofmusa.com
          </a>
        </div>
        <Button className="mt-8 w-full" variant="primary" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
