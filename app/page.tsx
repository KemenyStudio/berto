"use client"

import Terminal from "../terminal"
import MobileMessage from "../components/mobile-message"
import Navigation from "../components/navigation"
import { useIsMobile } from "../hooks/use-mobile"

export default function Page() {
  const isMobile = useIsMobile()

  // Show loading state while determining screen size
  if (isMobile === undefined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!isMobile && <Navigation />}
      <div className={!isMobile ? "pt-16" : ""}>
        {isMobile ? <MobileMessage /> : <Terminal />}
      </div>
    </div>
  )
}
