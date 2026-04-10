"use client"

import { useState } from 'react'
import { Menu, X, Search, Settings, User, Bell, MapPin } from 'lucide-react'
import AnimatedButton from './animated-button'
import GlassCard from './glass-card'
import StatusIndicator from './status-indicator'

interface NavigationHeaderProps {
  onMenuToggle: () => void
  isMenuOpen: boolean
  userLocation?: any
  connectionStatus: 'online' | 'offline'
  onSearch?: () => void
  onSettings?: () => void
  onProfile?: () => void
  isMobile?: boolean
  isTablet?: boolean
}

export default function NavigationHeader({
  onMenuToggle,
  isMenuOpen,
  userLocation,
  connectionStatus,
  onSearch,
  onSettings,
  onProfile,
  isMobile = false,
  isTablet = false
}: NavigationHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <GlassCard 
      variant="elevated" 
      padding={isMobile ? "xs" : "sm"}
      className={`w-full transition-all duration-300 ${
        isMobile ? 'rounded-lg' : isTablet ? 'rounded-xl' : 'rounded-2xl'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <AnimatedButton
            variant="glass"
            size={isMobile ? "xs" : "sm"}
            animation="bounce"
            onClick={onMenuToggle}
            icon={isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          >
            {!isMobile && (
              <span className="hidden sm:inline">
                {isMenuOpen ? 'Close' : 'Menu'}
              </span>
            )}
          </AnimatedButton>

          {/* Logo/Title - Adaptive sizing */}
          <div className="flex items-center gap-2">
            <div className={`bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center ${
              isMobile ? 'w-6 h-6' : isTablet ? 'w-7 h-7' : 'w-8 h-8'
            }`}>
              <MapPin className={`text-white ${
                isMobile ? 'h-3 w-3' : isTablet ? 'h-3.5 w-3.5' : 'h-4 w-4'
              }`} />
            </div>
            {!isMobile && (
              <div className="hidden sm:block">
                <h1 className={`font-bold text-gray-900 ${
                  isTablet ? 'text-sm' : 'text-base'
                }`}>TASUED Navigator</h1>
                <p className={`text-gray-600 ${
                  isTablet ? 'text-xs' : 'text-xs'
                }`}>Campus Navigation</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Section - Search (Desktop only) */}
        {!isMobile && !isTablet && (
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <AnimatedButton
              variant="glass"
              size="sm"
              animation="glow"
              onClick={onSearch}
              className="w-full justify-start"
              icon={<Search className="h-4 w-4" />}
            >
              Search locations, facilities...
            </AnimatedButton>
          </div>
        )}

        {/* Right Section - Adaptive controls */}
        <div className={`flex items-center ${
          isMobile ? 'gap-1' : isTablet ? 'gap-1.5' : 'gap-2'
        }`}>
          {/* Connection Status - Hidden on mobile */}
          {!isMobile && (
            <StatusIndicator
              status={connectionStatus}
              label={connectionStatus === 'online' ? 'Online' : 'Offline'}
              size="sm"
              className="hidden sm:flex"
            />
          )}

          {/* Location Status - Tablet and desktop only */}
          {!isMobile && userLocation && (
            <StatusIndicator
              status="success"
              label="GPS Active"
              size="sm"
              className="hidden md:flex"
            />
          )}

          {/* Notifications - Always visible but smaller on mobile */}
          <div className="relative">
            <AnimatedButton
              variant="ghost"
              size={isMobile ? "xs" : "sm"}
              animation="bounce"
              onClick={() => setShowNotifications(!showNotifications)}
              icon={<Bell className={`${
                isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'
              }`} />}
            >
              {/* Empty children for icon-only button */}
            </AnimatedButton>
            <div className={`absolute -top-1 -right-1 bg-red-500 rounded-full animate-pulse ${
              isMobile ? 'w-2 h-2' : 'w-3 h-3'
            }`} />
          </div>

          {/* Settings - Hidden on mobile */}
          {!isMobile && (
            <AnimatedButton
              variant="ghost"
              size={isTablet ? "xs" : "sm"}
              animation="bounce"
              onClick={onSettings}
              icon={<Settings className="h-4 w-4" />}
              className="hidden sm:inline-flex"
            >
              {/* Empty children for icon-only button */}
            </AnimatedButton>
          )}

          {/* Profile - Hidden on mobile */}
          {!isMobile && (
            <AnimatedButton
              variant="ghost"
              size={isTablet ? "xs" : "sm"}
              animation="bounce"
              onClick={onProfile}
              icon={<User className="h-4 w-4" />}
              className="hidden sm:inline-flex"
            >
              {/* Empty children for icon-only button */}
            </AnimatedButton>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Search - Below main header */}
      {(isMobile || isTablet) && (
        <div className={`pt-3 border-t border-gray-100 ${
          isMobile ? 'mt-2' : 'mt-3'
        }`}>
          <AnimatedButton
            variant="glass"
            size={isMobile ? "xs" : "sm"}
            animation="glow"
            onClick={onSearch}
            className="w-full justify-start"
            icon={<Search className="h-4 w-4" />}
          >
            {isMobile ? 'Search...' : 'Search locations, facilities...'}
          </AnimatedButton>
        </div>
      )}

      {/* Notifications Dropdown - Responsive positioning */}
      {showNotifications && (
        <div className={`absolute top-full mt-2 ${
          isMobile 
            ? 'left-0 right-0' 
            : isTablet 
              ? 'right-0 w-72' 
              : 'right-0 w-80'
        } max-w-sm z-50`}>
          <GlassCard variant="elevated" padding={isMobile ? "sm" : "md"}>
            <h3 className={`font-semibold mb-3 ${
              isMobile ? 'text-sm' : 'text-base'
            }`}>Notifications</h3>
            <div className="space-y-2">
              <div className={`bg-blue-50 rounded-lg ${
                isMobile ? 'p-2' : 'p-2'
              }`}>
                <p className={`font-medium ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>New route available</p>
                <p className={`text-gray-600 ${
                  isMobile ? 'text-xs' : 'text-xs'
                }`}>Faster route to COSIT discovered</p>
              </div>
              <div className={`bg-yellow-50 rounded-lg ${
                isMobile ? 'p-2' : 'p-2'
              }`}>
                <p className={`font-medium ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>Parking update</p>
                <p className={`text-gray-600 ${
                  isMobile ? 'text-xs' : 'text-xs'
                }`}>Limited parking at Main Gate</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </GlassCard>
  )
}