import { VoiceNavigationFeatureFlags } from './types'

export class FeatureFlagManager {
  private flags: VoiceNavigationFeatureFlags

  constructor() {
    this.flags = this.loadFeatureFlags()
  }

  isVoiceNavigationEnabled(): boolean {
    return this.flags.voiceNavigationEnabled && this.isBrowserSupported()
  }

  isSpeechSynthesisEnabled(): boolean {
    return this.flags.speechSynthesisEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window
  }

  isVoiceCommandsEnabled(): boolean {
    return this.flags.voiceCommandsEnabled && typeof window !== 'undefined' && 'webkitSpeechRecognition' in window
  }

  isBackgroundOperationEnabled(): boolean {
    return this.flags.backgroundOperationEnabled
  }

  isAdvancedAudioFeaturesEnabled(): boolean {
    return this.flags.advancedAudioFeaturesEnabled && typeof window !== 'undefined' && 'AudioContext' in window
  }

  private isBrowserSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      'AudioContext' in window
    )
  }

  private loadFeatureFlags(): VoiceNavigationFeatureFlags {
    // Load from environment variables with sensible defaults
    return {
      voiceNavigationEnabled: process.env.NEXT_PUBLIC_VOICE_NAVIGATION === 'true' || true,
      speechSynthesisEnabled: true,
      voiceCommandsEnabled: false, // Disabled initially for MVP
      backgroundOperationEnabled: true,
      advancedAudioFeaturesEnabled: false // Disabled initially for MVP
    }
  }

  // Development helper methods
  enableFeature(feature: keyof VoiceNavigationFeatureFlags): void {
    if (process.env.NODE_ENV === 'development') {
      this.flags[feature] = true
    }
  }

  disableFeature(feature: keyof VoiceNavigationFeatureFlags): void {
    if (process.env.NODE_ENV === 'development') {
      this.flags[feature] = false
    }
  }

  getFlags(): VoiceNavigationFeatureFlags {
    return { ...this.flags }
  }
}

// Singleton instance
export const featureFlags = new FeatureFlagManager()