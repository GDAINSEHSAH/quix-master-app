// Quiz Master - Advanced Game System
// Coins, Power-ups, Streaks, Profile, and Game Modes

class GameSystem {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Profile Data
        this.profile = JSON.parse(localStorage.getItem('userProfile') || JSON.stringify({
            username: 'Player',
            avatar: '😊',
            createdAt: new Date().toISOString(),
            level: 1,
            xp: 0
        }));

        // Currency System
        this.coins = parseInt(localStorage.getItem('coins') || '100');

        // Streak System
        this.streaks = JSON.parse(localStorage.getItem('streaks') || JSON.stringify({
            current: 0,
            longest: 0,
            lastPlayed: null
        }));

        // Power-ups Inventory
        this.powerups = JSON.parse(localStorage.getItem('powerups') || JSON.stringify({
            fiftyFifty: 3,
            skip: 2,
            hint: 5,
            extraTime: 2
        }));

        // Wrong Answers for Practice Mode
        this.wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');

        // Game Mode
        this.currentMode = 'normal'; // normal, timeAttack, survival

        // Survival Mode Lives
        this.lives = 3;

        // Statistics
        this.stats = JSON.parse(localStorage.getItem('stats') || JSON.stringify({
            totalQuizzes: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            totalTime: 0,
            categoryStats: {
                science: { played: 0, correct: 0, total: 0 },
                history: { played: 0, correct: 0, total: 0 },
                sports: { played: 0, correct: 0, total: 0 },
                literature: { played: 0, correct: 0, total: 0 },
                general: { played: 0, correct: 0, total: 0 }
            }
        }));

        // Badges/Achievements
        this.badges = JSON.parse(localStorage.getItem('badges') || '[]');

        // Theme
        this.theme = localStorage.getItem('theme') || 'dark';

