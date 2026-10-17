import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPageShell from "@/components/LegalPageShell";
import { publishedPosts, todayInIndia } from "@/lib/blog";
import { authorById } from "@/lib/blog/authors";
import PostList from "../../PostList";

// Rendered per request, like the other blog routes.
export const dynamic = "force-dynamic";

const SITE = "https://vyavasth.in";

function authorPosts(id: string) {
  return publishedPosts(todayInIndia()).filter((p) => p.author === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const author = authorById(id);
  if (!author || !author.bio || authorPosts(id).length === 0) {
    return { robots: { index: false } };
  }
  const title = `${author.name}, ${author.role} | Vyavasth Blog`;
  return {
    title,
    description: author.bio,
    alternates: { canonical: `/blog/author/${id}` },
    openGraph: {
      type: "profile",
      title,
      description: author.bio,
      url: `/blog/author/${id}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = authorById(id);
  const posts = authorPosts(id);
  if (!author || !author.bio || posts.length === 0) notFound();

  const url = `${SITE}/blog/author/${id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    worksFor: { "@id": `${SITE}/#organization` },
    url,
  };

  return (
    <LegalPageShell title={author.name}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <p className="m-0 text-sm" style={{ color: "#7A6F63" }}>
          {author.role}
        </p>
        <p className="mt-2 mb-0">{author.bio}</p>
      </div>
      <PostList posts={posts} />
    </LegalPageShell>
  );
}
