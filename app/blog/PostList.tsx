import Link from "next/link";
import { CATEGORY_LABELS, formatPostDate, type BlogPost } from "@/lib/blog";

const h2 = "text-xl font-semibold mt-1 mb-2 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;

/** The list of post summaries shared by /blog and the author pages. */
export default function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      {posts.map((p) => (
        <article key={p.slug}>
          <p className="m-0 text-sm" style={{ color: "#7A6F63" }}>
            {CATEGORY_LABELS[p.category]} · {formatPostDate(p.date)} ·{" "}
            {p.readingMinutes} min read
          </p>
          <h2 className={h2} style={h2Style}>
            <Link href={`/blog/${p.slug}`} className="text-[#C25A3A] underline">
              {p.title}
            </Link>
          </h2>
          <p className="m-0">{p.description}</p>
        </article>
      ))}
    </>
  );
}
