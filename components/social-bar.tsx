"use client"

import { useState, useEffect } from "react"
import { SocialIcon } from "./social-icon"

interface SocialLink {
  id: number
  network_name: string
  url: string
  icon: string
  is_active: boolean
  order_index: number
}

const FALLBACK_LINKS: SocialLink[] = [
  { id: 1, network_name: "Facebook", url: "https://www.facebook.com", icon: "facebook", is_active: true, order_index: 1 },
  { id: 2, network_name: "TikTok", url: "https://www.tiktok.com", icon: "tiktok", is_active: true, order_index: 2 },
  { id: 3, network_name: "Instagram", url: "https://www.instagram.com", icon: "instagram", is_active: true, order_index: 3 },
]

export function SocialBar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [links, setLinks] = useState<SocialLink[]>(FALLBACK_LINKS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/content/social")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLinks(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div 
        className="fixed left-0 top-1/2 z-50 hidden -translate-y-1/2 items-center transition-transform duration-500 ease-in-out md:flex"
        style={{ transform: `translateY(-50%) ${isExpanded ? 'translateX(0)' : 'translateX(calc(-100% + 40px))'}` }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex flex-col gap-3 rounded-r-2xl border-y border-r border-white/20 bg-white/10 px-3 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-md">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
            ))
          ) : (
            links.map((link, i) => (
              <div key={link.id}>
                {i > 0 && <div className="mx-auto mb-3 h-px w-6 bg-white/20" />}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all duration-300 hover:scale-110 hover:bg-white/20"
                  aria-label={link.network_name}
                >
                  <SocialIcon icon={link.icon} />
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {link.network_name}
                  </span>
                </a>
              </div>
            ))
          )}
        </div>

        <div className="flex h-14 w-6 cursor-pointer items-center justify-center rounded-r-xl bg-[#c8a882] transition-all duration-500">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="h-3.5 w-3.5 text-white transition-transform duration-500"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center gap-8 bg-[#1a1a1a]/90 py-4 backdrop-blur-md md:hidden">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-6 w-6 animate-pulse rounded-full bg-white/10" />
          ))
        ) : (
          links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-white"
              aria-label={link.network_name}
            >
              <SocialIcon icon={link.icon} className="h-6 w-6" />
            </a>
          ))
        )}
      </div>
    </>
  )
}
