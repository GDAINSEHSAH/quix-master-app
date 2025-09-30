// Achievements System - Gamification and progress tracking
class AchievementsSystem {
    constructor() {
        this.achievements = {
            // First Steps
            firstQuiz: {
                id: 'firstQuiz',
                name: 'First Steps',
                description: 'Complete your first quiz',
                icon: '🎯',
                xp: 50,
                coins: 10,
                rarity: 'common',
                condition: (stats) => stats.quizzesCompleted >= 1
            },
            perfectScore: {
                id: 'perfectScore',
                name: 'Perfection',
                description: 'Get 100% on any quiz',
                icon: '💯',
                xp: 100,
                coins: 25,
                rarity: 'rare',
                condition: (stats) => stats.perfectScores >= 1
            },
            speedDemon: {
                id: 'speedDemon',
                name: 'Speed Demon',
                description: 'Answer 10 questions in under 5 seconds each',
                icon: '⚡',
                xp: 150,
                coins: 30,
                rarity: 'epic',
                condition: (stats) => stats.speedAnswers >= 10
            },

            // Knowledge Areas
            scienceMaster: {
                id: 'scienceMaster',
                name: 'Science Master',
                description: 'Complete all Science & Technology levels',
                icon: '🔬',
                xp: 200,
                coins: 50,
                rarity: 'legendary',
                condition: (stats) => stats.sectionsCompleted.science >= 5
            },
            historyExpert: {
                id: 'historyExpert',
                name: 'History Expert',
                description: 'Complete all History & Geography levels',
                icon: '🏛️',
                xp: 200,
                coins: 50,
                rarity: 'legendary',
                condition: (stats) => stats.sectionsCompleted.history >= 3
            },
            sportsEnthusiast: {
                id: 'sportsEnthusiast',
                name: 'Sports Enthusiast',
                description: 'Complete all Sports & Entertainment levels',
                icon: '⚽',
                xp: 200,
                coins: 50,
                rarity: 'legendary',
                condition: (stats) => stats.sectionsCompleted.sports >= 2
            },
            literatureLover: {
                id: 'literatureLover',
                name: 'Literature Lover',
                description: 'Complete all Literature & Arts levels',
                icon: '📚',
                xp: 200,
                coins: 50,
                rarity: 'legendary',
                condition: (stats) => stats.sectionsCompleted.literature >= 2
            },
            generalGenius: {
                id: 'generalGenius',
                name: 'General Genius',
                description: 'Complete all General Knowledge levels',
                icon: '🧠',
                xp: 200,
                coins: 50,
                rarity: 'legendary',
                condition: (stats) => stats.sectionsCompleted.general >= 2
            },

            // Streaks and Consistency
            streakStarter: {
                id: 'streakStarter',
                name: 'Streak Starter',
                description: 'Get a 5-day learning streak',
                icon: '🔥',
                xp: 100,
                coins: 20,
                rarity: 'rare',
                condition: (stats) => stats.dailyStreak >= 5
            },
            dedicated: {
                id: 'dedicated',
                name: 'Dedicated',
                description: 'Get a 10-day learning streak',
                icon: '💪',
                xp: 200,
                coins: 40,
                rarity: 'epic',
                condition: (stats) => stats.dailyStreak >= 10
            },
            unstoppable: {
                id: 'unstoppable',
                name: 'Unstoppable',
                description: 'Get a 30-day learning streak',
                icon: '👑',
                xp: 500,
                coins: 100,
                rarity: 'legendary',
                condition: (stats) => stats.dailyStreak >= 30
            },

            // Performance
            sharpshooter: {
                id: 'sharpshooter',
                name: 'Sharpshooter',
                description: 'Maintain 90% accuracy over 100 questions',
                icon: '🎯',
                xp: 300,
                coins: 60,
                rarity: 'epic',
                condition: (stats) => stats.totalQuestions >= 100 && stats.accuracy >= 0.9
            },
            marathonRunner: {
                id: 'marathonRunner',
                name: 'Marathon Runner',
                description: 'Play for 1 hour straight',
                icon: '🏃',
                xp: 150,
                coins: 30,
                rarity: 'rare',
                condition: (stats) => stats.longestSession >= 3600 // 1 hour in seconds
            },
            questionMaster: {
                id: 'questionMaster',
                name: 'Question Master',
                description: 'Answer 1000 questions correctly',
                icon: '📝',
                xp: 400,
                coins: 80,
                rarity: 'legendary',
                condition: (stats) => stats.correctAnswers >= 1000
            },

            // Social and Special
            challenger: {
                id: 'challenger',
                name: 'Challenger',
                description: 'Win 10 multiplayer matches',
                icon: '⚔️',
                xp: 250,
                coins: 50,
                rarity: 'epic',
                condition: (stats) => stats.multiplayerWins >= 10
            },
            helpfulFriend: {
                id: 'helpfulFriend',
                name: 'Helpful Friend',
                description: 'Invite 5 friends to play',
                icon: '👥',
                xp: 200,
                coins: 40,
                rarity: 'rare',
                condition: (stats) => stats.friendsInvited >= 5
            },
            earlyBird: {
                id: 'earlyBird',
                name: 'Early Bird',
                description: 'Complete 10 morning quizzes (6AM-9AM)',
                icon: '🌅',
                xp: 100,
                coins: 20,
                rarity: 'rare',
                condition: (stats) => stats.morningQuizzes >= 10
            },
            nightOwl: {
                id: 'nightOwl',
                name: 'Night Owl',
                description: 'Complete 10 night quizzes (9PM-12AM)',
                icon: '🦉',
                xp: 100,
                coins: 20,
                rarity: 'rare',
                condition: (stats) => stats.nightQuizzes >= 10
            },

            // Special Events
            dailyChampion: {
                id: 'dailyChampion',
                name: 'Daily Champion',
                description: 'Complete 30 daily challenges',
                icon: '🏆',
                xp: 300,
                coins: 60,
                rarity: 'epic',
                condition: (stats) => stats.dailyChallengesCompleted >= 30
            },
            powerUser: {
                id: 'powerUser',
                name: 'Power User',
                description: 'Use each power-up at least 10 times',
                icon: '💎',
                xp: 200,
                coins: 40,
                rarity: 'epic',
                condition: (stats) => stats.powerUpsUsed.fiftyFifty >= 10 &&
                                   stats.powerUpsUsed.extraTime >= 10 &&
                                   stats.powerUpsUsed.skip >= 10 &&
                                   stats.powerUpsUsed.doublePoints >= 10
            },

            // Ultimate Achievements
            quizMaster: {
                id: 'quizMaster',
                name: 'Quiz Master',
                description: 'Complete all sections at 100% accuracy',
                icon: '👑',
                xp: 1000,
                coins: 200,
                rarity: 'mythic',
                condition: (stats) => Object.values(stats.sectionsCompleted).every(count => count >= 1) &&
                                   stats.accuracy >= 1.0
            },
            legendary: {
                id: 'legendary',
                name: 'Legendary',
                description: 'Unlock all other achievements',
                icon: '🌟',
                xp: 2000,
                coins: 500,
                rarity: 'mythic',
                condition: (stats, unlockedAchievements) => {
                    const totalAchievements = Object.keys(this.achievements).length - 1; // Excluding this one
                    return unlockedAchievements.length >= totalAchievements;
                }
            }
        };

        this.unlockedAchievements = [];
        this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem('quiz-achievements');
        if (saved) {
            this.unlockedAchievements = JSON.parse(saved);
        }
    }

