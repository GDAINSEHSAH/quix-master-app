// Voice Narration System - Text-to-speech and speech-to-text functionality
class VoiceNarrationSystem {
    constructor() {
        this.isSupported = 'speechSynthesis' in window && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
        this.speechSynthesis = window.speechSynthesis;
        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        this.voices = [];
        this.currentVoice = null;
        this.isNarrating = false;
        this.isListening = false;
        this.recognition = null;

        this.settings = {
            enabled: true,
            autoNarration: false, // Auto-narrate questions
            voiceAnswers: false,  // Allow voice answers
            narrationSpeed: 1.0,  // 0.5 to 2.0
            narrationPitch: 1.0,  // 0 to 2
            narrationVolume: 0.8, // 0 to 1
            preferredVoice: null,
            language: 'en-US',
            readQuestions: true,
            readAnswers: false,
            readFeedback: true,
            readResults: true
        };

        this.phrases = {
            welcome: "Welcome to Quiz Master! Get ready to test your knowledge.",
            questionIntro: "Question {number}:",
            timeWarning: "Time is running out!",
            timeUp: "Time's up!",
            correct: ["Correct!", "Well done!", "Excellent!", "That's right!", "Perfect!"],
            incorrect: ["Incorrect.", "Sorry, that's not right.", "Not quite.", "Try again next time."],
            answerReveal: "The correct answer is {answer}.",
            scoreUpdate: "Your score is now {score} points.",
            gameComplete: "Quiz complete! Your final score is {score} points.",
            achievement: "Achievement unlocked: {name}!",
            powerUpUsed: "Power-up activated: {name}",
            listeningStart: "I'm listening for your answer...",
            listeningStop: "Voice input stopped.",
            voiceNotRecognized: "Sorry, I didn't understand that. Please try again."
        };

        this.answerKeywords = {
            'a': ['a', 'option a', 'first', 'first option', 'one'],
            'b': ['b', 'option b', 'second', 'second option', 'two'],
            'c': ['c', 'option c', 'third', 'third option', 'three'],
            'd': ['d', 'option d', 'fourth', 'fourth option', 'four'],
            'true': ['true', 'yes', 'correct', 'right'],
            'false': ['false', 'no', 'incorrect', 'wrong'],
            'skip': ['skip', 'pass', 'next', 'skip question'],
            'repeat': ['repeat', 'say again', 'read again', 'repeat question']
        };

        this.loadSettings();
        this.initializeVoiceSystem();
        this.setupEventListeners();
    }

