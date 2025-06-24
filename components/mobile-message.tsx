"use client"

import { Monitor, Smartphone, Sparkles } from "lucide-react"

export default function MobileMessage() {
  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Grid Background - same as terminal */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative h-full flex flex-col">
        {/* Terminal Header - matching the real terminal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="text-xl font-mono font-bold text-white tracking-wider">BERTO VIBE TERMINAL</span>
          </div>
        </div>

        {/* Terminal Content Area */}
        <div className="flex-1 p-6 relative z-10 flex items-center justify-center">
          <div className="max-w-md w-full space-y-4">
            {/* Terminal-style welcome message */}
            <div className="font-mono text-sm leading-relaxed space-y-2">
              <div className="text-white">🤖 Berto's terminal experience is optimized for desktop and larger screens where you can fully enjoy the interactive command-line interface.</div>
              <div className="text-white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 