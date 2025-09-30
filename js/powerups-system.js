// Power-ups System - Special abilities and boosters for enhanced gameplay
class PowerUpsSystem {
    constructor() {
        this.powerUps = {
            fiftyFifty: {
                id: 'fiftyFifty',
                name: '50/50',
                description: 'Remove two wrong answers',
                icon: 'fas fa-divide',
                cost: 10,
                maxCount: 5,
                cooldown: 0,
                rarity: 'common'
            },
            extraTime: {
                id: 'extraTime',
                name: 'Extra Time',
                description: 'Add 30 seconds to the timer',
                icon: 'fas fa-clock',
                cost: 15,
                maxCount: 3,
                cooldown: 0,
                rarity: 'rare'
            },
            skip: {
                id: 'skip',
                name: 'Skip Question',
                description: 'Skip current question without penalty',
                icon: 'fas fa-forward',
                cost: 20,
                maxCount: 2,
                cooldown: 0,
                rarity: 'rare'
            },
            doublePoints: {
                id: 'doublePoints',
                name: 'Double Points',
                description: 'Double points for next 3 questions',
                icon: 'fas fa-gem',
                cost: 25,
                maxCount: 2,
                cooldown: 0,
                rarity: 'epic'
            },
            revealAnswer: {
                id: 'revealAnswer',
                name: 'Reveal Answer',
                description: 'Show the correct answer',
                icon: 'fas fa-eye',
                cost: 30,
                maxCount: 1,
                cooldown: 0,
                rarity: 'epic'
            },
            freezeTime: {
                id: 'freezeTime',
                name: 'Freeze Time',
                description: 'Stop the timer for 10 seconds',
                icon: 'fas fa-snowflake',
                cost: 35,
                maxCount: 1,
                cooldown: 0,
                rarity: 'legendary'
            },
            perfectQuestion: {
                id: 'perfectQuestion',
                name: 'Perfect Question',
                description: 'Automatically answer correctly with max points',
                icon: 'fas fa-star',
                cost: 50,
                maxCount: 1,
                cooldown: 0,
                rarity: 'mythic'
            }
        };

        this.inventory = {};
        this.activePowerUps = {};
        this.loadInventory();
        this.initializePowerUpUI();
    }

    loadInventory() {
        const saved = localStorage.getItem('quiz-powerups-inventory');
        if (saved) {
            this.inventory = JSON.parse(saved);
        } else {
            // Start with some free power-ups
            this.inventory = {
                fiftyFifty: 3,
                extraTime: 2,
                skip: 1,
                doublePoints: 1
            };
            this.saveInventory();
        }
    }

    saveInventory() {
        localStorage.setItem('quiz-powerups-inventory', JSON.stringify(this.inventory));
    }

    initializePowerUpUI() {
        // Update power-up buttons with current counts
        Object.keys(this.powerUps).forEach(powerUpId => {
            this.updatePowerUpButton(powerUpId);
        });
    }

    updatePowerUpButton(powerUpId) {
        const button = document.getElementById(powerUpId);
        if (!button) return;

        const count = this.inventory[powerUpId] || 0;
        const countElement = button.querySelector('.powerup-count');

        if (countElement) {
            countElement.textContent = count;
        }

        // Disable button if no power-ups left
        if (count <= 0) {
            button.disabled = true;
            button.classList.add('disabled');
        } else {
            button.disabled = false;
            button.classList.remove('disabled');
        }
    }

    usePowerUp(powerUpId) {
        const powerUp = this.powerUps[powerUpId];
        if (!powerUp) {
            console.warn(`Power-up ${powerUpId} not found`);
            return false;
        }

        // Check if player has this power-up
        if (!this.inventory[powerUpId] || this.inventory[powerUpId] <= 0) {
            this.showPowerUpMessage('No power-ups remaining!', 'error');
            return false;
        }

        // Check cooldown
        if (this.activePowerUps[powerUpId] && this.activePowerUps[powerUpId].cooldownEnds > Date.now()) {
            this.showPowerUpMessage('Power-up is on cooldown!', 'warning');
            return false;
        }

        // Use power-up
        this.inventory[powerUpId]--;
        this.saveInventory();
        this.updatePowerUpButton(powerUpId);

        // Apply power-up effect
        const success = this.applyPowerUpEffect(powerUpId);

        if (success) {
            // Play sound effect
            if (window.audioManager) {
                window.audioManager.playPowerup();
            }

            // Show notification
            this.showPowerUpNotification(powerUp);

            // Track usage
            this.trackPowerUpUsage(powerUpId);

            // Add visual effects
            this.addPowerUpVisualEffects(powerUpId);

            console.log(`💎 Power-up used: ${powerUp.name}`);
            return true;
        } else {
            // Refund if power-up couldn't be used
            this.inventory[powerUpId]++;
            this.saveInventory();
            this.updatePowerUpButton(powerUpId);
            return false;
        }
    }

