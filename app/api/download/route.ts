import { NextRequest, NextResponse } from 'next/server'

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

  // In a real scenario, you'd want to check if the file exists
  // For now, we'll redirect to the download URL
  return NextResponse.redirect(new URL(downloadPath, request.url))
}

export async function POST(request: NextRequest) {
  // Track download analytics
  const body = await request.json()
  const { platform, userAgent } = body
  
  // Here you could log to analytics service
  console.log('Download requested:', { platform, userAgent, timestamp: new Date().toISOString() })
  
  return NextResponse.json({ success: true })
} 