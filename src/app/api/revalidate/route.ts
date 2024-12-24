import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { CacheTag } from '@/utils/cache';

export async function POST(request: NextRequest) {
  try {
    const { tag } = await request.json();
    
    if (!tag || typeof tag !== 'string') {
      return NextResponse.json(
        { error: 'Invalid tag parameter' },
        { status: 400 }
      );
    }

    // Revalidate the cache for the specified tag
    revalidateTag(tag);

    return NextResponse.json(
      { message: `Cache invalidated for tag: ${tag}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    );
  }
} 