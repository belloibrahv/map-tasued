"use client"

import { useState, useEffect, lazy, Suspense } from 'react'
import { ArrowRight, RotateCcw, Route, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { campusLocations } from '@/lib/campus-data'
import { dijkstraShortestPath } from '@/lib/dijkstra'
import { featureFlags } from '@/lib/voice/feature-flags'

// Lazy load voice navigation components
const VoiceController = lazy(() => import('@/components/voice-navigation/voice-controller').then(module => ({ default: module.VoiceController })))
const VoiceControlButtonsCompact = lazy(() => import('@/components/voice-navigation/voice-control-buttons').then(module => ({ default: module.VoiceControlButtonsCompact })))

interface RoutePlannerProps {
  selectedStart?: number
  selectedEnd?: number
  onStartChange: (locationId: number) => void
  onEndChange: (locationId: number) => void
  onSwapLocations: () => void
  pathResult?: any // Current calculated route
}

export default function RoutePlanner({
  selectedStart,
  selectedEnd,
  onStartChange,
  onEndChange,
  onSwapLocations,
  pathResult
}: RoutePlannerProps) {
  const [plannerMode, setPlannerMode] = useState<'start' | 'end'>('start')

  // Voice Navigation Integration - Lazy load only when needed
  const [voiceControllerResult, setVoiceControllerResult] = useState<any>(null)
  
  const currentRoute = selectedStart && selectedEnd && selectedStart !== selectedEnd 
    ? dijkstraShortestPath(selectedStart, selectedEnd) 
    : null

  // Lazy initialize voice controller only when voice navigation is enabled and route exists
  useEffect(() => {
    if (typeof window !== 'undefined' && featureFlags.isVoiceNavigationEnabled() && currentRoute?.found) {
      import('@/components/voice-navigation/voice-controller').then(({ VoiceController }) => {
        const result = VoiceController({
          route: currentRoute,
          onStateChange: (state) => {
            console.log('RoutePlanner voice state:', state.isActive)
          },
          onError: (error) => {
            console.error('RoutePlanner voice error:', error)
          }
        })
        setVoiceControllerResult(result)
      })
    }
  }, [currentRoute])

  const { voiceController, state: voiceState, isReady: voiceReady } = voiceControllerResult || {
    voiceController: null,
    state: { isActive: false, isPaused: false, speechSynthesizerReady: false },
    isReady: false
  }

  const getLocationsByCategory = () => {
    const categories = {
      entrance: campusLocations.filter(loc => loc.category === 'entrance'),
      academic: campusLocations.filter(loc => loc.category === 'academic'),
      administrative: campusLocations.filter(loc => loc.category === 'administrative'),
      facility: campusLocations.filter(loc => loc.category === 'facility')
    }
    return categories
  }

  const categories = getLocationsByCategory()

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'entrance': return 'Entrances'
      case 'academic': return 'Academic Buildings'
      case 'administrative': return 'Administrative'
      case 'facility': return 'Facilities'
      default: return category
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'entrance': return '🚪'
      case 'academic': return '🎓'
      case 'administrative': return '🏢'
      case 'facility': return '🏗️'
      default: return '📍'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Route className="h-4 w-4 sm:h-5 sm:w-5" />
          Route Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Start Location */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">From</label>
          <Select
            value={selectedStart?.toString()}
            onValueChange={(value) => onStartChange(parseInt(value))}
          >
            <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
              <SelectValue placeholder="Select starting location" />
            </SelectTrigger>
            <SelectContent className="max-h-60 sm:max-h-80">
              {Object.entries(categories).map(([category, locations]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs sm:text-sm font-semibold text-gray-500 flex items-center gap-2">
                    <span>{getCategoryIcon(category)}</span>
                    {getCategoryLabel(category)}
                  </div>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                          style={{ backgroundColor: location.color }}
                        />
                        <span className="text-xs sm:text-sm truncate">{location.shortName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={onSwapLocations}
            disabled={!selectedStart || !selectedEnd}
            className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
          >
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* End Location */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">To</label>
          <Select
            value={selectedEnd?.toString()}
            onValueChange={(value) => onEndChange(parseInt(value))}
          >
            <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent className="max-h-60 sm:max-h-80">
              {Object.entries(categories).map(([category, locations]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs sm:text-sm font-semibold text-gray-500 flex items-center gap-2">
                    <span>{getCategoryIcon(category)}</span>
                    {getCategoryLabel(category)}
                  </div>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                          style={{ backgroundColor: location.color }}
                        />
                        <span className="text-xs sm:text-sm truncate">{location.shortName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Route Suggestions */}
        {!selectedStart && !selectedEnd && (
          <div className="mt-4 sm:mt-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Popular Routes</h3>
            <div className="space-y-1 sm:space-y-2">
              {[
                { from: 1, to: 21, label: "Main Gate → COSMAS" },
                { from: 1, to: 10, label: "Main Gate → Senate" },
                { from: 1, to: 11, label: "Main Gate → ICT Centre" },
                { from: 2, to: 19, label: "COSIT → Clinic" }
              ].map((route, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-between h-auto py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm"
                  onClick={() => {
                    onStartChange(route.from)
                    onEndChange(route.to)
                  }}
                >
                  <span className="truncate">{route.label}</span>
                  <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 ml-2" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Route Summary */}
        {selectedStart && selectedEnd && selectedStart !== selectedEnd && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <div className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{ 
                      backgroundColor: campusLocations.find(loc => loc.id === selectedStart)?.color 
                    }}
                  />
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {campusLocations.find(loc => loc.id === selectedStart)?.shortName}
                  </span>
                </div>
                <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400 flex-shrink-0" />
                <div className="flex items-center gap-1 min-w-0">
                  <div 
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{ 
                      backgroundColor: campusLocations.find(loc => loc.id === selectedEnd)?.color 
                    }}
                  />
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {campusLocations.find(loc => loc.id === selectedEnd)?.shortName}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-blue-600">
                Route calculated and displayed on map
              </p>
              
              {/* Voice Navigation Controls */}
              {typeof window !== 'undefined' && featureFlags.isVoiceNavigationEnabled() && voiceReady && currentRoute?.found && (
                <div className="flex items-center gap-2">
                  <Volume2 className="h-3 w-3 text-blue-600" />
                  <Suspense fallback={<div className="text-xs text-gray-500">Loading...</div>}>
                    <VoiceControlButtonsCompact
                      state={voiceState}
                      onStart={voiceController.startVoiceNavigation}
                      onPause={voiceController.pauseVoiceNavigation}
                      onResume={voiceController.resumeVoiceNavigation}
                      onStop={voiceController.stopVoiceNavigation}
                      onRepeat={voiceController.repeatLastInstruction}
                      onSkip={voiceController.skipToNextInstruction}
                      onEmergencyStop={voiceController.emergencyStop}
                    />
                  </Suspense>
                </div>
              )}
            </div>

            {/* Voice Navigation Status */}
            {voiceState.isActive && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-700">
                    {voiceState.isPaused ? 'Voice Paused' : 'Voice Active'}
                  </span>
                  {voiceState.currentInstruction && (
                    <span className="text-blue-600 truncate max-w-32">
                      {voiceState.currentInstruction.text.substring(0, 30)}...
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}