    saveProgress() {
        localStorage.setItem('quiz-achievements', JSON.stringify(this.unlockedAchievements));
    }

    checkAchievements(stats) {
        const newAchievements = [];

        Object.values(this.achievements).forEach(achievement => {
            // Skip if already unlocked
            if (this.unlockedAchievements.some(unlocked => unlocked.id === achievement.id)) {
                return;
            }

            // Check condition
            let conditionMet = false;
            try {
                conditionMet = achievement.condition(stats, this.unlockedAchievements);
            } catch (error) {
                console.warn(`Error checking achievement ${achievement.id}:`, error);
            }

            if (conditionMet) {
                this.unlockAchievement(achievement);
                newAchievements.push(achievement);
            }
        });

        return newAchievements;
    }

    unlockAchievement(achievement) {
        // Add to unlocked list
        const unlockedData = {
            ...achievement,
            unlockedAt: new Date().toISOString()
        };
        this.unlockedAchievements.push(unlockedData);

        // Save progress
        this.saveProgress();

        // Show notification
        this.showAchievementNotification(achievement);

        // Play sound
        if (window.audioManager) {
            window.audioManager.playAchievement();
        }

        // Award XP and coins
        if (window.gameLogic) {
            window.gameLogic.awardXP(achievement.xp);
            window.gameLogic.awardCoins(achievement.coins);
        }

        // Trigger achievement unlocked event
        const event = new CustomEvent('achievementUnlocked', {
            detail: achievement
        });
        document.dispatchEvent(event);

        console.log(`🏆 Achievement unlocked: ${achievement.name}`);
    }

