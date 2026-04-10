import { dijkstraShortestPath } from './dijkstra'
import { campusLocations } from './campus-data'

export interface RouteTestResult {
  from: number
  to: number
  fromName: string
  toName: string
  success: boolean
  distance?: number
  time?: number
  pathLength?: number
  error?: string
}

export function testAllRoutes(): RouteTestResult[] {
  const results: RouteTestResult[] = []
  
  // Test a sample of important routes - using routes that definitely exist
  const testRoutes = [
    { from: 1, to: 2 },   // Main Gate → COSIT (direct route)
    { from: 1, to: 3 },   // Main Gate → PETCHEM (direct route)
    { from: 2, to: 3 },   // COSIT → PETCHEM (direct route)
    { from: 1, to: 8 },   // Main Gate → COVTED (via PETCHEM: 1→3→8)
    { from: 3, to: 8 },   // PETCHEM → COVTED (direct route)
    { from: 8, to: 10 },  // COVTED → Senate (direct route)
    { from: 10, to: 14 }, // Senate → ETF (direct route)
    { from: 13, to: 14 }, // Postgraduate → ETF (direct route)
    { from: 14, to: 15 }, // ETF → COHUM (direct route)
    { from: 20, to: 21 }, // Language Lab → COSMAS (direct route)
  ]
  
  testRoutes.forEach(({ from, to }) => {
    const fromLocation = campusLocations.find(loc => loc.id === from)
    const toLocation = campusLocations.find(loc => loc.id === to)
    
    if (!fromLocation || !toLocation) {
      results.push({
        from,
        to,
        fromName: fromLocation?.shortName || `Location ${from}`,
        toName: toLocation?.shortName || `Location ${to}`,
        success: false,
        error: 'Location not found'
      })
      return
    }
    
    try {
      const result = dijkstraShortestPath(from, to)
      
      results.push({
        from,
        to,
        fromName: fromLocation.shortName,
        toName: toLocation.shortName,
        success: result.found,
        distance: result.found ? result.totalDistance : undefined,
        time: result.found ? result.totalTime : undefined,
        pathLength: result.found ? result.path.length : undefined,
        error: result.found ? undefined : 'No path found'
      })
    } catch (error) {
      results.push({
        from,
        to,
        fromName: fromLocation.shortName,
        toName: toLocation.shortName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })
  
  return results
}

export function getRouteTestSummary(): {
  total: number
  successful: number
  failed: number
  successRate: number
} {
  const results = testAllRoutes()
  const successful = results.filter(r => r.success).length
  const failed = results.length - successful
  
  return {
    total: results.length,
    successful,
    failed,
    successRate: (successful / results.length) * 100
  }
}

export function logRouteTestResults(): void {
  console.log('🧪 TASUED Campus Route Testing Results')
  console.log('=====================================')
  
  const results = testAllRoutes()
  const summary = getRouteTestSummary()
  
  console.log(`📊 Summary: ${summary.successful}/${summary.total} routes working (${summary.successRate.toFixed(1)}%)`)
  console.log('')
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌'
    const details = result.success 
      ? `${result.distance}m, ${result.time}min, ${result.pathLength} stops`
      : result.error
    
    console.log(`${status} ${result.fromName} → ${result.toName}: ${details}`)
  })
  
  if (summary.failed > 0) {
    console.log('')
    console.log('⚠️  Failed routes need investigation:')
    results.filter(r => !r.success).forEach(result => {
      console.log(`   • ${result.fromName} → ${result.toName}: ${result.error}`)
    })
  }
}