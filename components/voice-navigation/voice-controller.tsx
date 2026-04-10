"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { VoiceController as IVoiceController, VoiceNavigationState, VoiceInstruction } from '@/lib/voice/types'
import { PathResult } from '@/lib/dijkstra'
import { BrowserSpeechSynthesizer } from '@/lib/voice/speech-synthesizer'
import { CampusDirectionNarrator } from '@/lib/voice/direction-narrator'
import { featureFlags } from '@/lib/voice/feature-flags'

interface VoiceControllerProps {
  route: PathResult | null
  onStateChange?: (state: VoiceNavigationState) => void
  onError?: (error: Error) => void
}

export function VoiceController({ route, onStateChange, onError }: VoiceControllerProps) {
  const [state, setState] = useState<VoiceNavigationState>({
    isActive: false,
    isPaused: false,
    currentRoute: null,
    currentInstruction: null,
    completedWaypoints: [],
    nextWaypoint: null,
    distanceToNext: 0,
    estimatedTimeRemaining: 0,
    userLocation: null,
    movementSpeed: 0,
    lastLocationUpdate: 0,
    speechSynthesizerReady: false,
    audioDevicesAvailable: [],
    backgroundOperation: false,
    lastError: null,
    retryCount: 0,
    fallbackMode: false
  })

  const speechSynthesizerRef = useRef<BrowserSpeechSynthesizer | null>(null)
  const directionNarratorRef = useRef<CampusDirectionNarrator | null>(null)
  const instructionsRef = useRef<VoiceInstruction[]>([])
  const currentInstructionIndexRef = useRef<number>(0)

  // Initialize speech synthesizer
  useEffect(() => {
    const initializeSpeechSynthesizer = async () => {
      if (!featureFlags.isVoiceNavigationEnabled()) {
        console.log('Voice navigation is disabled by feature flags')
        return
      }

      try {
        const synthesizer = new BrowserSpeechSynthesizer()
        const initialized = await synthesizer.initialize()

        if (initialized) {
          speechSynthesizerRef.current = synthesizer
          directionNarratorRef.current = new CampusDirectionNarrator(synthesizer)

          setState(prev => ({
            ...prev,
            speechSynthesizerReady: true,
            lastError: null
          }))

          // Set up event handlers
          synthesizer.onSpeechStart(() => {
            console.log('Speech started')
          })

          synthesizer.onSpeechEnd(() => {
            console.log('Speech ended')
            // Move to next instruction if available
            moveToNextInstruction()
          })

          synthesizer.onSpeechError((error) => {
            console.error('Speech synthesis error:', error)
            setState(prev => ({
              ...prev,
              lastError: error,
              retryCount: prev.retryCount + 1
            }))
            onError?.(error)
          })
        }
      } catch (error) {
        console.error('Failed to initialize speech synthesizer:', error)
        setState(prev => ({
          ...prev,
          speechSynthesizerReady: false,
          lastError: error as Error,
          fallbackMode: true
        }))
        onError?.(error as Error)
      }
    }

    initializeSpeechSynthesizer()
  }, [onError])

  // Update state when route changes
  useEffect(() => {
    if (route && route.found) {
      setState(prev => ({
        ...prev,
        currentRoute: route,
        nextWaypoint: route.path[0] || null,
        estimatedTimeRemaining: route.totalTime
      }))

      // Generate instructions for the new route
      if (directionNarratorRef.current) {
        const instructions = directionNarratorRef.current.generateRouteInstructions(route)
        instructionsRef.current = instructions
        currentInstructionIndexRef.current = 0
      }
    }
  }, [route])

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(state)
  }, [state, onStateChange])

  const startVoiceNavigation = useCallback(async (): Promise<boolean> => {
    if (!speechSynthesizerRef.current || !directionNarratorRef.current || !route) {
      return false
    }

    try {
      setState(prev => ({
        ...prev,
        isActive: true,
        isPaused: false,
        currentRoute: route
      }))

      // Announce route overview
      await directionNarratorRef.current.announceRouteOverview(route)

      // Start with first instruction
      if (instructionsRef.current.length > 0) {
        const firstInstruction = instructionsRef.current[0]
        setState(prev => ({
          ...prev,
          currentInstruction: firstInstruction
        }))
        await directionNarratorRef.current.announceInstruction(firstInstruction)
      }

      return true
    } catch (error) {
      console.error('Failed to start voice navigation:', error)
      setState(prev => ({
        ...prev,
        isActive: false,
        lastError: error as Error
      }))
      onError?.(error as Error)
      return false
    }
  }, [route, onError])

  const pauseVoiceNavigation = useCallback(() => {
    if (speechSynthesizerRef.current) {
      speechSynthesizerRef.current.pause()
      setState(prev => ({
        ...prev,
        isPaused: true
      }))
    }
  }, [])

  const resumeVoiceNavigation = useCallback(() => {
    if (speechSynthesizerRef.current) {
      speechSynthesizerRef.current.resume()
      setState(prev => ({
        ...prev,
        isPaused: false
      }))
    }
  }, [])

  const stopVoiceNavigation = useCallback(() => {
    if (speechSynthesizerRef.current) {
      speechSynthesizerRef.current.cancel()
    }

    setState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      currentInstruction: null,
      completedWaypoints: [],
      nextWaypoint: null
    }))

    instructionsRef.current = []
    currentInstructionIndexRef.current = 0
  }, [])

  const repeatLastInstruction = useCallback(async () => {
    if (!directionNarratorRef.current || !state.currentInstruction) {
      return
    }

    try {
      await directionNarratorRef.current.announceInstruction(state.currentInstruction)
    } catch (error) {
      console.error('Failed to repeat instruction:', error)
      onError?.(error as Error)
    }
  }, [state.currentInstruction, onError])

  const skipToNextInstruction = useCallback(() => {
    if (speechSynthesizerRef.current) {
      speechSynthesizerRef.current.cancel()
    }
    moveToNextInstruction()
  }, [])

  const emergencyStop = useCallback(() => {
    if (speechSynthesizerRef.current) {
      speechSynthesizerRef.current.cancel()
    }

    setState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      currentInstruction: null
    }))
  }, [])

  const moveToNextInstruction = useCallback(async () => {
    const nextIndex = currentInstructionIndexRef.current + 1

    if (nextIndex < instructionsRef.current.length) {
      currentInstructionIndexRef.current = nextIndex
      const nextInstruction = instructionsRef.current[nextIndex]

      setState(prev => ({
        ...prev,
        currentInstruction: nextInstruction
      }))

      if (directionNarratorRef.current && state.isActive && !state.isPaused) {
        try {
          await directionNarratorRef.current.announceInstruction(nextInstruction)
        } catch (error) {
          console.error('Failed to announce next instruction:', error)
          onError?.(error as Error)
        }
      }
    } else {
      // Navigation complete
      stopVoiceNavigation()
    }
  }, [state.isActive, state.isPaused, onError, stopVoiceNavigation])

  // Implement the VoiceController interface
  const voiceController: IVoiceController = {
    isActive: state.isActive,
    isPaused: state.isPaused,
    currentRoute: state.currentRoute,
    startVoiceNavigation,
    pauseVoiceNavigation,
    resumeVoiceNavigation,
    stopVoiceNavigation,
    repeatLastInstruction,
    skipToNextInstruction,
    emergencyStop,
    onRouteUpdate: (newRoute: PathResult) => {
      // This would be called when the route changes
      if (directionNarratorRef.current) {
        const instructions = directionNarratorRef.current.generateRouteInstructions(newRoute)
        instructionsRef.current = instructions
        currentInstructionIndexRef.current = 0
      }
    },
    onLocationUpdate: (location: GeolocationPosition) => {
      setState(prev => ({
        ...prev,
        userLocation: location,
        lastLocationUpdate: Date.now()
      }))
    },
    onNavigationComplete: () => {
      stopVoiceNavigation()
    }
  }

  return {
    voiceController,
    state,
    isReady: state.speechSynthesizerReady && !state.fallbackMode
  }
}

export type { VoiceControllerProps }