"use client"

import { useState } from 'react'
import { Navigation, MapPin, Clock, Phone, Info, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { campusLocations } from '@/lib/campus-data'

interface QuickActionsProps {
  onLocationSelect: (locationId: number) => void
  onRouteSelect: (startId: number, endId: number) => void
}

export default function QuickActions({ onLocationSelect, onRouteSelect }: QuickActionsProps) {
  const [activeTab, setActiveTab] = useState<'locations' | 'routes' | 'info'>('locations')

  const popularLocations = [
    { id: 1, name: "Main Gate", icon: "🚪", description: "University entrance" },
    { id: 2, name: "COSIT", icon: "🎓", description: "Science Complex" },
    { id: 10, name: "Senate", icon: "🏛️", description: "Administrative center" },
    { id: 11, name: "ICT Centre", icon: "💻", description: "Computer facilities" },
    { id: 19, name: "Clinic", icon: "🏥", description: "Medical services" },
    { id: 21, name: "COSMAS", icon: "🧮", description: "Mathematics & Statistics" }
  ]

  const popularRoutes = [
    { from: 1, to: 21, fromName: "Main Gate", toName: "COSMAS", description: "Entrance to Math building" },
    { from: 1, to: 10, fromName: "Main Gate", toName: "Senate", description: "Entrance to Admin" },
    { from: 1, to: 11, fromName: "Main Gate", toName: "ICT Centre", description: "Entrance to Computer lab" },
    { from: 2, to: 19, fromName: "COSIT", toName: "Clinic", description: "Science to Medical" },
    { from: 10, to: 21, fromName: "Senate", toName: "COSMAS", description: "Admin to Math" },
    { from: 11, to: 19, fromName: "ICT Centre", toName: "Clinic", description: "Computer lab to Medical" }
  ]

  const campusInfo = [
    { icon: MapPin, label: "Total Locations", value: "21 Buildings" },
    { icon: Clock, label: "Campus Hours", value: "6:00 AM - 10:00 PM" },
    { icon: Phone, label: "Emergency", value: "+234 (0) 39 243 688" },
    { icon: Info, label: "Established", value: "2005" }
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
        <CardDescription className="text-sm">
          Fast access to popular locations and routes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          {[
            { key: 'locations', label: 'Locations', icon: MapPin },
            { key: 'routes', label: 'Routes', icon: Navigation },
            { key: 'info', label: 'Info', icon: Info }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'locations' && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Popular Locations</h3>
            <div className="grid grid-cols-1 gap-2">
              {popularLocations.map((location) => (
                <Button
                  key={location.id}
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2 h-auto py-2 text-left"
                  onClick={() => onLocationSelect(location.id)}
                >
                  <span className="text-base">{location.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs sm:text-sm truncate">{location.name}</div>
                    <div className="text-xs text-gray-500 truncate">{location.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Popular Routes</h3>
            <div className="space-y-2">
              {popularRoutes.map((route, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 h-auto py-2 text-left"
                  onClick={() => onRouteSelect(route.from, route.to)}
                >
                  <Navigation className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs sm:text-sm truncate">
                      {route.fromName} → {route.toName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{route.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Campus Information</h3>
            <div className="space-y-3">
              {campusInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <info.icon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">{info.label}</div>
                    <div className="font-medium text-sm">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center gap-2"
                onClick={() => window.open('https://tasued.edu.ng', '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
                <span className="text-xs">Visit TASUED Website</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}