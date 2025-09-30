// Daily Challenges System - Provide daily quests and special objectives
class DailyChallengesSystem {
    constructor() {
        this.challenges = {
            // Daily Challenges
            speedRunner: {
                id: 'speedRunner',
                name: 'Speed Runner',
                description: 'Answer 10 questions in under 5 seconds each',
                type: 'daily',
                target: 10,
                progress: 0,
                difficulty: 'medium',
                xpReward: 100,
                coinReward: 50,
                powerUpReward: { type: 'extraTime', quantity: 1 },
                icon: '⚡',
                category: 'performance'
            },
            perfectionist: {
                id: 'perfectionist',
                name: 'Perfectionist',
                description: 'Complete a quiz with 100% accuracy',
                type: 'daily',
                target: 1,
                progress: 0,
                difficulty: 'hard',
                xpReward: 150,
                coinReward: 75,
                powerUpReward: { type: 'doublePoints', quantity: 1 },
                icon: '💯',
                category: 'accuracy'
            },
            marathonist: {
                id: 'marathonist',
                name: 'Marathonist',
                description: 'Answer 50 questions in one session',
                type: 'daily',
                target: 50,
                progress: 0,
                difficulty: 'easy',
                xpReward: 75,
                coinReward: 30,
                powerUpReward: { type: 'fiftyFifty', quantity: 2 },
                icon: '🏃',
                category: 'endurance'
            },
            streakMaster: {
                id: 'streakMaster',
                name: 'Streak Master',
                description: 'Get 15 correct answers in a row',
                type: 'daily',
                target: 15,
                progress: 0,
                difficulty: 'medium',
                xpReward: 120,
                coinReward: 60,
                powerUpReward: { type: 'skip', quantity: 1 },
                icon: '🔥',
                category: 'consistency'
            },
            powerUser: {
                id: 'powerUser',
                name: 'Power User',
                description: 'Use 5 different power-ups in one session',
                type: 'daily',
                target: 5,
                progress: 0,
                difficulty: 'medium',
                xpReward: 100,
                coinReward: 50,
                powerUpReward: { type: 'revealAnswer', quantity: 1 },
                icon: '💎',
                category: 'powerups'
            },
            categoryExplorer: {
                id: 'categoryExplorer',
                name: 'Category Explorer',
                description: 'Play quizzes from 3 different sections',
                type: 'daily',
                target: 3,
                progress: 0,
                difficulty: 'easy',
                xpReward: 80,
                coinReward: 40,
                powerUpReward: { type: 'extraTime', quantity: 1 },
                icon: '🌍',
                category: 'exploration'
            },

            // Weekly Challenges
            weeklyWarrior: {
                id: 'weeklyWarrior',
                name: 'Weekly Warrior',
                description: 'Complete 20 quizzes this week',
                type: 'weekly',
                target: 20,
                progress: 0,
                difficulty: 'medium',
                xpReward: 500,
                coinReward: 200,
                powerUpReward: { type: 'perfectQuestion', quantity: 1 },
                icon: '⚔️',
                category: 'dedication'
            },
            knowledgeSeeker: {
                id: 'knowledgeSeeker',
                name: 'Knowledge Seeker',
                description: 'Answer 500 questions correctly this week',
                type: 'weekly',
                target: 500,
                progress: 0,
                difficulty: 'hard',
                xpReward: 750,
                coinReward: 300,
                powerUpReward: { type: 'freezeTime', quantity: 1 },
                icon: '📚',
                category: 'knowledge'
            },
            socialButterly: {
                id: 'socialButterly',
                name: 'Social Butterfly',
                description: 'Play 10 multiplayer matches this week',
                type: 'weekly',
                target: 10,
                progress: 0,
                difficulty: 'medium',
                xpReward: 400,
                coinReward: 150,
                powerUpReward: { type: 'doublePoints', quantity: 2 },
                icon: '👥',
                category: 'social'
            },

            // Special Event Challenges
            timeAttacker: {
                id: 'timeAttacker',
                name: 'Time Attacker',
                description: 'Score 500+ points in Time Attack mode',
                type: 'special',
                target: 500,
                progress: 0,
                difficulty: 'hard',
                xpReward: 200,
                coinReward: 100,
                powerUpReward: { type: 'extraTime', quantity: 3 },
                icon: '⏱️',
                category: 'timeattack'
            },
            mastermind: {
                id: 'mastermind',
                name: 'Mastermind',
                description: 'Complete all levels in Science section',
                type: 'special',
                target: 5,
                progress: 0,
                difficulty: 'epic',
                xpReward: 1000,
                coinReward: 500,
                powerUpReward: { type: 'perfectQuestion', quantity: 2 },
                icon: '🧠',
                category: 'mastery'
            }
        };

        this.activeChallenges = [];
        this.completedChallenges = [];
        this.challengeHistory = [];

        this.loadProgress();
        this.generateDailyChallenges();
        this.initializeUI();
    }

