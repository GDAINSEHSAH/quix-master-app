// Audio Manager - Fixed version with working sound effects
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.settings = {
            soundEffects: true,
            backgroundMusic: false,
            volume: 0.7
        };

        this.initializeAudio();
        this.loadSettings();
    }

    initializeAudio() {
        // Initialize Web Audio API for better sound generation
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported, falling back to HTML audio');
        }

        // Create sound effects using oscillators (works without external files)
        this.createSoundEffects();
        this.setupAudioElements();
    }

    createSoundEffects() {
        // Define sound patterns using Web Audio API
        this.soundDefinitions = {
            correct: {
                frequency: 523.25, // C5
                duration: 0.3,
                type: 'sine',
                pattern: [
                    {freq: 523.25, time: 0, duration: 0.1},    // C5
                    {freq: 659.25, time: 0.1, duration: 0.1},  // E5
                    {freq: 783.99, time: 0.2, duration: 0.2}   // G5
                ]
            },
            wrong: {
                frequency: 220,
                duration: 0.4,
                type: 'square',
                pattern: [
                    {freq: 220, time: 0, duration: 0.2},       // A3
                    {freq: 185, time: 0.2, duration: 0.2}      // F#3
                ]
            },
            powerup: {
                frequency: 440,
                duration: 0.6,
                type: 'triangle',
                pattern: [
                    {freq: 440, time: 0, duration: 0.1},       // A4
                    {freq: 554.37, time: 0.1, duration: 0.1},  // C#5
                    {freq: 659.25, time: 0.2, duration: 0.1},  // E5
                    {freq: 880, time: 0.3, duration: 0.3}      // A5
                ]
            },
            achievement: {
                frequency: 698.46,
                duration: 0.8,
                type: 'sine',
                pattern: [
                    {freq: 523.25, time: 0, duration: 0.15},   // C5
                    {freq: 659.25, time: 0.15, duration: 0.15}, // E5
                    {freq: 783.99, time: 0.3, duration: 0.15},  // G5
                    {freq: 1046.5, time: 0.45, duration: 0.35}  // C6
                ]
            }
        };
    }

    setupAudioElements() {
        // Create fallback audio elements for browsers without Web Audio API
        const audioElements = [
            'correct-sound',
            'wrong-sound',
            'powerup-sound',
            'achievement-sound',
            'background-music'
        ];

        audioElements.forEach(id => {
            let audio = document.getElementById(id);
            if (!audio) {
                audio = document.createElement('audio');
                audio.id = id;
                audio.preload = 'auto';
                document.body.appendChild(audio);
            }
            this.sounds[id.replace('-sound', '')] = audio;
        });
    }

    loadSettings() {
        const saved = localStorage.getItem('quiz-audio-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        this.applySettings();
    }

    saveSettings() {
        localStorage.setItem('quiz-audio-settings', JSON.stringify(this.settings));
    }

    applySettings() {
        // Update volume for all sounds
        Object.values(this.sounds).forEach(audio => {
            if (audio && audio.volume !== undefined) {
                audio.volume = this.settings.volume;
            }
        });

        // Update UI controls if they exist
        this.updateAudioControls();
    }

    updateAudioControls() {
        const soundEffectsToggle = document.getElementById('sound-effects');
        const backgroundMusicToggle = document.getElementById('background-music-toggle');
        const volumeSlider = document.getElementById('volume-slider');

        if (soundEffectsToggle) {
            soundEffectsToggle.checked = this.settings.soundEffects;
        }
        if (backgroundMusicToggle) {
            backgroundMusicToggle.checked = this.settings.backgroundMusic;
        }
        if (volumeSlider) {
            volumeSlider.value = this.settings.volume * 100;
        }
    }

    playSound(soundName) {
        if (!this.settings.soundEffects) return;

        // Try Web Audio API first
        if (this.audioContext && this.soundDefinitions[soundName]) {
            this.playWebAudioSound(soundName);
        } else {
            // Fallback to HTML audio
            this.playHTMLAudioSound(soundName);
        }
    }

    playWebAudioSound(soundName) {
        const soundDef = this.soundDefinitions[soundName];
        if (!soundDef) return;

        try {
            // Resume audio context if suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const now = this.audioContext.currentTime;

            soundDef.pattern.forEach(note => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.setValueAtTime(note.freq, now + note.time);
                oscillator.type = soundDef.type;

                // Envelope for smooth sound
                gainNode.gain.setValueAtTime(0, now + note.time);
                gainNode.gain.linearRampToValueAtTime(this.settings.volume * 0.3, now + note.time + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.duration);

                oscillator.start(now + note.time);
                oscillator.stop(now + note.time + note.duration);
            });

            console.log(`🔊 Playing sound: ${soundName}`);
        } catch (error) {
            console.warn('Web Audio playback failed:', error);
            this.playHTMLAudioSound(soundName);
        }
    }

    playHTMLAudioSound(soundName) {
        const audio = this.sounds[soundName];
        if (audio) {
            audio.currentTime = 0;
            audio.volume = this.settings.volume;
            audio.play().catch(e => {
                console.warn(`HTML Audio playback failed for ${soundName}:`, e);
                // Generate beep as last resort
                this.generateBeep(soundName);
            });
        } else {
            this.generateBeep(soundName);
        }
    }

    generateBeep(soundName) {
        // Generate simple beep tones as absolute fallback
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Different frequencies for different sound types
            const frequencies = {
                correct: 800,
                wrong: 300,
                powerup: 600,
                achievement: 1000
            };

            oscillator.frequency.setValueAtTime(frequencies[soundName] || 440, this.audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.settings.volume * 0.2, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.2);

            console.log(`🔊 Generated beep for: ${soundName}`);
        } catch (error) {
            console.warn('Beep generation failed:', error);
        }
    }

    // Specific sound methods
    playCorrect() {
        this.playSound('correct');
    }

    playWrong() {
        this.playSound('wrong');
    }

    playPowerup() {
        this.playSound('powerup');
    }

    playAchievement() {
        this.playSound('achievement');
    }

    playAnswerFeedback(isCorrect) {
        if (isCorrect) {
            this.playCorrect();
        } else {
            this.playWrong();
        }
    }

    // Settings methods
    toggleSoundEffects(enabled) {
        this.settings.soundEffects = enabled;
        this.saveSettings();
        console.log(`🔊 Sound effects ${enabled ? 'enabled' : 'disabled'}`);
    }

    toggleBackgroundMusic(enabled) {
        this.settings.backgroundMusic = enabled;
        this.saveSettings();

        if (enabled) {
            // Start background music
            const bgMusic = this.sounds.backgroundMusic || this.sounds['background-music'];
            if (bgMusic) {
                bgMusic.volume = this.settings.volume * 0.3;
                bgMusic.play().catch(e => console.log('Background music play failed:', e));
            }
        } else {
            // Stop background music
            const bgMusic = this.sounds.backgroundMusic || this.sounds['background-music'];
            if (bgMusic) {
                bgMusic.pause();
            }
        }
    }

    setVolume(volume) {
        this.settings.volume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
        this.applySettings();
        console.log(`🔊 Volume set to ${Math.round(this.settings.volume * 100)}%`);
    }

    // Initialize controls
    initializeControls() {
        // Setup event listeners for audio controls
        document.addEventListener('DOMContentLoaded', () => {
            const soundEffectsToggle = document.getElementById('sound-effects');
            const backgroundMusicToggle = document.getElementById('background-music-toggle');
            const volumeSlider = document.getElementById('volume-slider');

            if (soundEffectsToggle) {
                soundEffectsToggle.addEventListener('change', (e) => {
                    this.toggleSoundEffects(e.target.checked);
                });
            }

            if (backgroundMusicToggle) {
                backgroundMusicToggle.addEventListener('change', (e) => {
                    this.toggleBackgroundMusic(e.target.checked);
                });
            }

            if (volumeSlider) {
                volumeSlider.addEventListener('input', (e) => {
                    this.setVolume(e.target.value / 100);
                });
            }

            console.log('🔊 Audio controls initialized');
        });
    }

    // Test all sounds
    testAllSounds() {
        console.log('🧪 Testing all sound effects...');

        setTimeout(() => this.playCorrect(), 0);
        setTimeout(() => this.playWrong(), 500);
        setTimeout(() => this.playPowerup(), 1000);
        setTimeout(() => this.playAchievement(), 1500);

        console.log('🔊 Sound test sequence started');
    }

    // Get audio statistics
    getAudioStats() {
        return {
            webAudioSupported: !!this.audioContext,
            soundEffectsEnabled: this.settings.soundEffects,
            backgroundMusicEnabled: this.settings.backgroundMusic,
            volume: this.settings.volume,
            audioContext: this.audioContext ? {
                state: this.audioContext.state,
                sampleRate: this.audioContext.sampleRate
            } : null
        };
    }
}

// Replace the old audio manager with the fixed version
if (window.audioManager) {
    console.log('🔄 Replacing audio manager with fixed version...');
}

window.audioManager = new AudioManager();
window.audioManager.initializeControls();

// Add test button for debugging
setTimeout(() => {
    if (document.body) {
        const testButton = document.createElement('button');
        testButton.textContent = '🔊 Test Sounds';
        testButton.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        `;
        testButton.onclick = () => {
            window.audioManager.testAllSounds();
        };
        document.body.appendChild(testButton);
        console.log('🔊 Audio test button added to page');
    }
}, 1000);

console.log('🔊 Fixed Audio Manager loaded successfully!');