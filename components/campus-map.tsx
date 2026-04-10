"use client"

import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { formatDistance, formatTime } from '@/lib/utils'
import { campusLocations, CampusLocation } from '@/lib/campus-data'
import { dijkstraShortestPath, PathResult } from '@/lib/dijkstra'
import { featureFlags } from '@/lib/voice/feature-flags'
import MapFallback from './map-fallback'

// Lazy load voice navigation components
const VoiceControlButtons = lazy(() => import('@/components/voice-navigation/voice-control-buttons'))
const VoiceStatusIndicator = lazy(() => import('@/components/voice-navigation/voice-status-indicator'))
const VoiceStatusMini = lazy(() => import('@/components/voice-navigation/voice-status-indicator').then(module => ({ default: module.VoiceStatusMini })))

interface CampusMapProps {
  selectedStart?: number
  selectedEnd?: number
  onLocationSelect?: (locationId: number) => void
  selectedRoute?: any
  userLocation?: any
  navigationSteps?: any[]
  isNavigating?: boolean
}

const CampusMap = ({ 
  selectedStart, 
  selectedEnd, 
  onLocationSelect,
  selectedRoute,
  userLocation: externalUserLocation,
  navigationSteps,
  isNavigating 
}: CampusMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [pathResult, setPathResult] = useState<PathResult | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const markersRef = useRef<any[]>([])
  const polylineRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)

  // Voice Navigation Integration - Only initialize when needed
  const [voiceControllerResult, setVoiceControllerResult] = useState<any>(null)
  const [voiceError, setVoiceError] = useState<Error | null>(null)
  
  // Lazy initialize voice controller only when voice navigation is enabled
  useEffect(() => {
    if (typeof window !== 'undefined' && featureFlags.isVoiceNavigationEnabled() && pathResult) {
      import('@/components/voice-navigation/voice-controller').then(({ VoiceController }) => {
        const result = VoiceController({
          route: pathResult,
          onStateChange: (state) => {
            if (state.isActive && state.currentInstruction) {
              console.log('Voice instruction:', state.currentInstruction.text)
            }
          },
          onError: (error) => {
            console.error('Voice navigation error:', error)
            setVoiceError(error)
          }
        })
        setVoiceControllerResult(result)
      }).catch((error) => {
        console.error('Failed to load voice controller:', error)
        setVoiceError(error)
      })
    }
  }, [pathResult])

  const { voiceController, state: voiceState, isReady: voiceReady } = voiceControllerResult || {
    voiceController: null,
    state: { isActive: false, isPaused: false, speechSynthesizerReady: false },
    isReady: false
  }

  // Calculate path when start and end are selected
  useEffect(() => {
    if (selectedStart && selectedEnd && selectedStart !== selectedEnd) {
      const result = dijkstraShortestPath(selectedStart, selectedEnd)
      setPathResult(result.found ? result : null)
    } else {
      setPathResult(null)
    }
  }, [selectedStart, selectedEnd])

  // Use external user location if provided, otherwise get from geolocation
  const effectiveUserLocation = externalUserLocation 
    ? [externalUserLocation.latitude, externalUserLocation.longitude]
    : userLocation

  // Initialize map
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    console.log('Map useEffect triggered, mapRef.current:', !!mapRef.current)
    
    let map: any = null

    const initMap = async () => {
      try {
        console.log('initMap started')
        
        // Wait for container to be ready
        await new Promise(resolve => setTimeout(resolve, 200))
        
        if (!mapRef.current) {
          console.log('No map container available after delay')
          setError('Map container not available')
          return
        }

        console.log('Container available, checking dimensions...')
        const rect = mapRef.current.getBoundingClientRect()
        console.log('Container dimensions:', rect.width, 'x', rect.height)
        
        if (rect.width === 0 || rect.height === 0) {
          console.log('Container has zero dimensions, retrying...')
          // Retry after another delay
          setTimeout(() => {
            if (retryCount < 3) {
              setRetryCount(prev => prev + 1)
            } else {
              setError('Map container has zero dimensions after retries')
            }
          }, 500)
          return
        }

        console.log('Initializing map...')
        setError(null)

        // Import Leaflet dynamically
        console.log('Importing Leaflet...')
        const L = await import('leaflet')
        console.log('Leaflet imported successfully')
        leafletRef.current = L

        // Fix default marker icons
        console.log('Setting up marker icons...')
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        })

        // Clear any existing map
        if (mapInstanceRef.current) {
          console.log('Removing existing map...')
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }

        // Clear container
        console.log('Clearing container...')
        mapRef.current.innerHTML = ''

        // Create map with simpler approach
        console.log('Creating map instance...')
        map = L.map(mapRef.current).setView([6.8505, 3.3575], 17)
        console.log('Map instance created')
        
        // Add tiles
        console.log('Adding tile layer...')
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map)
        console.log('Tile layer added')

        mapInstanceRef.current = map
        console.log('Setting isMapReady to true...')
        setIsMapReady(true)

        console.log('Map created successfully, adding markers...')
        
        // Add markers after a short delay
        setTimeout(() => {
          console.log('Adding markers after delay...')
          updateMarkers()
        }, 100)

        console.log('Map initialization completed!')

      } catch (error) {
        console.error('Error initializing map:', error)
        setError(error instanceof Error ? error.message : 'Failed to initialize map')
        setIsMapReady(false)
      }
    }

    initMap()

    return () => {
      console.log('Cleaning up map...')
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [retryCount])

  // Update markers when selections change
  useEffect(() => {
    if (mapInstanceRef.current && leafletRef.current) {
      updateMarkers()
    }
  }, [selectedStart, selectedEnd, effectiveUserLocation])

  // Update path when pathResult changes
  useEffect(() => {
    if (mapInstanceRef.current && leafletRef.current) {
      updatePath()
    }
  }, [pathResult])

  const createCustomIcon = (location: CampusLocation, isSelected: boolean = false) => {
    if (!leafletRef.current) return null
    
    const L = leafletRef.current
    const iconColor = isSelected ? '#ef4444' : location.color
    const iconSize = isSelected ? 35 : 25
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${iconColor};
          width: ${iconSize}px;
          height: ${iconSize}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${iconSize > 30 ? '14px' : '12px'};
          cursor: pointer;
        ">
          ${location.id}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2],
    })
  }

  const updateMarkers = () => {
    const L = leafletRef.current
    const map = mapInstanceRef.current
    
    if (!L || !map) {
      console.log('updateMarkers: Missing L or map', { L: !!L, map: !!map })
      return
    }

    console.log('updateMarkers: Starting to add markers...')

    // Clear existing markers
    markersRef.current.forEach(marker => {
      try {
        map.removeLayer(marker)
      } catch (e) {
        console.warn('Error removing marker:', e)
      }
    })
    markersRef.current = []

    // Add campus location markers
    campusLocations.forEach(location => {
      try {
        const isSelected = location.id === selectedStart || location.id === selectedEnd
        const icon = createCustomIcon(location, isSelected)
        
        if (icon) {
          const marker = L.marker(location.coordinates, { icon })
            .addTo(map)
            .bindPopup(`
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${location.name}</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 8px;">${location.description}</p>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${location.color};"></span>
                  <span style="font-size: 12px; text-transform: capitalize;">${location.category}</span>
                </div>
              </div>
            `)
            .on('click', () => onLocationSelect?.(location.id))

          markersRef.current.push(marker)
        }
      } catch (error) {
        console.warn('Error adding marker for location:', location.id, error)
      }
    })

    console.log(`updateMarkers: Added ${markersRef.current.length} markers`)

    // Add user location marker if available
    if (effectiveUserLocation) {
      try {
        const userIcon = L.divIcon({
          html: `
            <div style="
              background-color: #3b82f6;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              animation: pulse 2s infinite;
            "></div>
          `,
          className: 'custom-marker pulse',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        const userMarker = L.marker(effectiveUserLocation, { icon: userIcon })
          .addTo(map)
          .bindPopup(`
            <div style="padding: 8px;">
              <h3 style="font-weight: 600;">Your Location</h3>
              <p style="font-size: 14px; color: #666;">Current position</p>
            </div>
          `)

        markersRef.current.push(userMarker)
        console.log('Added user location marker')
      } catch (error) {
        console.warn('Error adding user location marker:', error)
      }
    }
  }

  const updatePath = () => {
    const L = leafletRef.current
    const map = mapInstanceRef.current
    if (!L || !map) return

    // Remove existing polyline
    if (polylineRef.current) {
      try {
        map.removeLayer(polylineRef.current)
      } catch (e) {
        console.warn('Error removing polyline:', e)
      }
      polylineRef.current = null
    }

    // Add new polyline if path exists
    if (pathResult && pathResult.found) {
      try {
        const coordinates = pathResult.path.map(locationId => {
          const location = campusLocations.find(loc => loc.id === locationId)
          return location ? location.coordinates : [0, 0]
        })

        polylineRef.current = L.polyline(coordinates, {
          color: '#ef4444',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 5'
        }).addTo(map)
      } catch (error) {
        console.warn('Error adding path polyline:', error)
      }
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setIsMapReady(false)
    setError(null)
  }

  // Show fallback if there's an error
  if (error && retryCount > 2) {
    return (
      <MapFallback
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
        onLocationSelect={onLocationSelect}
        onRetry={handleRetry}
        error={error}
      />
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Map Container - Always rendered */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg z-0"
        style={{ minHeight: '500px', minWidth: '300px', height: '100%' }}
      />

      {/* Loading Overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading campus map...</p>
            <p className="text-xs text-gray-500 mt-2">Retry count: {retryCount}</p>
            {error && (
              <div className="mt-2">
                <p className="text-xs text-red-600">{error}</p>
                <button 
                  onClick={handleRetry}
                  className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            )}
            <button 
              onClick={() => {
                console.log('Force retry clicked')
                handleRetry()
              }}
              className="mt-2 px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 ml-2"
            >
              Force Retry
            </button>
          </div>
        </div>
      )}

      {/* Path information overlay */}
      {pathResult && pathResult.found && isMapReady && (
        <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-auto sm:max-w-sm bg-white rounded-lg shadow-lg p-3 sm:p-4 z-10">
          <h3 className="font-semibold text-base sm:text-lg mb-2">Route Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">{formatDistance(pathResult.totalDistance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Walking Time:</span>
              <span className="font-medium">{formatTime(pathResult.totalTime)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Stops:</span>
              <span className="font-medium">{pathResult.path.length} locations</span>
            </div>
          </div>
          
          {/* Voice Navigation Controls */}
          {typeof window !== 'undefined' && featureFlags.isVoiceNavigationEnabled() && voiceReady && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Voice Navigation</span>
                <Suspense fallback={<div className="text-xs text-gray-500">Loading...</div>}>
                  <VoiceStatusMini state={voiceState} />
                </Suspense>
              </div>
              <Suspense fallback={<div className="text-xs text-gray-500">Loading voice controls...</div>}>
                <VoiceControlButtons
                  state={voiceState}
                  onStart={voiceController.startVoiceNavigation}
                  onPause={voiceController.pauseVoiceNavigation}
                  onResume={voiceController.resumeVoiceNavigation}
                  onStop={voiceController.stopVoiceNavigation}
                  onRepeat={voiceController.repeatLastInstruction}
                  onSkip={voiceController.skipToNextInstruction}
                  onEmergencyStop={voiceController.emergencyStop}
                  className="w-full"
                />
              </Suspense>
              {voiceError && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  Voice Error: {voiceError.message}
                </div>
              )}
            </div>
          )}
          
          {/* Path details - collapsible on mobile */}
          <details className="mt-3 pt-3 border-t">
            <summary className="font-medium mb-2 cursor-pointer text-sm">Route Details</summary>
            <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
              {pathResult.path.map((locationId, index) => {
                const location = campusLocations.find(loc => loc.id === locationId)
                return (
                  <div key={locationId} className="flex items-center gap-2">
                    <span className="text-gray-400 min-w-[20px]">{index + 1}.</span>
                    <span className="truncate">{location?.shortName}</span>
                  </div>
                )
              })}
            </div>
          </details>
        </div>
      )}

      {/* Voice Navigation Status Panel - Show when voice navigation is active */}
      {typeof window !== 'undefined' && featureFlags.isVoiceNavigationEnabled() && voiceState.isActive && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-20">
          <Suspense fallback={<div className="bg-white p-4 rounded-lg shadow-lg text-sm">Loading voice status...</div>}>
            <VoiceStatusIndicator 
              state={voiceState} 
              compact={window.innerWidth < 640}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}

export default CampusMap