    loadProgress() {
        const saved = localStorage.getItem('quiz-daily-challenges');
        if (saved) {
            const data = JSON.parse(saved);
            this.activeChallenges = data.activeChallenges || [];
            this.completedChallenges = data.completedChallenges || [];
            this.challengeHistory = data.challengeHistory || [];

            // Restore progress for active challenges
            this.activeChallenges.forEach(activeChallenge => {
                if (this.challenges[activeChallenge.id]) {
                    this.challenges[activeChallenge.id].progress = activeChallenge.progress;
                }
            });
        }
    }

    saveProgress() {
        const data = {
            activeChallenges: this.activeChallenges,
            completedChallenges: this.completedChallenges,
            challengeHistory: this.challengeHistory,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('quiz-daily-challenges', JSON.stringify(data));
    }

    generateDailyChallenges() {
        const today = new Date().toDateString();
        const lastGenerated = localStorage.getItem('challenges-last-generated');

        // Check if we need to generate new daily challenges
        if (lastGenerated !== today) {
            this.resetDailyChallenges();
            this.selectDailyChallenges();
            localStorage.setItem('challenges-last-generated', today);
        }

        // Check weekly challenges
        this.updateWeeklyChallenges();
    }

    resetDailyChallenges() {
        // Reset progress for daily challenges
        Object.values(this.challenges).forEach(challenge => {
            if (challenge.type === 'daily') {
                challenge.progress = 0;
            }
        });

        // Move completed daily challenges to history
        this.activeChallenges = this.activeChallenges.filter(challenge => {
            if (this.challenges[challenge.id]?.type === 'daily') {
                if (challenge.completed) {
                    this.challengeHistory.push({
                        ...challenge,
                        completedAt: new Date().toISOString()
                    });
                }
                return false;
            }
            return true;
        });
    }

    selectDailyChallenges() {
        const dailyChallenges = Object.values(this.challenges).filter(c => c.type === 'daily');

        // Select 3 random daily challenges
        const selected = dailyChallenges.sort(() => Math.random() - 0.5).slice(0, 3);

        selected.forEach(challenge => {
            this.activeChallenges.push({
                id: challenge.id,
                progress: 0,
                completed: false,
                startedAt: new Date().toISOString()
            });
        });
    }

    updateWeeklyChallenges() {
        const weeklyChallenges = Object.values(this.challenges).filter(c => c.type === 'weekly');

        weeklyChallenges.forEach(challenge => {
            const existingActive = this.activeChallenges.find(ac => ac.id === challenge.id);
            if (!existingActive) {
                this.activeChallenges.push({
                    id: challenge.id,
                    progress: 0,
                    completed: false,
                    startedAt: new Date().toISOString()
                });
            }
        });
    }

    updateProgress(challengeType, data = {}) {
        this.activeChallenges.forEach(activeChallenge => {
            const challenge = this.challenges[activeChallenge.id];
            if (!challenge || activeChallenge.completed) return;

            let progressIncrement = 0;

            switch (challengeType) {
                case 'questionAnswered':
                    if (challenge.category === 'endurance' || challenge.category === 'knowledge') {
                        progressIncrement = 1;
                    }
                    break;

                case 'correctAnswer':
                    if (challenge.category === 'consistency') {
                        if (data.streak) {
                            progressIncrement = 1;
                        } else {
                            // Reset streak challenges on wrong answer
                            if (challenge.id === 'streakMaster') {
                                challenge.progress = 0;
                                activeChallenge.progress = 0;
                            }
                        }
                    }
                    if (challenge.category === 'knowledge') {
                        progressIncrement = 1;
                    }
                    break;

                case 'fastAnswer':
                    if (challenge.category === 'performance' && data.time < 5) {
                        progressIncrement = 1;
                    }
                    break;

                case 'perfectQuiz':
                    if (challenge.category === 'accuracy') {
                        progressIncrement = 1;
                    }
                    break;

                case 'powerUpUsed':
                    if (challenge.category === 'powerups') {
                        // Track unique power-ups used
                        if (!activeChallenge.powerUpsUsed) {
                            activeChallenge.powerUpsUsed = new Set();
                        }
                        activeChallenge.powerUpsUsed.add(data.powerUpType);
                        challenge.progress = activeChallenge.powerUpsUsed.size;
                        activeChallenge.progress = challenge.progress;
                    }
                    break;

                case 'sectionPlayed':
                    if (challenge.category === 'exploration') {
                        if (!activeChallenge.sectionsPlayed) {
                            activeChallenge.sectionsPlayed = new Set();
                        }
                        activeChallenge.sectionsPlayed.add(data.section);
                        challenge.progress = activeChallenge.sectionsPlayed.size;
                        activeChallenge.progress = challenge.progress;
                    }
                    break;

                case 'quizCompleted':
                    if (challenge.category === 'dedication') {
                        progressIncrement = 1;
                    }
                    break;

                case 'multiplayerMatch':
                    if (challenge.category === 'social') {
                        progressIncrement = 1;
                    }
                    break;

                case 'timeAttackScore':
                    if (challenge.category === 'timeattack' && data.score >= challenge.target) {
                        challenge.progress = challenge.target;
                        activeChallenge.progress = challenge.target;
                    }
                    break;

                case 'levelCompleted':
                    if (challenge.category === 'mastery' && data.section === 'science') {
                        progressIncrement = 1;
                    }
                    break;
            }

            if (progressIncrement > 0) {
                challenge.progress = Math.min(challenge.progress + progressIncrement, challenge.target);
                activeChallenge.progress = challenge.progress;
            }

            // Check if challenge is completed
            if (challenge.progress >= challenge.target && !activeChallenge.completed) {
                this.completeChallenge(activeChallenge.id);
            }
        });

        this.saveProgress();
        this.updateChallengeUI();
    }

    completeChallenge(challengeId) {
        const activeChallenge = this.activeChallenges.find(ac => ac.id === challengeId);
        const challenge = this.challenges[challengeId];

        if (!activeChallenge || !challenge) return;

        // Mark as completed
        activeChallenge.completed = true;
        activeChallenge.completedAt = new Date().toISOString();

        // Add to completed challenges
        this.completedChallenges.push({
            ...activeChallenge,
            rewards: {
                xp: challenge.xpReward,
                coins: challenge.coinReward,
                powerUp: challenge.powerUpReward
            }
        });

        // Award rewards
        this.awardRewards(challenge);

        // Show completion notification
        this.showChallengeCompletionNotification(challenge);

        // Play completion sound
        if (window.audioManager) {
            window.audioManager.playAchievement();
        }

        console.log(`🎯 Challenge completed: ${challenge.name}`);
    }

    awardRewards(challenge) {
        // Award XP
        if (window.gameLogic && challenge.xpReward) {
            window.gameLogic.awardXP(challenge.xpReward);
        }

        // Award coins
        if (window.gameLogic && challenge.coinReward) {
            window.gameLogic.awardCoins(challenge.coinReward);
        }

        // Award power-up
        if (window.powerUpsSystem && challenge.powerUpReward) {
            window.powerUpsSystem.awardPowerUp(
                challenge.powerUpReward.type,
                challenge.powerUpReward.quantity
            );
        }
    }

    showChallengeCompletionNotification(challenge) {
        const notification = document.getElementById('challenge-notification');
        if (!notification) return;

        const titleElement = document.getElementById('challenge-title');
        const descriptionElement = document.getElementById('challenge-description');
        const rewardsElement = document.getElementById('challenge-rewards');

        if (titleElement) titleElement.textContent = challenge.name + ' Completed!';
        if (descriptionElement) descriptionElement.textContent = challenge.description;

        if (rewardsElement) {
            rewardsElement.innerHTML = `
                <div class="reward-item">+${challenge.xpReward} XP</div>
                <div class="reward-item">+${challenge.coinReward} <i class="fas fa-coins"></i></div>
                <div class="reward-item">+${challenge.powerUpReward.quantity} ${challenge.powerUpReward.type}</div>
            `;
        }

        // Show notification
        notification.classList.add('show');

        // Hide after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);

        // Add particle effects
        if (window.particleEffects) {
            window.particleEffects.createChallengeParticles(challenge);
        }
    }

    initializeUI() {
        this.updateChallengeUI();
        this.setupEventListeners();
    }

    updateChallengeUI() {
        const challengesList = document.getElementById('daily-challenges-list');
        if (!challengesList) return;

        challengesList.innerHTML = '';

        // Separate challenges by type
        const dailyChallenges = this.activeChallenges.filter(ac =>
            this.challenges[ac.id]?.type === 'daily'
        );
        const weeklyChallenges = this.activeChallenges.filter(ac =>
            this.challenges[ac.id]?.type === 'weekly'
        );
        const specialChallenges = this.activeChallenges.filter(ac =>
            this.challenges[ac.id]?.type === 'special'
        );

        // Create sections
        if (dailyChallenges.length > 0) {
            this.createChallengeSection('Daily Challenges', dailyChallenges, challengesList);
        }
        if (weeklyChallenges.length > 0) {
            this.createChallengeSection('Weekly Challenges', weeklyChallenges, challengesList);
        }
        if (specialChallenges.length > 0) {
            this.createChallengeSection('Special Events', specialChallenges, challengesList);
        }
    }

    createChallengeSection(title, challenges, container) {
        const section = document.createElement('div');
        section.className = 'challenge-section';

        const header = document.createElement('h4');
        header.className = 'challenge-section-title';
        header.textContent = title;
        section.appendChild(header);

        challenges.forEach(activeChallenge => {
            const challenge = this.challenges[activeChallenge.id];
            if (challenge) {
                const card = this.createChallengeCard(challenge, activeChallenge);
                section.appendChild(card);
            }
        });

        container.appendChild(section);
    }

    createChallengeCard(challenge, activeChallenge) {
        const card = document.createElement('div');
        card.className = `challenge-card ${challenge.difficulty} ${activeChallenge.completed ? 'completed' : ''}`;

        const progressPercentage = Math.round((challenge.progress / challenge.target) * 100);

        card.innerHTML = `
            <div class="challenge-icon">${challenge.icon}</div>
            <div class="challenge-info">
                <h5 class="challenge-name">${challenge.name}</h5>
                <p class="challenge-description">${challenge.description}</p>
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                    <span class="progress-text">${challenge.progress}/${challenge.target}</span>
                </div>
                <div class="challenge-rewards">
                    <span class="xp-reward">+${challenge.xpReward} XP</span>
                    <span class="coin-reward">+${challenge.coinReward} <i class="fas fa-coins"></i></span>
                    <span class="powerup-reward">+${challenge.powerUpReward.quantity} ${challenge.powerUpReward.type}</span>
                </div>
                ${activeChallenge.completed ? `
                    <div class="completion-badge">
                        <i class="fas fa-check"></i> Completed!
                    </div>
                ` : ''}
            </div>
        `;

        return card;
    }

    setupEventListeners() {
        // Listen for game events to update challenge progress
        document.addEventListener('questionAnswered', (e) => {
            this.updateProgress('questionAnswered', e.detail);
        });

        document.addEventListener('correctAnswer', (e) => {
            this.updateProgress('correctAnswer', e.detail);
        });

        document.addEventListener('fastAnswer', (e) => {
            this.updateProgress('fastAnswer', e.detail);
        });

        document.addEventListener('perfectQuiz', (e) => {
            this.updateProgress('perfectQuiz', e.detail);
        });

        document.addEventListener('powerUpUsed', (e) => {
            this.updateProgress('powerUpUsed', e.detail);
        });

        document.addEventListener('sectionPlayed', (e) => {
            this.updateProgress('sectionPlayed', e.detail);
        });

        document.addEventListener('quizCompleted', (e) => {
            this.updateProgress('quizCompleted', e.detail);
        });

        document.addEventListener('multiplayerMatch', (e) => {
            this.updateProgress('multiplayerMatch', e.detail);
        });

        document.addEventListener('timeAttackScore', (e) => {
            this.updateProgress('timeAttackScore', e.detail);
        });

        document.addEventListener('levelCompleted', (e) => {
            this.updateProgress('levelCompleted', e.detail);
        });
    }

    // Get challenge statistics
    getChallengeStats() {
        return {
            activeChallenges: this.activeChallenges.length,
            completedToday: this.completedChallenges.filter(c =>
                new Date(c.completedAt).toDateString() === new Date().toDateString()
            ).length,
            totalCompleted: this.completedChallenges.length,
            streakDays: this.calculateStreakDays()
        };
    }

    calculateStreakDays() {
        // Calculate consecutive days with completed challenges
        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);

        while (streak < 100) { // Max 100 days to check
            const dateStr = currentDate.toDateString();
            const hasCompleted = this.challengeHistory.some(c =>
                new Date(c.completedAt).toDateString() === dateStr
            );

            if (hasCompleted) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    // Export challenge data
    exportChallenges() {
        return {
            activeChallenges: this.activeChallenges,
            completedChallenges: this.completedChallenges,
            challengeHistory: this.challengeHistory,
            definitions: this.challenges
        };
    }

    // Import challenge data
    importChallenges(data) {
        if (data.activeChallenges) this.activeChallenges = data.activeChallenges;
        if (data.completedChallenges) this.completedChallenges = data.completedChallenges;
        if (data.challengeHistory) this.challengeHistory = data.challengeHistory;
        if (data.definitions) this.challenges = { ...this.challenges, ...data.definitions };

        this.saveProgress();
        this.updateChallengeUI();
    }

    // Reset all challenges (for testing)
    resetAllChallenges() {
        this.activeChallenges = [];
        this.completedChallenges = [];
        this.challengeHistory = [];

        Object.values(this.challenges).forEach(challenge => {
            challenge.progress = 0;
        });

        localStorage.removeItem('challenges-last-generated');
        this.saveProgress();
        this.generateDailyChallenges();
        this.updateChallengeUI();
    }
}

// Global daily challenges system
window.dailyChallengesSystem = new DailyChallengesSystem();

// Add CSS for daily challenges
const challengeStyles = document.createElement('style');
challengeStyles.textContent = `
    .challenge-section {
        margin-bottom: 2rem;
    }

    .challenge-section-title {
        color: var(--text-primary);
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--accent-color);
    }

    .challenge-card {
        background: var(--bg-card);
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: var(--shadow-medium);
        border-left: 4px solid var(--accent-color);
        transition: all 0.3s ease;
    }

    .challenge-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-heavy);
    }

    .challenge-card.completed {
        border-left-color: var(--success-color);
        background: linear-gradient(135deg, var(--bg-card) 0%, rgba(40, 167, 69, 0.1) 100%);
    }

    .challenge-card.easy {
        border-left-color: #28a745;
    }

    .challenge-card.medium {
        border-left-color: #ffc107;
    }

    .challenge-card.hard {
        border-left-color: #dc3545;
    }

    .challenge-card.epic {
        border-left-color: #6f42c1;
    }

    .challenge-card {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }

    .challenge-icon {
        font-size: 2rem;
        padding: 0.5rem;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-radius: 10px;
        color: white;
        min-width: 60px;
        text-align: center;
    }

    .challenge-info {
        flex: 1;
    }

    .challenge-name {
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .challenge-description {
        color: var(--text-secondary);
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
    }

    .challenge-progress {
        margin-bottom: 1rem;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: var(--bg-tertiary);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
        transition: width 0.3s ease;
    }

    .progress-text {
        font-size: 0.8rem;
        color: var(--text-secondary);
        font-weight: 500;
    }

    .challenge-rewards {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .challenge-rewards span {
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .xp-reward {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
    }

    .coin-reward {
        background: linear-gradient(135deg, #f7931e, #ffd700);
        color: white;
    }

    .powerup-reward {
        background: linear-gradient(135deg, #ff006e, #8338ec);
        color: white;
    }

    .completion-badge {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: var(--success-color);
        color: white;
        border-radius: 20px;
        text-align: center;
        font-weight: 600;
        animation: completionPulse 2s infinite;
    }

    @keyframes completionPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    #challenge-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border-radius: 15px;
        padding: 1.5rem;
        box-shadow: var(--shadow-heavy);
        border-left: 4px solid var(--success-color);
        max-width: 350px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    #challenge-notification.show {
        transform: translateX(0);
    }

    #challenge-title {
        color: var(--text-primary);
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    #challenge-description {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    #challenge-rewards {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    #challenge-rewards .reward-item {
        padding: 0.25rem 0.5rem;
        background: var(--accent-color);
        color: white;
        border-radius: 10px;
        font-size: 0.8rem;
        font-weight: 500;
    }
`;
document.head.appendChild(challengeStyles);