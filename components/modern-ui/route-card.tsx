"use client"

import { ReactNode } from 'react'
import { Navigation, Clock, MapPin, Zap, Accessibility, Building, Share, Bookmark } from 'lucide-react'
import GlassCard from './glass-card'
import AnimatedButton from './animated-button'
import ProgressRing from './progress-ring'
import { cn } from '@/lib/utils'

interface RouteCardProps {
  route: {
    id: string
    name: string
    description: string
    distance: number
    time: number
    difficulty: 'easy' | 'moderate' | 'hard'
    accessibility: boolean
    type: 'shortest' | 'fastest' | 'accessible' | 'scenic'
  }
  isSelected?: boolean
  onSelect: () => void
  onShare?: () => void
  onBookmark?: () => void
  className?: string
}

export default function RouteCard({
  route,
  isSelected = false,
  onSelect,
  onShare,
  onBookmark,
  className = ''
}: RouteCardProps) {
  const getRouteIcon = () => {
    switch (route.type) {
      case 'fastest':
        return <Zap className="h-5 w-5" />
      case 'accessible':
        return <Accessibility className="h-5 w-5" />
      case 'scenic':
        return <Building className="h-5 w-5" />
      default:
        return <Navigation className="h-5 w-5" />
    }
  }

  const getRouteColor = () => {
    switch (route.type) {
      case 'fastest':
        return 'from-yellow-500 to-orange-500'
      case 'accessible':
        return 'from-blue-500 to-indigo-500'
      case 'scenic':
        return 'from-purple-500 to-pink-500'
      default:
        return 'from-green-500 to-emerald-500'
    }
  }

  const getDifficultyColor = () => {
    switch (route.difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`
    }
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    }
    return `${(meters / 1000).toFixed(1)}km`
  }

  return (
    <GlassCard
      variant={isSelected ? 'elevated' : 'default'}
      className={cn(
        'cursor-pointer transition-all duration-300 hover:scale-[1.02]',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        className
      )}
      onClick={onSelect}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg',
              getRouteColor()
            )}>
              {getRouteIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{route.name}</h3>
              <p className="text-sm text-gray-600">{route.description}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-1">
            {onBookmark && (
              <AnimatedButton
                variant="ghost"
                size="sm"
                animation="bounce"
                onClick={(e) => {
                  e.stopPropagation()
                  onBookmark()
                }}
                icon={<Bookmark className="h-4 w-4" />}
              />
            )}
            {onShare && (
              <AnimatedButton
                variant="ghost"
                size="sm"
                animation="bounce"
                onClick={(e) => {
                  e.stopPropagation()
                  onShare()
                }}
                icon={<Share className="h-4 w-4" />}
              />
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <ProgressRing
              progress={(route.distance / 1000) * 10} // Normalize for display
              size={50}
              color="#3b82f6"
              className="mx-auto mb-2"
            >
              <MapPin className="h-4 w-4 text-blue-600" />
            </ProgressRing>
            <div className="text-sm font-medium text-gray-900">{formatDistance(route.distance)}</div>
            <div className="text-xs text-gray-600">Distance</div>
          </div>
          
          <div className="text-center">
            <ProgressRing
              progress={(route.time / 60) * 100} // Normalize for display
              size={50}
              color="#10b981"
              className="mx-auto mb-2"
            >
              <Clock className="h-4 w-4 text-emerald-600" />
            </ProgressRing>
            <div className="text-sm font-medium text-gray-900">{formatTime(route.time)}</div>
            <div className="text-xs text-gray-600">Time</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-700">
                {route.difficulty === 'easy' ? '😊' : route.difficulty === 'moderate' ? '😐' : '😰'}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-900 capitalize">{route.difficulty}</div>
            <div className="text-xs text-gray-600">Difficulty</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium border',
            getDifficultyColor()
          )}>
            {route.difficulty}
          </span>
          
          {route.accessibility && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
              <Accessibility className="h-3 w-3" />
              Accessible
            </span>
          )}
          
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 capitalize">
            {route.type}
          </span>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="flex items-center justify-center py-2 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Selected Route</span>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}