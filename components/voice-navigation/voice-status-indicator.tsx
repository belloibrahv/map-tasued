"use client"

import { useEffect, useState } from 'react'
import { 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  AlertCircle, 
  Clock,
  Navigation,
  Mic
} from 'lucide-react'
import { VoiceNavigationState, VoiceInstruction } from '@/lib/voice/types'

interface VoiceStatusIndicatorProps {
  state: VoiceNavigationState
  className?: string
  compact?: boolean
}

export default function VoiceStatusIndicator({
  state,
  className = "",
  compact = false
}: VoiceStatusIndicatorProps) {
  const [timeToNext, setTimeToNext] = useState<number | null>(null)
  const [pulseAnimation, setPulseAnimation] = useState(false)

  // Calculate estimated time to next instruction
  useEffect(() => {
    if (state.isActive && !state.isPaused && state.currentInstruction) {
      // Estimate based on instruction length and speech rate
      const instructionLength = state.currentInstruction.text.length
      const estimatedDuration = Math.max(2, instructionLength * 0.1) // ~100ms per character, minimum 2 seconds
      setTimeToNext(estimatedDuration)
      
      const interval = setInterval(() => {
        setTimeToNext(prev => prev ? Math.max(0, prev - 1) : null)
      }, 1000)
      
      return () => clearInterval(interval)
    } else {
      setTimeToNext(null)
    }
  }, [state.currentInstruction, state.isActive, state.isPaused])

  // Pulse animation when speaking
  useEffect(() => {
    if (state.isActive && !state.isPaused) {
      setPulseAnimation(true)
      const timeout = setTimeout(() => setPulseAnimation(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [state.currentInstruction])

  const getStatusColor = () => {
    if (state.lastError) return 'text-red-600'
    if (!state.speechSynthesizerReady) return 'text-gray-400'
    if (state.isActive && !state.isPaused) return 'text-green-600'
    if (state.isActive && state.isPaused) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getStatusText = () => {
    if (state.lastError) return 'Error'
    if (!state.speechSynthesizerReady) return 'Not Ready'
    if (state.isActive && !state.isPaused) return 'Speaking'
    if (state.isActive && state.isPaused) return 'Paused'
    if (state.currentRoute) return 'Ready'
    return 'No Route'
  }

  const getStatusIcon = () => {
    if (state.lastError) return <AlertCircle className="w-4 h-4" />
    if (!state.speechSynthesizerReady) return <VolumeX className="w-4 h-4" />
    if (state.isActive && !state.isPaused) return <Volume2 className={`w-4 h-4 ${pulseAnimation ? 'animate-pulse' : ''}`} />
    if (state.isActive && state.isPaused) return <Pause className="w-4 h-4" />
    if (state.currentRoute) return <Mic className="w-4 h-4" />
    return <Navigation className="w-4 h-4" />
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`flex items-center gap-1 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-xs font-medium">{getStatusText()}</span>
        </div>
        {timeToNext !== null && timeToNext > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{Math.ceil(timeToNext)}s</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Voice Navigation</h3>
        <div className={`flex items-center gap-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
      </div>

      {/* Current Instruction */}
      {state.currentInstruction && (
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Current Instruction:</div>
          <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
            {state.currentInstruction.text}
          </div>
        </div>
      )}

      {/* Progress Information */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-gray-500">Waypoints</div>
          <div className="font-medium">
            {state.completedWaypoints.length} / {state.currentRoute?.path.length || 0}
          </div>
        </div>
        
        {timeToNext !== null && timeToNext > 0 && (
          <div>
            <div className="text-gray-500">Next in</div>
            <div className="font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.ceil(timeToNext)}s
            </div>
          </div>
        )}
        
        {state.estimatedTimeRemaining > 0 && (
          <div>
            <div className="text-gray-500">ETA</div>
            <div className="font-medium">
              {Math.ceil(state.estimatedTimeRemaining)} min
            </div>
          </div>
        )}
        
        {state.distanceToNext > 0 && (
          <div>
            <div className="text-gray-500">Distance</div>
            <div className="font-medium">
              {Math.round(state.distanceToNext)}m
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {state.lastError && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Error</span>
          </div>
          <div className="text-xs text-red-700 mt-1">
            {state.lastError.message}
          </div>
          {state.retryCount > 0 && (
            <div className="text-xs text-red-600 mt-1">
              Retry attempts: {state.retryCount}
            </div>
          )}
        </div>
      )}

      {/* System Status */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1 ${state.speechSynthesizerReady ? 'text-green-600' : 'text-red-600'}`}>
              {state.speechSynthesizerReady ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              <span>Speech</span>
            </div>
            
            <div className={`flex items-center gap-1 ${state.audioDevicesAvailable.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              <Mic className="w-3 h-3" />
              <span>Audio ({state.audioDevicesAvailable.length})</span>
            </div>
          </div>
          
          {state.backgroundOperation && (
            <div className="text-blue-600">
              <span>Background</span>
            </div>
          )}
          
          {state.fallbackMode && (
            <div className="text-yellow-600">
              <span>Fallback</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mini version for header/toolbar
export function VoiceStatusMini({
  state,
  className = ""
}: Pick<VoiceStatusIndicatorProps, 'state' | 'className'>) {
  const getStatusColor = () => {
    if (state.lastError) return 'bg-red-500'
    if (!state.speechSynthesizerReady) return 'bg-gray-400'
    if (state.isActive && !state.isPaused) return 'bg-green-500'
    if (state.isActive && state.isPaused) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const getStatusText = () => {
    if (state.lastError) return 'Voice Error'
    if (!state.speechSynthesizerReady) return 'Voice Not Ready'
    if (state.isActive && !state.isPaused) return 'Voice Active'
    if (state.isActive && state.isPaused) return 'Voice Paused'
    return 'Voice Ready'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-xs text-gray-600">{getStatusText()}</span>
    </div>
  )
}

export type { VoiceStatusIndicatorProps }