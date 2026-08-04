/** Swaps via Tailwind's `dark:` variant (next-themes toggles the `dark` class on <html>). */
export function Logo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/logo-black.png" alt="House of Musa" className={`${className} block dark:hidden`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/logo-white.png" alt="House of Musa" className={`${className} hidden dark:block`} />
    </>
  );
}
