"use client"

import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FloatingPanelProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  position?: 'left' | 'right' | 'bottom' | 'center'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function FloatingPanel({
  children,
  isOpen,
  onClose,
  title,
  position = 'left',
  size = 'md',
  className = ''
}: FloatingPanelProps) {
  if (!isOpen) return null

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-2 sm:left-4 top-4 bottom-4'
      case 'right':
        return 'right-2 sm:right-4 top-4 bottom-4'
      case 'bottom':
        return 'bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4'
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      default:
        return 'left-2 sm:left-4 top-4 bottom-4'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-72 sm:w-80 max-w-sm'
      case 'md':
        return 'w-80 sm:w-96 max-w-md'
      case 'lg':
        return 'w-96 sm:w-[28rem] max-w-lg'
      case 'xl':
        return 'w-[28rem] sm:w-[32rem] max-w-xl'
      default:
        return 'w-80 sm:w-96 max-w-md'
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`
        fixed z-50 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-white/20
        ${getPositionClasses()}
        ${getSizeClasses()}
        ${className}
        animate-in slide-in-from-left-5 duration-300
        max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)]
      `}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-gray-100"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}