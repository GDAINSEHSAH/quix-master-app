// Time Attack Mode - Fast-paced quiz mode with time pressure and scoring
class TimeAttackMode {
    constructor() {
        this.isActive = false;
        this.timeLimit = 60; // 60 seconds default
        this.timeRemaining = 0;
        this.score = 0;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.currentStreak = 0;
        this.maxStreak = 0;
        this.currentQuestion = null;
        this.questionStartTime = 0;

        this.settings = {
            duration: 60, // seconds
            pointsPerCorrect: 10,
            timeBonus: true,
            streakMultiplier: true,
            difficultyBonus: true
        };

        this.difficulties = {
            easy: { multiplier: 1, timeLimit: 15 },
            medium: { multiplier: 1.5, timeLimit: 10 },
            hard: { multiplier: 2, timeLimit: 7 },
            expert: { multiplier: 3, timeLimit: 5 }
        };

        this.currentDifficulty = 'medium';
        this.timer = null;
        this.questionTimer = null;

        this.loadSettings();
        this.initializeUI();
    }

    loadSettings() {
        const saved = localStorage.getItem('quiz-timeattack-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('quiz-timeattack-settings', JSON.stringify(this.settings));
    }

    initializeUI() {
        // Setup time attack mode UI elements
        this.createTimeAttackPanel();
        this.setupEventListeners();
    }

    createTimeAttackPanel() {
        // Time attack controls will be added to existing game UI
        const gameArea = document.querySelector('.game-area');
        if (!gameArea) return;

        // Add time attack specific UI elements
        const timeAttackUI = document.createElement('div');
        timeAttackUI.id = 'time-attack-ui';
        timeAttackUI.className = 'time-attack-overlay';
        timeAttackUI.style.display = 'none';

        timeAttackUI.innerHTML = `
            <div class="time-attack-header">
                <div class="time-attack-timer">
                    <div class="timer-circle">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" stroke-width="10"/>
                            <circle id="time-attack-progress" cx="50" cy="50" r="45" fill="none"
                                    stroke="var(--accent-color)" stroke-width="10"
                                    stroke-dasharray="282.6" stroke-dashoffset="282.6"
                                    transform="rotate(-90 50 50)"/>
                        </svg>
                        <div class="timer-text">
                            <span id="time-attack-time">60</span>
                            <small>sec</small>
                        </div>
                    </div>
                </div>

                <div class="time-attack-stats">
                    <div class="stat-item">
                        <div class="stat-value" id="time-attack-score">0</div>
                        <div class="stat-label">Score</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="time-attack-streak">0</div>
                        <div class="stat-label">Streak</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="time-attack-accuracy">100%</div>
                        <div class="stat-label">Accuracy</div>
                    </div>
                </div>

                <div class="difficulty-indicator">
                    <span id="current-difficulty">Medium</span>
                    <div class="difficulty-meter">
                        <div id="difficulty-progress" class="difficulty-bar"></div>
                    </div>
                </div>
            </div>

            <div class="time-attack-multipliers">
                <div id="streak-multiplier" class="multiplier-badge" style="display: none;">
                    <i class="fas fa-fire"></i>
                    <span>x<span id="streak-value">1</span></span>
                </div>
                <div id="speed-bonus" class="multiplier-badge" style="display: none;">
                    <i class="fas fa-bolt"></i>
                    <span>+<span id="speed-value">0</span></span>
                </div>
            </div>
        `;

        gameArea.appendChild(timeAttackUI);
    }

    setupEventListeners() {
        // Listen for time attack mode activation
        document.addEventListener('startTimeAttack', (e) => {
            this.startTimeAttack(e.detail);
        });

        document.addEventListener('endTimeAttack', () => {
            this.endTimeAttack();
        });
    }

    startTimeAttack(options = {}) {
        this.isActive = true;
        this.currentDifficulty = options.difficulty || 'medium';
        this.timeLimit = options.duration || this.settings.duration;
        this.timeRemaining = this.timeLimit;
        this.score = 0;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.currentStreak = 0;
        this.maxStreak = 0;

        // Show time attack UI
        const timeAttackUI = document.getElementById('time-attack-ui');
        if (timeAttackUI) {
            timeAttackUI.style.display = 'block';
        }

        // Hide regular game UI elements
        this.toggleGameUI(false);

        // Start the main timer
        this.startMainTimer();

        // Load first question
        this.loadNextQuestion();

        // Update UI
        this.updateTimeAttackUI();

        console.log(`⚡ Time Attack started: ${this.currentDifficulty} difficulty, ${this.timeLimit}s`);
    }

    startMainTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimeAttackUI();

            if (this.timeRemaining <= 0) {
                this.endTimeAttack();
            }
        }, 1000);
    }

    loadNextQuestion() {
        if (!this.isActive) return;

        // Get a random question from any section
        const sections = ['science', 'history', 'sports', 'literature', 'general'];
        const randomSection = sections[Math.floor(Math.random() * sections.length)];

        // Get questions from game logic
        if (window.gameLogic && window.gameLogic.questionsDatabase) {
            const sectionQuestions = window.gameLogic.questionsDatabase[randomSection];
            if (sectionQuestions && sectionQuestions.length > 0) {
                // Get random question from random level
                const allQuestions = sectionQuestions.flat();
                this.currentQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];

                // Display question
                this.displayQuestion();
                this.questionStartTime = Date.now();

                // Start question timer
                this.startQuestionTimer();
            }
        }
    }

    displayQuestion() {
        if (!this.currentQuestion) return;

        // Update question display
        const questionElement = document.getElementById('question-text');
        const answerButtons = document.querySelectorAll('.answer-btn');

        if (questionElement) {
            questionElement.textContent = this.currentQuestion.question;
        }

        if (answerButtons.length === 4) {
            this.currentQuestion.answers.forEach((answer, index) => {
                answerButtons[index].textContent = answer;
                answerButtons[index].disabled = false;
                answerButtons[index].className = 'answer-btn';
                answerButtons[index].onclick = () => this.submitAnswer(index);
            });
        }
    }

    startQuestionTimer() {
        const questionTimeLimit = this.difficulties[this.currentDifficulty].timeLimit;
        let questionTime = questionTimeLimit;

        this.questionTimer = setInterval(() => {
            questionTime--;

            // Update question progress indicator
            const progress = (questionTime / questionTimeLimit) * 100;
            this.updateQuestionProgress(progress);

            if (questionTime <= 0) {
                // Time's up for this question
                this.submitAnswer(-1); // Wrong answer
            }
        }, 1000);
    }

    submitAnswer(selectedIndex) {
        if (!this.isActive || !this.currentQuestion) return;

        // Clear question timer
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }

        const isCorrect = selectedIndex === this.currentQuestion.correct;
        const answerTime = (Date.now() - this.questionStartTime) / 1000;

        this.questionsAnswered++;

        if (isCorrect) {
            this.correctAnswers++;
            this.currentStreak++;
            this.maxStreak = Math.max(this.maxStreak, this.currentStreak);

            // Calculate score
            const points = this.calculatePoints(answerTime);
            this.score += points;

            // Show feedback
            this.showAnswerFeedback(true, points);

            // Play correct sound
            if (window.audioManager) {
                window.audioManager.playCorrect();
            }
        } else {
            this.currentStreak = 0;

            // Show feedback
            this.showAnswerFeedback(false, 0);

            // Play wrong sound
            if (window.audioManager) {
                window.audioManager.playWrong();
            }
        }

        // Update UI
        this.updateTimeAttackUI();

        // Load next question after delay
        setTimeout(() => {
            this.loadNextQuestion();
        }, 1000);

        // Trigger event for achievements/challenges
        const eventDetail = {
            isCorrect,
            answerTime,
            streak: this.currentStreak,
            score: this.score
        };

        document.dispatchEvent(new CustomEvent('timeAttackAnswer', { detail: eventDetail }));
    }

    calculatePoints(answerTime) {
        let points = this.settings.pointsPerCorrect;
        const difficulty = this.difficulties[this.currentDifficulty];

        // Difficulty multiplier
        if (this.settings.difficultyBonus) {
            points *= difficulty.multiplier;
        }

        // Time bonus
        if (this.settings.timeBonus) {
            const maxTime = difficulty.timeLimit;
            const timeBonus = Math.max(0, (maxTime - answerTime) / maxTime);
            points += Math.floor(points * timeBonus);
        }

        // Streak multiplier
        if (this.settings.streakMultiplier && this.currentStreak > 1) {
            const streakBonus = Math.min(this.currentStreak * 0.1, 1); // Max 100% bonus
            points += Math.floor(points * streakBonus);
        }

        return Math.floor(points);
    }

    showAnswerFeedback(isCorrect, points) {
        // Visual feedback for correct/wrong answers
        const answerButtons = document.querySelectorAll('.answer-btn');

        if (isCorrect) {
            answerButtons[this.currentQuestion.correct].classList.add('correct');

            // Show points popup
            if (points > 0) {
                this.showPointsPopup(points);
            }
        } else {
            // Show correct answer
            answerButtons[this.currentQuestion.correct].classList.add('correct');

            // Mark wrong answers
            answerButtons.forEach((btn, index) => {
                if (index !== this.currentQuestion.correct) {
                    btn.classList.add('wrong');
                }
            });
        }
    }

    showPointsPopup(points) {
        const popup = document.createElement('div');
        popup.className = 'points-popup';
        popup.textContent = `+${points}`;
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
            color: white;
            padding: 1rem 2rem;
            border-radius: 20px;
            font-weight: bold;
            font-size: 1.5rem;
            z-index: 2000;
            animation: pointsPopup 1s ease;
            pointer-events: none;
        `;

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    updateTimeAttackUI() {
        // Update timer
        const timeElement = document.getElementById('time-attack-time');
        if (timeElement) {
            timeElement.textContent = this.timeRemaining;
        }

        // Update timer circle
        const progressCircle = document.getElementById('time-attack-progress');
        if (progressCircle) {
            const percentage = (this.timeRemaining / this.timeLimit) * 100;
            const offset = 282.6 - (282.6 * percentage / 100);
            progressCircle.style.strokeDashoffset = offset;
        }

        // Update score
        const scoreElement = document.getElementById('time-attack-score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }

        // Update streak
        const streakElement = document.getElementById('time-attack-streak');
        if (streakElement) {
            streakElement.textContent = this.currentStreak;
        }

        // Update accuracy
        const accuracy = this.questionsAnswered > 0 ?
            Math.round((this.correctAnswers / this.questionsAnswered) * 100) : 100;
        const accuracyElement = document.getElementById('time-attack-accuracy');
        if (accuracyElement) {
            accuracyElement.textContent = accuracy + '%';
        }

        // Update difficulty
        const difficultyElement = document.getElementById('current-difficulty');
        if (difficultyElement) {
            difficultyElement.textContent = this.currentDifficulty.charAt(0).toUpperCase() +
                                            this.currentDifficulty.slice(1);
        }

        // Update multipliers
        this.updateMultiplierDisplay();
    }

    updateMultiplierDisplay() {
        // Streak multiplier
        const streakMultiplier = document.getElementById('streak-multiplier');
        const streakValue = document.getElementById('streak-value');

        if (this.currentStreak > 1 && streakMultiplier && streakValue) {
            const multiplier = 1 + (this.currentStreak * 0.1);
            streakValue.textContent = multiplier.toFixed(1);
            streakMultiplier.style.display = 'flex';
        } else if (streakMultiplier) {
            streakMultiplier.style.display = 'none';
        }
    }

    updateQuestionProgress(percentage) {
        // Update question-specific progress indicator
        const questionProgress = document.querySelector('.question-progress');
        if (questionProgress) {
            questionProgress.style.width = percentage + '%';
        }
    }

    endTimeAttack() {
        this.isActive = false;

        // Clear timers
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }

        // Hide time attack UI
        const timeAttackUI = document.getElementById('time-attack-ui');
        if (timeAttackUI) {
            timeAttackUI.style.display = 'none';
        }

        // Show regular game UI
        this.toggleGameUI(true);

        // Calculate final statistics
        const accuracy = this.questionsAnswered > 0 ?
            (this.correctAnswers / this.questionsAnswered) * 100 : 0;

        const stats = {
            score: this.score,
            questionsAnswered: this.questionsAnswered,
            correctAnswers: this.correctAnswers,
            accuracy: accuracy,
            maxStreak: this.maxStreak,
            difficulty: this.currentDifficulty,
            duration: this.timeLimit
        };

        // Show results
        this.showTimeAttackResults(stats);

        // Save high score
        this.saveHighScore(stats);

        // Trigger events for achievements/challenges
        document.dispatchEvent(new CustomEvent('timeAttackComplete', { detail: stats }));
        document.dispatchEvent(new CustomEvent('timeAttackScore', { detail: { score: this.score } }));

        console.log(`⚡ Time Attack completed: ${this.score} points`);
    }

    showTimeAttackResults(stats) {
        // Create results modal
        const modal = document.createElement('div');
        modal.className = 'time-attack-results-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <h2>Time Attack Complete!</h2>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-value">${stats.score}</div>
                        <div class="result-label">Final Score</div>
                    </div>
                    <div class="result-item">
                        <div class="result-value">${stats.questionsAnswered}</div>
                        <div class="result-label">Questions</div>
                    </div>
                    <div class="result-item">
                        <div class="result-value">${stats.correctAnswers}</div>
                        <div class="result-label">Correct</div>
                    </div>
                    <div class="result-item">
                        <div class="result-value">${Math.round(stats.accuracy)}%</div>
                        <div class="result-label">Accuracy</div>
                    </div>
                    <div class="result-item">
                        <div class="result-value">${stats.maxStreak}</div>
                        <div class="result-label">Best Streak</div>
                    </div>
                    <div class="result-item">
                        <div class="result-value">${stats.difficulty}</div>
                        <div class="result-label">Difficulty</div>
                    </div>
                </div>
                <div class="results-actions">
                    <button class="btn-primary" onclick="this.closest('.time-attack-results-modal').remove()">
                        Continue
                    </button>
                    <button class="btn-secondary" onclick="window.timeAttackMode.startTimeAttack({difficulty: '${stats.difficulty}', duration: ${stats.duration}})">
                        Play Again
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-remove after 10 seconds if not interacted with
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 10000);
    }

    saveHighScore(stats) {
        const highScores = this.getHighScores();

        highScores.push({
            ...stats,
            date: new Date().toISOString(),
            timestamp: Date.now()
        });

        // Keep only top 10 scores
        highScores.sort((a, b) => b.score - a.score);
        highScores.splice(10);

        localStorage.setItem('quiz-timeattack-highscores', JSON.stringify(highScores));
    }

    getHighScores() {
        const saved = localStorage.getItem('quiz-timeattack-highscores');
        return saved ? JSON.parse(saved) : [];
    }

    toggleGameUI(show) {
        const elementsToToggle = [
            '.quiz-controls',
            '.progress-container',
            '.score-container'
        ];

        elementsToToggle.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = show ? 'block' : 'none';
            }
        });
    }

    // Get time attack statistics
    getTimeAttackStats() {
        const highScores = this.getHighScores();

        return {
            gamesPlayed: highScores.length,
            bestScore: highScores.length > 0 ? highScores[0].score : 0,
            averageScore: highScores.length > 0 ?
                Math.round(highScores.reduce((sum, game) => sum + game.score, 0) / highScores.length) : 0,
            bestAccuracy: highScores.length > 0 ?
                Math.max(...highScores.map(game => game.accuracy)) : 0,
            highScores: highScores.slice(0, 5) // Top 5
        };
    }

    // Export time attack data
    exportTimeAttackData() {
        return {
            settings: this.settings,
            highScores: this.getHighScores()
        };
    }

    // Import time attack data
    importTimeAttackData(data) {
        if (data.settings) {
            this.settings = { ...this.settings, ...data.settings };
            this.saveSettings();
        }
        if (data.highScores) {
            localStorage.setItem('quiz-timeattack-highscores', JSON.stringify(data.highScores));
        }
    }
}

// Global time attack mode instance
window.timeAttackMode = new TimeAttackMode();

// Add CSS for time attack mode
const timeAttackStyles = document.createElement('style');
timeAttackStyles.textContent = `
    .time-attack-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        z-index: 100;
    }

    .time-attack-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--bg-card);
        border-radius: 15px;
        margin-bottom: 1rem;
        box-shadow: var(--shadow-medium);
    }

    .time-attack-timer {
        position: relative;
    }

    .timer-circle {
        width: 80px;
        height: 80px;
        position: relative;
    }

    .timer-circle svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
    }

    .timer-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: var(--text-primary);
        font-weight: bold;
    }

    .timer-text span {
        font-size: 1.5rem;
    }

    .timer-text small {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }

    .time-attack-stats {
        display: flex;
        gap: 2rem;
    }

    .stat-item {
        text-align: center;
    }

    .stat-value {
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--accent-color);
        margin-bottom: 0.25rem;
    }

    .stat-label {
        font-size: 0.8rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .difficulty-indicator {
        text-align: center;
    }

    .difficulty-indicator span {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        display: block;
    }

    .difficulty-meter {
        width: 100px;
        height: 8px;
        background: var(--bg-tertiary);
        border-radius: 4px;
        overflow: hidden;
    }

    .difficulty-bar {
        height: 100%;
        background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);
        transition: width 0.3s ease;
    }

    .time-attack-multipliers {
        position: absolute;
        top: 120px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .multiplier-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--accent-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: bold;
        animation: multiplierPulse 1s ease-in-out infinite;
    }

    @keyframes multiplierPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    .points-popup {
        animation: pointsPopup 1s ease !important;
    }

    @keyframes pointsPopup {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }

    .time-attack-results-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
    }

    .modal-content {
        background: var(--bg-card);
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        position: relative;
        text-align: center;
        box-shadow: var(--shadow-heavy);
    }

    .modal-content h2 {
        color: var(--text-primary);
        margin-bottom: 2rem;
        font-size: 2rem;
    }

    .results-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .result-item {
        text-align: center;
    }

    .result-value {
        font-size: 2rem;
        font-weight: bold;
        color: var(--accent-color);
        margin-bottom: 0.5rem;
    }

    .result-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .results-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .results-actions button {
        padding: 1rem 2rem;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
    }

    .btn-secondary {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }

    .btn-primary:hover, .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
    }

    @media (max-width: 768px) {
        .time-attack-header {
            flex-direction: column;
            gap: 1rem;
        }

        .time-attack-stats {
            gap: 1rem;
        }

        .results-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .results-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(timeAttackStyles);