"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import EnquiryModal from "@/components/EnquiryModal";

const EnquiryContext = createContext<{ openEnquiry: () => void }>({
  openEnquiry: () => {},
});

/**
 * Provides a single "Book a demo" enquiry modal for the whole app. Any
 * component can call `useEnquiry().openEnquiry()` — the nav, hero, footer and
 * closing CTA all share this one modal instance.
 */
export default function EnquiryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openEnquiry = useCallback(() => setOpen(true), []);
  const closeEnquiry = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openEnquiry }), [openEnquiry]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryModal open={open} onClose={closeEnquiry} />
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  return useContext(EnquiryContext);
}
