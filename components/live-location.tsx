"use client"

import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, Target, Wifi, WifiOff, Battery, Signal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  heading?: number
  speed?: number
  timestamp: number
}

interface LiveLocationProps {
  onLocationUpdate: (location: LocationData) => void
  isNavigating: boolean
}

export default function LiveLocation({ onLocationUpdate, isNavigating }: LiveLocationProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [accuracy, setAccuracy] = useState<'high' | 'medium' | 'low'>('medium')
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const watchIdRef = useRef<number | null>(null)

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Monitor battery level
  useEffect(() => {
    const getBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery()
          setBatteryLevel(Math.round(battery.level * 100))
          
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100))
          })
        } catch (error) {
          console.log('Battery API not supported')
        }
      }
    }

    getBatteryInfo()
  }, [])

  // Start location tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser')
      return
    }

    setLocationError(null)
    setIsTracking(true)

    const options: PositionOptions = {
      enableHighAccuracy: accuracy === 'high',
      timeout: 10000,
      maximumAge: accuracy === 'high' ? 1000 : 5000
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
          timestamp: Date.now()
        }
        
        setCurrentLocation(locationData)
        onLocationUpdate(locationData)
      },
      (error) => {
        setLocationError(getLocationErrorMessage(error))
        setIsTracking(false)
      },
      options
    )

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
          timestamp: Date.now()
        }
        
        setCurrentLocation(locationData)
        onLocationUpdate(locationData)
      },
      (error) => {
        setLocationError(getLocationErrorMessage(error))
      },
      options
    )
  }

  // Stop location tracking
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
    setCurrentLocation(null)
  }

  // Auto-start tracking when navigating
  useEffect(() => {
    if (isNavigating && !isTracking) {
      startTracking()
    } else if (!isNavigating && isTracking) {
      stopTracking()
    }
  }, [isNavigating])

  const getLocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location permissions.'
      case error.POSITION_UNAVAILABLE:
        return 'Location information unavailable.'
      case error.TIMEOUT:
        return 'Location request timed out.'
      default:
        return 'An unknown error occurred while retrieving location.'
    }
  }

  const getAccuracyLevel = (accuracy: number): 'high' | 'medium' | 'low' => {
    if (accuracy <= 10) return 'high'
    if (accuracy <= 50) return 'medium'
    return 'low'
  }

  const getAccuracyColor = (level: 'high' | 'medium' | 'low'): string => {
    switch (level) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-red-600'
    }
  }

  const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6)
  }

  const formatSpeed = (speed?: number): string => {
    if (!speed) return 'Stationary'
    const kmh = speed * 3.6
    return `${kmh.toFixed(1)} km/h`
  }

  const formatHeading = (heading?: number): string => {
    if (!heading) return 'Unknown'
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(heading / 45) % 8
    return `${directions[index]} (${Math.round(heading)}°)`
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Live Location
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            
            {/* Battery Level */}
            {batteryLevel !== null && (
              <div className="flex items-center gap-1">
                <Battery className={`h-4 w-4 ${batteryLevel > 20 ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-xs">{batteryLevel}%</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tracking Controls */}
        <div className="flex gap-2">
          <Button
            onClick={isTracking ? stopTracking : startTracking}
            variant={isTracking ? "destructive" : "default"}
            size="sm"
            className="flex-1"
          >
            {isTracking ? (
              <>
                <Target className="h-4 w-4 mr-2 animate-pulse" />
                Stop Tracking
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Start Tracking
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newAccuracy = accuracy === 'high' ? 'medium' : accuracy === 'medium' ? 'low' : 'high'
              setAccuracy(newAccuracy)
              if (isTracking) {
                stopTracking()
                setTimeout(startTracking, 100)
              }
            }}
          >
            <Signal className="h-4 w-4" />
          </Button>
        </div>

        {/* Accuracy Setting */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Accuracy Mode:</span>
          <Badge variant={accuracy === 'high' ? 'default' : 'secondary'}>
            {accuracy.toUpperCase()}
          </Badge>
        </div>

        {/* Location Error */}
        {locationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{locationError}</p>
          </div>
        )}

        {/* Current Location Info */}
        {currentLocation && (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Location Active</span>
                <Badge 
                  variant="outline" 
                  className={getAccuracyLevel(currentLocation.accuracy) === 'high' ? 'border-green-500 text-green-700' : 
                            getAccuracyLevel(currentLocation.accuracy) === 'medium' ? 'border-yellow-500 text-yellow-700' : 
                            'border-red-500 text-red-700'}
                >
                  ±{Math.round(currentLocation.accuracy)}m
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-600">Latitude:</span>
                  <div className="font-mono">{formatCoordinate(currentLocation.latitude)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Longitude:</span>
                  <div className="font-mono">{formatCoordinate(currentLocation.longitude)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Speed:</span>
                  <div>{formatSpeed(currentLocation.speed)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Heading:</span>
                  <div>{formatHeading(currentLocation.heading)}</div>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-600">
                Last updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
              </div>
            </div>

            {/* Campus Location Detection */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Campus Detection</span>
              </div>
              <p className="text-sm text-blue-700">
                {/* This would be enhanced with actual campus boundary detection */}
                {Math.abs(currentLocation.latitude - 6.8505) < 0.01 && 
                 Math.abs(currentLocation.longitude - 3.3575) < 0.01 
                  ? "You are on TASUED campus" 
                  : "You are outside TASUED campus"}
              </p>
            </div>
          </div>
        )}

        {/* Offline Mode Notice */}
        {!isOnline && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Offline Mode</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Location tracking continues offline. Map tiles may not update.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}