import {NextRequest, NextResponse} from 'next/server';
import {savePreference} from '@/app/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    await savePreference({
      user_id: body.userId,
      key: body.key,
      value: body.value,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