    loadSettings() {
        const saved = localStorage.getItem('quiz-voice-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('quiz-voice-settings', JSON.stringify(this.settings));
    }

    initializeVoiceSystem() {
        if (!this.isSupported) {
            console.warn('Voice narration not supported in this browser');
            return;
        }

        // Initialize speech synthesis
        this.loadVoices();

        // Initialize speech recognition
        if (this.SpeechRecognition) {
            this.recognition = new this.SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.settings.language;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                this.processVoiceInput(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();

                if (event.error === 'no-speech') {
                    this.speak(this.phrases.voiceNotRecognized);
                }
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceUI();
            };
        }

        this.createVoiceControls();
    }

    loadVoices() {
        const updateVoices = () => {
            this.voices = this.speechSynthesis.getVoices();

            // Find preferred voice or default
            if (this.settings.preferredVoice) {
                this.currentVoice = this.voices.find(voice => voice.name === this.settings.preferredVoice);
            }

            if (!this.currentVoice) {
                // Find best default voice for the language
                this.currentVoice = this.voices.find(voice =>
                    voice.lang.startsWith(this.settings.language.split('-')[0]) && voice.default
                ) || this.voices.find(voice =>
                    voice.lang.startsWith(this.settings.language.split('-')[0])
                ) || this.voices[0];
            }

            this.updateVoiceSelector();
        };

        // Load voices (they might not be available immediately)
        updateVoices();
        if (this.voices.length === 0) {
            this.speechSynthesis.onvoiceschanged = updateVoices;
        }
    }

    createVoiceControls() {
        // Add voice controls to settings panel
        const voiceControls = document.createElement('div');
        voiceControls.className = 'voice-controls';
        voiceControls.innerHTML = `
            <div class="voice-settings">
                <h4>🎤 Voice Narration</h4>

                <div class="setting-group">
                    <label>
                        <input type="checkbox" id="voice-enabled" ${this.settings.enabled ? 'checked' : ''}>
                        Enable Voice Narration
                    </label>
                </div>

                <div class="setting-group">
                    <label>
                        <input type="checkbox" id="auto-narration" ${this.settings.autoNarration ? 'checked' : ''}>
                        Auto-narrate Questions
                    </label>
                </div>

                <div class="setting-group">
                    <label>
                        <input type="checkbox" id="voice-answers" ${this.settings.voiceAnswers ? 'checked' : ''}>
                        Voice Answer Input
                    </label>
                </div>

                <div class="setting-group">
                    <label for="voice-selector">Voice:</label>
                    <select id="voice-selector">
                        <!-- Populated by updateVoiceSelector -->
                    </select>
                </div>

                <div class="setting-group">
                    <label for="voice-speed">Speed:</label>
                    <input type="range" id="voice-speed" min="0.5" max="2" step="0.1" value="${this.settings.narrationSpeed}">
                    <span class="range-value">${this.settings.narrationSpeed}x</span>
                </div>

                <div class="setting-group">
                    <label for="voice-pitch">Pitch:</label>
                    <input type="range" id="voice-pitch" min="0" max="2" step="0.1" value="${this.settings.narrationPitch}">
                    <span class="range-value">${this.settings.narrationPitch}</span>
                </div>

                <div class="setting-group">
                    <label for="voice-volume">Volume:</label>
                    <input type="range" id="voice-volume" min="0" max="1" step="0.1" value="${this.settings.narrationVolume}">
                    <span class="range-value">${Math.round(this.settings.narrationVolume * 100)}%</span>
                </div>

                <div class="voice-test">
                    <button class="btn-primary test-voice-btn">Test Voice</button>
                    <button class="btn-secondary voice-command-btn" ${!this.settings.voiceAnswers ? 'disabled' : ''}>
                        🎤 Voice Command
                    </button>
                </div>

                <div class="voice-commands-help" style="display: none;">
                    <h5>Voice Commands:</h5>
                    <ul>
                        <li>"A", "B", "C", "D" - Select answer</li>
                        <li>"True", "False" - For true/false questions</li>
                        <li>"Skip" - Skip question</li>
                        <li>"Repeat" - Repeat question</li>
                    </ul>
                </div>
            </div>
        `;

        // Add to settings panel
        const settingsPanel = document.querySelector('.settings-content');
        if (settingsPanel) {
            settingsPanel.appendChild(voiceControls);
        }

        this.setupVoiceControlEvents(voiceControls);
    }

    setupVoiceControlEvents(voiceControls) {
        // Enable/disable voice narration
        const enabledCheckbox = voiceControls.querySelector('#voice-enabled');
        enabledCheckbox.onchange = () => {
            this.settings.enabled = enabledCheckbox.checked;
            this.saveSettings();
            this.updateVoiceUI();
        };

        // Auto-narration
        const autoNarrationCheckbox = voiceControls.querySelector('#auto-narration');
        autoNarrationCheckbox.onchange = () => {
            this.settings.autoNarration = autoNarrationCheckbox.checked;
            this.saveSettings();
        };

        // Voice answers
        const voiceAnswersCheckbox = voiceControls.querySelector('#voice-answers');
        voiceAnswersCheckbox.onchange = () => {
            this.settings.voiceAnswers = voiceAnswersCheckbox.checked;
            this.saveSettings();
            this.updateVoiceUI();
        };

        // Voice selector
        const voiceSelector = voiceControls.querySelector('#voice-selector');
        voiceSelector.onchange = () => {
            const selectedVoice = this.voices.find(voice => voice.name === voiceSelector.value);
            this.currentVoice = selectedVoice;
            this.settings.preferredVoice = selectedVoice?.name;
            this.saveSettings();
        };

        // Range inputs
        ['speed', 'pitch', 'volume'].forEach(property => {
            const slider = voiceControls.querySelector(`#voice-${property}`);
            const valueDisplay = slider.nextElementSibling;

            slider.oninput = () => {
                const value = parseFloat(slider.value);
                this.settings[`narration${property.charAt(0).toUpperCase() + property.slice(1)}`] = value;

                if (property === 'volume') {
                    valueDisplay.textContent = Math.round(value * 100) + '%';
                } else {
                    valueDisplay.textContent = value + (property === 'speed' ? 'x' : '');
                }

                this.saveSettings();
            };
        });

        // Test voice button
        const testVoiceBtn = voiceControls.querySelector('.test-voice-btn');
        testVoiceBtn.onclick = () => {
            this.speak("This is a test of the voice narration system. Your voice settings sound great!");
        };

        // Voice command button
        const voiceCommandBtn = voiceControls.querySelector('.voice-command-btn');
        voiceCommandBtn.onclick = () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        };

        // Help toggle
        const helpBtn = document.createElement('button');
        helpBtn.className = 'btn-info help-btn';
        helpBtn.textContent = '?';
        helpBtn.onclick = () => {
            const helpDiv = voiceControls.querySelector('.voice-commands-help');
            helpDiv.style.display = helpDiv.style.display === 'none' ? 'block' : 'none';
        };
        voiceControls.querySelector('.voice-test').appendChild(helpBtn);
    }

