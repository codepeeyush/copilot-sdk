/**
 * Individual Thread API Routes
 *
 * - GET    /api/threads/:id  - Get thread with messages
 * - PATCH  /api/threads/:id  - Update thread
 * - DELETE /api/threads/:id  - Delete thread
 */

import { NextRequest } from "next/server";
import {
  threads,
  generateTitle,
  generatePreview,
  type StoredThread,
} from "../_store";

// ============================================
// GET /api/threads/:id - Get thread with messages
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const thread = threads.get(id);

  if (!thread) {
    return Response.json({ error: "Thread not found" }, { status: 404 });
  }

  console.log(`[Threads API] Retrieved thread: ${id}`);
  return Response.json(thread);
}

// ============================================
// PATCH /api/threads/:id - Update thread
// ============================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const thread = threads.get(id);

  if (!thread) {
    return Response.json({ error: "Thread not found" }, { status: 404 });
  }

  const updates = await request.json();
  const now = new Date().toISOString();

  // Get updated messages
  const messages = updates.messages ?? thread.messages;

  // Apply updates
  const updatedThread: StoredThread = {
    ...thread,
    title: updates.title ?? generateTitle(messages) ?? thread.title,
    preview: updates.preview ?? generatePreview(messages) ?? thread.preview,
    messages,
    messageCount: messages.length,
    updatedAt: now,
    sources: updates.sources ?? thread.sources,
  };

  threads.set(id, updatedThread);

  console.log(
    `[Threads API] Updated thread: ${id} (${messages.length} messages)`,
  );
  return Response.json(updatedThread);
}

// ============================================
// DELETE /api/threads/:id - Delete thread
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!threads.has(id)) {
    return Response.json({ error: "Thread not found" }, { status: 404 });
  }

  threads.delete(id);

  console.log(`[Threads API] Deleted thread: ${id}`);
  return new Response(null, { status: 204 });
}
