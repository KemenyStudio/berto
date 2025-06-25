"use client"

import { Button } from "@/components/ui/button"

export default function Navigation() {
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
        </div>
      </div>
    </nav>
  )
}
