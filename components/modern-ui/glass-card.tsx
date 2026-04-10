"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'minimal' | 'colored'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  blur = 'md',
  padding = 'md',
  onClick
}: GlassCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white/90 shadow-2xl border border-white/30'
      case 'minimal':
        return 'bg-white/70 shadow-lg border border-white/20'
      case 'colored':
        return 'bg-gradient-to-br from-white/80 to-blue-50/80 shadow-xl border border-white/25'
      default:
        return 'bg-white/80 shadow-xl border border-white/25'
    }
  }

  const getBlurClasses = () => {
    switch (blur) {
      case 'sm':
        return 'backdrop-blur-sm'
      case 'lg':
        return 'backdrop-blur-lg'
      case 'xl':
        return 'backdrop-blur-xl'
      default:
        return 'backdrop-blur-md'
    }
  }

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return ''
      case 'xs':
        return 'p-2'
      case 'sm':
        return 'p-3'
      case 'lg':
        return 'p-6'
      default:
        return 'p-4'
    }
  }

  return (
    <div 
      className={cn(
        'rounded-2xl transition-all duration-300 hover:shadow-2xl',
        getVariantClasses(),
        getBlurClasses(),
        getPaddingClasses(),
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}