        // Avatars unlocked
        this.unlockedAvatars = JSON.parse(localStorage.getItem('unlockedAvatars') || '["😊", "🎓", "🤓"]');
    }

    // Save all data
    save() {
        localStorage.setItem('userProfile', JSON.stringify(this.profile));
        localStorage.setItem('coins', this.coins.toString());
        localStorage.setItem('streaks', JSON.stringify(this.streaks));
        localStorage.setItem('powerups', JSON.stringify(this.powerups));
        localStorage.setItem('wrongAnswers', JSON.stringify(this.wrongAnswers));
        localStorage.setItem('stats', JSON.stringify(this.stats));
        localStorage.setItem('badges', JSON.stringify(this.badges));
        localStorage.setItem('theme', this.theme);
        localStorage.setItem('unlockedAvatars', JSON.stringify(this.unlockedAvatars));
    }

    // Coins
    addCoins(amount) {
        this.coins += amount;
        this.save();
        this.updateUI();
    }

    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            this.save();
            this.updateUI();
            return true;
        }
        return false;
    }

    // XP and Leveling
    addXP(amount) {
        this.profile.xp += amount;
        const xpNeeded = this.profile.level * 100;
        if (this.profile.xp >= xpNeeded) {
            this.profile.level++;
            this.profile.xp -= xpNeeded;
            this.onLevelUp();
        }
        this.save();
    }

    onLevelUp() {
        // Reward on level up
        this.addCoins(50);
        this.showNotification(`🎉 Level Up! You're now Level ${this.profile.level}!`);
    }

    // Streaks
    updateStreak() {
        const today = new Date().toDateString();
        const lastPlayed = this.streaks.lastPlayed;

        if (!lastPlayed) {
            this.streaks.current = 1;
        } else {
            const lastDate = new Date(lastPlayed).toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (lastDate === today) {
                // Already played today
                return;
            } else if (lastDate === yesterday) {
                // Consecutive day
                this.streaks.current++;
            } else {
                // Streak broken
                this.streaks.current = 1;
            }
        }

        if (this.streaks.current > this.streaks.longest) {
            this.streaks.longest = this.streaks.current;
        }

        this.streaks.lastPlayed = new Date().toISOString();
        this.save();

        // Reward streak
        if (this.streaks.current >= 7) {
            this.addCoins(20);
            this.showNotification(`🔥 7 Day Streak! +20 coins!`);
        }
    }

    // Power-ups
    usePowerup(type) {
        if (this.powerups[type] > 0) {
            this.powerups[type]--;
            this.save();
            this.updateUI();
            return true;
        }
        return false;
    }

    buyPowerup(type, cost) {
        if (this.spendCoins(cost)) {
            this.powerups[type]++;
            this.save();
            this.updateUI();
            return true;
        }
        return false;
    }

    // Statistics
    recordQuizResult(category, correct, total, time) {
        this.stats.totalQuizzes++;
        this.stats.totalQuestions += total;
        this.stats.correctAnswers += correct;
        this.stats.totalTime += time;

        if (this.stats.categoryStats[category]) {
            this.stats.categoryStats[category].played++;
            this.stats.categoryStats[category].correct += correct;
            this.stats.categoryStats[category].total += total;
        }

        this.save();
    }

    // Wrong Answers tracking
    addWrongAnswer(question) {
        this.wrongAnswers.push({
            ...question,
            date: new Date().toISOString()
        });
        // Keep only last 50
        if (this.wrongAnswers.length > 50) {
            this.wrongAnswers.shift();
        }
        this.save();
    }

    // Badges
    checkAndAwardBadges(quizResult) {
        const newBadges = [];

        // First Quiz
        if (this.stats.totalQuizzes === 1 && !this.badges.includes('first_quiz')) {
            newBadges.push({ id: 'first_quiz', name: '🎮 First Quiz', desc: 'Complete your first quiz' });
            this.badges.push('first_quiz');
        }

        // Perfect Score
        if (quizResult.percentage === 100 && !this.badges.includes('perfect')) {
            newBadges.push({ id: 'perfect', name: '💯 Perfectionist', desc: 'Score 100%' });
            this.badges.push('perfect');
        }

        // Speed Demon
        if (quizResult.time < 60 && quizResult.percentage >= 80 && !this.badges.includes('speed_demon')) {
            newBadges.push({ id: 'speed_demon', name: '⚡ Speed Demon', desc: 'Complete quiz under 1 min with 80%+' });
            this.badges.push('speed_demon');
        }

        // Dedicated
        if (this.stats.totalQuizzes >= 10 && !this.badges.includes('dedicated')) {
            newBadges.push({ id: 'dedicated', name: '📚 Dedicated', desc: 'Complete 10 quizzes' });
            this.badges.push('dedicated');
        }

        // Master
        if (this.stats.totalQuizzes >= 50 && !this.badges.includes('master')) {
            newBadges.push({ id: 'master', name: '👑 Quiz Master', desc: 'Complete 50 quizzes' });
            this.badges.push('master');
        }

        // Streak Master
        if (this.streaks.longest >= 30 && !this.badges.includes('streak_master')) {
            newBadges.push({ id: 'streak_master', name: '🔥 Streak Master', desc: '30 day streak' });
            this.badges.push('streak_master');
        }

        this.save();
        return newBadges;
    }

    // Avatar unlock
    unlockAvatar(avatar) {
        if (!this.unlockedAvatars.includes(avatar)) {
            this.unlockedAvatars.push(avatar);
            this.save();
            return true;
        }
        return false;
    }

    // Theme toggle
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.save();
        this.applyTheme();
    }

    applyTheme() {
        document.body.classList.toggle('light-theme', this.theme === 'light');
    }

    // UI Updates
    updateUI() {
        const coinsEl = document.getElementById('coins-display');
        if (coinsEl) {
            coinsEl.textContent = `💰 ${this.coins}`;
        }

        const streakEl = document.getElementById('streak-display');
        if (streakEl) {
            streakEl.textContent = `🔥 ${this.streaks.current}`;
        }

        const levelEl = document.getElementById('level-display');
        if (levelEl) {
            levelEl.textContent = `⭐ Lvl ${this.profile.level}`;
        }

        // Update powerup counts
        ['fiftyFifty', 'skip', 'hint', 'extraTime'].forEach(type => {
            const el = document.getElementById(`powerup-${type}`);
            if (el) {
                el.textContent = this.powerups[type];
            }
        });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Export/Import Data
    exportData() {
        const data = {
            profile: this.profile,
            coins: this.coins,
            streaks: this.streaks,
            powerups: this.powerups,
            stats: this.stats,
            badges: this.badges,
            unlockedAvatars: this.unlockedAvatars,
            unlockedLevels: JSON.parse(localStorage.getItem('unlockedLevels') || '{}'),
            leaderboard: JSON.parse(localStorage.getItem('quizLeaderboard') || '[]')
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quiz-master-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        this.showNotification('✅ Data exported successfully!');
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                this.profile = data.profile;
                this.coins = data.coins;
                this.streaks = data.streaks;
                this.powerups = data.powerups;
                this.stats = data.stats;
                this.badges = data.badges;
                this.unlockedAvatars = data.unlockedAvatars;

                localStorage.setItem('unlockedLevels', JSON.stringify(data.unlockedLevels));
                localStorage.setItem('quizLeaderboard', JSON.stringify(data.leaderboard));

                this.save();
                this.showNotification('✅ Data imported successfully!');
                location.reload();
            } catch (error) {
                this.showNotification('❌ Failed to import data!');
            }
        };
        reader.readAsText(file);
    }
}

// Create global instance
const gameSystem = new GameSystem();
