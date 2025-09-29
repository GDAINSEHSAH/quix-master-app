// Game Logic - Handles quiz game mechanics and scoring
class GameLogic {
    constructor() {
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.timeRemaining = 30;
        this.timerInterval = null;
        this.selectedAnswer = null;
        this.gameActive = false;
        this.currentSection = null;
        this.currentLevel = null;
    }

    // Initialize a new quiz session
    async initializeQuiz(section, level) {
        this.currentSection = section;
        this.currentLevel = level;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.selectedAnswer = null;
        this.gameActive = true;

        // Load questions for this section and level
        this.currentQuestions = await dataManager.loadQuestions(section, level);

        if (this.currentQuestions.length === 0) {
            throw new Error('No questions available for this level');
        }

        // Shuffle questions for variety
        this.shuffleArray(this.currentQuestions);

        return {
            totalQuestions: this.currentQuestions.length,
            firstQuestion: this.getCurrentQuestion()
        };
    }

    // Get the current question
    getCurrentQuestion() {
        if (this.currentQuestionIndex < this.currentQuestions.length) {
            const question = this.currentQuestions[this.currentQuestionIndex];
            return {
                question: question.question,
                options: [...question.options], // Create a copy
                questionNumber: this.currentQuestionIndex + 1,
                totalQuestions: this.currentQuestions.length,
                timeLimit: this.getTimeLimit()
            };
        }
        return null;
    }

    // Get time limit based on level difficulty
    getTimeLimit() {
        const baseTimes = {
            1: 45, 2: 40, 3: 35, 4: 30, 5: 30,
            6: 25, 7: 25, 8: 20, 9: 20, 10: 15
        };
        return baseTimes[this.currentLevel] || 30;
    }

    // Start the timer for current question
    startTimer(onTick, onTimeout) {
        this.timeRemaining = this.getTimeLimit();
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            onTick(this.timeRemaining);

            if (this.timeRemaining <= 0) {
                this.stopTimer();
                onTimeout();
            }
        }, 1000);
    }

    // Stop the current timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Submit an answer
    submitAnswer(answerIndex) {
        if (!this.gameActive || this.selectedAnswer !== null) {
            return null;
        }

        this.selectedAnswer = answerIndex;
        this.stopTimer();

        const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = answerIndex === currentQuestion.correct;

        if (isCorrect) {
            this.correctAnswers++;
            this.score += this.calculateScore();
        }

        return {
            isCorrect,
            correctAnswer: currentQuestion.correct,
            explanation: currentQuestion.explanation,
            scoreEarned: isCorrect ? this.calculateScore() : 0,
            totalScore: this.score
        };
    }

    // Calculate score based on time remaining and difficulty
    calculateScore() {
        const baseScore = 100;
        const timeBonus = Math.max(0, this.timeRemaining * 2);
        const levelMultiplier = 1 + (this.currentLevel - 1) * 0.1;

        return Math.round((baseScore + timeBonus) * levelMultiplier);
    }

    // Move to next question
    nextQuestion() {
        this.currentQuestionIndex++;
        this.selectedAnswer = null;
        return this.getCurrentQuestion();
    }

    // Check if quiz is complete
    isQuizComplete() {
        return this.currentQuestionIndex >= this.currentQuestions.length;
    }

    // Get final results
    getFinalResults() {
        const totalQuestions = this.currentQuestions.length;
        const accuracy = Math.round((this.correctAnswers / totalQuestions) * 100);

        let performance;
        if (accuracy >= 90) performance = 'excellent';
        else if (accuracy >= 75) performance = 'good';
        else if (accuracy >= 60) performance = 'average';
        else performance = 'needs_improvement';

        const results = {
            correctAnswers: this.correctAnswers,
            totalQuestions: totalQuestions,
            score: this.score,
            accuracy: accuracy,
            performance: performance,
            levelPassed: accuracy >= 60,
            stars: this.calculateStars(accuracy)
        };

        // Update user progress
        if (results.levelPassed) {
            const progressUpdate = dataManager.updateProgress(
                this.currentSection,
                this.currentLevel,
                this.score,
                this.correctAnswers,
                totalQuestions
            );
            results.nextLevelUnlocked = progressUpdate.nextLevelUnlocked;
            results.newAchievements = progressUpdate.newAchievements;
        }

        return results;
    }

    // Calculate stars earned (1-3)
    calculateStars(accuracy) {
        if (accuracy >= 95) return 3;
        if (accuracy >= 80) return 2;
        if (accuracy >= 60) return 1;
        return 0;
    }

    // Get performance message
    getPerformanceMessage(performance) {
        const messages = {
            excellent: "Outstanding! You're a quiz master! 🌟",
            good: "Great job! You really know your stuff! 👏",
            average: "Good work! Keep practicing to improve! 📚",
            needs_improvement: "Don't give up! Review and try again! 💪"
        };
        return messages[performance] || messages.average;
    }

    // Shuffle array utility
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Get hint for current question (if available)
    getHint() {
        const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
        if (currentQuestion.hint) {
            return currentQuestion.hint;
        }
        return "No hint available for this question.";
    }

    // Skip current question (with penalty)
    skipQuestion() {
        if (!this.gameActive) return null;

        this.stopTimer();
        this.selectedAnswer = -1; // Mark as skipped

        return {
            isCorrect: false,
            correctAnswer: this.currentQuestions[this.currentQuestionIndex].correct,
            explanation: this.currentQuestions[this.currentQuestionIndex].explanation,
            scoreEarned: 0,
            totalScore: this.score,
            skipped: true
        };
    }

    // Pause the game
    pauseGame() {
        this.gameActive = false;
        this.stopTimer();
    }

    // Resume the game
    resumeGame(onTick, onTimeout) {
        this.gameActive = true;
        if (this.selectedAnswer === null) {
            this.startTimer(onTick, onTimeout);
        }
    }

    // End the current game
    endGame() {
        this.gameActive = false;
        this.stopTimer();
    }

    // Get game statistics
    getGameStats() {
        return {
            currentSection: this.currentSection,
            currentLevel: this.currentLevel,
            currentQuestionIndex: this.currentQuestionIndex,
            totalQuestions: this.currentQuestions.length,
            score: this.score,
            correctAnswers: this.correctAnswers,
            timeRemaining: this.timeRemaining,
            gameActive: this.gameActive
        };
    }

    // Validate answer format
    isValidAnswer(answerIndex) {
        return (
            typeof answerIndex === 'number' &&
            answerIndex >= 0 &&
            answerIndex < 4 &&
            this.gameActive &&
            this.selectedAnswer === null
        );
    }
}

// Sound effects manager
class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = dataManager.userProgress.settings.soundEnabled;
    }

    // Initialize sound effects
    init() {
        // In a full implementation, you would load actual audio files
        this.sounds = {
            correct: this.createBeep(800, 0.2),
            incorrect: this.createBeep(300, 0.5),
            tick: this.createBeep(600, 0.1),
            complete: this.createBeep(1000, 0.8),
            click: this.createBeep(400, 0.1)
        };
    }

    // Create a simple beep sound
    createBeep(frequency, duration) {
        return () => {
            if (!this.enabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (error) {
                console.log('Sound not supported');
            }
        };
    }

    // Play a sound effect
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        dataManager.userProgress.settings.soundEnabled = this.enabled;
        dataManager.saveProgress();
    }
}

// Create global instances
const gameLogic = new GameLogic();
const soundManager = new SoundManager();