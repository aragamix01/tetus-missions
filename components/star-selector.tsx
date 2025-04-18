"use client"

import { Star } from "lucide-react"
import { useState } from "react"

interface StarSelectorProps {
  value: number
  onChange: (value: number) => void
  maxStars?: number
}

export function StarSelector({ value, onChange, maxStars = 5 }: StarSelectorProps) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex space-x-2">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1
        return (
          <button
            key={index}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(0)}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
          >
            <Star
              className={`h-8 w-8 transition-all duration-200 ${
                starValue <= (hoverValue || value)
                  ? "fill-yellow-300 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.7)]"
                  : "fill-gray-700 text-gray-700"
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
