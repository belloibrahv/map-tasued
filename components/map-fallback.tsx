"use client"

import { MapPin, Navigation, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { campusLocations } from '@/lib/campus-data'

interface MapFallbackProps {
  selectedStart?: number
  selectedEnd?: number
  onLocationSelect?: (locationId: number) => void
  onRetry?: () => void
  error?: string
}

export default function MapFallback({ 
  selectedStart, 
  selectedEnd, 
  onLocationSelect, 
  onRetry,
  error 
}: MapFallbackProps) {
  const startLocation = campusLocations.find(loc => loc.id === selectedStart)
  const endLocation = campusLocations.find(loc => loc.id === selectedEnd)

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Map Unavailable</CardTitle>
          <CardDescription>
            {error ? `Error: ${error}` : 'The interactive map is currently unavailable. You can still use the navigation features below.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Selection */}
          {(selectedStart || selectedEnd) && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Current Selection</h3>
              {selectedStart && (
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <span>From:</span>
                  <span className="font-medium">{startLocation?.name}</span>
                </div>
              )}
              {selectedEnd && (
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <span>To:</span>
                  <span className="font-medium">{endLocation?.name}</span>
                </div>
              )}
            </div>
          )}

          {/* Quick Location Access */}
          <div>
            <h3 className="font-medium mb-2">Quick Access Locations</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 1, name: "University Main Gate", icon: "🚪" },
                { id: 2, name: "COSIT (Science Complex)", icon: "🎓" },
                { id: 10, name: "Senate Building", icon: "🏛️" },
                { id: 11, name: "ICT Centre", icon: "💻" },
                { id: 19, name: "University Clinic", icon: "🏥" },
                { id: 21, name: "COSMAS Building", icon: "🧮" }
              ].map((location) => (
                <Button
                  key={location.id}
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2 h-auto py-2"
                  onClick={() => onLocationSelect?.(location.id)}
                >
                  <span>{location.icon}</span>
                  <span className="text-xs truncate">{location.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Map
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Refresh Page
            </Button>
          </div>

          {/* Campus Info */}
          <div className="text-center text-sm text-gray-600">
            <p>TASUED Campus has {campusLocations.length} mapped locations</p>
            <p className="mt-1">Use the sidebar to plan your route</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}