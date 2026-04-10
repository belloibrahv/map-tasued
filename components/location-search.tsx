"use client"

import { useState } from 'react'
import { Search, MapPin, Navigation } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { campusLocations, CampusLocation } from '@/lib/campus-data'
import { findNearestLocation } from '@/lib/dijkstra'

interface LocationSearchProps {
  onLocationSelect: (locationId: number) => void
  selectedStart?: number
  selectedEnd?: number
}

export default function LocationSearch({ 
  onLocationSelect, 
  selectedStart, 
  selectedEnd 
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredLocations, setFilteredLocations] = useState<CampusLocation[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 0) {
      const filtered = campusLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.shortName.toLowerCase().includes(query.toLowerCase()) ||
        location.description.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredLocations(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredLocations([])
      setShowSuggestions(false)
    }
  }

  const handleLocationClick = (location: CampusLocation) => {
    onLocationSelect(location.id)
    setSearchQuery(location.name)
    setShowSuggestions(false)
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nearestId = findNearestLocation(
            position.coords.latitude,
            position.coords.longitude
          )
          onLocationSelect(nearestId)
          const nearestLocation = campusLocations.find(loc => loc.id === nearestId)
          if (nearestLocation) {
            setSearchQuery(nearestLocation.name)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your current location. Please select a location manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return '🎓'
      case 'administrative':
        return '🏢'
      case 'facility':
        return '🏗️'
      case 'entrance':
        return '🚪'
      default:
        return '📍'
    }
  }

  return (
    <div className="relative">
      <div className="flex gap-2 mb-3 sm:mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8 sm:pl-10 text-sm h-8 sm:h-10"
            onFocus={() => searchQuery && setShowSuggestions(true)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleUseCurrentLocation}
          title="Use current location"
          className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
        >
          <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Search suggestions */}
      {showSuggestions && filteredLocations.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 sm:max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => handleLocationClick(location)}
              >
                <div className="flex-shrink-0">
                  <div 
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold"
                    style={{ backgroundColor: location.color }}
                  >
                    {location.id}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-lg">{getCategoryIcon(location.category)}</span>
                    <h3 className="font-medium text-xs sm:text-sm truncate">{location.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{location.description}</p>
                  <span className="text-xs text-gray-400 capitalize">{location.category}</span>
                </div>
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick access buttons for popular locations */}
      <div className="mt-3 sm:mt-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Quick Access</h3>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {[
            { id: 1, name: "Main Gate", icon: "🚪" },
            { id: 2, name: "COSIT", icon: "🎓" },
            { id: 10, name: "Senate", icon: "🏛️" },
            { id: 11, name: "ICT Centre", icon: "💻" },
            { id: 19, name: "Clinic", icon: "🏥" },
            { id: 21, name: "COSMAS", icon: "🧮" }
          ].map((location) => (
            <Button
              key={location.id}
              variant="outline"
              size="sm"
              className="justify-start gap-1 sm:gap-2 h-auto py-1.5 sm:py-2 text-xs"
              onClick={() => {
                onLocationSelect(location.id)
                const fullLocation = campusLocations.find(loc => loc.id === location.id)
                if (fullLocation) {
                  setSearchQuery(fullLocation.name)
                }
              }}
            >
              <span className="text-sm">{location.icon}</span>
              <span className="truncate">{location.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Selected locations display */}
      {(selectedStart || selectedEnd) && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-50 rounded-lg">
          <h3 className="text-xs sm:text-sm font-medium text-green-800 mb-2">Selected Route</h3>
          <div className="space-y-1 sm:space-y-2">
            {selectedStart && (
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-green-600 font-medium">From:</span>
                <span className="font-medium truncate">
                  {campusLocations.find(loc => loc.id === selectedStart)?.shortName}
                </span>
              </div>
            )}
            {selectedEnd && (
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-green-600 font-medium">To:</span>
                <span className="font-medium truncate">
                  {campusLocations.find(loc => loc.id === selectedEnd)?.shortName}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}