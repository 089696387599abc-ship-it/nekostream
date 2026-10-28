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
    const res = await fetchCraftvel(`/v1/anime/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    const d = res?.data || res;
    return NextResponse.json({
      items: d.items || (Array.isArray(d) ? d : []),
      page: d.page || parseInt(page, 10),
      total: d.total || (d.items ? d.items.length : 0),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Gagal melakukan pencarian anime' },
      { status: 500 }
    );
  }
}
