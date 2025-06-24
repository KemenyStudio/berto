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
          <div className="text-sm text-gray-400 font-mono">
            📱 Mobile View
          </div>
        </div>

        {/* Terminal Content Area */}
        <div className="flex-1 p-6 relative z-10 flex items-center justify-center">
          <div className="max-w-md w-full space-y-4">
            {/* Terminal-style welcome message */}
            <div className="font-mono text-sm leading-relaxed space-y-2">
              <div className="text-cyan-400">🤖 Hi, I'm Berto, your vibe terminal</div>
              <div className="text-white">This is a terminal for humans. There's no need to know commands, just vibes.</div>
              <div className="text-white"></div>
              <div className="text-red-400">⚠️  Mobile Experience Limited</div>
              <div className="text-white"></div>
              <div className="text-white">Berto's terminal experience is optimized for desktop and larger screens where you can fully enjoy the interactive command-line interface.</div>
              <div className="text-white"></div>
              
              {/* Mobile to Desktop visual */}
              <div className="flex items-center justify-center gap-4 py-4">
                <Smartphone className="w-6 h-6 text-red-400" />
                <div className="text-green-400 text-xl font-mono">→</div>
                <Monitor className="w-6 h-6 text-green-400" />
              </div>
              
              <div className="text-cyan-400">💡 For the best experience:</div>
              <div className="text-white ml-4">• Open this on a desktop or laptop</div>
              <div className="text-white ml-4">• Use a screen wider than 768px</div>
              <div className="text-white ml-4">• Enjoy the full terminal interface</div>
              <div className="text-white"></div>
              <div className="text-green-400">✨ Here are some examples you can try on desktop:</div>
              <div className="text-white ml-4">'show me the files in this folder'</div>
              <div className="text-white ml-4">'make a project folder and call it bananas'</div>
              <div className="text-white ml-4">'help me find all the python files'</div>
              <div className="text-white"></div>
              <div className="text-yellow-400">Thanks for understanding! 🚀</div>
            </div>

            {/* Fake terminal prompt */}
            <div className="mt-8 pt-4 border-t border-gray-800">
              <div className="flex items-center">
                <span className="text-green-400 mr-3 font-mono text-sm font-medium">user@mobile-device:~$</span>
                <span className="text-gray-500 font-mono text-sm">Please switch to desktop...</span>
                <span className="text-green-400 font-mono text-sm animate-pulse ml-1">█</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 