    updateVoiceSelector() {
        const selector = document.querySelector('#voice-selector');
        if (!selector) return;

        selector.innerHTML = this.voices.map(voice =>
            `<option value="${voice.name}" ${voice === this.currentVoice ? 'selected' : ''}>
                ${voice.name} (${voice.lang})
            </option>`
        ).join('');
    }

    updateVoiceUI() {
        const voiceCommandBtn = document.querySelector('.voice-command-btn');
        if (voiceCommandBtn) {
            voiceCommandBtn.disabled = !this.settings.voiceAnswers || !this.settings.enabled;
            voiceCommandBtn.textContent = this.isListening ? '🔴 Stop Listening' : '🎤 Voice Command';
        }

        // Update voice indicator in game UI
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            const indicator = gameArea.querySelector('.voice-indicator') || document.createElement('div');
            indicator.className = 'voice-indicator';

            if (this.isListening) {
                indicator.innerHTML = '🎤 Listening...';
                indicator.style.display = 'block';
            } else {
                indicator.style.display = 'none';
            }

            if (!gameArea.contains(indicator)) {
                gameArea.appendChild(indicator);
            }
        }
    }

    setupEventListeners() {
        // Listen for game events to provide narration
        document.addEventListener('questionDisplayed', (e) => {
            if (this.settings.enabled && this.settings.autoNarration && this.settings.readQuestions) {
                this.narrateQuestion(e.detail);
            }
        });

        document.addEventListener('answerSubmitted', (e) => {
            if (this.settings.enabled && this.settings.readFeedback) {
                this.narrateAnswerFeedback(e.detail);
            }
        });

        document.addEventListener('scoreUpdated', (e) => {
            if (this.settings.enabled) {
                this.narrateScoreUpdate(e.detail.score);
            }
        });

        document.addEventListener('gameComplete', (e) => {
            if (this.settings.enabled && this.settings.readResults) {
                this.narrateGameComplete(e.detail);
            }
        });

        document.addEventListener('achievementUnlocked', (e) => {
            if (this.settings.enabled) {
                this.narrateAchievement(e.detail);
            }
        });

        document.addEventListener('powerUpUsed', (e) => {
            if (this.settings.enabled) {
                this.narratePowerUp(e.detail);
            }
        });

        document.addEventListener('timeWarning', () => {
            if (this.settings.enabled) {
                this.speak(this.phrases.timeWarning);
            }
        });

        document.addEventListener('timeUp', () => {
            if (this.settings.enabled) {
                this.speak(this.phrases.timeUp);
            }
        });

        // Voice command shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'v' && e.ctrlKey && this.settings.voiceAnswers) {
                e.preventDefault();
                if (this.isListening) {
                    this.stopListening();
                } else {
                    this.startListening();
                }
            }
        });
    }

    speak(text, options = {}) {
        if (!this.settings.enabled || !this.isSupported || !text) return;

        // Stop current narration if speaking
        if (this.isNarrating) {
            this.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Apply settings
        utterance.voice = this.currentVoice;
        utterance.rate = options.rate || this.settings.narrationSpeed;
        utterance.pitch = options.pitch || this.settings.narrationPitch;
        utterance.volume = options.volume || this.settings.narrationVolume;
        utterance.lang = this.settings.language;

        // Event handlers
        utterance.onstart = () => {
            this.isNarrating = true;
        };

        utterance.onend = () => {
            this.isNarrating = false;
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isNarrating = false;
        };

        // Speak the text
        this.speechSynthesis.speak(utterance);
    }

    stopSpeaking() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
            this.isNarrating = false;
        }
    }

    narrateQuestion(questionData) {
        const { question, questionNumber, answers } = questionData;

        let narrationText = this.phrases.questionIntro.replace('{number}', questionNumber) + ' ' + question;

        if (this.settings.readAnswers && answers) {
            narrationText += ' The options are: ';
            answers.forEach((answer, index) => {
                const letter = String.fromCharCode(65 + index);
                narrationText += `${letter}, ${answer}. `;
            });
        }

        this.speak(narrationText);
    }

    narrateAnswerFeedback(answerData) {
        const { isCorrect, correctAnswer, explanation } = answerData;

        let feedbackText;

        if (isCorrect) {
            feedbackText = this.getRandomPhrase(this.phrases.correct);
        } else {
            feedbackText = this.getRandomPhrase(this.phrases.incorrect);
            if (correctAnswer) {
                feedbackText += ' ' + this.phrases.answerReveal.replace('{answer}', correctAnswer);
            }
        }

        if (explanation && isCorrect) {
            feedbackText += ' ' + explanation;
        }

        this.speak(feedbackText);
    }

    narrateScoreUpdate(score) {
        const scoreText = this.phrases.scoreUpdate.replace('{score}', score);
        this.speak(scoreText);
    }

    narrateGameComplete(gameData) {
        const { finalScore, accuracy, achievements } = gameData;

        let completionText = this.phrases.gameComplete.replace('{score}', finalScore);

        if (accuracy) {
            completionText += ` You achieved ${Math.round(accuracy)}% accuracy.`;
        }

        if (achievements && achievements.length > 0) {
            completionText += ` You earned ${achievements.length} achievement${achievements.length > 1 ? 's' : ''}.`;
        }

        this.speak(completionText);
    }

    narrateAchievement(achievement) {
        const achievementText = this.phrases.achievement.replace('{name}', achievement.name);
        this.speak(achievementText, { pitch: 1.2, rate: 0.9 }); // Slightly higher pitch for achievements
    }

    narratePowerUp(powerUpData) {
        const powerUpText = this.phrases.powerUpUsed.replace('{name}', powerUpData.name);
        this.speak(powerUpText, { rate: 1.1 }); // Slightly faster for power-ups
    }

    startListening() {
        if (!this.settings.enabled || !this.settings.voiceAnswers || !this.recognition) return;

        try {
            this.isListening = true;
            this.recognition.start();
            this.speak(this.phrases.listeningStart);
            this.updateVoiceUI();
        } catch (error) {
            console.error('Failed to start voice recognition:', error);
            this.isListening = false;
            this.updateVoiceUI();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.speak(this.phrases.listeningStop);
            this.updateVoiceUI();
        }
    }

    processVoiceInput(transcript) {
        console.log('Voice input received:', transcript);

        // Find matching command
        let matchedCommand = null;
        let matchedOption = null;

        for (const [option, keywords] of Object.entries(this.answerKeywords)) {
            if (keywords.some(keyword => transcript.includes(keyword))) {
                matchedCommand = option;
                matchedOption = option;
                break;
            }
        }

        if (matchedCommand) {
            this.executeVoiceCommand(matchedCommand, matchedOption);
        } else {
            this.speak(this.phrases.voiceNotRecognized);
        }
    }

    executeVoiceCommand(command, option) {
        switch (command) {
            case 'a':
            case 'b':
            case 'c':
            case 'd':
                const answerIndex = command.charCodeAt(0) - 97; // Convert 'a' to 0, 'b' to 1, etc.
                this.selectAnswer(answerIndex);
                break;

            case 'true':
                this.selectAnswer(0); // True is typically first option
                break;

            case 'false':
                this.selectAnswer(1); // False is typically second option
                break;

            case 'skip':
                this.skipQuestion();
                break;

            case 'repeat':
                this.repeatQuestion();
                break;

            default:
                this.speak(this.phrases.voiceNotRecognized);
        }
    }

    selectAnswer(answerIndex) {
        const answerButtons = document.querySelectorAll('.answer-btn');
        if (answerButtons[answerIndex] && !answerButtons[answerIndex].disabled) {
            answerButtons[answerIndex].click();
            this.speak(`Selected option ${String.fromCharCode(65 + answerIndex)}`);
        } else {
            this.speak("That option is not available.");
        }
    }

    skipQuestion() {
        // Look for skip button or power-up
        const skipBtn = document.querySelector('.skip-btn') || document.getElementById('skip');
        if (skipBtn && !skipBtn.disabled) {
            skipBtn.click();
            this.speak("Question skipped.");
        } else {
            this.speak("Cannot skip this question.");
        }
    }

    repeatQuestion() {
        // Re-narrate the current question
        const questionElement = document.getElementById('question-text');
        const answerButtons = document.querySelectorAll('.answer-btn');

        if (questionElement) {
            const questionText = questionElement.textContent;
            const answers = Array.from(answerButtons).map(btn => btn.textContent);

            this.narrateQuestion({
                question: questionText,
                questionNumber: "current",
                answers: answers
            });
        }
    }

    getRandomPhrase(phrases) {
        if (Array.isArray(phrases)) {
            return phrases[Math.floor(Math.random() * phrases.length)];
        }
        return phrases;
    }

    // Accessibility features
    enableAccessibilityMode() {
        this.settings.autoNarration = true;
        this.settings.readQuestions = true;
        this.settings.readAnswers = true;
        this.settings.readFeedback = true;
        this.settings.readResults = true;
        this.settings.voiceAnswers = true;
        this.saveSettings();

        this.speak("Accessibility mode enabled. All content will be narrated, and voice commands are active.");
    }

    // Export voice settings
    exportVoiceSettings() {
        return {
            settings: this.settings,
            currentVoice: this.currentVoice?.name,
            isSupported: this.isSupported
        };
    }

    // Import voice settings
    importVoiceSettings(data) {
        if (data.settings) {
            this.settings = { ...this.settings, ...data.settings };
            this.saveSettings();
        }

        if (data.currentVoice) {
            const voice = this.voices.find(v => v.name === data.currentVoice);
            if (voice) {
                this.currentVoice = voice;
                this.settings.preferredVoice = voice.name;
            }
        }

        this.updateVoiceUI();
        this.updateVoiceSelector();
    }

    // Get voice statistics
    getVoiceStats() {
        return {
            isSupported: this.isSupported,
            voicesAvailable: this.voices.length,
            currentVoice: this.currentVoice?.name,
            language: this.settings.language,
            featuresEnabled: {
                narration: this.settings.enabled,
                autoNarration: this.settings.autoNarration,
                voiceAnswers: this.settings.voiceAnswers
            }
        };
    }
}

