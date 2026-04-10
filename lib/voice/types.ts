import { CampusLocation } from '@/lib/campus-data'
import { PathResult } from '@/lib/dijkstra'

// Core Voice Navigation Interfaces

export interface VoiceController {
  // State Management
  isActive: boolean
  isPaused: boolean
  currentRoute: PathResult | null
  
  // Core Methods
  startVoiceNavigation(route: PathResult): Promise<boolean>
  pauseVoiceNavigation(): void
  resumeVoiceNavigation(): void
  stopVoiceNavigation(): void
  
  // Control Methods
  repeatLastInstruction(): void
  skipToNextInstruction(): void
  emergencyStop(): void
  
  // Event Handlers
  onRouteUpdate(route: PathResult): void
  onLocationUpdate(location: GeolocationPosition): void
  onNavigationComplete(): void
}

export interface DirectionNarrator {
  // Instruction Generation
  generateRouteInstructions(route: PathResult): VoiceInstruction[]
  generateTurnInstruction(fromLocation: CampusLocation, toLocation: CampusLocation): string
  generateApproachingInstruction(location: CampusLocation, distance: number): string
  generateArrivalInstruction(location: CampusLocation): string
  
  // Context-Aware Instructions
  addLandmarkInformation(instruction: string, location: CampusLocation): string
  addSafetyReminders(instruction: string, location: CampusLocation): string
  addDistanceInformation(instruction: string, distance: number): string
  
  // Instruction Delivery
  announceInstruction(instruction: VoiceInstruction): Promise<void>
  announceRouteOverview(route: PathResult): Promise<void>
}

export interface SpeechSynthesizer {
  // Initialization
  initialize(): Promise<boolean>
  isSupported(): boolean
  getAvailableVoices(): SpeechSynthesisVoice[]
  
  // Speech Control
  speak(text: string, options?: SpeechOptions): Promise<void>
  pause(): void
  resume(): void
  cancel(): void
  
  // Configuration
  setVoice(voice: SpeechSynthesisVoice): void
  setRate(rate: number): void
  setPitch(pitch: number): void
  setVolume(volume: number): void
  
  // Events
  onSpeechStart: (callback: () => void) => void
  onSpeechEnd: (callback: () => void) => void
  onSpeechError: (callback: (error: Error) => void) => void
}

export interface AudioManager {
  // Device Management
  detectAudioDevices(): Promise<MediaDeviceInfo[]>
  routeAudioToDevice(deviceId: string): Promise<void>
  
  // Audio Control
  playConfirmationSound(type: 'start' | 'pause' | 'resume' | 'stop' | 'error'): Promise<void>
  duckBackgroundAudio(enable: boolean): void
  
  // Interruption Handling
  handlePhoneCall(active: boolean): void
  handleNotificationInterruption(): void
  
  // System Integration
  respectDoNotDisturb(): boolean
  checkAudioPermissions(): Promise<boolean>
}

// Data Models

export interface VoiceInstruction {
  id: string
  type: 'turn' | 'approaching' | 'arrival' | 'overview' | 'safety' | 'confirmation'
  text: string
  location?: CampusLocation
  distance?: number
  priority: 'low' | 'normal' | 'high' | 'emergency'
  timestamp: number
  metadata?: {
    landmarks?: string[]
    safetyWarnings?: string[]
    estimatedTime?: number
  }
}

export interface VoiceSettings {
  // Voice Characteristics
  gender: 'male' | 'female' | 'neutral'
  rate: number // 0.5 to 2.0
  pitch: number // 0.5 to 2.0
  volume: number // 0.0 to 1.0
  
  // Language and Localization
  language: string // 'en-US', 'en-NG', etc.
  accent: string
  
  // Behavior Settings
  confirmationSounds: boolean
  safetyReminders: boolean
  landmarkAnnouncements: boolean
  distanceUnits: 'meters' | 'feet'
  
  // Accessibility Options
  verboseMode: boolean
  screenReaderCompatibility: boolean
  highContrastVisuals: boolean
  
  // Advanced Settings
  instructionTiming: 'early' | 'normal' | 'late'
  backgroundAudioDucking: boolean
  emergencyStopEnabled: boolean
}

export interface VoiceNavigationState {
  // Current State
  isActive: boolean
  isPaused: boolean
  currentRoute: PathResult | null
  currentInstruction: VoiceInstruction | null
  
  // Progress Tracking
  completedWaypoints: number[]
  nextWaypoint: number | null
  distanceToNext: number
  estimatedTimeRemaining: number
  
  // User Context
  userLocation: GeolocationPosition | null
  movementSpeed: number // meters per second
  lastLocationUpdate: number
  
  // System Status
  speechSynthesizerReady: boolean
  audioDevicesAvailable: MediaDeviceInfo[]
  backgroundOperation: boolean
  
  // Error Handling
  lastError: Error | null
  retryCount: number
  fallbackMode: boolean
}

export interface SpeechOptions {
  voice?: SpeechSynthesisVoice
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
}

// Feature Flag Interface
export interface VoiceNavigationFeatureFlags {
  voiceNavigationEnabled: boolean
  speechSynthesisEnabled: boolean
  voiceCommandsEnabled: boolean
  backgroundOperationEnabled: boolean
  advancedAudioFeaturesEnabled: boolean
}

// Error Types
export class VoiceNavigationError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true
  ) {
    super(message)
    this.name = 'VoiceNavigationError'
  }
}

export class SpeechSynthesisError extends VoiceNavigationError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, 'SPEECH_SYNTHESIS_ERROR', recoverable)
  }
}

export class AudioDeviceError extends VoiceNavigationError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, 'AUDIO_DEVICE_ERROR', recoverable)
  }
}