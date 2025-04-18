"use client"

import { Star } from "lucide-react"
import { useEffect, useRef } from "react"

interface StarRatingProps {
  rating: number
  maxStars?: number
}

export function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const stars = container.querySelectorAll(".star")

    stars.forEach((star, index) => {
      if (index < rating) {
        // Add animation to active stars
        star.classList.add("animate-pulse-slow")
      }
    })
  }, [rating])

  return (
    <div ref={containerRef} className="flex">
      {[...Array(maxStars)].map((_, index) => (
        <div key={index} className="relative star">
          <Star
            className={`h-6 w-6 ${
              index < rating
                ? "fill-yellow-300 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.7)]"
                : "fill-gray-700 text-gray-700"
            } transition-all duration-300`}
          />
        </div>
      ))}
    </div>
  )
}
