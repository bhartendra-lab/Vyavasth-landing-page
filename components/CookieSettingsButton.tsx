"use client";

import { GTM_ID, OPEN_CONSENT_EVENT } from "@/lib/analytics";

/** Footer link that reopens the consent banner so a choice can be changed. */
export default function CookieSettingsButton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!GTM_ID) return null;
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    >
      Cookie settings
    </button>
  );
}
