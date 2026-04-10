"use client"

import { useState, useEffect } from 'react'
import { Info, Clock, Users, Wifi, Car, Coffee, Book, Heart, Shield, Phone, Mail, Globe, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CampusService {
  id: string
  name: string
  status: 'operational' | 'limited' | 'down' | 'maintenance'
  description: string
  icon: any
  lastUpdated: string
}

interface CampusAnnouncement {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'emergency' | 'event'
  timestamp: string
  priority: 'low' | 'medium' | 'high'
}

interface CampusStats {
  totalStudents: number
  totalStaff: number
  activeClasses: number
  availableParking: number
  wifiUsers: number
  libraryOccupancy: number
}

export default function CampusInfo() {
  const [services, setServices] = useState<CampusService[]>([])
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>([])
  const [stats, setStats] = useState<CampusStats | null>(null)
  const [selectedTab, setSelectedTab] = useState<'services' | 'announcements' | 'stats' | 'contact'>('services')

  // Initialize campus services
  useEffect(() => {
    const campusServices: CampusService[] = [
      {
        id: 'wifi',
        name: 'Campus WiFi',
        status: 'operational',
        description: 'High-speed internet across campus',
        icon: Wifi,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'library',
        name: 'Digital Library',
        status: 'operational',
        description: 'Online resources and e-books',
        icon: Book,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'parking',
        name: 'Parking System',
        status: 'limited',
        description: 'Smart parking availability',
        icon: Car,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'medical',
        name: 'Health Services',
        status: 'operational',
        description: 'Campus clinic and emergency care',
        icon: Heart,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'security',
        name: 'Campus Security',
        status: 'operational',
        description: '24/7 security monitoring',
        icon: Shield,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'cafeteria',
        name: 'Dining Services',
        status: 'operational',
        description: 'Campus cafeteria and food courts',
        icon: Coffee,
        lastUpdated: new Date().toISOString()
      }
    ]

    setServices(campusServices)
  }, [])

  // Initialize announcements
  useEffect(() => {
    const campusAnnouncements: CampusAnnouncement[] = [
      {
        id: '1',
        title: 'New Semester Registration',
        message: 'Registration for the new semester is now open. Visit the admission office or use the online portal.',
        type: 'info',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        priority: 'high'
      },
      {
        id: '2',
        title: 'Library Extended Hours',
        message: 'The library will be open until 10 PM during exam period (March 15-30).',
        type: 'info',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Parking Lot Maintenance',
        message: 'Parking Lot B will be under maintenance from 8 AM to 2 PM today. Please use alternative parking areas.',
        type: 'warning',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Campus WiFi Upgrade',
        message: 'WiFi infrastructure has been upgraded. Enjoy faster internet speeds across campus!',
        type: 'info',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        priority: 'low'
      }
    ]

    setAnnouncements(campusAnnouncements)
  }, [])

  // Initialize campus stats
  useEffect(() => {
    const campusStats: CampusStats = {
      totalStudents: 12500,
      totalStaff: 850,
      activeClasses: 45,
      availableParking: 120,
      wifiUsers: 3200,
      libraryOccupancy: 65
    }

    setStats(campusStats)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => prev ? {
        ...prev,
        activeClasses: Math.max(0, prev.activeClasses + Math.floor(Math.random() * 6) - 3),
        availableParking: Math.max(0, Math.min(200, prev.availableParking + Math.floor(Math.random() * 20) - 10)),
        wifiUsers: Math.max(0, prev.wifiUsers + Math.floor(Math.random() * 100) - 50),
        libraryOccupancy: Math.max(0, Math.min(100, prev.libraryOccupancy + Math.floor(Math.random() * 10) - 5))
      } : null)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: CampusService['status']) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-50 border-green-200'
      case 'limited': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'down': return 'text-red-600 bg-red-50 border-red-200'
      case 'maintenance': return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getStatusIcon = (status: CampusService['status']) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4" />
      case 'limited': return <AlertTriangle className="h-4 w-4" />
      case 'down': return <AlertTriangle className="h-4 w-4" />
      case 'maintenance': return <Info className="h-4 w-4" />
    }
  }

  const getAnnouncementColor = (type: CampusAnnouncement['type']) => {
    switch (type) {
      case 'info': return 'border-blue-200 bg-blue-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'emergency': return 'border-red-200 bg-red-50'
      case 'event': return 'border-green-200 bg-green-50'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const tabs = [
    { id: 'services', label: 'Services', icon: Wifi },
    { id: 'announcements', label: 'News', icon: Info },
    { id: 'stats', label: 'Live Stats', icon: Users },
    { id: 'contact', label: 'Contact', icon: Phone }
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Campus Information
        </CardTitle>
        
        {/* Tab Navigation */}
        <div className="flex rounded-lg bg-gray-100 p-1 mt-3">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                selectedTab === id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Services Tab */}
        {selectedTab === 'services' && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Campus Services Status</h3>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <service.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-sm">{service.name}</h4>
                      <p className="text-xs text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-xs ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)}
                      <span className="ml-1 capitalize">{service.status}</span>
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(service.lastUpdated)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {selectedTab === 'announcements' && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Campus Announcements</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {announcements.map((announcement) => (
                <div key={announcement.id} className={`p-3 rounded-lg border ${getAnnouncementColor(announcement.type)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{announcement.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={announcement.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {announcement.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatTimeAgo(announcement.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{announcement.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {selectedTab === 'stats' && stats && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Live Campus Statistics</h3>
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-blue-800">Students</span>
                </div>
                <div className="text-lg font-bold text-blue-900">{stats.totalStudents.toLocaleString()}</div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-800">Staff</span>
                </div>
                <div className="text-lg font-bold text-green-900">{stats.totalStaff}</div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Book className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-purple-800">Active Classes</span>
                </div>
                <div className="text-lg font-bold text-purple-900">{stats.activeClasses}</div>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <Car className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs text-yellow-800">Parking</span>
                </div>
                <div className="text-lg font-bold text-yellow-900">{stats.availableParking} spots</div>
              </div>
              
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-1">
                  <Wifi className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs text-indigo-800">WiFi Users</span>
                </div>
                <div className="text-lg font-bold text-indigo-900">{stats.wifiUsers.toLocaleString()}</div>
              </div>
              
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-center gap-2 mb-1">
                  <Book className="h-4 w-4 text-teal-600" />
                  <span className="text-xs text-teal-800">Library</span>
                </div>
                <div className="text-lg font-bold text-teal-900">{stats.libraryOccupancy}% full</div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {selectedTab === 'contact' && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Contact Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-sm">Main Office</h4>
                  <p className="text-sm text-gray-600">+234 (0) 39 243 688</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-medium text-sm">Emergency</h4>
                  <p className="text-sm text-gray-600">+234 (0) 39 243 999</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-sm">Email</h4>
                  <p className="text-sm text-gray-600">info@tasued.edu.ng</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium text-sm">Website</h4>
                  <p className="text-sm text-gray-600">www.tasued.edu.ng</p>
                </div>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Phone className="h-3 w-3 mr-1" />
                  Call Security
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Mail className="h-3 w-3 mr-1" />
                  Report Issue
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}