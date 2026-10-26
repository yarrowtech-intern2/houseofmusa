"use client";

import { useContext, type ComponentProps, type MouseEvent } from "react";
import NextLink from "next/link";
import { RouteTransitionContext } from "./RouteTransitionProvider";

type NextLinkProps = ComponentProps<typeof NextLink>;

/**
 * Drop-in replacement for next/link's default export. Internal navigations
 * route through the shared curtain transition instead of Next's instant
 * swap; external hrefs, new tabs, modifier-clicks, and callers that already
 * called preventDefault themselves (e.g. SiteNav's logo tap-counter) fall
 * through to ordinary Link/browser behavior untouched.
 */
export default function TransitionLink({ href, onClick, target, ...rest }: NextLinkProps) {
  const requestTransition = useContext(RouteTransitionContext);

  return (
    <NextLink
      href={href}
      target={target}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (target && target !== "_self") return;
        if (typeof href !== "string" || !href.startsWith("/")) return;

        event.preventDefault();
        requestTransition(href);
      }}
      {...rest}
    />
  );
}
