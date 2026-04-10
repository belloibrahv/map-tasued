"use client"

import { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient' | 'glass'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  animation?: 'bounce' | 'pulse' | 'glow' | 'slide' | 'none'
  icon?: ReactNode
  loading?: boolean
}

export default function AnimatedButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  animation = 'bounce',
  icon,
  loading = false,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent'
      case 'gradient':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
      case 'glass':
        return 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-900 border border-white/30'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'px-2 py-1 text-xs h-6'
      case 'sm':
        return 'px-3 py-2 text-sm h-8'
      case 'lg':
        return 'px-6 py-3 text-lg h-12'
      case 'xl':
        return 'px-8 py-4 text-xl h-14'
      default:
        return 'px-4 py-2.5 text-base h-10'
    }
  }

  const getAnimationClasses = () => {
    if (disabled || loading) return ''
    
    switch (animation) {
      case 'bounce':
        return 'hover:scale-105 active:scale-95 transition-transform duration-150'
      case 'pulse':
        return 'hover:animate-pulse'
      case 'glow':
        return 'hover:shadow-2xl hover:shadow-blue-500/25 transition-shadow duration-300'
      case 'slide':
        return 'hover:translate-y-[-2px] transition-transform duration-200'
      default:
        return ''
    }
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200',
        getVariantClasses(),
        getSizeClasses(),
        getAnimationClasses(),
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}