    applyPowerUpEffect(powerUpId) {
        switch (powerUpId) {
            case 'fiftyFifty':
                return this.applyFiftyFifty();
            case 'extraTime':
                return this.applyExtraTime();
            case 'skip':
                return this.applySkipQuestion();
            case 'doublePoints':
                return this.applyDoublePoints();
            case 'revealAnswer':
                return this.applyRevealAnswer();
            case 'freezeTime':
                return this.applyFreezeTime();
            case 'perfectQuestion':
                return this.applyPerfectQuestion();
            default:
                return false;
        }
    }

    applyFiftyFifty() {
        if (!window.gameLogic || !window.gameLogic.currentQuestions) {
            return false;
        }

        const currentQuestion = window.gameLogic.getCurrentQuestion();
        if (!currentQuestion) return false;

        const answerButtons = document.querySelectorAll('.answer-btn');
        if (answerButtons.length !== 4) return false;

        const correctIndex = currentQuestion.correct;
        const wrongIndices = [];

        // Find wrong answer indices
        for (let i = 0; i < 4; i++) {
            if (i !== correctIndex) {
                wrongIndices.push(i);
            }
        }

        // Randomly select 2 wrong answers to remove
        const indicesToRemove = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);

        // Hide the selected wrong answers
        indicesToRemove.forEach(index => {
            answerButtons[index].style.opacity = '0.3';
            answerButtons[index].style.pointerEvents = 'none';
            answerButtons[index].classList.add('eliminated');
        });

