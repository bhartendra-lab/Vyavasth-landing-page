"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = ComponentProps<typeof Link> & {
  event: string;
  eventParams?: Record<string, string | number | boolean>;
};

/** next/link that pushes a dataLayer event on click. For server components. */
export default function TrackedLink({ event, eventParams, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        trackEvent(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}
