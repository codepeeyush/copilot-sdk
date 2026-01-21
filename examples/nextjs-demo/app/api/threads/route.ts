/**
 * Thread API Routes
 *
 * Simple in-memory implementation for demo purposes.
 * For production, replace with your database (Prisma, Drizzle, MongoDB, etc.)
 *
 * API Contract:
 * - GET    /api/threads      - List all threads (metadata only)
 * - POST   /api/threads      - Create new thread
 * - PUT    /api/threads      - Batch update all threads
 * - DELETE /api/threads      - Clear all threads
 */

import {
  threads,
  generateThreadId,
  generateTitle,
  generatePreview,
  type StoredThread,
} from "./_store";

// ============================================
// GET /api/threads - List all threads
// ============================================
export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const orderBy = url.searchParams.get("orderBy") || "updatedAt";
  const orderDir = url.searchParams.get("orderDir") || "desc";

  // Get all threads and sort
  let threadList = Array.from(threads.values());

  // Sort
  threadList.sort((a, b) => {
    const aVal =
      orderBy === "createdAt"
        ? new Date(a.createdAt).getTime()
        : new Date(a.updatedAt).getTime();
    const bVal =
      orderBy === "createdAt"
        ? new Date(b.createdAt).getTime()
        : new Date(b.updatedAt).getTime();
    return orderDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  // Paginate
  const total = threadList.length;
  const paginatedThreads = threadList.slice(offset, offset + limit);

  // Return metadata only (no messages)
  const response = {
    threads: paginatedThreads.map((t) => ({
      id: t.id,
      title: t.title,
      preview: t.preview,
      messageCount: t.messageCount,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    })),
    total,
    hasMore: offset + limit < total,
  };

  return Response.json(response);
}

// ============================================
// POST /api/threads - Create new thread
// ============================================
export async function POST(request: Request) {
  const body = await request.json();

  const now = new Date().toISOString();
  const messages = body.messages || [];

  const thread: StoredThread = {
    id: body.id || generateThreadId(),
    title: body.title || generateTitle(messages),
    preview: body.preview || generatePreview(messages),
    messageCount: messages.length,
    createdAt: body.createdAt || now,
    updatedAt: body.updatedAt || now,
    messages,
    sources: body.sources || [],
  };

  threads.set(thread.id, thread);

  console.log(`[Threads API] Created thread: ${thread.id}`);
  return Response.json(thread, { status: 201 });
}

// ============================================
// PUT /api/threads - Batch update (for full save)
// ============================================
export async function PUT(request: Request) {
  const body = await request.json();

  if (!body.threads || !Array.isArray(body.threads)) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Clear and replace all threads
  threads.clear();

  for (const threadData of body.threads) {
    const thread: StoredThread = {
      id: threadData.id,
      title: threadData.title,
      preview: threadData.preview,
      messageCount: threadData.messages?.length || 0,
      createdAt: threadData.createdAt,
      updatedAt: threadData.updatedAt,
      messages: threadData.messages || [],
      sources: threadData.sources || [],
    };
    threads.set(thread.id, thread);
  }

  console.log(`[Threads API] Batch updated ${body.threads.length} threads`);
  return new Response(null, { status: 204 });
}

// ============================================
// DELETE /api/threads - Clear all threads
// ============================================
export async function DELETE() {
  threads.clear();
  console.log("[Threads API] Cleared all threads");
  return new Response(null, { status: 204 });
}
