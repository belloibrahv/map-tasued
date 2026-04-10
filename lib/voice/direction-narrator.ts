import { DirectionNarrator, VoiceInstruction, SpeechSynthesizer } from './types'
import { CampusLocation, campusLocations } from '@/lib/campus-data'
import { PathResult } from '@/lib/dijkstra'

export class CampusDirectionNarrator implements DirectionNarrator {
  private speechSynthesizer: SpeechSynthesizer
  private instructionCounter: number = 0

  constructor(speechSynthesizer: SpeechSynthesizer) {
    this.speechSynthesizer = speechSynthesizer
  }

  generateRouteInstructions(route: PathResult): VoiceInstruction[] {
    const instructions: VoiceInstruction[] = []

    if (!route.found || route.path.length === 0) {
      return instructions
    }

    // Generate route overview
    const startLocation = campusLocations.find(loc => loc.id === route.path[0])
    const endLocation = campusLocations.find(loc => loc.id === route.path[route.path.length - 1])

    if (startLocation && endLocation) {
      instructions.push(this.createInstruction(
        'overview',
        this.generateRouteOverviewText(route, startLocation, endLocation),
        startLocation
      ))
    }

    // Generate turn-by-turn instructions
    for (let i = 0; i < route.path.length - 1; i++) {
      const fromLocation = campusLocations.find(loc => loc.id === route.path[i])
      const toLocation = campusLocations.find(loc => loc.id === route.path[i + 1])

      if (fromLocation && toLocation) {
        const instruction = this.generateTurnInstruction(fromLocation, toLocation)
        instructions.push(this.createInstruction('turn', instruction, toLocation))

        // Add approaching instruction for the final destination
        if (i === route.path.length - 2) {
          const approachingInstruction = this.generateApproachingInstruction(toLocation, 200)
          instructions.push(this.createInstruction('approaching', approachingInstruction, toLocation))

          const arrivalInstruction = this.generateArrivalInstruction(toLocation)
          instructions.push(this.createInstruction('arrival', arrivalInstruction, toLocation))
        }
      }
    }

    return instructions
  }

  generateTurnInstruction(fromLocation: CampusLocation, toLocation: CampusLocation): string {
    let instruction = `Continue to ${toLocation.shortName}`

    // Add building type context for academic buildings
    if (toLocation.category === 'academic') {
      instruction += `, the ${this.getAcademicBuildingDescription(toLocation)}`
    } else if (toLocation.category === 'administrative') {
      instruction += `, the administrative building`
    } else if (toLocation.category === 'facility') {
      instruction += `, the campus facility`
    }

    // Add distance information if available (this would need route segment data)
    instruction = this.addDistanceInformation(instruction, 0) // Placeholder for now

    // Add safety reminders for certain locations
    instruction = this.addSafetyReminders(instruction, toLocation)

    return instruction
  }

  generateApproachingInstruction(location: CampusLocation, distance: number): string {
    let instruction = `You are approaching ${location.shortName}`

    if (location.category === 'academic') {
      instruction += `, the ${this.getAcademicBuildingDescription(location)}`
    }

    return instruction
  }

  generateArrivalInstruction(location: CampusLocation): string {
    let instruction = `You have arrived at ${location.shortName}`

    if (location.category === 'academic') {
      instruction += `, the ${this.getAcademicBuildingDescription(location)}`
    }

    instruction += '. Navigation complete.'

    return instruction
  }

  addLandmarkInformation(instruction: string, location: CampusLocation): string {
    const landmarks = this.getLandmarksForLocation(location)
    if (landmarks.length > 0) {
      instruction += `. Look for ${landmarks.join(' and ')}`
    }
    return instruction
  }

  addSafetyReminders(instruction: string, location: CampusLocation): string {
    const safetyWarnings = this.getSafetyWarningsForLocation(location)
    if (safetyWarnings.length > 0) {
      instruction += `. ${safetyWarnings.join('. ')}`
    }
    return instruction
  }

  addDistanceInformation(instruction: string, distance: number): string {
    if (distance > 0) {
      if (distance < 100) {
        instruction += ` in ${Math.round(distance)} meters`
      } else {
        instruction += ` in about ${Math.round(distance / 10) * 10} meters`
      }
    }
    return instruction
  }