        return true;
    }

    applyExtraTime() {
        if (!window.gameLogic) return false;

        // Add 30 seconds to the timer
        window.gameLogic.timeRemaining = Math.min(
            window.gameLogic.timeRemaining + 30,
            window.gameLogic.timeLimit
        );

        // Update timer display
        if (window.uiManager) {
            window.uiManager.updateTimer();
        }

        return true;
    }

    applySkipQuestion() {
        if (!window.gameLogic) return false;

        // Mark question as skipped (no penalty)
        window.gameLogic.skipCurrentQuestion();
        return true;
    }

    applyDoublePoints() {
        if (!window.gameLogic) return false;

        // Activate double points for next 3 questions
        this.activePowerUps.doublePoints = {
            questionsRemaining: 3,
            multiplier: 2,
            activatedAt: Date.now()
        };

        // Update score multiplier display
        const multiplierElement = document.getElementById('score-multiplier');
        const multiplierValue = document.getElementById('multiplier-value');

        if (multiplierElement && multiplierValue) {
            multiplierValue.textContent = '2';
            multiplierElement.style.display = 'flex';
        }

        return true;
    }

    applyRevealAnswer() {
        if (!window.gameLogic) return false;

        const currentQuestion = window.gameLogic.getCurrentQuestion();
        if (!currentQuestion) return false;

        const answerButtons = document.querySelectorAll('.answer-btn');
        const correctIndex = currentQuestion.correct;

        // Highlight the correct answer
        if (answerButtons[correctIndex]) {
            answerButtons[correctIndex].classList.add('revealed-correct');
            answerButtons[correctIndex].style.background = 'linear-gradient(45deg, #28a745, #20c997)';
            answerButtons[correctIndex].style.animation = 'pulse 1s infinite';
        }

        return true;
    }

    applyFreezeTime() {
        if (!window.gameLogic) return false;

        // Freeze timer for 10 seconds
        this.activePowerUps.freezeTime = {
            duration: 10000,
            activatedAt: Date.now()
        };

        // Visual indication that time is frozen
        const timerElement = document.getElementById('timer-circle');
        if (timerElement) {
            timerElement.style.stroke = '#00f5ff';
            timerElement.style.filter = 'drop-shadow(0 0 10px #00f5ff)';
        }

        setTimeout(() => {
            if (timerElement) {
                timerElement.style.stroke = '';
                timerElement.style.filter = '';
            }
            delete this.activePowerUps.freezeTime;
        }, 10000);

        return true;
    }

    applyPerfectQuestion() {
        if (!window.gameLogic) return false;

        const currentQuestion = window.gameLogic.getCurrentQuestion();
        if (!currentQuestion) return false;

        // Automatically submit correct answer with maximum points
        window.gameLogic.timeRemaining = window.gameLogic.timeLimit; // Full time bonus
        window.gameLogic.submitAnswer(currentQuestion.correct);

        return true;
    }

    showPowerUpNotification(powerUp) {
        const notification = document.getElementById('powerup-notification');
        if (!notification) return;

        const titleElement = document.getElementById('powerup-title');
        const descriptionElement = document.getElementById('powerup-description');

        if (titleElement) titleElement.textContent = powerUp.name + ' Activated!';
        if (descriptionElement) descriptionElement.textContent = powerUp.description;

        // Show notification
        notification.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    showPowerUpMessage(message, type = 'info') {
        // Create a temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `powerup-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: var(--shadow-heavy);
            z-index: 2000;
            animation: fadeInOut 2s ease;
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 2000);
    }

    addPowerUpVisualEffects(powerUpId) {
        const powerUp = this.powerUps[powerUpId];
        const button = document.getElementById(powerUpId);

        if (button) {
            // Add activation effect
            button.style.transform = 'scale(1.2)';
            button.style.boxShadow = '0 0 20px var(--accent-color)';

            setTimeout(() => {
                button.style.transform = '';
                button.style.boxShadow = '';
            }, 300);
        }

        // Create particles
        if (window.particleEffects) {
            window.particleEffects.createPowerUpParticles(powerUpId);
        }
    }

    trackPowerUpUsage(powerUpId) {
        const stats = window.statisticsManager?.getStats() || {};
        if (!stats.powerUpsUsed) stats.powerUpsUsed = {};
        if (!stats.powerUpsUsed[powerUpId]) stats.powerUpsUsed[powerUpId] = 0;

        stats.powerUpsUsed[powerUpId]++;

        if (window.statisticsManager) {
            window.statisticsManager.updateStats(stats);
        }
    }

    // Check if double points is active and reduce count
    processQuestionComplete() {
        if (this.activePowerUps.doublePoints) {
            this.activePowerUps.doublePoints.questionsRemaining--;

            if (this.activePowerUps.doublePoints.questionsRemaining <= 0) {
                // Deactivate double points
                delete this.activePowerUps.doublePoints;

                // Hide multiplier display
                const multiplierElement = document.getElementById('score-multiplier');
                if (multiplierElement) {
                    multiplierElement.style.display = 'none';
                }
            }
        }
    }

    // Get current score multiplier
    getScoreMultiplier() {
        return this.activePowerUps.doublePoints ? this.activePowerUps.doublePoints.multiplier : 1;
    }

    // Check if time is frozen
    isTimeFrozen() {
        return this.activePowerUps.freezeTime !== undefined;
    }

    // Purchase power-ups with coins
    purchasePowerUp(powerUpId, quantity = 1) {
        const powerUp = this.powerUps[powerUpId];
        if (!powerUp) return false;

        const totalCost = powerUp.cost * quantity;

        // Check if player has enough coins
        if (window.gameLogic && window.gameLogic.coins >= totalCost) {
            window.gameLogic.spendCoins(totalCost);

            // Add to inventory
            if (!this.inventory[powerUpId]) this.inventory[powerUpId] = 0;
            this.inventory[powerUpId] += quantity;

            this.saveInventory();
            this.updatePowerUpButton(powerUpId);

            this.showPowerUpMessage(`Purchased ${quantity}x ${powerUp.name}!`, 'success');
            return true;
        } else {
            this.showPowerUpMessage('Not enough coins!', 'error');
            return false;
        }
    }

    // Award free power-ups
    awardPowerUp(powerUpId, quantity = 1) {
        if (!this.inventory[powerUpId]) this.inventory[powerUpId] = 0;
        this.inventory[powerUpId] += quantity;

        this.saveInventory();
        this.updatePowerUpButton(powerUpId);

        const powerUp = this.powerUps[powerUpId];
        this.showPowerUpMessage(`Received ${quantity}x ${powerUp.name}!`, 'success');
    }

    // Get inventory
    getInventory() {
        return this.inventory;
    }

    // Get all power-ups info
    getAllPowerUps() {
        return this.powerUps;
    }

    // Reset inventory (for testing)
    resetInventory() {
        this.inventory = {};
        this.activePowerUps = {};
        this.saveInventory();
        this.initializePowerUpUI();
    }

    // Export power-ups data
    exportPowerUps() {
        return {
            inventory: this.inventory,
            activePowerUps: this.activePowerUps
        };
    }

    // Import power-ups data
    importPowerUps(data) {
        if (data.inventory) {
            this.inventory = data.inventory;
            this.saveInventory();
            this.initializePowerUpUI();
        }
        if (data.activePowerUps) {
            this.activePowerUps = data.activePowerUps;
        }
    }
}

// Global power-ups system
window.powerUpsSystem = new PowerUpsSystem();

// Add CSS for power-up effects
const powerUpStyles = document.createElement('style');
powerUpStyles.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    .answer-btn.eliminated {
        background: #6c757d !important;
        color: #ffffff !important;
        text-decoration: line-through;
    }

    .answer-btn.revealed-correct {
        animation: revealPulse 2s infinite !important;
    }

    @keyframes revealPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    .powerup-message {
        animation: fadeInOut 2s ease;
    }

    .powerup-message.success {
        border-left: 4px solid var(--success-color);
    }

    .powerup-message.error {
        border-left: 4px solid var(--error-color);
    }

    .powerup-message.warning {
        border-left: 4px solid var(--warning-color);
    }
`;
document.head.appendChild(powerUpStyles);