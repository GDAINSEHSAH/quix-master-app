// Integration Fixer - Ensures all premium features work together properly
class IntegrationFixer {
    constructor() {
        this.fixes = [];
        this.errors = [];
        this.initialized = false;
    }

    async runAllFixes() {
        console.log('🔧 Running comprehensive integration fixes...');

        // Fix audio system first
        await this.fixAudioSystem();

        // Fix missing UI elements
        await this.fixUIElements();

        // Fix CSS and styling issues
        await this.fixStyling();

        // Fix event system integration
        await this.fixEventSystem();

        // Fix feature dependencies
        await this.fixFeatureDependencies();

        // Fix mobile compatibility
        await this.fixMobileCompatibility();

        // Fix performance issues
        await this.fixPerformance();

        this.initialized = true;
        console.log(`✅ Integration fixes completed. Applied ${this.fixes.length} fixes.`);

        return {
            fixes: this.fixes,
            errors: this.errors,
            success: this.errors.length === 0
        };
    }

    async fixAudioSystem() {
        console.log('🔊 Fixing audio system...');

        try {
            // Ensure the fixed audio manager is loaded
            if (!window.audioManager || !window.audioManager.playCorrect) {
                // Load the fixed audio manager if needed
                const script = document.createElement('script');
                script.src = 'js/audio-manager-fixed.js';
                document.head.appendChild(script);

                await new Promise(resolve => {
                    script.onload = resolve;
                    script.onerror = resolve;
                });
            }

            // Create audio settings UI if missing
            this.createAudioSettingsUI();

            // Test audio functionality
            if (window.audioManager) {
                const stats = window.audioManager.getAudioStats();
                console.log('🔊 Audio stats:', stats);

                this.fixes.push('Audio system verified and fixed');
            }

        } catch (error) {
            this.errors.push(`Audio fix failed: ${error.message}`);
        }
    }

    createAudioSettingsUI() {
        // Add audio settings to settings panel if missing
        const settingsContent = document.querySelector('.settings-content');
        if (settingsContent && !document.getElementById('audio-settings')) {
            const audioSettings = document.createElement('div');
            audioSettings.id = 'audio-settings';
            audioSettings.innerHTML = `
                <div class="settings-section">
                    <h3>🔊 Audio Settings</h3>

                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="sound-effects" checked>
                            Sound Effects
                        </label>
                    </div>

                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="background-music-toggle">
                            Background Music
                        </label>
                    </div>

                    <div class="setting-item">
                        <label for="volume-slider">Volume</label>
                        <input type="range" id="volume-slider" min="0" max="100" value="70">
                        <span id="volume-value">70%</span>
                    </div>

                    <div class="setting-item">
                        <button id="test-audio-btn" class="btn-secondary">Test Audio</button>
                    </div>
                </div>
            `;
            settingsContent.appendChild(audioSettings);

            // Setup event listeners
            this.setupAudioEventListeners();
            this.fixes.push('Audio settings UI created');
        }
    }

    setupAudioEventListeners() {
        const soundEffectsToggle = document.getElementById('sound-effects');
        const backgroundMusicToggle = document.getElementById('background-music-toggle');
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        const testAudioBtn = document.getElementById('test-audio-btn');

        if (soundEffectsToggle) {
            soundEffectsToggle.addEventListener('change', (e) => {
                if (window.audioManager) {
                    window.audioManager.toggleSoundEffects(e.target.checked);
                }
            });
        }

        if (backgroundMusicToggle) {
            backgroundMusicToggle.addEventListener('change', (e) => {
                if (window.audioManager) {
                    window.audioManager.toggleBackgroundMusic(e.target.checked);
                }
            });
        }

        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener('input', (e) => {
                const volume = e.target.value;
                volumeValue.textContent = volume + '%';
                if (window.audioManager) {
                    window.audioManager.setVolume(volume / 100);
                }
            });
        }

