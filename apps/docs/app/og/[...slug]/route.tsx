import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.15) 0%, transparent 60%)",
        padding: "60px 80px",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
            maxWidth: "900px",
            marginBottom: 20,
          }}
        >
          {page.data.title}
        </div>
        {page.data.description && (
          <div
            style={{
              fontSize: 28,
              color: "#a1a1aa",
              lineHeight: 1.4,
              maxWidth: "800px",
            }}
          >
            {page.data.description}
          </div>
        )}
      </div>

      {/* Bottom branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.5)",
            letterSpacing: "0.05em",
          }}
        >
          Copilot SDK
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: [...page.slugs, "image.png"],
  }));
}
