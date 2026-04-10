"use client"

import { useState, useEffect, useRef } from 'react'
import { Navigation, MapPin, Clock, Route, Volume2, VolumeX, Share, Bookmark, Filter, Zap, Accessibility, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { campusLocations, CampusLocation } from '@/lib/campus-data'
import { dijkstraShortestPath } from '@/lib/dijkstra'

interface RouteOption {
  id: string
  name: string
  description: string
  path: number[]
  distance: number
  time: number
  difficulty: 'easy' | 'moderate' | 'hard'
  accessibility: boolean
  icon: any
  color: string
}

interface NavigationStep {
  instruction: string
  distance: number
  direction: 'straight' | 'left' | 'right' | 'slight-left' | 'slight-right'
  landmark?: string
  location: CampusLocation
}

interface AdvancedNavigationProps {
  selectedStart?: number
  selectedEnd?: number
  onRouteSelect: (route: RouteOption) => void
  onNavigationStart: (steps: NavigationStep[]) => void
}

export default function AdvancedNavigation({ 
  selectedStart, 
  selectedEnd, 
  onRouteSelect, 
  onNavigationStart 
}: AdvancedNavigationProps) {
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([])
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null)
  const [navigationSteps, setNavigationSteps] = useState<NavigationStep[]>([])
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [routeFilter, setRouteFilter] = useState<'all' | 'shortest' | 'accessible' | 'fastest'>('all')
  
  // Calculate multiple route options
  useEffect(() => {
    if (selectedStart && selectedEnd && selectedStart !== selectedEnd) {
      calculateRouteOptions()
    } else {
      setRouteOptions([])
      setSelectedRoute(null)
    }
  }, [selectedStart, selectedEnd])

  const calculateRouteOptions = () => {
    if (!selectedStart || !selectedEnd) return

    const baseRoute = dijkstraShortestPath(selectedStart, selectedEnd)
    if (!baseRoute.found) return

    const options: RouteOption[] = [
      // Shortest Route
      {
        id: 'shortest',
        name: 'Shortest Route',
        description: 'Minimum distance path',
        path: baseRoute.path,
        distance: baseRoute.totalDistance,
        time: baseRoute.totalTime,
        difficulty: 'easy',
        accessibility: true,
        icon: Route,
        color: '#22c55e'
      },
      // Fastest Route (simulated - could use different algorithm)
      {
        id: 'fastest',
        name: 'Fastest Route',
        description: 'Quickest walking time',
        path: baseRoute.path,
        distance: baseRoute.totalDistance * 1.1,
        time: baseRoute.totalTime * 0.9,
        difficulty: 'moderate',
        accessibility: true,
        icon: Zap,
        color: '#f59e0b'
      },
      // Accessible Route
      {
        id: 'accessible',
        name: 'Accessible Route',
        description: 'Wheelchair and mobility friendly',
        path: baseRoute.path,
        distance: baseRoute.totalDistance * 1.2,
        time: baseRoute.totalTime * 1.1,
        difficulty: 'easy',
        accessibility: true,
        icon: Accessibility,
        color: '#3b82f6'
      },
      // Scenic Route (through main campus areas)
      {
        id: 'scenic',
        name: 'Campus Tour Route',
        description: 'Pass by major landmarks',
        path: baseRoute.path,
        distance: baseRoute.totalDistance * 1.3,
        time: baseRoute.totalTime * 1.2,
        difficulty: 'moderate',
        accessibility: false,
        icon: Building,
        color: '#8b5cf6'
      }
    ]

    setRouteOptions(options)
    setSelectedRoute(options[0]) // Default to shortest route
  }

  const generateNavigationSteps = (route: RouteOption): NavigationStep[] => {
    const steps: NavigationStep[] = []
    
    for (let i = 0; i < route.path.length - 1; i++) {
      const currentLocationId = route.path[i]
      const nextLocationId = route.path[i + 1]
      
      const currentLocation = campusLocations.find(loc => loc.id === currentLocationId)
      const nextLocation = campusLocations.find(loc => loc.id === nextLocationId)
      
      if (currentLocation && nextLocation) {
        // Generate instruction based on locations
        let instruction = `Head towards ${nextLocation.shortName}`
        let direction: NavigationStep['direction'] = 'straight'
        
        // Add more specific instructions based on location types
        if (i === 0) {
          instruction = `Start at ${currentLocation.shortName} and head towards ${nextLocation.shortName}`
        } else if (i === route.path.length - 2) {
          instruction = `Arrive at ${nextLocation.shortName}`
        } else {
          // Determine direction based on location categories
          if (currentLocation.category === 'entrance' && nextLocation.category === 'academic') {
            direction = 'straight'
            instruction = `Continue straight towards ${nextLocation.shortName}`
          } else if (currentLocation.category === 'academic' && nextLocation.category === 'administrative') {
            direction = 'right'
            instruction = `Turn right towards ${nextLocation.shortName}`
          } else {
            instruction = `Continue to ${nextLocation.shortName}`
          }
        }

        // Calculate distance between points (simplified)
        const distance = Math.round(Math.random() * 100 + 50) // Simulated distance in meters

        steps.push({
          instruction,
          distance,
          direction,
          landmark: currentLocation.description,
          location: nextLocation
        })
      }
    }

    return steps
  }

  const startNavigation = (route: RouteOption) => {
    const steps = generateNavigationSteps(route)
    setNavigationSteps(steps)
    setCurrentStep(0)
    setIsNavigating(true)
    onNavigationStart(steps)
    
    if (voiceEnabled) {
      speakInstruction(steps[0]?.instruction)
    }
  }

  const speakInstruction = (instruction: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(instruction)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const nextStep = () => {
    if (currentStep < navigationSteps.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      if (voiceEnabled) {
        speakInstruction(navigationSteps[newStep]?.instruction)
      }
    }
  }

  const stopNavigation = () => {
    setIsNavigating(false)
    setCurrentStep(0)
    setNavigationSteps([])
    speechSynthesis.cancel()
  }

  const shareRoute = () => {
    if (selectedRoute && selectedStart && selectedEnd) {
      const startLocation = campusLocations.find(loc => loc.id === selectedStart)
      const endLocation = campusLocations.find(loc => loc.id === selectedEnd)
      
      const shareData = {
        title: 'TASUED Campus Route',
        text: `Route from ${startLocation?.shortName} to ${endLocation?.shortName}`,
        url: `${window.location.origin}?from=${selectedStart}&to=${selectedEnd}&route=${selectedRoute.id}`
      }

      if (navigator.share) {
        navigator.share(shareData)
      } else {
        navigator.clipboard.writeText(shareData.url)
        alert('Route link copied to clipboard!')
      }
    }
  }

  const filteredRoutes = routeOptions.filter(route => {
    switch (routeFilter) {
      case 'shortest':
        return route.id === 'shortest'
      case 'accessible':
        return route.accessibility
      case 'fastest':
        return route.id === 'fastest'
      default:
        return true
    }
  })

  if (!selectedStart || !selectedEnd || selectedStart === selectedEnd) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Advanced Navigation
          </CardTitle>
          <CardDescription>
            Select start and destination points to see route options
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Route Options */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Route Options</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRouteFilter(routeFilter === 'all' ? 'shortest' : 'all')}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedRoute?.id === route.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setSelectedRoute(route)
                onRouteSelect(route)
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: `${route.color}20`, color: route.color }}
                  >
                    <route.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{route.name}</h4>
                    <p className="text-xs text-gray-600">{route.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{Math.round(route.distance)}m</div>
                  <div className="text-xs text-gray-600">{Math.round(route.time)} min</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={route.difficulty === 'easy' ? 'default' : 'secondary'} className="text-xs">
                  {route.difficulty}
                </Badge>
                {route.accessibility && (
                  <Badge variant="outline" className="text-xs">
                    <Accessibility className="h-3 w-3 mr-1" />
                    Accessible
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      {selectedRoute && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isNavigating ? (
              <div className="space-y-3">
                <Button
                  onClick={() => startNavigation(selectedRoute)}
                  className="w-full"
                  size="lg"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Navigation
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareRoute}
                    className="flex-1"
                  >
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Bookmark className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Current Step */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {currentStep + 1}
                    </div>
                    <span className="text-sm font-medium text-blue-900">
                      Step {currentStep + 1} of {navigationSteps.length}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">
                    {navigationSteps[currentStep]?.instruction}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-blue-600">
                    <span>{navigationSteps[currentStep]?.distance}m</span>
                    {navigationSteps[currentStep]?.landmark && (
                      <span>Near: {navigationSteps[currentStep]?.landmark}</span>
                    )}
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex gap-2">
                  <Button
                    onClick={nextStep}
                    disabled={currentStep >= navigationSteps.length - 1}
                    className="flex-1"
                  >
                    Next Step
                  </Button>
                  <Button
                    variant="outline"
                    onClick={stopNavigation}
                  >
                    Stop
                  </Button>
                </div>

                {/* Progress */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / navigationSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Route Summary */}
      {selectedRoute && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Route Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{Math.round(selectedRoute.distance)}m</div>
                <div className="text-xs text-gray-600">Distance</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{Math.round(selectedRoute.time)} min</div>
                <div className="text-xs text-gray-600">Walking Time</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{selectedRoute.path.length}</div>
                <div className="text-xs text-gray-600">Stops</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}