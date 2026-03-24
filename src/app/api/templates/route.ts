import { NextResponse } from 'next/server'
import { templateConfigs } from '@/lib/templates/templateConfigs'

export async function GET() {
  return NextResponse.json(templateConfigs)
}
