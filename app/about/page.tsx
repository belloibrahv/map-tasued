import { ArrowLeft, MapPin, Users, Award, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">About TASUED Navigator</h1>
            <p className="text-gray-600">Learn more about our campus navigation system</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Project Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  TASUED Navigator is a modern web-based navigation system designed specifically 
                  for Tai Solarin University of Education campus. Built with cutting-edge 
                  technologies, it helps students, staff, and visitors find the shortest routes 
                  between campus locations.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Key Features</h3>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Interactive campus map with 21+ locations</li>
                    <li>• Dijkstra&apos;s algorithm for optimal pathfinding</li>
                    <li>• Real-time distance and time calculations</li>
                    <li>• Mobile-responsive design</li>
                    <li>• Location search and filtering</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Research Foundation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  This project is based on the research paper &quot;Determination of the Shortest Path 
                  of a Nigerian University Map Using Dijkstra&apos;s Algorithm&quot; published in AICTTRA 2017.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Research Authors</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Usman Opeyemi Lateef (Lead Author)</li>
                    <li>• Adebare Adedeji, O.</li>
                    <li>• Rufai Kazeem, I.</li>
                    <li>• Idowu Peter, A.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technical Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Frontend Technologies</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">Next.js 14</div>
                      <div className="bg-gray-50 p-2 rounded">React 18</div>
                      <div className="bg-gray-50 p-2 rounded">TypeScript</div>
                      <div className="bg-gray-50 p-2 rounded">Tailwind CSS</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Map & Navigation</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">React Leaflet</div>
                      <div className="bg-gray-50 p-2 rounded">OpenStreetMap</div>
                      <div className="bg-gray-50 p-2 rounded">Dijkstra&apos;s Algorithm</div>
                      <div className="bg-gray-50 p-2 rounded">Geolocation API</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">UI Components</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">Shadcn/ui</div>
                      <div className="bg-gray-50 p-2 rounded">Radix UI</div>
                      <div className="bg-gray-50 p-2 rounded">Lucide Icons</div>
                      <div className="bg-gray-50 p-2 rounded">Class Variance Authority</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  About TASUED
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Tai Solarin University of Education (TASUED) is a specialized university 
                  established in 2005, located in Ijagun, Ijebu-Ode, Ogun State, Nigeria.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="font-bold text-2xl text-green-600">2005</div>
                    <div className="text-sm text-green-800">Established</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-2xl text-blue-600">15,000+</div>
                    <div className="text-sm text-blue-800">Students</div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Mission</h4>
                  <p className="text-sm text-yellow-800">
                    To provide quality teacher education and conduct research that will 
                    contribute to national development and global competitiveness.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                This navigation system was developed to improve campus accessibility and 
                enhance the experience of students, staff, and visitors at TASUED.
              </p>
              <Link href="/">
                <Button>
                  <MapPin className="h-4 w-4 mr-2" />
                  Start Navigating
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}