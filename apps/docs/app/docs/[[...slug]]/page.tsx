import type { ComponentType } from "react";
import { source, getPageImage } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { TocFooter } from "@/components/toc-footer";
import { PageActions } from "@/components/page-actions";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MDX = (page.data as any).body as ComponentType<{
    components: ReturnType<typeof getMDXComponents>;
  }>;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      footer={page.data.footer === false ? { enabled: false } : undefined}
      tableOfContent={
        page.data.hideToc
          ? { enabled: false }
          : { style: "clerk", footer: <TocFooter /> }
      }
    >
      {!page.data.hideHeader && (
        <>
          <DocsTitle>{page.data.title}</DocsTitle>
          <DocsDescription>{page.data.description}</DocsDescription>
          <div className="mt-0 pb-4 border-b border-fd-border">
            <PageActions url={page.url} />
          </div>
        </>
      )}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  // Only use dynamic OG for pages with slugs, not index
  if (params.slug && params.slug.length > 0) {
    const ogImage = getPageImage(page);
    return {
      title: page.data.title,
      description: page.data.description,
      openGraph: {
        title: page.data.title,
        description: page.data.description,
        images: [ogImage.url],
      },
      twitter: {
        card: "summary_large_image",
        title: page.data.title,
        description: page.data.description,
        images: [ogImage.url],
      },
    };
  }

  // For index page, use static opengraph-image.png (inherited from layout)
  return {
    title: page.data.title,
    description: page.data.description,
  };
}
