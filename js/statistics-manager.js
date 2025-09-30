// Statistics Manager - Track detailed user performance and analytics
class StatisticsManager {
    constructor() {
        this.stats = {
            // Basic Stats
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            quizzesCompleted: 0,
            perfectScores: 0,

            // Time Stats
            totalPlayTime: 0,
            averageQuestionTime: 0,
            fastestCorrectAnswer: Infinity,
            longestSession: 0,

            // Accuracy and Performance
            accuracy: 0,
            currentStreak: 0,
            longestStreak: 0,
            dailyStreak: 0,

            // Section Progress
            sectionsCompleted: {
                science: 0,
                history: 0,
                sports: 0,
                literature: 0,
                general: 0
            },

            // Level Progress
            levelsCompleted: {
                science: 0,
                history: 0,
                sports: 0,
                literature: 0,
                general: 0
            },

            // Special Stats
            speedAnswers: 0, // Answers under 5 seconds
            morningQuizzes: 0, // 6AM-9AM
            nightQuizzes: 0, // 9PM-12AM
            weekendQuizzes: 0,

            // Power-ups and Features
            powerUpsUsed: {
                fiftyFifty: 0,
                extraTime: 0,
                skip: 0,
                doublePoints: 0,
                revealAnswer: 0,
                freezeTime: 0,
                perfectQuestion: 0
            },

            // Social and Multiplayer
            multiplayerWins: 0,
            multiplayerLosses: 0,
            friendsInvited: 0,

            // Daily Challenges
            dailyChallengesCompleted: 0,
            dailyChallengePerfectScores: 0,

            // Time-based Data
            dailyProgress: {},
            weeklyProgress: {},
            monthlyProgress: {},

            // Performance History
            sessionHistory: [],
            accuracyHistory: [],
            scoreHistory: [],

            // Achievements
            lastPlayDate: null,
            firstPlayDate: null,
            totalDaysPlayed: 0
        };

        this.sessionStartTime = Date.now();
        this.currentSessionStats = {
            questionsAnswered: 0,
            correctAnswers: 0,
            startTime: this.sessionStartTime
        };

        this.loadStats();
        this.initializeTracking();
    }

    loadStats() {
        const saved = localStorage.getItem('quiz-statistics');
        if (saved) {
            const savedStats = JSON.parse(saved);
            this.stats = { ...this.stats, ...savedStats };
        }

        // Set first play date if not set
        if (!this.stats.firstPlayDate) {
            this.stats.firstPlayDate = new Date().toISOString();
        }

        this.updateDailyStreak();
        this.saveStats();
    }

    saveStats() {
        localStorage.setItem('quiz-statistics', JSON.stringify(this.stats));
    }