// Global voice narration system
window.voiceNarrationSystem = new VoiceNarrationSystem();

// Add CSS for voice controls
const voiceStyles = document.createElement('style');
voiceStyles.textContent = `
    .voice-controls {
        background: var(--bg-secondary);
        border-radius: 10px;
        padding: 1.5rem;
        margin: 1rem 0;
    }

    .voice-controls h4 {
        color: var(--text-primary);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .setting-group {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .setting-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-primary);
        font-weight: 500;
    }

    .setting-group input[type="checkbox"] {
        width: 18px;
        height: 18px;
    }

    .setting-group input[type="range"] {
        width: 100%;
        margin: 0.5rem 0;
    }

    .setting-group select {
        padding: 0.5rem;
        border: 1px solid var(--bg-tertiary);
        border-radius: 5px;
        background: var(--bg-card);
        color: var(--text-primary);
    }

    .range-value {
        color: var(--accent-color);
        font-weight: 600;
        min-width: 50px;
        text-align: right;
    }

    .voice-test {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        align-items: center;
    }

    .help-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: none;
        background: var(--info-color);
        color: white;
        font-weight: bold;
        cursor: pointer;
    }

    .voice-commands-help {
        background: var(--bg-tertiary);
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
    }

    .voice-commands-help h5 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }

    .voice-commands-help ul {
        color: var(--text-secondary);
        margin: 0;
        padding-left: 1.5rem;
    }

    .voice-commands-help li {
        margin-bottom: 0.25rem;
    }

    .voice-indicator {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--error-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        z-index: 1000;
        animation: voicePulse 1s infinite;
        box-shadow: var(--shadow-medium);
    }

    @keyframes voicePulse {
        0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
        50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
    }

    .voice-command-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .voice-test {
            flex-direction: column;
            align-items: stretch;
        }

        .voice-controls {
            padding: 1rem;
        }
    }
`;
document.head.appendChild(voiceStyles);