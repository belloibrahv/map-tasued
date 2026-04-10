"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'loading' | 'error' | 'success' | 'warning'
  label?: string
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export default function StatusIndicator({
  status,
  label,
  icon,
  size = 'md',
  animated = true,
  className = ''
}: StatusIndicatorProps) {
  const getStatusClasses = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500 text-green-50'
      case 'offline':
        return 'bg-gray-500 text-gray-50'
      case 'loading':
        return 'bg-blue-500 text-blue-50'
      case 'error':
        return 'bg-red-500 text-red-50'
      case 'success':
        return 'bg-emerald-500 text-emerald-50'
      case 'warning':
        return 'bg-yellow-500 text-yellow-50'
      default:
        return 'bg-gray-500 text-gray-50'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2 w-2'
      case 'lg':
        return 'h-4 w-4'
      default:
        return 'h-3 w-3'
    }
  }

  const getAnimationClasses = () => {
    if (!animated) return ''
    
    switch (status) {
      case 'online':
        return 'animate-pulse'
      case 'loading':
        return 'animate-spin'
      case 'error':
        return 'animate-bounce'
      default:
        return ''
    }
  }

  if (label || icon) {
    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        <div className={cn(
          'rounded-full flex items-center justify-center',
          getStatusClasses(),
          getSizeClasses(),
          getAnimationClasses()
        )}>
          {icon && <span className="text-xs">{icon}</span>}
        </div>
        {label && (
          <span className="text-sm font-medium text-gray-700">{label}</span>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-full',
      getStatusClasses(),
      getSizeClasses(),
      getAnimationClasses(),
      className
    )} />
  )
}