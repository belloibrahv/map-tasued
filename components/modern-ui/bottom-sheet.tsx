"use client"

import { ReactNode, useEffect, useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  snapPoints?: number[] // Percentages of screen height
  defaultSnap?: number
  className?: string
  showHandle?: boolean
}

export default function BottomSheet({
  children,
  isOpen,
  onClose,
  title,
  snapPoints = [25, 50, 90],
  defaultSnap = 0,
  className = '',
  showHandle = true
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(defaultSnap)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(defaultSnap)
    }
  }, [isOpen, defaultSnap])

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const deltaY = currentY - startY
    const threshold = 50

    if (deltaY > threshold && currentSnap > 0) {
      // Swipe down - go to lower snap point
      setCurrentSnap(currentSnap - 1)
    } else if (deltaY < -threshold && currentSnap < snapPoints.length - 1) {
      // Swipe up - go to higher snap point
      setCurrentSnap(currentSnap + 1)
    } else if (deltaY > threshold && currentSnap === 0) {
      // Swipe down from lowest point - close
      onClose()
    }
  }

  const handleSnapPointClick = (index: number) => {
    setCurrentSnap(index)
  }

  if (!isOpen) return null

  const currentHeight = snapPoints[currentSnap]
  const translateY = isDragging ? Math.max(0, currentY - startY) : 0

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0 }}
      />
      
      {/* Bottom Sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl',
          'rounded-t-3xl shadow-2xl border-t border-white/20',
          'transition-all duration-300 ease-out',
          className
        )}
        style={{
          height: `${currentHeight}vh`,
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'all 0.3s ease-out'
        }}
      >
        {/* Handle */}
        {showHandle && (
          <div
            className="flex flex-col items-center pt-2 sm:pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-10 sm:w-12 h-1 sm:h-1.5 bg-gray-300 rounded-full mb-2" />
            
            {/* Snap Point Indicators */}
            <div className="flex gap-1">
              {snapPoints.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSnapPointClick(index)}
                  className={cn(
                    'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200',
                    currentSnap === index ? 'bg-blue-600' : 'bg-gray-300'
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
            <div className="flex gap-1 sm:gap-2">
              {currentSnap < snapPoints.length - 1 && (
                <button
                  onClick={() => setCurrentSnap(currentSnap + 1)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
                </button>
              )}
              {currentSnap > 0 && (
                <button
                  onClick={() => setCurrentSnap(currentSnap - 1)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
          {children}
        </div>
      </div>
    </>
  )
}