  async announceInstruction(instruction: VoiceInstruction): Promise<void> {
    try {
      await this.speechSynthesizer.speak(instruction.text)
    } catch (error) {
      console.error('Failed to announce instruction:', error)
      throw error
    }
  }

  async announceRouteOverview(route: PathResult): Promise<void> {
    const startLocation = campusLocations.find(loc => loc.id === route.path[0])
    const endLocation = campusLocations.find(loc => loc.id === route.path[route.path.length - 1])

    if (startLocation && endLocation) {
      const overviewText = this.generateRouteOverviewText(route, startLocation, endLocation)
      await this.speechSynthesizer.speak(overviewText)
    }
  }

  // Private helper methods

  private createInstruction(
    type: VoiceInstruction['type'],
    text: string,
    location?: CampusLocation,
    priority: VoiceInstruction['priority'] = 'normal'
  ): VoiceInstruction {
    return {
      id: `instruction_${++this.instructionCounter}`,
      type,
      text,
      location,
      priority,
      timestamp: Date.now(),
      metadata: {
        landmarks: location ? this.getLandmarksForLocation(location) : [],
        safetyWarnings: location ? this.getSafetyWarningsForLocation(location) : []
      }
    }
  }

  private generateRouteOverviewText(
    route: PathResult,
    startLocation: CampusLocation,
    endLocation: CampusLocation
  ): string {
    const distance = Math.round(route.totalDistance)
    const time = Math.round(route.totalTime)
    const stops = route.path.length

    let overview = `Route from ${startLocation.shortName} to ${endLocation.shortName}`

    if (endLocation.category === 'academic') {
      overview += `, the ${this.getAcademicBuildingDescription(endLocation)}`
    }

    overview += `. The route is ${distance} meters and will take approximately ${time} minute${time !== 1 ? 's' : ''}`

    if (stops > 2) {
      overview += ` with ${stops - 2} intermediate stop${stops - 2 !== 1 ? 's' : ''}`
    }

    overview += '. Voice navigation will guide you step by step.'

    return overview
  }

  private getAcademicBuildingDescription(location: CampusLocation): string {
    const name = location.name.toLowerCase()
    
    if (name.includes('science') || name.includes('cosit')) {
      return 'Science Complex'
    } else if (name.includes('humanities') || name.includes('cohum')) {
      return 'Humanities building'
    } else if (name.includes('vocational') || name.includes('covted')) {
      return 'Vocational and Technical Education building'
    } else if (name.includes('postgraduate')) {
      return 'Postgraduate Studies building'
    } else if (name.includes('specialized') || name.includes('cosped')) {
      return 'Specialized and Professional Education building'
    } else if (name.includes('mathematics') || name.includes('cosmas')) {
      return 'Mathematics and Statistics building'
    } else if (name.includes('lecture')) {
      return 'main lecture theatre'
    }
    
    return 'academic building'
  }

  private getLandmarksForLocation(location: CampusLocation): string[] {
    const landmarks: string[] = []

    // Add landmarks based on location type and nearby features
    switch (location.category) {
      case 'entrance':
        landmarks.push('the main campus entrance')
        break
      case 'academic':
        landmarks.push('the academic building signage')
        break
      case 'administrative':
        landmarks.push('the administrative office signs')
        break
      case 'facility':
        if (location.name.toLowerCase().includes('auditorium')) {
          landmarks.push('the large auditorium building')
        } else if (location.name.toLowerCase().includes('clinic')) {
          landmarks.push('the medical facility sign')
        } else if (location.name.toLowerCase().includes('laboratory')) {
          landmarks.push('the laboratory building')
        }
        break
    }

    return landmarks
  }

  private getSafetyWarningsForLocation(location: CampusLocation): string[] {
    const warnings: string[] = []

    // Add contextual safety warnings
    if (location.id === 1) { // Main Gate
      warnings.push('Watch for vehicle traffic at the main entrance')
    }

    // General pedestrian safety
    warnings.push('Watch for pedestrian traffic')

    return warnings
  }

  // Public utility methods for testing and customization

  public setCustomLandmarks(locationId: number, landmarks: string[]): void {
    // This could be extended to allow custom landmark configuration
    // For now, it's a placeholder for future enhancement
  }

  public setCustomSafetyWarnings(locationId: number, warnings: string[]): void {
    // This could be extended to allow custom safety warning configuration
    // For now, it's a placeholder for future enhancement
  }
}