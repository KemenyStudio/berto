import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform')
  
  if (!platform) {
    return NextResponse.json({ error: 'Platform not specified' }, { status: 400 })
  }

  const downloads = {
    mac: '/downloads/berto-mac.dmg',
    windows: '/downloads/berto-windows.exe',
    linux: '/downloads/berto-linux.AppImage'
  }

  const downloadPath = downloads[platform as keyof typeof downloads]
  
  if (!downloadPath) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  // Redirect to the download URL
  return NextResponse.redirect(new URL(downloadPath, request.url))
}

export async function POST(request: NextRequest) {
  // Track download analytics
  const body = await request.json()
  const { platform, userAgent } = body
  
  // Log analytics (in production, you'd save this to a database)
  console.log(`Download tracked: ${platform} from ${userAgent}`)
  
  return NextResponse.json({ success: true, message: 'Download tracked' })
} 