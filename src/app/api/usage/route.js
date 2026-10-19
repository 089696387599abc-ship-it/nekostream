import { fetchCraftvel } from '@/lib/craftvel';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await fetchCraftvel('/services/usage');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Gagal memuat status kuota' },
      { status: 500 }
    );
  }
}
