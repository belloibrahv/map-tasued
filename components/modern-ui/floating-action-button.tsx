"use client"

import { ReactNode, useState } from 'react'
import { Plus, Navigation, MapPin, Search, Info, Phone } from 'lucide-react'
import AnimatedButton from './animated-button'
import { cn } from '@/lib/utils'

interface FloatingAction {
  id: string
  icon: ReactNode
  label: string
  onClick: () => void
  color?: string
}

interface FloatingActionButtonProps {
  actions?: FloatingAction[]
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function FloatingActionButton({
  actions = [],
  position = 'bottom-right',
  size = 'md',
  className = ''
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const defaultActions: FloatingAction[] = [
    {
      id: 'navigate',
      icon: <Navigation className="h-4 w-4" />,
      label: 'Start Navigation',
      onClick: () => console.log('Navigate'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'location',
      icon: <MapPin className="h-4 w-4" />,
      label: 'My Location',
      onClick: () => console.log('Location'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'search',
      icon: <Search className="h-4 w-4" />,
      label: 'Search',
      onClick: () => console.log('Search'),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'info',
      icon: <Info className="h-4 w-4" />,
      label: 'Campus Info',
      onClick: () => console.log('Info'),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      id: 'emergency',
      icon: <Phone className="h-4 w-4" />,
      label: 'Emergency',
      onClick: () => console.log('Emergency'),
      color: 'bg-red-600 hover:bg-red-700'
    }
  ]

  const finalActions = actions.length > 0 ? actions : defaultActions

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 sm:bottom-6 left-4 sm:left-6'
      case 'top-right':
        return 'top-4 sm:top-6 right-4 sm:right-6'
      case 'top-left':
        return 'top-4 sm:top-6 left-4 sm:left-6'
      default:
        return 'bottom-4 sm:bottom-6 right-4 sm:right-6'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-10 h-10 sm:w-12 sm:h-12'
      case 'lg':
        return 'w-14 h-14 sm:w-16 sm:h-16'
      default:
        return 'w-12 h-12 sm:w-14 sm:h-14'
    }
  }

  const getActionPosition = (index: number) => {
    const spacing = size === 'lg' ? 60 : size === 'sm' ? 45 : 55
    const offset = (index + 1) * spacing

    switch (position) {
      case 'bottom-left':
        return { bottom: offset, left: 0 }
      case 'top-right':
        return { top: offset, right: 0 }
      case 'top-left':
        return { top: offset, left: 0 }
      default:
        return { bottom: offset, right: 0 }
    }
  }

  return (
    <div className={cn('fixed z-50', getPositionClasses(), className)}>
      {/* Action Buttons */}
      {isExpanded && finalActions.map((action, index) => (
        <div
          key={action.id}
          className="absolute transition-all duration-300 ease-out"
          style={{
            ...getActionPosition(index),
            transform: isExpanded ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)',
            opacity: isExpanded ? 1 : 0,
            transitionDelay: `${index * 75}ms`
          }}
        >
          <div className="relative group">
            {/* Enhanced Tooltip */}
            <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-elegant scale-95 group-hover:scale-100">
              {action.label}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900/95" />
            </div>
            
            {/* Enhanced Action Button */}
            <button
              onClick={() => {
                action.onClick()
                setIsExpanded(false)
              }}
              className={cn(
                'rounded-full text-white shadow-floating transition-all duration-300 backdrop-blur-sm',
                'hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30',
                'transform hover:shadow-3xl hover:-translate-y-1',
                size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-10 h-10' : 'w-12 h-12',
                action.color || 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
              )}
            >
              <div className="flex items-center justify-center">
                {action.icon}
              </div>
            </button>
          </div>
        </div>
      ))}

      {/* Enhanced Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'rounded-full text-white shadow-3xl relative overflow-hidden',
          'hover:shadow-floating hover:scale-110 active:scale-95 transition-all duration-300',
          'focus:outline-none focus:ring-4 focus:ring-white/30',
          'gradient-primary hover:from-blue-700 hover:via-purple-700 hover:to-blue-800',
          'flex items-center justify-center group',
          getSizeClasses()
        )}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {/* Icon with enhanced animation */}
        <Plus 
          className={cn(
            'transition-all duration-300 relative z-10',
            isExpanded ? 'rotate-45 scale-110' : 'rotate-0 scale-100',
            size === 'lg' ? 'h-7 w-7' : size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'
          )} 
        />
        
        {/* Pulse effect when expanded */}
        {isExpanded && (
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
        )}
      </button>

      {/* Enhanced Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  )
}