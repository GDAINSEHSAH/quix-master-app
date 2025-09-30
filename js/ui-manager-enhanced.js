// UI Manager - Handles all user interface updates and interactions
class UIManager {
    constructor() {
        this.screens = {
            loading: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            levelSelection: document.getElementById('level-selection'),
            quizGame: document.getElementById('quiz-game'),
            results: document.getElementById('results-screen')
        };

        this.currentScreen = 'loading';
        this.animationTimeouts = [];
    }

    // Initialize UI after DOM is loaded
    init() {
        this.bindEventListeners();
        this.updateMainMenuStats();
        soundManager.init();

        // Simulate loading time
        setTimeout(() => {
            this.showScreen('mainMenu');
        }, 2000);
    }

    // Bind all event listeners
    bindEventListeners() {
        // Section cards in main menu
        document.querySelectorAll('.section-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const section = card.dataset.section;
                this.showLevelSelection(section);
                soundManager.play('click');
            });
        });

        // Navigation buttons
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showScreen('mainMenu');
            soundManager.play('click');
        });

        document.getElementById('back-to-levels').addEventListener('click', () => {
            gameLogic.endGame();
            this.showLevelSelection(gameLogic.currentSection);
            soundManager.play('click');
        });

        // Settings and achievements buttons
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
            soundManager.play('click');
        });

        document.getElementById('achievements-btn').addEventListener('click', () => {
            this.showAchievements();
            soundManager.play('click');
        });

        // Quiz controls
        document.getElementById('next-question').addEventListener('click', () => {
            this.handleNextQuestion();
            soundManager.play('click');
        });

        // Results screen buttons
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.handleNextLevel();
            soundManager.play('click');
        });

        document.getElementById('retry-level-btn').addEventListener('click', () => {
            this.handleRetryLevel();
            soundManager.play('click');
        });

        document.getElementById('back-to-section').addEventListener('click', () => {
            this.showLevelSelection(gameLogic.currentSection);
            soundManager.play('click');
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }

    // Show a specific screen
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
    }

    // Update main menu statistics
    updateMainMenuStats() {
        const progress = dataManager.userProgress;

        document.getElementById('total-score').textContent = progress.totalScore.toLocaleString();
        document.getElementById('levels-completed').textContent = progress.levelsCompleted;

        // Update section progress
        Object.keys(progress.sections).forEach(sectionId => {
            const sectionProgress = progress.sections[sectionId];
            const sectionCard = document.querySelector(`[data-section="${sectionId}"]`);

            if (sectionCard) {
                const progressFill = sectionCard.querySelector('.progress-fill');
                const progressText = sectionCard.querySelector('.progress-text');

                const completedLevels = sectionProgress.levelsCompleted.length;
                const progressPercent = (completedLevels / 10) * 100;

                progressFill.style.width = `${progressPercent}%`;
                progressText.textContent = `${completedLevels}/10 Levels`;
            }
        });
    }

    // Show level selection for a section
    showLevelSelection(sectionId) {
        const sectionInfo = dataManager.getSectionInfo(sectionId);
        const sectionProgress = dataManager.getSectionProgress(sectionId);

        // Update section title
        document.getElementById('section-title').textContent = sectionInfo.name;

        // Generate level cards
        const levelsGrid = document.getElementById('levels-grid');
        levelsGrid.innerHTML = '';

        for (let level = 1; level <= 10; level++) {
            const isUnlocked = dataManager.isLevelUnlocked(sectionId, level);
            const stars = dataManager.getLevelStars(sectionId, level);
            const isCompleted = sectionProgress.levelsCompleted.includes(level);

            const levelCard = this.createLevelCard(level, isUnlocked, isCompleted, stars);

            if (isUnlocked) {
                levelCard.addEventListener('click', () => {
                    this.startQuiz(sectionId, level);
                    soundManager.play('click');
                });
            }

            levelsGrid.appendChild(levelCard);
        }

        this.showScreen('levelSelection');
    }

    // Create a level card element
    createLevelCard(level, isUnlocked, isCompleted, stars) {
        const card = document.createElement('div');
        card.className = `level-card ${!isUnlocked ? 'locked' : ''}`;

        const difficulty = this.getLevelDifficultyText(level);
        const starsDisplay = '★'.repeat(stars) + '☆'.repeat(3 - stars);

        card.innerHTML = `
            <div class="level-number">${level}</div>
            <div class="level-stars">${isCompleted ? starsDisplay : ''}</div>
            <div class="level-difficulty">${difficulty}</div>
        `;

        return card;
    }

    // Get difficulty text for level
    getLevelDifficultyText(level) {
        if (level <= 2) return 'Easy';
        if (level <= 5) return 'Medium';
        if (level <= 8) return 'Hard';
        return 'Expert';
    }

    // Start a quiz
    async startQuiz(sectionId, level) {
        try {
            this.showScreen('quizGame');

            // Update quiz header
            document.getElementById('current-level').textContent = level;
            document.getElementById('current-score').textContent = '0';

            // Initialize quiz
            const quizData = await gameLogic.initializeQuiz(sectionId, level);

            // Update question counter
            document.getElementById('total-questions').textContent = quizData.totalQuestions;

            // Show first question
            this.displayQuestion(quizData.firstQuestion);

        } catch (error) {
            console.error('Error starting quiz:', error);
            this.showError('Failed to load quiz. Please try again.');
        }
    }

    // Display a question
    displayQuestion(questionData) {
        if (!questionData) {
            this.showQuizResults();
            return;
        }

        // Update question counter
        document.getElementById('question-number').textContent = questionData.questionNumber;

        // Update question text
        document.getElementById('question-text').textContent = questionData.question;

        // Create answer options
        const answersContainer = document.getElementById('answers-container');
        answersContainer.innerHTML = '';

        questionData.options.forEach((option, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.textContent = option;
            answerDiv.addEventListener('click', () => this.selectAnswer(index));
            answersContainer.appendChild(answerDiv);
        });

        // Hide next button
        document.getElementById('next-question').style.display = 'none';

        // Start timer
        gameLogic.startTimer(
            (timeRemaining) => this.updateTimer(timeRemaining),
            () => this.handleTimeout()
        );
    }

    // Handle answer selection
    selectAnswer(answerIndex) {
        if (!gameLogic.isValidAnswer(answerIndex)) return;

        const result = gameLogic.submitAnswer(answerIndex);
        if (!result) return;

        // Update UI based on result
        this.showAnswerResult(result);

        // Update score display
        document.getElementById('current-score').textContent = result.totalScore;

        // Play sound effect
        soundManager.play(result.isCorrect ? 'correct' : 'incorrect');

        // Show next button or complete quiz
        if (!gameLogic.isQuizComplete()) {
            document.getElementById('next-question').style.display = 'block';
        } else {
            setTimeout(() => this.showQuizResults(), 2000);
        }
    }

    // Show answer result
    showAnswerResult(result) {
        const answerOptions = document.querySelectorAll('.answer-option');

        answerOptions.forEach((option, index) => {
            option.style.pointerEvents = 'none';

            if (index === result.correctAnswer) {
                option.classList.add('correct');
            } else if (index === gameLogic.selectedAnswer && !result.isCorrect) {
                option.classList.add('incorrect');
            }
        });

        // Show explanation if available
        if (result.explanation) {
            this.showExplanation(result.explanation);
        }
    }

    // Show explanation
    showExplanation(explanation) {
        // Create explanation element
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
        explanationDiv.innerHTML = `
            <div class="explanation-header">💡 Explanation</div>
            <div class="explanation-text">${explanation}</div>
        `;

        // Add styles
        explanationDiv.style.cssText = `
            background: #f8faff;
            border: 2px solid #667eea;
            border-radius: 12px;
            padding: 1rem;
            margin-top: 1rem;
            animation: fadeIn 0.5s ease-in-out;
        `;

        document.querySelector('.quiz-content').appendChild(explanationDiv);
    }

    // Handle next question
    handleNextQuestion() {
        // Clear previous explanation
        const explanation = document.querySelector('.explanation');
        if (explanation) {
            explanation.remove();
        }

        const nextQuestion = gameLogic.nextQuestion();
        this.displayQuestion(nextQuestion);
    }

    // Handle timeout
    handleTimeout() {
        soundManager.play('incorrect');
        this.selectAnswer(-1); // Mark as timeout
    }

    // Update timer display
    updateTimer(timeRemaining) {
        const timerDisplay = document.getElementById('timer-display');
        timerDisplay.textContent = timeRemaining;

        // Add visual feedback for low time
        const timerCircle = document.querySelector('.timer-circle');
        if (timeRemaining <= 5) {
            timerCircle.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
            soundManager.play('tick');
        } else if (timeRemaining <= 10) {
            timerCircle.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        } else {
            timerCircle.style.background = 'var(--primary-gradient)';
        }
    }

    // Show quiz results
    showQuizResults() {
        const results = gameLogic.getFinalResults();

        // Update results display
        document.getElementById('correct-answers').textContent = results.correctAnswers;
        document.getElementById('final-score').textContent = results.score;
        document.getElementById('accuracy').textContent = `${results.accuracy}%`;

        // Update results icon and title
        const resultsIcon = document.getElementById('results-icon');
        const resultsTitle = document.getElementById('results-title');

        if (results.performance === 'excellent') {
            resultsIcon.textContent = '🏆';
            resultsTitle.textContent = 'Excellent!';
        } else if (results.performance === 'good') {
            resultsIcon.textContent = '🎉';
            resultsTitle.textContent = 'Great Job!';
        } else if (results.performance === 'average') {
            resultsIcon.textContent = '👍';
            resultsTitle.textContent = 'Good Work!';
        } else {
            resultsIcon.textContent = '📚';
            resultsTitle.textContent = 'Keep Trying!';
        }

        // Update results message
        document.getElementById('results-message').textContent =
            gameLogic.getPerformanceMessage(results.performance);

        // Show/hide next level button
        const nextLevelBtn = document.getElementById('next-level-btn');
        if (results.levelPassed && results.nextLevelUnlocked) {
            nextLevelBtn.style.display = 'block';
        } else {
            nextLevelBtn.style.display = 'none';
        }

        // Update main menu stats
        this.updateMainMenuStats();

        // Show results screen
        this.showScreen('results');

        // Play completion sound
        soundManager.play('complete');
    }

    // Handle next level
    handleNextLevel() {
        const nextLevel = gameLogic.currentLevel + 1;
        if (nextLevel <= 10) {
            this.startQuiz(gameLogic.currentSection, nextLevel);
        }
    }

    // Handle retry level
    handleRetryLevel() {
        this.startQuiz(gameLogic.currentSection, gameLogic.currentLevel);
    }

    // Show settings modal
    showSettings() {
        // Create settings modal
        const modal = this.createModal('Settings', `
            <div class="settings-option">
                <label>
                    <input type="checkbox" id="sound-toggle" ${soundManager.enabled ? 'checked' : ''}>
                    Sound Effects
                </label>
            </div>
            <div class="settings-option">
                <label>
                    <input type="checkbox" id="timer-toggle" ${dataManager.userProgress.settings.timerEnabled ? 'checked' : ''}>
                    Timer
                </label>
            </div>
            <div class="settings-option">
                <button class="btn btn-secondary" id="reset-progress">Reset All Progress</button>
            </div>
            <div class="settings-option">
                <button class="btn btn-secondary" id="export-progress">Export Progress</button>
            </div>
        `);

        // Bind settings event listeners
        modal.querySelector('#sound-toggle').addEventListener('change', (e) => {
            soundManager.enabled = e.target.checked;
            dataManager.userProgress.settings.soundEnabled = e.target.checked;
            dataManager.saveProgress();
        });

        modal.querySelector('#timer-toggle').addEventListener('change', (e) => {
            dataManager.userProgress.settings.timerEnabled = e.target.checked;
            dataManager.saveProgress();
        });

        modal.querySelector('#reset-progress').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                dataManager.resetProgress();
                this.updateMainMenuStats();
                this.closeModal();
                this.showScreen('mainMenu');
            }
        });

        modal.querySelector('#export-progress').addEventListener('click', () => {
            const progressData = dataManager.exportProgress();
            this.downloadData(progressData, 'quiz-master-progress.json');
        });
    }

    // Show achievements modal
    showAchievements() {
        const achievements = this.getAchievementsList();
        const modal = this.createModal('Achievements', `
            <div class="achievements-list">
                ${achievements.map(achievement => `
                    <div class="achievement-item ${achievement.earned ? 'earned' : 'locked'}">
                        <div class="achievement-icon">${achievement.earned ? '🏆' : '🔒'}</div>
                        <div class="achievement-info">
                            <div class="achievement-name">${achievement.name}</div>
                            <div class="achievement-description">${achievement.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `);
    }

    // Get achievements list
    getAchievementsList() {
        const earnedAchievements = dataManager.userProgress.achievements;

        return [
            {
                id: 'first_level',
                name: 'Getting Started',
                description: 'Complete your first level',
                earned: earnedAchievements.includes('first_level')
            },
            {
                id: 'perfect_score',
                name: 'Perfect!',
                description: 'Get 100% accuracy on a level',
                earned: earnedAchievements.includes('perfect_score')
            },
            {
                id: 'level_5',
                name: 'Warming Up',
                description: 'Complete 5 levels',
                earned: earnedAchievements.includes('level_5')
            },
            {
                id: 'level_10',
                name: 'Getting Serious',
                description: 'Complete 10 levels',
                earned: earnedAchievements.includes('level_10')
            },
            {
                id: 'high_scorer',
                name: 'High Scorer',
                description: 'Reach 1000 total points',
                earned: earnedAchievements.includes('high_scorer')
            }
        ];
    }

    // Create modal
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        modal.querySelector('.modal-content').style.cssText = `
            background: white;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            max-height: 80%;
            overflow-y: auto;
            box-shadow: var(--shadow-xl);
        `;

        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        document.body.appendChild(modal);
        return modal;
    }

    // Close modal
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    // Handle keyboard input
    handleKeyboardInput(e) {
        if (this.currentScreen === 'quizGame' && gameLogic.gameActive) {
            // Number keys for answers
            if (e.key >= '1' && e.key <= '4') {
                const answerIndex = parseInt(e.key) - 1;
                this.selectAnswer(answerIndex);
            }
            // Space for next question
            else if (e.key === ' ' && document.getElementById('next-question').style.display !== 'none') {
                e.preventDefault();
                this.handleNextQuestion();
            }
        }
        // Escape to go back
        else if (e.key === 'Escape') {
            if (this.currentScreen === 'levelSelection') {
                this.showScreen('mainMenu');
            } else if (this.currentScreen === 'quizGame') {
                gameLogic.endGame();
                this.showLevelSelection(gameLogic.currentSection);
            }
        }
    }

    // Show error message
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    // Download data as file
    downloadData(data, filename) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Create global UI manager instance
const uiManager = new UIManager();