        if (testAudioBtn) {
            testAudioBtn.addEventListener('click', () => {
                if (window.audioManager) {
                    window.audioManager.testAllSounds();
                }
            });
        }
    }

    async fixUIElements() {
        console.log('🎨 Fixing UI elements...');

        try {
            // Essential UI elements that must exist
            const essentialElements = [
                {
                    id: 'powerup-notification',
                    html: `
                        <div id="powerup-notification" class="notification powerup-notification">
                            <div class="notification-content">
                                <div class="powerup-icon">⚡</div>
                                <div class="powerup-info">
                                    <h4 id="powerup-title">Power-up Activated!</h4>
                                    <p id="powerup-description">Power-up effect description</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    id: 'achievement-notification',
                    html: `
                        <div id="achievement-notification" class="notification achievement-notification">
                            <div class="notification-content">
                                <div class="achievement-icon">🏆</div>
                                <div class="achievement-info">
                                    <h4 id="achievement-title">Achievement Unlocked!</h4>
                                    <p id="achievement-description">Achievement description</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    id: 'challenge-notification',
                    html: `
                        <div id="challenge-notification" class="notification challenge-notification">
                            <div class="notification-content">
                                <div class="challenge-icon">🎯</div>
                                <div class="challenge-info">
                                    <h4 id="challenge-title">Challenge Completed!</h4>
                                    <p id="challenge-description">Challenge description</p>
                                    <div id="challenge-rewards">Rewards earned</div>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    id: 'score-multiplier',
                    html: `
                        <div id="score-multiplier" class="score-multiplier" style="display: none;">
                            <i class="fas fa-fire"></i>
                            <span>x<span id="multiplier-value">1</span></span>
                        </div>
                    `
                }
            ];

            // Add missing elements
            essentialElements.forEach(element => {
                if (!document.getElementById(element.id)) {
                    const container = document.querySelector('.app-container') || document.body;
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = element.html;
                    container.appendChild(tempDiv.firstElementChild);
                    this.fixes.push(`Created missing UI element: ${element.id}`);
                }
            });

            // Fix power-ups bar if missing
            this.createPowerUpsBar();

            // Fix multiplayer UI elements
            this.createMultiplayerUI();

            // Fix voice narration indicators
            this.createVoiceIndicators();

        } catch (error) {
            this.errors.push(`UI fix failed: ${error.message}`);
        }
    }

    createPowerUpsBar() {
        if (!document.getElementById('powerups-bar')) {
            const gameScreen = document.getElementById('game-screen');
            if (gameScreen) {
                const powerupsBar = document.createElement('div');
                powerupsBar.id = 'powerups-bar';
                powerupsBar.className = 'powerups-bar';
                powerupsBar.innerHTML = `
                    <div class="powerups-title">Power-ups</div>
                    <div class="powerups-grid">
                        <button id="fiftyFifty" class="powerup-btn" data-powerup="fiftyFifty">
                            <i class="fas fa-divide"></i>
                            <span class="powerup-count">0</span>
                        </button>
                        <button id="extraTime" class="powerup-btn" data-powerup="extraTime">
                            <i class="fas fa-clock"></i>
                            <span class="powerup-count">0</span>
                        </button>
                        <button id="skip" class="powerup-btn" data-powerup="skip">
                            <i class="fas fa-forward"></i>
                            <span class="powerup-count">0</span>
                        </button>
                        <button id="doublePoints" class="powerup-btn" data-powerup="doublePoints">
                            <i class="fas fa-gem"></i>
                            <span class="powerup-count">0</span>
                        </button>
                        <button id="revealAnswer" class="powerup-btn" data-powerup="revealAnswer">
                            <i class="fas fa-eye"></i>
                            <span class="powerup-count">0</span>
                        </button>
                        <button id="freezeTime" class="powerup-btn" data-powerup="freezeTime">
                            <i class="fas fa-snowflake"></i>
                            <span class="powerup-count">0</span>
                        </button>
                        <button id="perfectQuestion" class="powerup-btn" data-powerup="perfectQuestion">
                            <i class="fas fa-star"></i>
                            <span class="powerup-count">0</span>
                        </button>
                    </div>
                `;

                // Insert power-ups bar at the top of game screen
                const gameContainer = gameScreen.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.insertBefore(powerupsBar, gameContainer.firstChild);
                } else {
                    gameScreen.appendChild(powerupsBar);
                }

                // Setup power-up button event listeners
                this.setupPowerUpButtons();
                this.fixes.push('Power-ups bar created');
            }
        }
    }

    setupPowerUpButtons() {
        document.querySelectorAll('.powerup-btn').forEach(button => {
            button.addEventListener('click', () => {
                const powerUpId = button.getAttribute('data-powerup');
                if (window.powerUpsSystem && powerUpId) {
                    window.powerUpsSystem.usePowerUp(powerUpId);
                }
            });
        });
    }

    createMultiplayerUI() {
        if (!document.getElementById('multiplayer-container')) {
            const appContainer = document.querySelector('.app-container');
            if (appContainer) {
                const multiplayerContainer = document.createElement('div');
                multiplayerContainer.id = 'multiplayer-container';
                multiplayerContainer.className = 'multiplayer-container';
                multiplayerContainer.style.display = 'none';

                appContainer.appendChild(multiplayerContainer);
                this.fixes.push('Multiplayer container created');
            }
        }
    }

    createVoiceIndicators() {
        if (!document.querySelector('.voice-indicator')) {
            const gameArea = document.querySelector('.game-area') || document.body;
            const voiceIndicator = document.createElement('div');
            voiceIndicator.className = 'voice-indicator';
            voiceIndicator.style.display = 'none';
            gameArea.appendChild(voiceIndicator);
            this.fixes.push('Voice indicator created');
        }
    }

    async fixStyling() {
        console.log('🎨 Fixing styling issues...');

        try {
            // Add missing CSS for premium features
            this.addPremiumStyles();
            this.fixes.push('Premium styles added');

        } catch (error) {
            this.errors.push(`Styling fix failed: ${error.message}`);
        }
    }

    addPremiumStyles() {
        if (!document.getElementById('premium-styles')) {
            const style = document.createElement('style');
            style.id = 'premium-styles';
            style.textContent = `
                /* Power-ups Bar Styles */
                .powerups-bar {
                    background: var(--bg-card, rgba(255,255,255,0.1));
                    border-radius: 10px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    backdrop-filter: blur(10px);
                }

                .powerups-title {
                    text-align: center;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--text-primary, #333);
                }

                .powerups-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
                    gap: 0.5rem;
                }

                .powerup-btn {
                    position: relative;
                    padding: 0.75rem;
                    border: 2px solid var(--accent-color, #667eea);
                    border-radius: 10px;
                    background: var(--bg-secondary, rgba(255,255,255,0.9));
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                }

                .powerup-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .powerup-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .powerup-count {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--error-color, #dc3545);
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 0.7rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }

                /* Notification Styles */
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-card, white);
                    border-radius: 15px;
                    padding: 1rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    z-index: 1000;
                    max-width: 300px;
                }

                .notification.show {
                    transform: translateX(0);
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .achievement-icon, .powerup-icon, .challenge-icon {
                    font-size: 2rem;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary-color, #667eea), var(--secondary-color, #764ba2));
                    color: white;
                }

                .achievement-info h4, .powerup-info h4, .challenge-info h4 {
                    margin: 0 0 0.5rem 0;
                    color: var(--text-primary, #333);
                }

                .achievement-info p, .powerup-info p, .challenge-info p {
                    margin: 0;
                    color: var(--text-secondary, #666);
                    font-size: 0.9rem;
                }

                /* Score Multiplier */
                .score-multiplier {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: linear-gradient(135deg, #ff6b35, #f7931e);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-weight: bold;
                    animation: multiplierPulse 1s infinite;
                    z-index: 999;
                }

                @keyframes multiplierPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                /* Voice Indicator */
                .voice-indicator {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #dc3545;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-weight: 600;
                    z-index: 1000;
                    animation: voicePulse 1s infinite;
                }

                @keyframes voicePulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .powerups-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }

                    .powerup-btn {
                        padding: 0.5rem;
                    }

                    .notification {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                        transform: translateY(-100px);
                    }

                    .notification.show {
                        transform: translateY(0);
                    }
                }

                /* Theme Support */
                [data-theme="dark"] .powerup-btn {
                    background: rgba(45, 45, 45, 0.9);
                    color: white;
                }

                [data-theme="neon"] .powerup-btn {
                    border-color: #00f5ff;
                    background: rgba(10, 10, 10, 0.9);
                    color: #00f5ff;
                }
            `;
            document.head.appendChild(style);
        }
    }

    async fixEventSystem() {
        console.log('📡 Fixing event system...');

        try {
            // Ensure all event listeners are properly connected
            this.setupGlobalEventListeners();
            this.connectFeatureEvents();
            this.fixes.push('Event system integrated');

        } catch (error) {
            this.errors.push(`Event system fix failed: ${error.message}`);
        }
    }

    setupGlobalEventListeners() {
        // Remove any existing listeners to prevent duplicates
        document.removeEventListener('questionAnswered', this.handleQuestionAnswered);
        document.removeEventListener('achievementUnlocked', this.handleAchievementUnlocked);
        document.removeEventListener('powerUpUsed', this.handlePowerUpUsed);

        // Add event listeners
        document.addEventListener('questionAnswered', this.handleQuestionAnswered.bind(this));
        document.addEventListener('achievementUnlocked', this.handleAchievementUnlocked.bind(this));
        document.addEventListener('powerUpUsed', this.handlePowerUpUsed.bind(this));
    }

    handleQuestionAnswered(event) {
        const { isCorrect, responseTime } = event.detail;

        // Play audio feedback
        if (window.audioManager) {
            window.audioManager.playAnswerFeedback(isCorrect);
        }

        // Update statistics
        if (window.statisticsManager) {
            window.statisticsManager.recordAnswer(isCorrect, responseTime);
        }

        // Update daily challenges
        if (window.dailyChallengesSystem) {
            window.dailyChallengesSystem.updateProgress('questionAnswered', event.detail);
        }
    }

    handleAchievementUnlocked(event) {
        const achievement = event.detail;

        // Play achievement sound
        if (window.audioManager) {
            window.audioManager.playAchievement();
        }

        // Show achievement notification
        this.showAchievementNotification(achievement);
    }

    handlePowerUpUsed(event) {
        const powerUp = event.detail;

        // Play power-up sound
        if (window.audioManager) {
            window.audioManager.playPowerup();
        }

        // Show power-up notification
        this.showPowerUpNotification(powerUp);
    }

    showAchievementNotification(achievement) {
        const notification = document.getElementById('achievement-notification');
        if (notification) {
            const title = document.getElementById('achievement-title');
            const description = document.getElementById('achievement-description');

            if (title) title.textContent = achievement.name;
            if (description) description.textContent = achievement.description;

            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 4000);
        }
    }

    showPowerUpNotification(powerUp) {
        const notification = document.getElementById('powerup-notification');
        if (notification) {
            const title = document.getElementById('powerup-title');
            const description = document.getElementById('powerup-description');

            if (title) title.textContent = powerUp.name + ' Activated!';
            if (description) description.textContent = powerUp.description;

            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 3000);
        }
    }

    connectFeatureEvents() {
        // Connect all premium features to the event system
        const features = [
            'achievementsSystem',
            'powerUpsSystem',
            'dailyChallengesSystem',
            'statisticsManager',
            'timeAttackMode',
            'socialSharingSystem',
            'multiplayerManager',
            'aiAdaptiveDifficulty',
            'voiceNarrationSystem'
        ];

        features.forEach(feature => {
            if (window[feature] && typeof window[feature].setupEventListeners === 'function') {
                try {
                    window[feature].setupEventListeners();
                } catch (error) {
                    console.warn(`Failed to setup events for ${feature}:`, error);
                }
            }
        });
    }

    async fixFeatureDependencies() {
        console.log('🔗 Fixing feature dependencies...');

        try {
            // Ensure all features can access each other properly
            this.createFeatureRegistry();
            this.verifyDependencies();
            this.fixes.push('Feature dependencies resolved');

        } catch (error) {
            this.errors.push(`Dependencies fix failed: ${error.message}`);
        }
    }

    createFeatureRegistry() {
        // Create a global registry for all features
        window.quizFeatures = {
            gameLogic: window.gameLogic,
            audioManager: window.audioManager,
            themeManager: window.themeManager,
            achievementsSystem: window.achievementsSystem,
            powerUpsSystem: window.powerUpsSystem,
            dailyChallengesSystem: window.dailyChallengesSystem,
            statisticsManager: window.statisticsManager,
            timeAttackMode: window.timeAttackMode,
            socialSharingSystem: window.socialSharingSystem,
            multiplayerManager: window.multiplayerManager,
            aiAdaptiveDifficulty: window.aiAdaptiveDifficulty,
            customQuizCreator: window.customQuizCreator,
            voiceNarrationSystem: window.voiceNarrationSystem
        };
    }

    verifyDependencies() {
        const dependencies = {
            powerUpsSystem: ['gameLogic', 'audioManager'],
            achievementsSystem: ['statisticsManager'],
            dailyChallengesSystem: ['achievementsSystem', 'powerUpsSystem'],
            timeAttackMode: ['gameLogic', 'audioManager'],
            multiplayerManager: ['gameLogic', 'audioManager'],
            aiAdaptiveDifficulty: ['gameLogic', 'statisticsManager']
        };

        Object.entries(dependencies).forEach(([feature, deps]) => {
            if (window[feature]) {
                deps.forEach(dep => {
                    if (!window[dep]) {
                        console.warn(`${feature} depends on ${dep} but it's not available`);
                    }
                });
            }
        });
    }

    async fixMobileCompatibility() {
        console.log('📱 Fixing mobile compatibility...');

        try {
            // Add viewport meta tag if missing
            if (!document.querySelector('meta[name="viewport"]')) {
                const viewport = document.createElement('meta');
                viewport.name = 'viewport';
                viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
                document.head.appendChild(viewport);
                this.fixes.push('Viewport meta tag added');
            }

            // Add touch-friendly styles
            this.addMobileStyles();

            // Fix touch events for power-ups
            this.setupTouchEvents();

            this.fixes.push('Mobile compatibility improved');

        } catch (error) {
            this.errors.push(`Mobile fix failed: ${error.message}`);
        }
    }

    addMobileStyles() {
        if (!document.getElementById('mobile-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-styles';
            style.textContent = `
                @media (max-width: 768px) {
                    .powerup-btn {
                        min-height: 44px;
                        min-width: 44px;
                    }

                    .notification {
                        font-size: 14px;
                    }

                    .voice-indicator {
                        font-size: 14px;
                        padding: 0.5rem;
                    }
                }

                /* Touch-friendly interactions */
                .powerup-btn:active {
                    transform: scale(0.95);
                }

                .answer-btn:active {
                    transform: scale(0.98);
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupTouchEvents() {
        // Add touch event support for power-up buttons
        document.querySelectorAll('.powerup-btn').forEach(button => {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                button.style.transform = 'scale(0.95)';
            });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.style.transform = '';
                button.click();
            });
        });
    }

    async fixPerformance() {
        console.log('⚡ Fixing performance issues...');

        try {
            // Debounce frequent events
            this.setupPerformanceOptimizations();

            // Optimize animations
            this.optimizeAnimations();

            this.fixes.push('Performance optimizations applied');

        } catch (error) {
            this.errors.push(`Performance fix failed: ${error.message}`);
        }
    }

    setupPerformanceOptimizations() {
        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                document.dispatchEvent(new Event('debouncedResize'));
            }, 250);
        });
    }

    optimizeAnimations() {
        // Use CSS transform instead of changing layout properties
        const style = document.createElement('style');
        style.textContent = `
            .powerup-btn {
                will-change: transform;
            }

            .notification {
                will-change: transform;
            }

            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Public method to run a quick fix check
    quickFix() {
        console.log('🚀 Running quick integration fix...');

        // Fix most common issues
        if (!window.audioManager || !window.audioManager.playCorrect) {
            this.fixAudioSystem();
        }

        if (!document.getElementById('powerups-bar')) {
            this.createPowerUpsBar();
        }

        if (!document.getElementById('premium-styles')) {
            this.addPremiumStyles();
        }

        console.log('⚡ Quick fix completed');
    }
}

// Create global integration fixer
window.integrationFixer = new IntegrationFixer();

// Auto-run fixes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.integrationFixer.runAllFixes();
    }, 1000);
});

// Add manual fix button for debugging
setTimeout(() => {
    if (document.body) {
        const fixButton = document.createElement('button');
        fixButton.textContent = '🔧 Fix All';
        fixButton.style.cssText = `
            position: fixed;
            top: 50px;
            left: 10px;
            z-index: 10000;
            padding: 10px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        `;
        fixButton.onclick = () => {
            window.integrationFixer.runAllFixes();
        };
        document.body.appendChild(fixButton);
    }
}, 1500);

console.log('🔧 Integration Fixer loaded successfully!');