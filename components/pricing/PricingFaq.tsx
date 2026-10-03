"use client";

import { Fragment, useState } from "react";
import { whatsappUrl } from "@/lib/site-legal";
import type { PricingFaqGroup } from "./pricing-faqs";
import styles from "./pricing.module.css";

/**
 * The questions, in groups, closed until clicked. The answer height animates
 * with grid-template-rows 0fr to 1fr (see .a in pricing.module.css). Copy comes
 * from pricing-faqs.ts, the same source as the FAQPage JSON-LD.
 */
export default function PricingFaq({ groups }: { groups: PricingFaqGroup[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <section className={styles.faq}>
      <div className={styles.wrap}>
        <div className={styles.side}>
          <h2>Questions, answered plainly.</h2>
          <p>Something else? A person answers on WhatsApp, 24×7.</p>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
        </div>
        <div>
          {groups.map((group, g) => (
            <Fragment key={group.title}>
              <div className={styles.grp}>{group.title}</div>
              {group.items.map((item, i) => {
                const id = `faq-${g}-${i}`;
                const isOpen = Boolean(open[id]);
                return (
                  <div key={id} className={isOpen ? `${styles.q} ${styles.open}` : styles.q}>
                    <button
                      type="button"
                      id={`${id}-q`}
                      aria-expanded={isOpen}
                      aria-controls={`${id}-a`}
                      onClick={() => setOpen((o) => ({ ...o, [id]: !o[id] }))}
                    >
                      {item.q}
                      <i></i>
                    </button>
                    <div className={styles.a} id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} inert={!isOpen}>
                      <div>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
