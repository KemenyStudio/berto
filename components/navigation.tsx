"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Download, Monitor, Smartphone } from "lucide-react"

interface OSInfo {
  name: string
  downloadUrl: string
  icon: React.ReactNode
}

const getOSInfo = (): OSInfo => {
  if (typeof window === 'undefined') {
    return { name: 'Download', downloadUrl: '#', icon: <Download className="w-4 h-4" /> }
  }

  const userAgent = window.navigator.userAgent.toLowerCase()
  const platform = window.navigator.platform.toLowerCase()

  if (userAgent.includes('mac') || platform.includes('mac')) {
    return {
      name: 'Download for Mac',
      downloadUrl: '/downloads/berto-mac.dmg',
      icon: <Monitor className="w-4 h-4" />
    }
  } else if (userAgent.includes('win') || platform.includes('win')) {
    return {
      name: 'Download for Windows',
      downloadUrl: '/downloads/berto-windows.exe',
      icon: <Monitor className="w-4 h-4" />
    }
  } else if (userAgent.includes('linux') || platform.includes('linux')) {
    return {
      name: 'Download for Linux',
      downloadUrl: '/downloads/berto-linux.AppImage',
      icon: <Monitor className="w-4 h-4" />
    }
  }

  return { name: 'Download', downloadUrl: '#', icon: <Download className="w-4 h-4" /> }
}

export default function Navigation() {
  const [osInfo, setOSInfo] = useState<OSInfo>({ 
    name: 'Download', 
    downloadUrl: '#', 
    icon: <Download className="w-4 h-4" /> 
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setOSInfo(getOSInfo())
  }, [])

  if (!isClient) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">Berto AI Terminal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" disabled>
              <Download className="w-4 h-4 mr-2" />
              Loading...
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-gray-900">Berto AI Terminal</h1>
          <span className="text-sm text-gray-500">Terminal for humans. No commands, just vibes.</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://github.com/KemenyStudio/vibeterminal', '_blank')}
          >
            GitHub
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={async () => {
              // Check if running in Electron
              if (window.navigator.userAgent.includes('Electron')) {
                alert('You\'re already using the desktop app!')
                return
              }
              
              // Track download analytics
              const platform = osInfo.downloadUrl.includes('mac') ? 'mac' : 
                              osInfo.downloadUrl.includes('windows') ? 'windows' : 'linux'
              
              try {
                await fetch('/api/download', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    platform, 
                    userAgent: window.navigator.userAgent 
                  })
                })
              } catch (error) {
                console.error('Failed to track download:', error)
              }
              
              window.open(osInfo.downloadUrl, '_blank')
            }}
          >
            {osInfo.icon}
            <span className="ml-2">{osInfo.name}</span>
          </Button>
        </div>
      </div>
    </nav>
  )
} 