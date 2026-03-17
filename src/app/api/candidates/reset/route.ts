import { NextResponse } from 'next/server'
import { resetStore } from '@/infrastructure/persistence/storage'

export async function POST() {
  if (process.env.NODE_ENV === 'production' && !process.env.CI) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  await resetStore()
  return NextResponse.json({ ok: true })
}