    showAchievementNotification(achievement) {
        const notification = document.getElementById('achievement-notification');
        if (!notification) return;

        const titleElement = document.getElementById('achievement-title');
        const descriptionElement = document.getElementById('achievement-description');

        if (titleElement) titleElement.textContent = achievement.name;
        if (descriptionElement) titleElement.textContent = achievement.description;

        // Update icon
        const iconElement = notification.querySelector('.achievement-icon');
        if (iconElement) iconElement.textContent = achievement.icon;

        // Show notification
        notification.classList.add('show');

        // Hide after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);

        // Add particle effects
        if (window.particleEffects) {
            window.particleEffects.createAchievementParticles(achievement);
        }
    }

    getUnlockedAchievements() {
        return this.unlockedAchievements;
    }

    getAllAchievements() {
        return this.achievements;
    }

    getAchievementProgress() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.unlockedAchievements.length;
        return {
            unlocked,
            total,
            percentage: Math.round((unlocked / total) * 100)
        };
    }

    isAchievementUnlocked(achievementId) {
        return this.unlockedAchievements.some(achievement => achievement.id === achievementId);
    }

    getAchievementsByRarity(rarity) {
        return Object.values(this.achievements).filter(achievement => achievement.rarity === rarity);
    }

    getTotalXPFromAchievements() {
        return this.unlockedAchievements.reduce((total, achievement) => total + achievement.xp, 0);
    }

    getTotalCoinsFromAchievements() {
        return this.unlockedAchievements.reduce((total, achievement) => total + achievement.coins, 0);
    }

    // Render achievements in the UI
    renderAchievements() {
        const container = document.getElementById('achievements-list');
        if (!container) return;

        container.innerHTML = '';

        const rarityOrder = ['common', 'rare', 'epic', 'legendary', 'mythic'];

        rarityOrder.forEach(rarity => {
            const achievementsOfRarity = this.getAchievementsByRarity(rarity);

            if (achievementsOfRarity.length === 0) return;

            // Create rarity section
            const section = document.createElement('div');
            section.className = 'achievement-rarity-section';

            const header = document.createElement('h4');
            header.className = `rarity-header ${rarity}`;
            header.textContent = rarity.charAt(0).toUpperCase() + rarity.slice(1);
            section.appendChild(header);

            // Create achievement cards
            achievementsOfRarity.forEach(achievement => {
                const card = this.createAchievementCard(achievement);
                section.appendChild(card);
            });

            container.appendChild(section);
        });

        // Update stats
        this.updateAchievementStats();
    }

    createAchievementCard(achievement) {
        const isUnlocked = this.isAchievementUnlocked(achievement.id);

        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.rarity} ${isUnlocked ? 'unlocked' : 'locked'}`;

        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h5 class="achievement-name">${achievement.name}</h5>
                <p class="achievement-description">${achievement.description}</p>
                <div class="achievement-rewards">
                    <span class="xp-reward">+${achievement.xp} XP</span>
                    <span class="coin-reward">+${achievement.coins} <i class="fas fa-coins"></i></span>
                </div>
                ${isUnlocked ? `
                    <div class="unlocked-date">
                        Unlocked: ${new Date(this.unlockedAchievements.find(a => a.id === achievement.id).unlockedAt).toLocaleDateString()}
                    </div>
                ` : ''}
            </div>
        `;

        return card;
    }

    updateAchievementStats() {
        const progress = this.getAchievementProgress();

        const totalElement = document.getElementById('total-achievements');
        const pointsElement = document.getElementById('total-points');

        if (totalElement) {
            totalElement.textContent = `${progress.unlocked}/${progress.total}`;
        }

        if (pointsElement) {
            pointsElement.textContent = this.getTotalXPFromAchievements();
        }
    }

    // Reset all achievements (for testing or new profile)
    resetAchievements() {
        this.unlockedAchievements = [];
        this.saveProgress();
        this.renderAchievements();
    }

    // Export achievements data
    exportAchievements() {
        return {
            unlocked: this.unlockedAchievements,
            definitions: this.achievements
        };
    }

    // Import achievements data
    importAchievements(data) {
        if (data.unlocked) {
            this.unlockedAchievements = data.unlocked;
            this.saveProgress();
        }
        if (data.definitions) {
            this.achievements = { ...this.achievements, ...data.definitions };
        }
        this.renderAchievements();
    }
}

// Global achievements manager
window.achievementsSystem = new AchievementsSystem();