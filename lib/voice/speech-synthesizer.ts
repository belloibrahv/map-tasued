import { SpeechSynthesizer, SpeechOptions, SpeechSynthesisError } from './types'

export class BrowserSpeechSynthesizer implements SpeechSynthesizer {
  private synthesis: SpeechSynthesis | null = null
  private utterance: SpeechSynthesisUtterance | null = null
  private currentVoice: SpeechSynthesisVoice | null = null
  private currentRate: number = 1.0
  private currentPitch: number = 1.0
  private currentVolume: number = 1.0
  private speechStartCallback: (() => void) | null = null
  private speechEndCallback: (() => void) | null = null
  private speechErrorCallback: ((error: Error) => void) | null = null

  async initialize(): Promise<boolean> {
    try {
      if (!('speechSynthesis' in window)) {
        throw new SpeechSynthesisError('Speech synthesis not supported in this browser', false)
      }

      this.synthesis = window.speechSynthesis

      // Wait for voices to load with timeout
      const voicesLoaded = await this.waitForVoices(5000)
      if (!voicesLoaded) {
        console.warn('Voice loading timed out, using default voice')
      }

      return true
    } catch (error) {
      console.error('Speech synthesizer initialization failed:', error)
      throw error
    }
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window && window.speechSynthesis !== undefined
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return []
    return this.synthesis.getVoices()
  }

  async speak(text: string, options?: SpeechOptions): Promise<void> {
    if (!this.synthesis) {
      throw new SpeechSynthesisError('Speech synthesizer not initialized')
    }

    // Cancel any ongoing speech
    this.cancel()

    return new Promise((resolve, reject) => {
      try {
        this.utterance = new SpeechSynthesisUtterance(text)

        // Apply options or use current settings
        this.utterance.rate = options?.rate ?? this.currentRate
        this.utterance.pitch = options?.pitch ?? this.currentPitch
        this.utterance.volume = options?.volume ?? this.currentVolume
        this.utterance.voice = options?.voice ?? this.currentVoice
        this.utterance.lang = options?.lang ?? 'en-US'

        // Set up event handlers
        this.utterance.onstart = () => {
          this.speechStartCallback?.()
        }

        this.utterance.onend = () => {
          this.speechEndCallback?.()
          resolve()
        }

        this.utterance.onerror = (event) => {
          const error = new SpeechSynthesisError(`Speech synthesis failed: ${event.error}`)
          this.speechErrorCallback?.(error)
          reject(error)
        }

        // Start speaking
        this.synthesis!.speak(this.utterance)

        // Fallback timeout in case events don't fire
        setTimeout(() => {
          if (this.utterance && !this.synthesis!.speaking) {
            resolve()
          }
        }, text.length * 100 + 2000) // Rough estimate based on text length

      } catch (error) {
        const speechError = new SpeechSynthesisError(
          error instanceof Error ? error.message : 'Unknown speech synthesis error'
        )
        reject(speechError)
      }
    })
  }

  pause(): void {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.pause()
    }
  }

  resume(): void {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume()
    }
  }

  cancel(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  setVoice(voice: SpeechSynthesisVoice): void {
    this.currentVoice = voice
  }

  setRate(rate: number): void {
    // Clamp rate between 0.5 and 2.0
    this.currentRate = Math.max(0.5, Math.min(2.0, rate))
  }

  setPitch(pitch: number): void {
    // Clamp pitch between 0.5 and 2.0
    this.currentPitch = Math.max(0.5, Math.min(2.0, pitch))
  }

  setVolume(volume: number): void {
    // Clamp volume between 0.0 and 1.0
    this.currentVolume = Math.max(0.0, Math.min(1.0, volume))
  }

  onSpeechStart(callback: () => void): void {
    this.speechStartCallback = callback
  }

  onSpeechEnd(callback: () => void): void {
    this.speechEndCallback = callback
  }

  onSpeechError(callback: (error: Error) => void): void {
    this.speechErrorCallback = callback
  }

  // Helper method to wait for voices to load
  private waitForVoices(timeout: number = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      const checkVoices = () => {
        const voices = this.synthesis?.getVoices() || []
        if (voices.length > 0) {
          resolve(true)
          return
        }

        // Some browsers fire voiceschanged event
        if ('onvoiceschanged' in this.synthesis!) {
          this.synthesis!.onvoiceschanged = () => {
            const voices = this.synthesis?.getVoices() || []
            if (voices.length > 0) {
              resolve(true)
            }
          }
        }
      }

      checkVoices()

      // Timeout fallback
      setTimeout(() => resolve(false), timeout)
    })
  }

  // Get preferred voice based on language and gender preferences
  getPreferredVoice(language: string = 'en-US', gender?: 'male' | 'female'): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices()
    
    // Filter by language first
    let filteredVoices = voices.filter(voice => 
      voice.lang.toLowerCase().startsWith(language.toLowerCase())
    )

    // If no voices for specific language, fall back to English
    if (filteredVoices.length === 0) {
      filteredVoices = voices.filter(voice => 
        voice.lang.toLowerCase().startsWith('en')
      )
    }

    // If still no voices, use any available voice
    if (filteredVoices.length === 0) {
      filteredVoices = voices
    }

    // Try to match gender preference if specified
    if (gender && filteredVoices.length > 1) {
      const genderMatches = filteredVoices.filter(voice => {
        const name = voice.name.toLowerCase()
        if (gender === 'female') {
          return name.includes('female') || name.includes('woman') || 
                 name.includes('samantha') || name.includes('victoria') ||
                 name.includes('karen') || name.includes('susan')
        } else {
          return name.includes('male') || name.includes('man') ||
                 name.includes('daniel') || name.includes('alex') ||
                 name.includes('tom') || name.includes('david')
        }
      })

      if (genderMatches.length > 0) {
        return genderMatches[0]
      }
    }

    return filteredVoices[0] || null
  }

  // Test speech synthesis with a sample phrase
  async testSpeech(testPhrase: string = 'Voice navigation is ready'): Promise<boolean> {
    try {
      await this.speak(testPhrase)
      return true
    } catch (error) {
      console.error('Speech synthesis test failed:', error)
      return false
    }
  }
}