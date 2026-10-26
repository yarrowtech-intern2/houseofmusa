import Link from "@/components/transitions/TransitionLink";
import { RevealText } from "@/components/motion/RevealText";

export interface StorySectionData {
  eyebrow: string;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
}

export function StorySection({ eyebrow, title, body, href, linkLabel }: StorySectionData) {
  return (
    <section className="relative flex min-h-[85vh] items-center px-6 py-24 sm:px-12 lg:px-24">
      {/* Scrim (not a card) so oversized text stays readable over whatever
          part of the scene is behind it — cheaper than backdrop-blur too. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.2)_30%,transparent_52%)]" />
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</span>
        <RevealText
          as="h2"
          text={title}
          mode="word"
          trigger="scroll"
          className="mt-4 font-display text-display-lg font-medium leading-[0.94] tracking-tight text-white"
        />
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">{body}</p>
        {href && linkLabel && (
          <Link
            href={href}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-primary"
          >
            {linkLabel}
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </section>
  );
}