    initializeTracking() {
        // Track page visibility for session time
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseSessionTracking();
            } else {
                this.resumeSessionTracking();
            }
        });

        // Save stats periodically
        setInterval(() => {
            this.saveStats();
        }, 30000); // Every 30 seconds
    }

    // Update daily streak
    updateDailyStreak() {
        const today = new Date().toDateString();
        const lastPlay = this.stats.lastPlayDate ? new Date(this.stats.lastPlayDate).toDateString() : null;

        if (lastPlay === today) {
            // Already played today, don't reset streak
            return;
        }

        if (lastPlay) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastPlay === yesterdayStr) {
                // Played yesterday, continue streak
                this.stats.dailyStreak++;
            } else {
                // Missed a day, reset streak
                this.stats.dailyStreak = 1;
            }
        } else {
            // First time playing
            this.stats.dailyStreak = 1;
        }

        this.stats.lastPlayDate = new Date().toISOString();
        this.trackDailyProgress();
    }

    // Track daily progress
    trackDailyProgress() {
        const today = new Date().toDateString();
        if (!this.stats.dailyProgress[today]) {
            this.stats.dailyProgress[today] = {
                questionsAnswered: 0,
                correctAnswers: 0,
                quizzesCompleted: 0,
                timeSpent: 0
            };
            this.stats.totalDaysPlayed++;
        }
    }

    // Record a question attempt
    recordQuestionAttempt(isCorrect, timeSpent, difficulty = 'medium') {
        // Update basic stats
        this.stats.totalQuestions++;
        this.currentSessionStats.questionsAnswered++;

        if (isCorrect) {
            this.stats.correctAnswers++;
            this.currentSessionStats.correctAnswers++;
            this.stats.currentStreak++;

            // Check for speed answer (under 5 seconds)
            if (timeSpent < 5) {
                this.stats.speedAnswers++;
            }

            // Track fastest correct answer
            if (timeSpent < this.stats.fastestCorrectAnswer) {
                this.stats.fastestCorrectAnswer = timeSpent;
            }

            // Update longest streak
            if (this.stats.currentStreak > this.stats.longestStreak) {
                this.stats.longestStreak = this.stats.currentStreak;
            }
        } else {
            this.stats.wrongAnswers++;
            this.stats.currentStreak = 0;
        }

        // Update accuracy
        this.stats.accuracy = this.stats.correctAnswers / this.stats.totalQuestions;

        // Update average question time
        this.stats.averageQuestionTime = (
            (this.stats.averageQuestionTime * (this.stats.totalQuestions - 1) + timeSpent) /
            this.stats.totalQuestions
        );

        // Update daily progress
        const today = new Date().toDateString();
        if (this.stats.dailyProgress[today]) {
            this.stats.dailyProgress[today].questionsAnswered++;
            if (isCorrect) {
                this.stats.dailyProgress[today].correctAnswers++;
            }
        }

        // Update accuracy history
        this.updateAccuracyHistory();

        this.saveStats();

        // Check for achievements
        if (window.achievementsSystem) {
            window.achievementsSystem.checkAchievements(this.stats);
        }
    }

    // Record quiz completion
    recordQuizCompletion(section, level, score, accuracy, timeSpent, questionsCorrect, totalQuestions) {
        this.stats.quizzesCompleted++;

        // Perfect score check
        if (accuracy === 1.0) {
            this.stats.perfectScores++;
        }

        // Update section and level progress
        if (this.stats.sectionsCompleted[section] !== undefined) {
            this.stats.sectionsCompleted[section] = Math.max(
                this.stats.sectionsCompleted[section],
                level
            );
        }

        if (this.stats.levelsCompleted[section] !== undefined) {
            this.stats.levelsCompleted[section]++;
        }

        // Time-based tracking
        const hour = new Date().getHours();
        const day = new Date().getDay();

        if (hour >= 6 && hour < 9) {
            this.stats.morningQuizzes++;
        } else if (hour >= 21 && hour < 24) {
            this.stats.nightQuizzes++;
        }

        if (day === 0 || day === 6) {
            this.stats.weekendQuizzes++;
        }

        // Update daily progress
        const today = new Date().toDateString();
        if (this.stats.dailyProgress[today]) {
            this.stats.dailyProgress[today].quizzesCompleted++;
            this.stats.dailyProgress[today].timeSpent += timeSpent;
        }

        // Add to session history
        this.stats.sessionHistory.push({
            date: new Date().toISOString(),
            section: section,
            level: level,
            score: score,
            accuracy: accuracy,
            timeSpent: timeSpent,
            questionsCorrect: questionsCorrect,
            totalQuestions: totalQuestions
        });

        // Keep only last 100 sessions
        if (this.stats.sessionHistory.length > 100) {
            this.stats.sessionHistory = this.stats.sessionHistory.slice(-100);
        }

        // Update score history
        this.stats.scoreHistory.push({
            date: new Date().toISOString(),
            score: score
        });

        // Keep only last 50 scores
        if (this.stats.scoreHistory.length > 50) {
            this.stats.scoreHistory = this.stats.scoreHistory.slice(-50);
        }

        this.saveStats();

        // Check for achievements
        if (window.achievementsSystem) {
            window.achievementsSystem.checkAchievements(this.stats);
        }
    }

    // Update accuracy history for trending
    updateAccuracyHistory() {
        const accuracy = this.stats.accuracy;
        const now = Date.now();

        this.stats.accuracyHistory.push({
            timestamp: now,
            accuracy: accuracy
        });

        // Keep only last 100 data points
        if (this.stats.accuracyHistory.length > 100) {
            this.stats.accuracyHistory = this.stats.accuracyHistory.slice(-100);
        }
    }

    // Track session time
    updateSessionTime() {
        const currentTime = Date.now();
        const sessionTime = currentTime - this.sessionStartTime;

        this.stats.totalPlayTime += sessionTime;

        if (sessionTime > this.stats.longestSession) {
            this.stats.longestSession = sessionTime;
        }

        this.sessionStartTime = currentTime;
    }

    pauseSessionTracking() {
        this.updateSessionTime();
    }

    resumeSessionTracking() {
        this.sessionStartTime = Date.now();
    }

    // Get formatted statistics
    getFormattedStats() {
        return {
            totalQuestions: this.stats.totalQuestions.toLocaleString(),
            correctAnswers: this.stats.correctAnswers.toLocaleString(),
            accuracy: `${(this.stats.accuracy * 100).toFixed(1)}%`,
            currentStreak: this.stats.currentStreak.toLocaleString(),
            longestStreak: this.stats.longestStreak.toLocaleString(),
            dailyStreak: this.stats.dailyStreak.toLocaleString(),
            quizzesCompleted: this.stats.quizzesCompleted.toLocaleString(),
            perfectScores: this.stats.perfectScores.toLocaleString(),
            totalPlayTime: this.formatTime(this.stats.totalPlayTime),
            averageQuestionTime: `${this.stats.averageQuestionTime.toFixed(1)}s`,
            fastestAnswer: this.stats.fastestCorrectAnswer === Infinity ? 'N/A' : `${this.stats.fastestCorrectAnswer.toFixed(1)}s`,
            longestSession: this.formatTime(this.stats.longestSession),
            totalDaysPlayed: this.stats.totalDaysPlayed.toLocaleString()
        };
    }

    // Format time in milliseconds to readable format
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    // Get performance trends
    getPerformanceTrends() {
        const recentSessions = this.stats.sessionHistory.slice(-20);
        const recentAccuracy = this.stats.accuracyHistory.slice(-20);

        return {
            accuracyTrend: this.calculateTrend(recentAccuracy.map(a => a.accuracy)),
            scoreTrend: this.calculateTrend(this.stats.scoreHistory.slice(-20).map(s => s.score)),
            improvementRate: this.calculateImprovementRate()
        };
    }

    calculateTrend(data) {
        if (data.length < 2) return 0;

        const first = data.slice(0, Math.floor(data.length / 2));
        const second = data.slice(Math.floor(data.length / 2));

        const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
        const secondAvg = second.reduce((a, b) => a + b, 0) / second.length;

        return ((secondAvg - firstAvg) / firstAvg) * 100;
    }

    calculateImprovementRate() {
        const recent = this.stats.sessionHistory.slice(-10);
        const older = this.stats.sessionHistory.slice(-20, -10);

        if (recent.length === 0 || older.length === 0) return 0;

        const recentAvg = recent.reduce((sum, session) => sum + session.accuracy, 0) / recent.length;
        const olderAvg = older.reduce((sum, session) => sum + session.accuracy, 0) / older.length;

        return ((recentAvg - olderAvg) / olderAvg) * 100;
    }

    // Get section performance
    getSectionPerformance() {
        const sectionStats = {};

        this.stats.sessionHistory.forEach(session => {
            if (!sectionStats[session.section]) {
                sectionStats[session.section] = {
                    totalQuizzes: 0,
                    totalAccuracy: 0,
                    totalScore: 0,
                    bestAccuracy: 0,
                    averageTime: 0
                };
            }

            const stats = sectionStats[session.section];
            stats.totalQuizzes++;
            stats.totalAccuracy += session.accuracy;
            stats.totalScore += session.score;
            stats.bestAccuracy = Math.max(stats.bestAccuracy, session.accuracy);
            stats.averageTime += session.timeSpent;
        });

        // Calculate averages
        Object.keys(sectionStats).forEach(section => {
            const stats = sectionStats[section];
            stats.averageAccuracy = stats.totalAccuracy / stats.totalQuizzes;
            stats.averageScore = stats.totalScore / stats.totalQuizzes;
            stats.averageTime = stats.averageTime / stats.totalQuizzes;
        });

        return sectionStats;
    }

    // Update UI with current stats
    updateStatsUI() {
        const elements = {
            'total-questions-answered': this.stats.totalQuestions,
            'accuracy-rate': `${(this.stats.accuracy * 100).toFixed(1)}%`,
            'study-time': this.formatTime(this.stats.totalPlayTime),
            'current-streak': this.stats.currentStreak,
            'daily-streak': this.stats.dailyStreak
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // Update progress chart
        this.updatePerformanceChart();
    }

    // Create performance chart
    updatePerformanceChart() {
        const canvas = document.getElementById('performance-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.stats.accuracyHistory.slice(-20);

        if (data.length === 0) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw chart
        const width = canvas.width - 40;
        const height = canvas.height - 40;
        const maxAccuracy = Math.max(...data.map(d => d.accuracy), 1);

        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = 20 + (index * width) / (data.length - 1);
            const y = height - (point.accuracy / maxAccuracy) * height + 20;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        data.forEach((point, index) => {
            const x = 20 + (index * width) / (data.length - 1);
            const y = height - (point.accuracy / maxAccuracy) * height + 20;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    // Export statistics
    exportStats() {
        return {
            stats: this.stats,
            exportDate: new Date().toISOString()
        };
    }

    // Import statistics
    importStats(data) {
        if (data.stats) {
            this.stats = { ...this.stats, ...data.stats };
            this.saveStats();
            this.updateStatsUI();
        }
    }

    // Reset statistics (for testing or new profile)
    resetStats() {
        this.stats = {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            quizzesCompleted: 0,
            perfectScores: 0,
            totalPlayTime: 0,
            averageQuestionTime: 0,
            fastestCorrectAnswer: Infinity,
            longestSession: 0,
            accuracy: 0,
            currentStreak: 0,
            longestStreak: 0,
            dailyStreak: 0,
            sectionsCompleted: {
                science: 0,
                history: 0,
                sports: 0,
                literature: 0,
                general: 0
            },
            levelsCompleted: {
                science: 0,
                history: 0,
                sports: 0,
                literature: 0,
                general: 0
            },
            speedAnswers: 0,
            morningQuizzes: 0,
            nightQuizzes: 0,
            weekendQuizzes: 0,
            powerUpsUsed: {
                fiftyFifty: 0,
                extraTime: 0,
                skip: 0,
                doublePoints: 0,
                revealAnswer: 0,
                freezeTime: 0,
                perfectQuestion: 0
            },
            multiplayerWins: 0,
            multiplayerLosses: 0,
            friendsInvited: 0,
            dailyChallengesCompleted: 0,
            dailyChallengePerfectScores: 0,
            dailyProgress: {},
            weeklyProgress: {},
            monthlyProgress: {},
            sessionHistory: [],
            accuracyHistory: [],
            scoreHistory: [],
            lastPlayDate: null,
            firstPlayDate: new Date().toISOString(),
            totalDaysPlayed: 0
        };

        this.saveStats();
        this.updateStatsUI();
    }

    // Get current stats object
    getStats() {
        return this.stats;
    }

    // Update stats object
    updateStats(newStats) {
        this.stats = { ...this.stats, ...newStats };
        this.saveStats();
    }
}

// Global statistics manager
window.statisticsManager = new StatisticsManager();