import { NextRequest, NextResponse } from 'next/server'
import { dijkstraShortestPath } from '@/lib/dijkstra'
import { campusLocations } from '@/lib/campus-data'

export async function POST(request: NextRequest) {
  try {
    const { startId, endId } = await request.json()

    if (!startId || !endId) {
      return NextResponse.json(
        { error: 'Start and end location IDs are required' },
        { status: 400 }
      )
    }

    // Validate location IDs
    const startLocation = campusLocations.find(loc => loc.id === startId)
    const endLocation = campusLocations.find(loc => loc.id === endId)

    if (!startLocation || !endLocation) {
      return NextResponse.json(
        { error: 'Invalid location ID provided' },
        { status: 400 }
      )
    }

    // Calculate shortest path
    const pathResult = dijkstraShortestPath(startId, endId)

    if (!pathResult.found) {
      return NextResponse.json(
        { error: 'No path found between the specified locations' },
        { status: 404 }
      )
    }

    // Get detailed path information
    const pathDetails = pathResult.path.map(locationId => {
      const location = campusLocations.find(loc => loc.id === locationId)
      return {
        id: locationId,
        name: location?.name,
        shortName: location?.shortName,
        coordinates: location?.coordinates,
        category: location?.category
      }
    })

    return NextResponse.json({
      success: true,
      route: {
        path: pathResult.path,
        pathDetails,
        totalDistance: pathResult.totalDistance,
        totalTime: pathResult.totalTime,
        startLocation: {
          id: startLocation.id,
          name: startLocation.name,
          shortName: startLocation.shortName
        },
        endLocation: {
          id: endLocation.id,
          name: endLocation.name,
          shortName: endLocation.shortName
        }
      }
    })

  } catch (error) {
    console.error('Route calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'TASUED Campus Navigation API',
    endpoints: {
      'POST /api/route': 'Calculate shortest path between two locations',
      'GET /api/locations': 'Get all campus locations'
    }
  })
}