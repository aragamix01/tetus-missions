"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock } from "lucide-react"

interface PinDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  correctPin: string
}

export function PinDialog({ isOpen, onClose, onSuccess, correctPin }: PinDialogProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setPin("")
      setError("")
      setShake(false)
    }
  }, [isOpen])

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4)
    setPin(value)
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (pin === correctPin) {
      onSuccess()
      onClose()
    } else {
      setError("Incorrect PIN. Please try again.")
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Lock className="h-5 w-5 text-purple-400" />
            Enter Parent PIN
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex justify-center">
              <Input
                ref={inputRef}
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={handlePinChange}
                className={`bg-gray-800 border-gray-700 text-center text-xl tracking-widest w-40 ${
                  shake ? "animate-shake" : ""
                }`}
                placeholder="• • • •"
                maxLength={4}
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </div>
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-40"
            >
              Unlock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
