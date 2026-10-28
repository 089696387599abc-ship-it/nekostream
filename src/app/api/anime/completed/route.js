import { fetchCraftvel } from '@/lib/craftvel';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '20';

  try {
    const res = await fetchCraftvel(`/v1/anime/completed?page=${page}&limit=${limit}`);
    const d = res?.data || res;
    return NextResponse.json({
      items: d.items || (Array.isArray(d) ? d : []),
      page: d.page || parseInt(page, 10),
      total: d.total || (d.items ? d.items.length : 0),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Gagal memuat anime tamat' },
      { status: 500 }
    );
  }
}
