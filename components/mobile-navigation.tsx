"use client"

import { useState } from 'react'
import { ChevronUp, ChevronDown, Navigation, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { campusLocations } from '@/lib/campus-data'
import { formatDistance, formatTime } from '@/lib/utils'

interface MobileNavigationProps {
  selectedStart?: number
  selectedEnd?: number
  pathResult?: {
    totalDistance: number
    totalTime: number
    path: number[]
  } | null
  onClearRoute: () => void
}

export default function MobileNavigation({
  selectedStart,
  selectedEnd,
  pathResult,
  onClearRoute
}: MobileNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!selectedStart || !selectedEnd || selectedStart === selectedEnd) {
    return null
  }

  const startLocation = campusLocations.find(loc => loc.id === selectedStart)
  const endLocation = campusLocations.find(loc => loc.id === selectedEnd)

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-lg">
      {/* Collapsed Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: startLocation?.color }}
            />
            <span className="text-sm font-medium truncate">
              {startLocation?.shortName}
            </span>
          </div>
          <Navigation className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: endLocation?.color }}
            />
            <span className="text-sm font-medium truncate">
              {endLocation?.shortName}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {pathResult && (
            <div className="text-xs text-gray-600">
              {formatDistance(pathResult.totalDistance)}
            </div>
          )}
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t bg-gray-50 p-4 max-h-64 overflow-y-auto">
          {pathResult ? (
            <div className="space-y-4">
              {/* Route Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center bg-white rounded-lg p-3">
                  <MapPin className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                  <div className="text-xs text-gray-600">Distance</div>
                  <div className="font-semibold text-sm">
                    {formatDistance(pathResult.totalDistance)}
                  </div>
                </div>
                <div className="text-center bg-white rounded-lg p-3">
                  <Clock className="h-4 w-4 mx-auto mb-1 text-green-600" />
                  <div className="text-xs text-gray-600">Time</div>
                  <div className="font-semibold text-sm">
                    {formatTime(pathResult.totalTime)}
                  </div>
                </div>
                <div className="text-center bg-white rounded-lg p-3">
                  <Navigation className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                  <div className="text-xs text-gray-600">Stops</div>
                  <div className="font-semibold text-sm">
                    {pathResult.path.length}
                  </div>
                </div>
              </div>

              {/* Route Steps */}
              <div>
                <h4 className="font-medium text-sm mb-2">Route Steps</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {pathResult.path.map((locationId, index) => {
                    const location = campusLocations.find(loc => loc.id === locationId)
                    return (
                      <div key={locationId} className="flex items-center gap-3 bg-white rounded p-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {location?.shortName}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {location?.name}
                          </div>
                        </div>
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: location?.color }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearRoute}
                  className="flex-1"
                >
                  Clear Route
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-sm text-gray-600">Calculating route...</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}