import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { tag } = await request.json();
    revalidateTag(tag);
    return Response.json({ revalidated: true, now: Date.now() });
  } catch {
    return Response.json({ revalidated: false });
  }
} 