import { createAdjacencyList, campusLocations } from './campus-data'

export interface PathResult {
  path: number[]
  totalDistance: number
  totalTime: number
  found: boolean
}

export function dijkstraShortestPath(startId: number, endId: number): PathResult {
  const adjacencyList = createAdjacencyList()
  const distances = new Map<number, number>()
  const times = new Map<number, number>()
  const previous = new Map<number, number | null>()
  const visited = new Set<number>()
  const unvisited = new Set<number>()

  // Debug: Check if start and end nodes exist
  if (!campusLocations.find(loc => loc.id === startId)) {
    console.error(`Start location ${startId} not found`)
    return { path: [], totalDistance: 0, totalTime: 0, found: false }
  }
  if (!campusLocations.find(loc => loc.id === endId)) {
    console.error(`End location ${endId} not found`)
    return { path: [], totalDistance: 0, totalTime: 0, found: false }
  }

  // Initialize distances and times
  campusLocations.forEach(location => {
    distances.set(location.id, location.id === startId ? 0 : Infinity)
    times.set(location.id, location.id === startId ? 0 : Infinity)
    previous.set(location.id, null)
    unvisited.add(location.id)
  })

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let currentNode: number | null = null
    let minDistance = Infinity

    for (const nodeId of Array.from(unvisited)) {
      const distance = distances.get(nodeId) || Infinity
      if (distance < minDistance) {
        minDistance = distance
        currentNode = nodeId
      }
    }

    if (currentNode === null || minDistance === Infinity) {
      break // No path exists
    }

    unvisited.delete(currentNode)
    visited.add(currentNode)

    // If we reached the destination
    if (currentNode === endId) {
      break
    }

    // Check neighbors
    const neighbors = adjacencyList.get(currentNode) || []
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.to)) {
        continue
      }

      const currentDistance = distances.get(currentNode) || 0
      const currentTime = times.get(currentNode) || 0
      const newDistance = currentDistance + neighbor.distance
      const newTime = currentTime + neighbor.time

      if (newDistance < (distances.get(neighbor.to) || Infinity)) {
        distances.set(neighbor.to, newDistance)
        times.set(neighbor.to, newTime)
        previous.set(neighbor.to, currentNode)
      }
    }
  }

  // Reconstruct path
  const path: number[] = []
  let current: number | null = endId

  while (current !== null && current !== undefined) {
    path.unshift(current)
    const prev = previous.get(current)
    if (prev === current) break // Prevent infinite loop
    current = prev || null
  }

  // Check if we found a valid path
  const found = path.length > 1 && path[0] === startId
  const totalDistance = found ? (distances.get(endId) || 0) : 0
  const totalTime = found ? (times.get(endId) || 0) : 0

  return {
    path: found ? path : [],
    totalDistance,
    totalTime,
    found
  }
}

export function findNearestLocation(userLat: number, userLng: number): number {
  let nearestId = 1
  let minDistance = Infinity

  campusLocations.forEach(location => {
    const distance = calculateDistance(
      userLat, userLng,
      location.coordinates[0], location.coordinates[1]
    )
    if (distance < minDistance) {
      minDistance = distance
      nearestId = location.id
    }
  })

  return nearestId
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}