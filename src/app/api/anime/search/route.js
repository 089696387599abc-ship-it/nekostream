import { fetchCraftvel } from '@/lib/craftvel';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '20';

  if (!q) {
    return NextResponse.json({ items: [], page: 1, total: 0 });
  }

  try {
    const data = await fetchCraftvel(`/services/anime/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Gagal melakukan pencarian anime' },
      { status: 500 }
    );
  }
}
