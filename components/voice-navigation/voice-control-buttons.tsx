"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  SkipForward, 
  AlertTriangle,
  Volume2,
  VolumeX
} from 'lucide-react'
import { VoiceNavigationState } from '@/lib/voice/types'

interface VoiceControlButtonsProps {
  state: VoiceNavigationState
  onStart: () => Promise<boolean>
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onRepeat: () => void
  onSkip: () => void
  onEmergencyStop: () => void
  disabled?: boolean
  className?: string
}

export default function VoiceControlButtons({
  state,
  onStart,
  onPause,
  onResume,
  onStop,
  onRepeat,
  onSkip,
  onEmergencyStop,
  disabled = false,
  className = ""
}: VoiceControlButtonsProps) {
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = async () => {
    setIsStarting(true)
    try {
      await onStart()
    } finally {
      setIsStarting(false)
    }
  }

  const canStart = !state.isActive && state.currentRoute && state.speechSynthesizerReady && !disabled
  const canPause = state.isActive && !state.isPaused && !disabled
  const canResume = state.isActive && state.isPaused && !disabled
  const canStop = state.isActive && !disabled
  const canRepeat = state.isActive && state.currentInstruction && !disabled
  const canSkip = state.isActive && !state.isPaused && !disabled

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Primary Controls */}
      <div className="flex items-center gap-2">
        {!state.isActive ? (
          <Button
            onClick={handleStart}
            disabled={!canStart || isStarting}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            {isStarting ? 'Starting...' : 'Start Voice Navigation'}
          </Button>
        ) : (
          <>
            {state.isPaused ? (
              <Button
                onClick={onResume}
                disabled={!canResume}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            ) : (
              <Button
                onClick={onPause}
                disabled={!canPause}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                size="sm"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button
              onClick={onStop}
              disabled={!canStop}
              variant="outline"
              size="sm"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </>
        )}
      </div>

      {/* Secondary Controls - Only show when voice navigation is active */}
      {state.isActive && (
        <div className="flex items-center gap-2">
          <Button
            onClick={onRepeat}
            disabled={!canRepeat}
            variant="outline"
            size="sm"
            title="Repeat last instruction"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onSkip}
            disabled={!canSkip}
            variant="outline"
            size="sm"
            title="Skip to next instruction"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Emergency Stop - Always visible when active */}
      {state.isActive && (
        <Button
          onClick={onEmergencyStop}
          variant="destructive"
          size="sm"
          className="ml-auto"
          title="Emergency stop - immediately stops all voice navigation"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Emergency Stop
        </Button>
      )}

      {/* Status Indicators */}
      <div className="flex items-center gap-2 ml-2">
        {/* Speech Synthesizer Status */}
        <div title="Speech synthesizer ready">
          {state.speechSynthesizerReady ? (
            <Volume2 className="w-4 h-4 text-green-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-red-600" />
          )}
        </div>
        
        {/* Fallback Mode Indicator */}
        {state.fallbackMode && (
          <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
            Fallback Mode
          </div>
        )}
        
        {/* Error Indicator */}
        {state.lastError && (
          <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded" title={state.lastError.message}>
            Error
          </div>
        )}
      </div>
    </div>
  )
}

// Compact version for mobile/small spaces
export function VoiceControlButtonsCompact({
  state,
  onStart,
  onPause,
  onResume,
  onStop,
  onRepeat,
  onSkip,
  onEmergencyStop,
  disabled = false,
  className = ""
}: VoiceControlButtonsProps) {
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = async () => {
    setIsStarting(true)
    try {
      await onStart()
    } finally {
      setIsStarting(false)
    }
  }

  const canStart = !state.isActive && state.currentRoute && state.speechSynthesizerReady && !disabled
  const canPause = state.isActive && !state.isPaused && !disabled
  const canResume = state.isActive && state.isPaused && !disabled
  const canStop = state.isActive && !disabled

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {!state.isActive ? (
        <Button
          onClick={handleStart}
          disabled={!canStart || isStarting}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <Play className="w-4 h-4" />
        </Button>
      ) : (
        <>
          {state.isPaused ? (
            <Button
              onClick={onResume}
              disabled={!canResume}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Play className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={onPause}
              disabled={!canPause}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              size="sm"
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            onClick={onStop}
            disabled={!canStop}
            variant="outline"
            size="sm"
          >
            <Square className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onRepeat}
            disabled={!state.currentInstruction}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onEmergencyStop}
            variant="destructive"
            size="sm"
          >
            <AlertTriangle className="w-4 h-4" />
          </Button>
        </>
      )}
      
      {/* Status indicator */}
      <div title={state.speechSynthesizerReady ? "Speech synthesizer ready" : "Speech synthesizer not ready"}>
        {state.speechSynthesizerReady ? (
          <Volume2 className="w-4 h-4 text-green-600 ml-1" />
        ) : (
          <VolumeX className="w-4 h-4 text-red-600 ml-1" />
        )}
      </div>
    </div>
  )
}

export type { VoiceControlButtonsProps }