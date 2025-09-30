// Data Manager - Handles all data operations and user progress
class DataManager {
    constructor() {
        this.currentSection = null;
        this.currentLevel = null;
        this.userProgress = this.loadProgress();
        this.questions = null;
    }

    // Load user progress from localStorage
    loadProgress() {
        const saved = localStorage.getItem('quiz-master-progress');
        if (saved) {
            return JSON.parse(saved);
        }

        // Default progress structure
        return {
            totalScore: 0,
            levelsCompleted: 0,
            sections: {
                science: { unlockedLevel: 1, levelsCompleted: [], totalScore: 0 },
                history: { unlockedLevel: 1, levelsCompleted: [], totalScore: 0 },
                sports: { unlockedLevel: 1, levelsCompleted: [], totalScore: 0 },
                literature: { unlockedLevel: 1, levelsCompleted: [], totalScore: 0 },
                general: { unlockedLevel: 1, levelsCompleted: [], totalScore: 0 }
            },
            achievements: [],
            settings: {
                soundEnabled: true,
                timerEnabled: true,
                difficulty: 'normal'
            }
        };
    }

    // Save progress to localStorage
    saveProgress() {
        localStorage.setItem('quiz-master-progress', JSON.stringify(this.userProgress));
    }

    // Load questions for a specific section and level
    async loadQuestions(section, level) {
        try {
            // Check if we have questions in the database
            if (QUIZ_DATABASE[section] && QUIZ_DATABASE[section].levels[level]) {
                const questions = [...QUIZ_DATABASE[section].levels[level]]; // Create a copy

                // Shuffle questions to ensure variety
                this.shuffleArray(questions);

                // Return only 10 questions for the quiz (or all if less than 10)
                return questions.slice(0, 10);
            } else {
                // If no questions exist for this level, return questions from previous level
                // This ensures the game doesn't break for missing levels
                console.warn(`No questions found for ${section} level ${level}, using previous level`);
                const fallbackLevel = Math.max(1, level - 1);
                if (QUIZ_DATABASE[section] && QUIZ_DATABASE[section].levels[fallbackLevel]) {
                    const questions = [...QUIZ_DATABASE[section].levels[fallbackLevel]];
                    this.shuffleArray(questions);
                    return questions.slice(0, 10);
                }
                return [];
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            return [];
        }
    }

    // Generate questions for levels not in the basic dataset
    generateQuestionsForLevel(section, level) {
        const templates = this.getQuestionTemplates(section);
        const difficulty = this.getLevelDifficulty(level);

        const questions = [];
        const questionsPerLevel = 10;

        for (let i = 0; i < questionsPerLevel; i++) {
            const template = templates[Math.floor(Math.random() * templates.length)];
            const question = this.generateQuestionFromTemplate(template, difficulty);
            questions.push(question);
        }

        return questions;
    }

    // Get question templates for each section
    getQuestionTemplates(section) {
        const templates = {
            science: [
                {
                    type: 'multiple_choice',
                    category: 'physics',
                    difficulty_factor: 1.2
                },
                {
                    type: 'multiple_choice',
                    category: 'chemistry',
                    difficulty_factor: 1.1
                },
                {
                    type: 'multiple_choice',
                    category: 'biology',
                    difficulty_factor: 1.0
                }
            ],
            history: [
                {
                    type: 'multiple_choice',
                    category: 'world_history',
                    difficulty_factor: 1.1
                },
                {
                    type: 'multiple_choice',
                    category: 'geography',
                    difficulty_factor: 0.9
                }
            ],
            sports: [
                {
                    type: 'multiple_choice',
                    category: 'sports',
                    difficulty_factor: 0.8
                },
                {
                    type: 'multiple_choice',
                    category: 'entertainment',
                    difficulty_factor: 0.9
                }
            ],
            literature: [
                {
                    type: 'multiple_choice',
                    category: 'literature',
                    difficulty_factor: 1.2
                },
                {
                    type: 'multiple_choice',
                    category: 'arts',
                    difficulty_factor: 1.1
                }
            ],
            general: [
                {
                    type: 'multiple_choice',
                    category: 'general',
                    difficulty_factor: 1.0
                }
            ]
        };

        return templates[section] || templates.general;
    }

    // Determine difficulty based on level
    getLevelDifficulty(level) {
        if (level <= 2) return 'easy';
        if (level <= 5) return 'medium';
        if (level <= 8) return 'hard';
        return 'expert';
    }

    // Generate a question from a template (simplified version)
    generateQuestionFromTemplate(template, difficulty) {
        // This is a simplified version. In a real app, you'd have
        // a comprehensive question generation system or API calls
        const sampleQuestions = {
            easy: {
                question: "What is 2 + 2?",
                options: ["3", "4", "5", "6"],
                correct: 1,
                explanation: "Basic addition: 2 + 2 equals 4."
            },
            medium: {
                question: "What is the square root of 64?",
                options: ["6", "7", "8", "9"],
                correct: 2,
                explanation: "The square root of 64 is 8 because 8 × 8 = 64."
            },
            hard: {
                question: "What is the derivative of x²?",
                options: ["x", "2x", "x²", "2"],
                correct: 1,
                explanation: "The derivative of x² is 2x using the power rule."
            },
            expert: {
                question: "What is the integral of 2x dx?",
                options: ["x²", "x² + C", "2x²", "2x² + C"],
                correct: 1,
                explanation: "The integral of 2x dx is x² + C, where C is the constant of integration."
            }
        };

        return sampleQuestions[difficulty];
    }

    // Update user progress after completing a level
    updateProgress(section, level, score, correctAnswers, totalQuestions) {
        const sectionProgress = this.userProgress.sections[section];

        // Update section progress
        if (!sectionProgress.levelsCompleted.includes(level)) {
            sectionProgress.levelsCompleted.push(level);
            this.userProgress.levelsCompleted++;
        }

        // Update scores
        const levelScore = Math.max(0, score);
        sectionProgress.totalScore += levelScore;
        this.userProgress.totalScore += levelScore;

        // Unlock next level if score is high enough
        const accuracy = (correctAnswers / totalQuestions) * 100;
        if (accuracy >= 60 && level === sectionProgress.unlockedLevel) {
            sectionProgress.unlockedLevel = Math.min(10, level + 1);
        }

        // Check for achievements
        this.checkAchievements(section, level, accuracy);

        // Save progress
        this.saveProgress();

        return {
            levelCompleted: true,
            nextLevelUnlocked: level < sectionProgress.unlockedLevel,
            newAchievements: this.getNewAchievements()
        };
    }

    // Check and award achievements
    checkAchievements(section, level, accuracy) {
        const achievements = [
            {
                id: 'first_level',
                name: 'Getting Started',
                description: 'Complete your first level',
                condition: () => this.userProgress.levelsCompleted >= 1
            },
            {
                id: 'perfect_score',
                name: 'Perfect!',
                description: 'Get 100% accuracy on a level',
                condition: () => accuracy === 100
            },
            {
                id: 'level_5',
                name: 'Warming Up',
                description: 'Complete 5 levels',
                condition: () => this.userProgress.levelsCompleted >= 5
            },
            {
                id: 'level_10',
                name: 'Getting Serious',
                description: 'Complete 10 levels',
                condition: () => this.userProgress.levelsCompleted >= 10
            },
            {
                id: 'high_scorer',
                name: 'High Scorer',
                description: 'Reach 1000 total points',
                condition: () => this.userProgress.totalScore >= 1000
            },
            {
                id: 'section_master',
                name: 'Section Master',
                description: 'Complete all levels in a section',
                condition: () => this.userProgress.sections[section].levelsCompleted.length === 10
            }
        ];

        achievements.forEach(achievement => {
            if (!this.userProgress.achievements.includes(achievement.id) && achievement.condition()) {
                this.userProgress.achievements.push(achievement.id);
            }
        });
    }

    // Get newly earned achievements
    getNewAchievements() {
        // This would return achievements earned in the current session
        return [];
    }

    // Get section information
    getSectionInfo(sectionId) {
        return QUIZ_DATABASE[sectionId];
    }

    // Get user progress for a specific section
    getSectionProgress(sectionId) {
        return this.userProgress.sections[sectionId];
    }

    // Check if a level is unlocked
    isLevelUnlocked(section, level) {
        return level <= this.userProgress.sections[section].unlockedLevel;
    }

    // Get level stars based on previous performance
    getLevelStars(section, level) {
        const completed = this.userProgress.sections[section].levelsCompleted.includes(level);
        if (!completed) return 0;

        // This would be based on actual performance data
        // For now, return random stars (1-3)
        return Math.floor(Math.random() * 3) + 1;
    }

    // Reset all progress (for testing or user request)
    resetProgress() {
        localStorage.removeItem('quiz-master-progress');
        this.userProgress = this.loadProgress();
    }

    // Export progress data
    exportProgress() {
        return JSON.stringify(this.userProgress, null, 2);
    }

    // Import progress data
    importProgress(progressData) {
        try {
            const imported = JSON.parse(progressData);
            this.userProgress = imported;
            this.saveProgress();
            return true;
        } catch (error) {
            console.error('Error importing progress:', error);
            return false;
        }
    }

    // Shuffle array utility
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Create global data manager instance
const dataManager = new DataManager();