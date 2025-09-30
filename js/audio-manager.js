// Audio Manager - Handle all sound effects and background music
class AudioManager {
    constructor() {
        this.sounds = {
            correct: null,
            wrong: null,
            powerup: null,
            achievement: null,
            backgroundMusic: null
        };

        this.settings = {
            soundEffects: true,
            backgroundMusic: false,
            volume: 0.5
        };

        this.initializeAudio();
        this.loadSettings();
    }

    initializeAudio() {
        // Create audio elements programmatically if they don't exist
        this.sounds.correct = this.createAudioElement('correct', [
            'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCDWa2+/LdSUELZHE8t6PQAoTV7Lp6KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp64lVFApCn9/vy3QlBSuDzvLZgzYIGWW37NeodReRaLzvnmEAFnbG79qQQAoTV7Dp7KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp65hVFApCn9/vy3QlBSl+x/LMdyoEKI7C7txIQAoUXrTm6KZUEwlGnt/yukADCtdRtpePQAoUXbPp66hVFApCn9/vym4lBSuDzvLZgzYIGGW37NeodReRaLzvnmEAFnbG79qQQAoTV7Dp7KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp66hVFAlGn9/py3MkBSl+x/DMdigiCGGUH8tiMQUpcse25ZhJFAw3a5PmqGEaFz5+w+3Pdz1u4';
        ]);

        this.sounds.wrong = this.createAudioElement('wrong', [
            'data:audio/wav;base64,UklGRroBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWYBAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAp2jfC9XCUEKs/18sKMJQQfbtG8f2MbSz4+r+7CrTIGHH/P8qGLJh4lhtT+voAlBCp9xOncWyQFJ3rD49SOAOv5';
        ]);

        this.sounds.powerup = this.createAudioElement('powerup', [
            'data:audio/wav;base64,UklGRmoBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUYBAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCDWa2+/LdSUELZHE8t6PQAoTV7Lp6KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp65hVFApCn9/vy3QlBSl+x/LMdyoEKI7C7txIQAoUXrTm6KZUEwlGnt/yukADCtdR';
        ]);

        this.sounds.achievement = this.createAudioElement('achievement', [
            'data:audio/wav;base64,UklGRmoBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUYBAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCDWa2+/LdSUELZHE8t6PQAoTV7Lp6KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp65hVFApCn9/vy3QlBSl+x/LMdyoEKI7C7txIQAoUXrTm6KZUEwlGnt/yukADCtdR';
        ]);

        // Background music (placeholder - silent audio)
        this.sounds.backgroundMusic = this.createAudioElement('background-music', [
            'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCDWa2+/LdSUELZHE8t6PQAoTV7Lp6KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp65hVFApCn9/vy3QlBSl+x/LMdyoEKI7C7txIQAoUXrTm6KZUEwlGnt/yukADCtdR';
        ]);

        this.sounds.backgroundMusic.loop = true;
        this.sounds.backgroundMusic.volume = 0.2;
    }

    createAudioElement(id, sources) {
        // Try to use existing audio element first
        let audio = document.getElementById(id + '-sound');

        if (!audio) {
            audio = document.createElement('audio');
            audio.id = id + '-sound';
            audio.preload = 'auto';

            // Add sources
            sources.forEach(src => {
                const source = document.createElement('source');
                source.src = src;
                source.type = src.includes('mp3') ? 'audio/mpeg' : 'audio/wav';
                audio.appendChild(source);
            });

            document.body.appendChild(audio);
        }

        return audio;
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
            if (audio) {
                audio.volume = this.settings.volume;
            }
        });

        // Update UI controls
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

        // Start/stop background music
        if (this.settings.backgroundMusic && this.sounds.backgroundMusic) {
            this.sounds.backgroundMusic.play().catch(e => console.log('Background music play failed:', e));
        } else if (this.sounds.backgroundMusic) {
            this.sounds.backgroundMusic.pause();
        }
    }

    playSound(soundName) {
        if (!this.settings.soundEffects) return;

        const audio = this.sounds[soundName];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log(`Sound ${soundName} play failed:`, e));
        }
    }

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

    toggleSoundEffects(enabled) {
        this.settings.soundEffects = enabled;
        this.saveSettings();
    }

    toggleBackgroundMusic(enabled) {
        this.settings.backgroundMusic = enabled;
        this.saveSettings();
        this.applySettings();
    }

    setVolume(volume) {
        this.settings.volume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
        this.applySettings();
    }

    // Initialize event listeners for audio controls
    initializeControls() {
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
    }

    // Haptic feedback for mobile devices
    vibrate(pattern = [100]) {
        if ('vibrate' in navigator && this.settings.vibration) {
            navigator.vibrate(pattern);
        }
    }

    // Play feedback based on answer correctness
    playAnswerFeedback(isCorrect) {
        if (isCorrect) {
            this.playCorrect();
            this.vibrate([50]);
        } else {
            this.playWrong();
            this.vibrate([100, 50, 100]);
        }
    }
}

// Create global audio manager instance
window.audioManager = new AudioManager();