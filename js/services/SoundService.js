export class SoundService {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
    }

    initialize() {
        if (!this.initialized) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        }
    }

    async playCompletionSound() {
        try {
            this.initialize();
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Configure sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5 note
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            
            // Start sound
            oscillator.start();
            
            // Fade out
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            // Stop after fade
            setTimeout(() => {
                oscillator.stop();
            }, 200);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }
}