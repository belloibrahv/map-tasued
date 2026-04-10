"use client"

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, Clock, MapPin, Building, Users, Accessibility, Wifi, Car, Coffee, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { campusLocations, CampusLocation } from '@/lib/campus-data'

interface SearchFilter {
  category: string[]
  facilities: string[]
  accessibility: boolean
  openNow: boolean
}

interface LocationWithFacilities extends CampusLocation {
  facilities: string[]
  hours: {
    open: string
    close: string
    days: string[]
  }
  isOpen: boolean
  popularity: number
}

interface EnhancedSearchProps {
  onLocationSelect: (locationId: number) => void
  selectedStart?: number
  selectedEnd?: number
}

export default function EnhancedSearch({ onLocationSelect, selectedStart, selectedEnd }: EnhancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilter>({
    category: [],
    facilities: [],
    accessibility: false,
    openNow: false
  })
  const [showFilters, setShowFilters] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Enhanced location data with facilities and hours
  const enhancedLocations: LocationWithFacilities[] = useMemo(() => {
    return campusLocations.map(location => ({
      ...location,
      facilities: getFacilitiesForLocation(location),
      hours: getHoursForLocation(location),
      isOpen: isLocationOpen(location),
      popularity: getLocationPopularity(location.id)
    }))
  }, [])

  // Get facilities for each location
  function getFacilitiesForLocation(location: CampusLocation): string[] {
    const facilities: string[] = []
    
    switch (location.category) {
      case 'academic':
        facilities.push('WiFi', 'Classrooms', 'Laboratories')
        if (location.name.includes('ICT')) facilities.push('Computers', 'Internet')
        if (location.name.includes('Library')) facilities.push('Books', 'Study Areas')
        break
      case 'administrative':
        facilities.push('WiFi', 'Offices', 'Services')
        if (location.name.includes('Admission')) facilities.push('Registration', 'Information')
        break
      case 'facility':
        facilities.push('WiFi')
        if (location.name.includes('Clinic')) facilities.push('Medical', 'Emergency')
        if (location.name.includes('Auditorium')) facilities.push('Events', 'Seating')
        break
      case 'entrance':
        facilities.push('Security', 'Information')
        break
    }
    
    // Add common facilities
    facilities.push('Accessibility', 'Parking')
    
    return facilities
  }

  // Get operating hours for location
  function getHoursForLocation(location: CampusLocation) {
    // Default campus hours
    let hours = {
      open: '08:00',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }

    // Specific hours for different location types
    if (location.category === 'facility') {
      if (location.name.includes('Clinic')) {
        hours = { open: '08:00', close: '16:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
      } else if (location.name.includes('Library')) {
        hours = { open: '08:00', close: '20:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }
      }
    } else if (location.category === 'administrative') {
      hours = { open: '08:00', close: '16:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
    }

    return hours
  }

  // Check if location is currently open
  function isLocationOpen(location: CampusLocation): boolean {
    const now = new Date()
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
    const currentTime = now.toTimeString().slice(0, 5)
    
    const hours = getHoursForLocation(location)
    
    return hours.days.includes(currentDay) && 
           currentTime >= hours.open && 
           currentTime <= hours.close
  }

  // Get location popularity (simulated)
  function getLocationPopularity(locationId: number): number {
    const popularLocations = [1, 2, 10, 11, 19, 21] // Main Gate, COSIT, Senate, ICT, Clinic, COSMAS
    return popularLocations.includes(locationId) ? Math.random() * 0.3 + 0.7 : Math.random() * 0.7
  }

  // Filter and search locations
  const filteredLocations = useMemo(() => {
    let results = enhancedLocations

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(location =>
        location.name.toLowerCase().includes(query) ||
        location.shortName.toLowerCase().includes(query) ||
        location.description.toLowerCase().includes(query) ||
        location.facilities.some(facility => facility.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (filters.category.length > 0) {
      results = results.filter(location => filters.category.includes(location.category))
    }

    // Facilities filter
    if (filters.facilities.length > 0) {
      results = results.filter(location =>
        filters.facilities.some(facility => location.facilities.includes(facility))
      )
    }

    // Accessibility filter
    if (filters.accessibility) {
      results = results.filter(location => location.facilities.includes('Accessibility'))
    }

    // Open now filter
    if (filters.openNow) {
      results = results.filter(location => location.isOpen)
    }

    // Sort by popularity and relevance
    return results.sort((a, b) => {
      if (searchQuery.trim()) {
        // Prioritize exact matches
        const aExact = a.shortName.toLowerCase() === searchQuery.toLowerCase()
        const bExact = b.shortName.toLowerCase() === searchQuery.toLowerCase()
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
      }
      
      // Then by popularity
      return b.popularity - a.popularity
    })
  }, [searchQuery, filters, enhancedLocations])

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      const allTerms = [
        ...enhancedLocations.map(loc => loc.name),
        ...enhancedLocations.map(loc => loc.shortName),
        ...enhancedLocations.flatMap(loc => loc.facilities),
        'Library', 'Computer Lab', 'Cafeteria', 'Parking', 'ATM', 'WiFi'
      ]
      
      const matches = allTerms
        .filter(term => term.toLowerCase().includes(searchQuery.toLowerCase()) && term.toLowerCase() !== searchQuery.toLowerCase())
        .slice(0, 5)
      
      setSuggestions(Array.from(new Set(matches)))
    } else {
      setSuggestions([])
    }
  }, [searchQuery, enhancedLocations])

  const handleLocationClick = (location: LocationWithFacilities) => {
    onLocationSelect(location.id)
    
    // Add to recent searches
    const newSearch = location.shortName
    setRecentSearches(prev => {
      const updated = [newSearch, ...prev.filter(s => s !== newSearch)].slice(0, 5)
      localStorage.setItem('tasued-recent-searches', JSON.stringify(updated))
      return updated
    })
  }

  const toggleFilter = (type: keyof SearchFilter, value: string | boolean) => {
    setFilters(prev => {
      if (type === 'accessibility' || type === 'openNow') {
        return { ...prev, [type]: !prev[type] }
      } else {
        const currentArray = prev[type] as string[]
        const newArray = currentArray.includes(value as string)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value as string]
        return { ...prev, [type]: newArray }
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      facilities: [],
      accessibility: false,
      openNow: false
    })
  }

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'wifi': return <Wifi className="h-3 w-3" />
      case 'parking': return <Car className="h-3 w-3" />
      case 'accessibility': return <Accessibility className="h-3 w-3" />
      case 'books': return <Book className="h-3 w-3" />
      case 'cafeteria': return <Coffee className="h-3 w-3" />
      default: return <Building className="h-3 w-3" />
    }
  }

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('tasued-recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Enhanced Search
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search locations, facilities, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-gray-600">Suggestions:</p>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setSearchQuery(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchQuery && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-600">Recent Searches</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filters</h4>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

            {/* Category Filter */}
            <div>
              <p className="text-xs text-gray-600 mb-2">Category</p>
              <div className="flex flex-wrap gap-1">
                {['academic', 'administrative', 'facility', 'entrance'].map(category => (
                  <Button
                    key={category}
                    variant={filters.category.includes(category) ? "default" : "outline"}
                    size="sm"
                    className="h-6 text-xs capitalize"
                    onClick={() => toggleFilter('category', category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Facilities Filter */}
            <div>
              <p className="text-xs text-gray-600 mb-2">Facilities</p>
              <div className="flex flex-wrap gap-1">
                {['WiFi', 'Parking', 'Computers', 'Books', 'Medical'].map(facility => (
                  <Button
                    key={facility}
                    variant={filters.facilities.includes(facility) ? "default" : "outline"}
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => toggleFilter('facilities', facility)}
                  >
                    {getFacilityIcon(facility)}
                    <span className="ml-1">{facility}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <Button
                variant={filters.accessibility ? "default" : "outline"}
                size="sm"
                className="h-6 text-xs"
                onClick={() => toggleFilter('accessibility', true)}
              >
                <Accessibility className="h-3 w-3 mr-1" />
                Accessible
              </Button>
              <Button
                variant={filters.openNow ? "default" : "outline"}
                size="sm"
                className="h-6 text-xs"
                onClick={() => toggleFilter('openNow', true)}
              >
                <Clock className="h-3 w-3 mr-1" />
                Open Now
              </Button>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedStart === location.id || selectedEnd === location.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200'
              }`}
              onClick={() => handleLocationClick(location)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{location.shortName}</h4>
                    {location.isOpen && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        Open
                      </Badge>
                    )}
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full mr-0.5 ${
                            i < Math.floor(location.popularity * 5) ? 'bg-yellow-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{location.description}</p>
                  
                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1">
                    {location.facilities.slice(0, 4).map((facility, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {getFacilityIcon(facility)}
                        <span className="ml-1">{facility}</span>
                      </Badge>
                    ))}
                    {location.facilities.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{location.facilities.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-right ml-2">
                  <div className="text-xs text-gray-600">
                    {location.hours.open} - {location.hours.close}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredLocations.length === 0 && searchQuery && (
            <div className="text-center py-4 text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No locations found matching your search</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}