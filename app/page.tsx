"use client"

import { useState, useEffect, useCallback } from 'react'
import { MapPin, Menu, X, Info, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CampusMap from '@/components/campus-map'
import LocationSearch from '@/components/location-search'
import RoutePlanner from '@/components/route-planner'
import MobileNavigation from '@/components/mobile-navigation'
import QuickActions from '@/components/quick-actions'
import AdvancedNavigation from '@/components/advanced-navigation'
import LiveLocation from '@/components/live-location'
import EnhancedSearch from '@/components/enhanced-search'
import CampusInfo from '@/components/campus-info'
import NavigationHeader from '@/components/modern-ui/navigation-header'
import FloatingPanel from '@/components/modern-ui/floating-panel'
import FloatingActionButton from '@/components/modern-ui/floating-action-button'
import BottomSheet from '@/components/modern-ui/bottom-sheet'
import GlassCard from '@/components/modern-ui/glass-card'
import { dijkstraShortestPath } from '@/lib/dijkstra'
import { campusLocations } from '@/lib/campus-data'

export default function Home() {
  const [selectedStart, setSelectedStart] = useState<number>()
  const [selectedEnd, setSelectedEnd] = useState<number>()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start')
  const [pathResult, setPathResult] = useState<any>(null)
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [navigationSteps, setNavigationSteps] = useState<any[]>([])
  const [isNavigating, setIsNavigating] = useState(false)
  const [userLocation, setUserLocation] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online')
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [selectedLocationDetails, setSelectedLocationDetails] = useState<any>(null)
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'info' | 'warning' | 'error'}>>([])
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false)
  const addNotification = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }, [])

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online')
    const handleOffline = () => setConnectionStatus('offline')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Monitor screen size for smart responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    // Check immediately on mount
    checkScreenSize()
    
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault()
            handlePanelToggle('search')
            break
          case 'n':
            e.preventDefault()
            handlePanelToggle('navigation')
            break
          case 'i':
            e.preventDefault()
            handlePanelToggle('info')
            break
          case 'r':
            e.preventDefault()
            resetRoute()
            break
        }
      }
      
      if (e.key === 'Escape') {
        setSelectedLocationDetails(null)
        setActivePanel(null)
        setShowBottomSheet(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Calculate path when start and end are selected
  useEffect(() => {
    if (selectedStart && selectedEnd && selectedStart !== selectedEnd) {
      setIsCalculatingRoute(true)
      
      // Add a small delay to show loading state
      setTimeout(() => {
        try {
          const result = dijkstraShortestPath(selectedStart, selectedEnd)
          console.log('Route calculation result:', result)
          
          if (result.found && result.path.length > 0) {
            setPathResult(result)
            const startLocation = campusLocations.find(loc => loc.id === selectedStart)
            const endLocation = campusLocations.find(loc => loc.id === selectedEnd)
            addNotification(
              `Route found: ${startLocation?.shortName} → ${endLocation?.shortName} (${Math.round(result.totalDistance)}m, ${Math.round(result.totalTime)} min)`, 
              'success'
            )
          } else {
            setPathResult(null)
            addNotification('No route found between selected locations. Please try different locations.', 'warning')
          }
        } catch (error) {
          console.error('Route calculation error:', error)
          setPathResult(null)
          addNotification('Error calculating route. Please try again.', 'error')
        }
        
        setIsCalculatingRoute(false)
      }, 500)
    } else {
      setPathResult(null)
      setIsCalculatingRoute(false)
    }
  }, [selectedStart, selectedEnd, addNotification])

  const handleQuickLocationSelect = (locationId: number) => {
    if (!selectedStart) {
      setSelectedStart(locationId)
      setSelectionMode('end')
    } else if (!selectedEnd) {
      setSelectedEnd(locationId)
      setSelectionMode('start')
    } else {
      // If both are selected, replace the current selection mode target
      if (selectionMode === 'start') {
        setSelectedStart(locationId)
        setSelectionMode('end')
      } else {
        setSelectedEnd(locationId)
        setSelectionMode('start')
      }
    }
  }

  const handleQuickRouteSelect = (startId: number, endId: number) => {
    setSelectedStart(startId)
    setSelectedEnd(endId)
    setSelectionMode('start')
    
    const startLocation = campusLocations.find(loc => loc.id === startId)
    const endLocation = campusLocations.find(loc => loc.id === endId)
    addNotification(`Route set: ${startLocation?.shortName} → ${endLocation?.shortName}`, 'success')
  }

  const handleRouteSelect = (route: any) => {
    setSelectedRoute(route)
  }

  const handleNavigationStart = (steps: any[]) => {
    setNavigationSteps(steps)
    setIsNavigating(true)
  }

  const handleLocationUpdate = (location: any) => {
    setUserLocation(location)
  }

  const handlePanelToggle = useCallback((panelId: string) => {
    if (isMobile) {
      // On mobile, always use bottom sheet
      setShowBottomSheet(true)
    } else {
      // On desktop/tablet, use floating panels
      setActivePanel(activePanel === panelId ? null : panelId)
    }
  }, [isMobile, activePanel])

  const handleLocationSelect = (locationId: number) => {
    const location = campusLocations.find(loc => loc.id === locationId)
    setSelectedLocationDetails(location)
    
    if (selectionMode === 'start') {
      setSelectedStart(locationId)
      setSelectionMode('end')
    } else {
      setSelectedEnd(locationId)
      setSelectionMode('start')
    }
  }

  const handleSwapLocations = () => {
    const temp = selectedStart
    setSelectedStart(selectedEnd)
    setSelectedEnd(temp)
  }

  const resetRoute = useCallback(() => {
    setSelectedStart(undefined)
    setSelectedEnd(undefined)
    setSelectionMode('start')
    setPathResult(null)
    addNotification('Route cleared', 'info')
  }, [addNotification])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Navigation Header - Smart responsive positioning */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-4'
      }`}>
        <NavigationHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          isMenuOpen={sidebarOpen}
          userLocation={userLocation}
          connectionStatus={connectionStatus}
          onSearch={() => handlePanelToggle('search')}
          onSettings={() => handlePanelToggle('settings')}
          onProfile={() => handlePanelToggle('profile')}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      </div>

      {/* Main Map Container - Smart responsive height */}
      <div className={`w-full transition-all duration-300 ${
        isMobile 
          ? 'pt-14 h-screen pb-16' // Mobile: account for header and bottom bar
          : isTablet 
            ? 'pt-16 h-screen pb-4' // Tablet: more space for header
            : 'pt-20 h-screen' // Desktop: full space
      }`}>
        <CampusMap
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
          onLocationSelect={handleLocationSelect}
          selectedRoute={selectedRoute}
          userLocation={userLocation}
          navigationSteps={navigationSteps}
          isNavigating={isNavigating}
        />
      </div>

      {/* Smart Floating Panels - Desktop and Tablet only */}
      {!isMobile && (
        <div className="hidden md:block">
          <FloatingPanel
            isOpen={activePanel === 'navigation'}
            onClose={() => setActivePanel(null)}
            title="Navigation"
            position="left"
            size={isTablet ? "md" : "lg"}
            className={`max-h-[calc(100vh-8rem)] overflow-hidden transition-all duration-300 ${
              isTablet ? 'w-80' : 'w-96'
            }`}
          >
            <div className="space-y-4 p-4 overflow-y-auto custom-scrollbar max-h-[calc(100vh-12rem)]">
              <QuickActions
                onLocationSelect={handleQuickLocationSelect}
                onRouteSelect={handleQuickRouteSelect}
              />
              
              <AdvancedNavigation
                selectedStart={selectedStart}
                selectedEnd={selectedEnd}
                onRouteSelect={handleRouteSelect}
                onNavigationStart={handleNavigationStart}
              />
              
              <LiveLocation
                onLocationUpdate={handleLocationUpdate}
                isNavigating={isNavigating}
              />
            </div>
          </FloatingPanel>

          <FloatingPanel
            isOpen={activePanel === 'search'}
            onClose={() => setActivePanel(null)}
            title="Search & Explore"
            position="right"
            size={isTablet ? "sm" : "md"}
            className={`max-h-[calc(100vh-8rem)] overflow-hidden transition-all duration-300 ${
              isTablet ? 'w-72' : 'w-80'
            }`}
          >
            <div className="p-4 overflow-y-auto custom-scrollbar max-h-[calc(100vh-12rem)]">
              <EnhancedSearch
                onLocationSelect={handleLocationSelect}
                selectedStart={selectedStart}
                selectedEnd={selectedEnd}
              />
            </div>
          </FloatingPanel>

          <FloatingPanel
            isOpen={activePanel === 'info'}
            onClose={() => setActivePanel(null)}
            title="Campus Information"
            position="right"
            size={isTablet ? "md" : "lg"}
            className={`max-h-[calc(100vh-8rem)] overflow-hidden transition-all duration-300 ${
              isTablet ? 'w-80' : 'w-96'
            }`}
          >
            <div className="p-4 overflow-y-auto custom-scrollbar max-h-[calc(100vh-12rem)]">
              <CampusInfo />
            </div>
          </FloatingPanel>
        </div>
      )}

      {/* Smart Bottom Sheet - Mobile only */}
      {isMobile && (
        <BottomSheet
          isOpen={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          title="Navigation Options"
          snapPoints={[30, 60, 90]}
          defaultSnap={1}
          className="md:hidden"
        >
          <div className="space-y-4 pb-8">
            <QuickActions
              onLocationSelect={handleQuickLocationSelect}
              onRouteSelect={handleQuickRouteSelect}
            />
            
            <AdvancedNavigation
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
              onRouteSelect={handleRouteSelect}
              onNavigationStart={handleNavigationStart}
            />
            
            <EnhancedSearch
              onLocationSelect={handleLocationSelect}
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
            />
            
            <LiveLocation
              onLocationUpdate={handleLocationUpdate}
              isNavigating={isNavigating}
            />
            
            <CampusInfo />
          </div>
        </BottomSheet>
      )}

      {/* Enhanced Notifications */}
      <div className="fixed top-4 right-4 z-[70] space-y-3 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-xl shadow-floating backdrop-blur-md border animate-in slide-in-from-right-5 duration-300 ${
              notification.type === 'success' ? 'bg-green-50/95 border-green-200/50 text-green-800' :
              notification.type === 'error' ? 'bg-red-50/95 border-red-200/50 text-red-800' :
              notification.type === 'warning' ? 'bg-yellow-50/95 border-yellow-200/50 text-yellow-800' :
              'bg-blue-50/95 border-blue-200/50 text-blue-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                notification.type === 'success' ? 'bg-green-500' :
                notification.type === 'error' ? 'bg-red-500' :
                notification.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}>
                {notification.type === 'success' && <div className="w-2 h-2 bg-white rounded-full" />}
                {notification.type === 'error' && <X className="w-3 h-3 text-white" />}
                {notification.type === 'warning' && <div className="w-2 h-2 bg-white rounded-full" />}
                {notification.type === 'info' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-relaxed">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Location Details Popup */}
      {selectedLocationDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedLocationDetails(null)} />
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl max-w-md w-full max-h-[80vh] overflow-hidden border border-white/20 scale-in">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLocationDetails.name}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedLocationDetails.description}</p>
                </div>
                <button
                  onClick={() => setSelectedLocationDetails(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4 flex-shrink-0"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    style={{ backgroundColor: selectedLocationDetails.color }}
                  >
                    {selectedLocationDetails.id}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-gray-900">Location #{selectedLocationDetails.id}</p>
                    <p className="text-sm text-gray-600 capitalize font-medium">{selectedLocationDetails.category}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Coordinates
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/70 rounded-lg p-3">
                      <div className="text-xs text-gray-600 font-medium">Latitude</div>
                      <div className="font-mono font-bold text-gray-900">{selectedLocationDetails.coordinates[0].toFixed(6)}</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                      <div className="text-xs text-gray-600 font-medium">Longitude</div>
                      <div className="font-mono font-bold text-gray-900">{selectedLocationDetails.coordinates[1].toFixed(6)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedStart(selectedLocationDetails.id)
                      setSelectionMode('end')
                      setSelectedLocationDetails(null)
                    }}
                    className="flex-1 px-4 py-3 gradient-success text-white rounded-xl text-sm font-bold hover:shadow-floating transition-all duration-300 flex items-center justify-center gap-2 btn-modern"
                  >
                    <MapPin className="h-4 w-4" />
                    Set as Start
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEnd(selectedLocationDetails.id)
                      setSelectionMode('start')
                      setSelectedLocationDetails(null)
                    }}
                    className="flex-1 px-4 py-3 gradient-danger text-white rounded-xl text-sm font-bold hover:shadow-floating transition-all duration-300 flex items-center justify-center gap-2 btn-modern"
                  >
                    <MapPin className="h-4 w-4" />
                    Set as End
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Quick Action Panel - Desktop/Tablet */}
      {!isMobile && (
        <div className="fixed top-20 left-4 z-40 space-y-4 animate-in slide-in-from-left-5">
          {/* Main Quick Actions */}
          <div className="glass-panel rounded-2xl p-4 min-w-[280px] scale-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h3 className="text-base font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => handlePanelToggle('navigation')}
                className="w-full px-4 py-3 gradient-primary text-white rounded-xl text-sm font-medium hover:shadow-floating transition-all duration-300 flex items-center gap-3 group btn-modern"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Navigation</span>
              </button>
              <button 
                onClick={() => handlePanelToggle('search')}
                className="w-full px-4 py-3 gradient-success text-white rounded-xl text-sm font-medium hover:shadow-floating transition-all duration-300 flex items-center gap-3 group btn-modern"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Info className="h-4 w-4" />
                </div>
                <span>Search</span>
              </button>
              <button 
                onClick={() => handlePanelToggle('info')}
                className="w-full px-4 py-3 gradient-info text-white rounded-xl text-sm font-medium hover:shadow-floating transition-all duration-300 flex items-center gap-3 group btn-modern"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Info className="h-4 w-4" />
                </div>
                <span>Campus Info</span>
              </button>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="glass-panel rounded-2xl p-4 fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="text-sm font-bold text-gray-900">Popular Routes</h3>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => handleQuickRouteSelect(1, 5)}
                className="w-full px-3 py-2.5 text-xs text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 rounded-lg transition-all duration-200 text-left font-medium interactive-subtle"
              >
                Main Gate → COSIT
              </button>
              <button 
                onClick={() => handleQuickRouteSelect(1, 8)}
                className="w-full px-3 py-2.5 text-xs text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 rounded-lg transition-all duration-200 text-left font-medium interactive-subtle"
              >
                Main Gate → Library
              </button>
              <button 
                onClick={() => handleQuickRouteSelect(2, 12)}
                className="w-full px-3 py-2.5 text-xs text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 rounded-lg transition-all duration-200 text-left font-medium interactive-subtle"
              >
                Admin → Student Affairs
              </button>
              <button 
                onClick={() => handleQuickRouteSelect(8, 15)}
                className="w-full px-3 py-2.5 text-xs text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 rounded-lg transition-all duration-200 text-left font-medium interactive-subtle"
              >
                Library → Cafeteria
              </button>
            </div>
          </div>

          {/* Campus Stats */}
          <div className="glass-panel rounded-2xl p-4 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <h3 className="text-sm font-bold text-gray-900">Campus Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 text-center">
                <div className="text-blue-600 font-medium">Locations</div>
                <div className="text-xl font-bold text-blue-900">21</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 text-center">
                <div className="text-green-600 font-medium">Academic</div>
                <div className="text-xl font-bold text-green-900">8</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 text-center">
                <div className="text-purple-600 font-medium">Facilities</div>
                <div className="text-xl font-bold text-purple-900">7</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-2 text-center">
                <div className="text-emerald-600 font-medium">Status</div>
                <div className="text-sm font-bold text-emerald-900">Online</div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="glass-panel rounded-2xl p-4 fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <h3 className="text-sm font-bold text-gray-900">Shortcuts</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Search:</span>
                <kbd className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md text-xs font-mono shadow-sm">Ctrl+K</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Navigation:</span>
                <kbd className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md text-xs font-mono shadow-sm">Ctrl+N</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Campus Info:</span>
                <kbd className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md text-xs font-mono shadow-sm">Ctrl+I</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Clear Route:</span>
                <kbd className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md text-xs font-mono shadow-sm">Ctrl+R</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Close:</span>
                <kbd className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md text-xs font-mono shadow-sm">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Floating Action Button */}
      {/* Smart Floating Action Button */}
      <div className={`fixed z-50 transition-all duration-300 ${
        isMobile 
          ? 'bottom-20 right-4' // Mobile: above bottom bar
          : isTablet 
            ? 'bottom-6 right-6' // Tablet: standard position
            : 'bottom-8 right-8' // Desktop: more space
      }`}>
        <FloatingActionButton
          actions={[
            {
              id: 'navigation',
              icon: <MapPin className="h-4 w-4" />,
              label: 'Navigation',
              onClick: () => handlePanelToggle('navigation'),
              color: 'bg-blue-600 hover:bg-blue-700'
            },
            {
              id: 'search',
              icon: <Info className="h-4 w-4" />,
              label: 'Search',
              onClick: () => handlePanelToggle('search'),
              color: 'bg-green-600 hover:bg-green-700'
            },
            {
              id: 'info',
              icon: <Info className="h-4 w-4" />,
              label: 'Campus Info',
              onClick: () => handlePanelToggle('info'),
              color: 'bg-purple-600 hover:bg-purple-700'
            }
          ]}
          position="bottom-right"
          size={isMobile ? "sm" : isTablet ? "md" : "lg"}
        />
      </div>

      {/* Route Planning Instructions - Show when no locations selected */}
      {!selectedStart && !selectedEnd && (
        <div className={`fixed z-30 transition-all duration-500 ${
          isMobile 
            ? 'bottom-20 left-2 right-16'
            : isTablet 
              ? 'bottom-6 left-4 right-20'
              : 'bottom-6 left-auto right-6 w-96'
        }`}>
          <div className="glass-panel rounded-2xl p-4 scale-in">
            <div className={`space-y-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <h3 className={`font-bold text-gray-900 ${
                  isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
                }`}>
                  Campus Navigation
                </h3>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h4 className="text-sm font-bold text-gray-800">How to Plan a Route</h4>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Click your starting location</p>
                      <p className="text-xs text-gray-600">Choose any numbered marker on the map (1-21)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Click your destination</p>
                      <p className="text-xs text-gray-600">Select a different numbered marker</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">View your route</p>
                      <p className="text-xs text-gray-600">See distance, time, and step-by-step directions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Try These Sample Routes</h4>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => handleQuickRouteSelect(1, 2)}
                    className="text-left px-3 py-2 bg-white/70 hover:bg-white rounded-lg transition-colors text-xs font-medium flex items-center justify-between"
                  >
                    <span>Main Gate → COSIT</span>
                    <span className="text-blue-600 font-bold">Try Now</span>
                  </button>
                  <button 
                    onClick={() => handleQuickRouteSelect(1, 12)}
                    className="text-left px-3 py-2 bg-white/70 hover:bg-white rounded-lg transition-colors text-xs font-medium flex items-center justify-between"
                  >
                    <span>Main Gate → Lecture Theatre</span>
                    <span className="text-blue-600 font-bold">Try Now</span>
                  </button>
                  <button 
                    onClick={() => handleQuickRouteSelect(8, 15)}
                    className="text-left px-3 py-2 bg-white/70 hover:bg-white rounded-lg transition-colors text-xs font-medium flex items-center justify-between"
                  >
                    <span>COVTED → COHUM</span>
                    <span className="text-blue-600 font-bold">Try Now</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">Tips</h4>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Click on any numbered circle (1-21) on the map</li>
                  <li>• Selected markers will turn red and show larger</li>
                  <li>• Route will appear as a red dashed line</li>
                  <li>• All 21 campus locations are connected</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Route Information Overlay */}
      {(selectedStart && selectedEnd && selectedStart !== selectedEnd) ? (
        <div className={`fixed z-30 transition-all duration-500 ${
          isMobile 
            ? 'bottom-20 left-2 right-16' // Mobile: above bottom bar, avoid FAB
            : isTablet 
              ? 'bottom-6 left-4 right-20' // Tablet: standard positioning
              : 'bottom-6 left-auto right-6 w-96' // Desktop: fixed width on right
        }`}>
          <div className="glass-panel rounded-2xl p-4 scale-in">
            <div className={`space-y-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <h3 className={`font-bold text-gray-900 ${
                    isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
                  }`}>
                    {isCalculatingRoute ? 'Calculating Route...' : 'Active Route'}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetRoute}
                  className={`hover:bg-red-50 hover:text-red-600 transition-colors ${
                    isMobile ? 'text-xs h-6 px-2' : isTablet ? 'text-xs h-7 px-3' : 'text-sm h-8 px-3'
                  }`}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
              
              {isCalculatingRoute ? (
                <div className="flex items-center justify-center py-8">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                    <div className="absolute inset-0 rounded-full border-3 border-blue-200 animate-pulse"></div>
                  </div>
                </div>
              ) : pathResult ? (
                <>
                  <div className={`grid grid-cols-3 gap-3 ${
                    isMobile ? 'gap-2' : 'gap-3'
                  }`}>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                      <div className="text-blue-600 font-medium text-xs mb-1">Distance</div>
                      <div className={`font-bold text-blue-900 ${
                        isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
                      }`}>
                        {Math.round(pathResult.totalDistance)}m
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                      <div className="text-green-600 font-medium text-xs mb-1">Time</div>
                      <div className={`font-bold text-green-900 ${
                        isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
                      }`}>
                        {Math.round(pathResult.totalTime)} min
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                      <div className="text-purple-600 font-medium text-xs mb-1">Stops</div>
                      <div className={`font-bold text-purple-900 ${
                        isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
                      }`}>
                        {pathResult.path?.length || 0}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Route Path Details */}
                  {pathResult.path && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <h4 className="text-sm font-bold text-gray-700">Route Path</h4>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {pathResult.path.map((locationId: number, index: number) => {
                          const location = campusLocations.find((loc: any) => loc.id === locationId)
                          const isStart = index === 0
                          const isEnd = index === pathResult.path.length - 1
                          return (
                            <div key={locationId} className="flex items-center gap-3 p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                isStart ? 'bg-green-500' : isEnd ? 'bg-red-500' : 'bg-blue-500'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="text-sm font-medium text-gray-800 truncate">
                                {location?.shortName || `Location ${locationId}`}
                              </span>
                              {isStart && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Start</span>}
                              {isEnd && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">End</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">No route calculated</p>
                  <p className="text-xs text-gray-400 mt-1">Select two locations to plan a route</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (selectedStart || selectedEnd) ? (
        // Show guidance when only one location is selected
        <div className={`fixed z-30 transition-all duration-500 ${
          isMobile 
            ? 'bottom-20 left-2 right-16'
            : isTablet 
              ? 'bottom-6 left-4 right-20'
              : 'bottom-6 left-auto right-6 w-96'
        }`}>
          <div className="glass-panel rounded-2xl p-4 scale-in">
            <div className={`space-y-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <h3 className={`font-bold text-gray-900 ${
                  isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
                }`}>
                  Route Planning
                </h3>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2">
                  {selectedStart && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {selectedStart}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {campusLocations.find(loc => loc.id === selectedStart)?.shortName}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Start</span>
                    </div>
                  )}
                  {selectedEnd && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {selectedEnd}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {campusLocations.find(loc => loc.id === selectedEnd)?.shortName}
                      </span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">End</span>
                    </div>
                  )}
                </div>
                
                <div className="text-center py-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {selectedStart ? 'Select destination location' : 'Select starting location'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Click any numbered marker on the map
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetRoute}
                  className="flex-1 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile Quick Access Bar - Only on small screens */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2">
        <div className="flex justify-around items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBottomSheet(true)}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Menu className="h-4 w-4" />
            <span className="text-xs">Menu</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePanelToggle('search')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Info className="h-4 w-4" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetRoute}
            className="flex flex-col items-center gap-1 h-auto py-2"
            disabled={!selectedStart && !selectedEnd}
          >
            <X className="h-4 w-4" />
            <span className="text-xs">Clear</span>
          </Button>
        </div>
      </div>

      {/* Legacy Mobile Navigation (hidden) */}
      <div className="hidden">
        <MobileNavigation
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
          pathResult={pathResult}
          onClearRoute={resetRoute}
        />
      </div>
    </div>
  )
}