// AI Adaptive Difficulty System - Intelligent difficulty adjustment based on performance
class AIAdaptiveDifficulty {
    constructor() {
        this.currentDifficulty = 0.5; // Scale from 0 (easiest) to 1 (hardest)
        this.targetAccuracy = 0.75; // Target 75% accuracy
        this.learningRate = 0.1;
        this.performanceHistory = [];
        this.sessionData = {
            questionsAnswered: 0,
            correctAnswers: 0,
            averageResponseTime: 0,
            totalResponseTime: 0,
            streakCount: 0,
            maxStreak: 0
        };

        this.difficultyFactors = {
            timeComplexity: 0.3,      // How much time pressure affects difficulty
            knowledgeDepth: 0.4,      // How much question complexity affects difficulty
            userConfidence: 0.3       // How much user behavior affects difficulty
        };

        this.adaptationSettings = {
            enabled: true,
            aggressiveness: 0.5,      // How quickly to adapt (0-1)
            smoothing: 0.8,           // How much to smooth difficulty changes
            minDifficulty: 0.2,       // Minimum difficulty level
            maxDifficulty: 0.9        // Maximum difficulty level
        };

        this.userProfile = {
            skillLevel: 0.5,
            learningStyle: 'balanced', // visual, auditory, kinesthetic, balanced
            preferredPace: 'medium',   // slow, medium, fast
            knowledgeAreas: {},        // Track performance by category
            adaptationPreferences: {
                wantsChallenge: true,
                prefersGradualIncrease: true,
                avoidsTimePresure: false
            }
        };

        this.questionPool = {
            easy: [],
            medium: [],
            hard: [],
            expert: []
        };

        this.aiModel = {
            weights: {
                accuracy: 0.4,
                responseTime: 0.2,
                streak: 0.2,
                confidence: 0.1,
                engagement: 0.1
            },
            neuralNetwork: null // Placeholder for actual neural network
        };

        this.loadAIData();
        this.initializeAdaptiveSystem();
    }

    loadAIData() {
        // Load user profile and performance history
        const savedProfile = localStorage.getItem('quiz-ai-profile');
        if (savedProfile) {
            this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
        }

        const savedHistory = localStorage.getItem('quiz-performance-history');
        if (savedHistory) {
            this.performanceHistory = JSON.parse(savedHistory);
        }

        const savedSettings = localStorage.getItem('quiz-ai-settings');
        if (savedSettings) {
            this.adaptationSettings = { ...this.adaptationSettings, ...JSON.parse(savedSettings) };
        }

        // Initialize user's difficulty based on history
        if (this.performanceHistory.length > 0) {
            this.currentDifficulty = this.calculateOptimalDifficulty();
        }
    }

    saveAIData() {
        localStorage.setItem('quiz-ai-profile', JSON.stringify(this.userProfile));
        localStorage.setItem('quiz-performance-history', JSON.stringify(this.performanceHistory));
        localStorage.setItem('quiz-ai-settings', JSON.stringify(this.adaptationSettings));
    }

    initializeAdaptiveSystem() {
        this.setupPerformanceTracking();
        this.categorizeQuestions();
        this.initializeNeuralNetwork();
    }

    setupPerformanceTracking() {
        // Listen for quiz events to track performance
        document.addEventListener('questionAnswered', (e) => {
            this.recordQuestionResponse(e.detail);
        });

        document.addEventListener('quizCompleted', (e) => {
            this.analyzeSessionPerformance(e.detail);
        });

        document.addEventListener('userInteraction', (e) => {
            this.trackEngagementMetrics(e.detail);
        });
    }

    categorizeQuestions() {
        // Categorize questions by difficulty based on various factors
        if (!window.gameLogic?.questionsDatabase) return;

        Object.entries(window.gameLogic.questionsDatabase).forEach(([category, levels]) => {
            levels.forEach((levelQuestions, levelIndex) => {
                levelQuestions.forEach(question => {
                    const difficulty = this.calculateQuestionDifficulty(question, levelIndex, category);

                    if (difficulty < 0.3) {
                        this.questionPool.easy.push({ ...question, difficulty, category, level: levelIndex });
                    } else if (difficulty < 0.6) {
                        this.questionPool.medium.push({ ...question, difficulty, category, level: levelIndex });
                    } else if (difficulty < 0.8) {
                        this.questionPool.hard.push({ ...question, difficulty, category, level: levelIndex });
                    } else {
                        this.questionPool.expert.push({ ...question, difficulty, category, level: levelIndex });
                    }
                });
            });
        });
    }

    calculateQuestionDifficulty(question, level, category) {
        let difficulty = 0;

        // Base difficulty from level
        difficulty += (level / 10) * 0.4;

        // Text complexity analysis
        const textComplexity = this.analyzeTextComplexity(question.question);
        difficulty += textComplexity * 0.3;

        // Category-specific difficulty
        const categoryDifficulty = this.getCategoryDifficulty(category);
        difficulty += categoryDifficulty * 0.2;

        // Answer complexity
        const answerComplexity = this.analyzeAnswerComplexity(question.answers);
        difficulty += answerComplexity * 0.1;

        return Math.min(1, Math.max(0, difficulty));
    }

    analyzeTextComplexity(text) {
        // Simple text complexity analysis
        const words = text.split(' ').length;
        const avgWordLength = text.replace(/\s/g, '').length / words;
        const complexity = (words / 20) * 0.6 + (avgWordLength / 10) * 0.4;

        return Math.min(1, complexity);
    }

    getCategoryDifficulty(category) {
        const categoryDifficulties = {
            science: 0.8,
            history: 0.6,
            literature: 0.7,
            sports: 0.4,
            general: 0.5
        };
        return categoryDifficulties[category] || 0.5;
    }

    analyzeAnswerComplexity(answers) {
        // Analyze similarity between answers (more similar = harder)
        let totalSimilarity = 0;
        let comparisons = 0;

        for (let i = 0; i < answers.length; i++) {
            for (let j = i + 1; j < answers.length; j++) {
                const similarity = this.calculateStringSimilarity(answers[i], answers[j]);
                totalSimilarity += similarity;
                comparisons++;
            }
        }

        return comparisons > 0 ? totalSimilarity / comparisons : 0;
    }

    calculateStringSimilarity(str1, str2) {
        // Simple Levenshtein distance-based similarity
        const len1 = str1.length;
        const len2 = str2.length;
        const maxLen = Math.max(len1, len2);

        if (maxLen === 0) return 1;

        // Simplified similarity calculation
        const commonChars = this.getCommonCharacters(str1.toLowerCase(), str2.toLowerCase());
        return commonChars / maxLen;
    }

    getCommonCharacters(str1, str2) {
        let common = 0;
        const shorter = str1.length < str2.length ? str1 : str2;
        const longer = str1.length >= str2.length ? str1 : str2;

        for (let char of shorter) {
            if (longer.includes(char)) {
                common++;
            }
        }

        return common;
    }

    recordQuestionResponse(responseData) {
        const {
            questionId,
            isCorrect,
            responseTime,
            confidence,
            difficulty,
            category
        } = responseData;

        // Update session data
        this.sessionData.questionsAnswered++;
        this.sessionData.totalResponseTime += responseTime;
        this.sessionData.averageResponseTime = this.sessionData.totalResponseTime / this.sessionData.questionsAnswered;

        if (isCorrect) {
            this.sessionData.correctAnswers++;
            this.sessionData.streakCount++;
            this.sessionData.maxStreak = Math.max(this.sessionData.maxStreak, this.sessionData.streakCount);
        } else {
            this.sessionData.streakCount = 0;
        }

        // Record in performance history
        const performanceRecord = {
            timestamp: Date.now(),
            questionId,
            isCorrect,
            responseTime,
            confidence: confidence || this.estimateConfidence(responseTime, isCorrect),
            difficulty: difficulty || this.currentDifficulty,
            category,
            sessionAccuracy: this.sessionData.correctAnswers / this.sessionData.questionsAnswered,
            sessionId: this.getCurrentSessionId()
        };

        this.performanceHistory.push(performanceRecord);

        // Keep only last 1000 records
        if (this.performanceHistory.length > 1000) {
            this.performanceHistory = this.performanceHistory.slice(-1000);
        }

        // Update knowledge areas
        if (!this.userProfile.knowledgeAreas[category]) {
            this.userProfile.knowledgeAreas[category] = {
                accuracy: 0,
                averageTime: 0,
                questionsAnswered: 0,
                skillLevel: 0.5
            };
        }

        const categoryData = this.userProfile.knowledgeAreas[category];
        categoryData.questionsAnswered++;
        categoryData.accuracy = ((categoryData.accuracy * (categoryData.questionsAnswered - 1)) + (isCorrect ? 1 : 0)) / categoryData.questionsAnswered;
        categoryData.averageTime = ((categoryData.averageTime * (categoryData.questionsAnswered - 1)) + responseTime) / categoryData.questionsAnswered;
        categoryData.skillLevel = this.calculateCategorySkillLevel(category);

        // Adapt difficulty
        if (this.adaptationSettings.enabled) {
            this.adaptDifficulty(performanceRecord);
        }

        this.saveAIData();
    }

    estimateConfidence(responseTime, isCorrect) {
        // Estimate confidence based on response time and correctness
        const fastResponse = responseTime < 3000;
        const mediumResponse = responseTime < 8000;

        if (isCorrect && fastResponse) return 0.9;
        if (isCorrect && mediumResponse) return 0.7;
        if (isCorrect) return 0.5;
        if (!isCorrect && fastResponse) return 0.3; // Fast but wrong = overconfident
        if (!isCorrect && mediumResponse) return 0.2;
        return 0.1; // Slow and wrong = low confidence
    }

    adaptDifficulty(performanceRecord) {
        const recentPerformance = this.getRecentPerformance(10); // Last 10 questions
        const currentAccuracy = recentPerformance.reduce((sum, p) => sum + (p.isCorrect ? 1 : 0), 0) / recentPerformance.length;

        // Calculate desired difficulty adjustment
        let adjustment = 0;

        // Accuracy-based adjustment
        const accuracyDiff = currentAccuracy - this.targetAccuracy;
        adjustment -= accuracyDiff * this.adaptationSettings.aggressiveness;

        // Response time adjustment
        const avgResponseTime = recentPerformance.reduce((sum, p) => sum + p.responseTime, 0) / recentPerformance.length;
        const expectedTime = 8000; // 8 seconds expected
        const timeDiff = (avgResponseTime - expectedTime) / expectedTime;
        adjustment -= timeDiff * 0.2 * this.adaptationSettings.aggressiveness;

        // Confidence adjustment
        const avgConfidence = recentPerformance.reduce((sum, p) => sum + p.confidence, 0) / recentPerformance.length;
        if (avgConfidence > 0.8 && currentAccuracy > 0.8) {
            adjustment += 0.1; // Increase difficulty if confident and accurate
        }

        // Apply smoothing
        const smoothedAdjustment = adjustment * (1 - this.adaptationSettings.smoothing) +
                                  this.currentDifficulty * this.adaptationSettings.smoothing;

        // Update difficulty with constraints
        this.currentDifficulty = Math.max(
            this.adaptationSettings.minDifficulty,
            Math.min(
                this.adaptationSettings.maxDifficulty,
                this.currentDifficulty + (smoothedAdjustment * this.learningRate)
            )
        );

        console.log(`🤖 AI Difficulty adapted: ${(this.currentDifficulty * 100).toFixed(1)}% (Accuracy: ${(currentAccuracy * 100).toFixed(1)}%)`);
    }

    getRecentPerformance(count) {
        return this.performanceHistory.slice(-count);
    }

    calculateCategorySkillLevel(category) {
        const categoryData = this.userProfile.knowledgeAreas[category];
        if (!categoryData || categoryData.questionsAnswered < 5) return 0.5;

        // Combine accuracy and speed for skill level
        const accuracyScore = categoryData.accuracy;
        const speedScore = Math.max(0, 1 - (categoryData.averageTime / 15000)); // Normalize to 15 seconds

        return (accuracyScore * 0.7) + (speedScore * 0.3);
    }

    getOptimalQuestion(category = null, previousQuestions = []) {
        if (!this.adaptationSettings.enabled) {
            return this.getRandomQuestion(category);
        }

        // Determine target difficulty pool
        const targetPool = this.getDifficultyPool(this.currentDifficulty);

        // Filter by category if specified
        let candidateQuestions = targetPool;
        if (category) {
            candidateQuestions = targetPool.filter(q => q.category === category);
        }

        // Avoid recently asked questions
        candidateQuestions = candidateQuestions.filter(q =>
            !previousQuestions.some(prev => prev.question === q.question)
        );

        if (candidateQuestions.length === 0) {
            return this.getRandomQuestion(category);
        }

        // Use AI scoring to select best question
        const scoredQuestions = candidateQuestions.map(question => ({
            question,
            score: this.scoreQuestion(question)
        }));

        // Sort by score and add some randomization
        scoredQuestions.sort((a, b) => b.score - a.score);

        // Select from top 3 candidates to maintain some unpredictability
        const topCandidates = scoredQuestions.slice(0, 3);
        const selectedQuestion = topCandidates[Math.floor(Math.random() * topCandidates.length)];

        return selectedQuestion.question;
    }

    getDifficultyPool(targetDifficulty) {
        if (targetDifficulty < 0.25) return this.questionPool.easy;
        if (targetDifficulty < 0.5) return [...this.questionPool.easy, ...this.questionPool.medium];
        if (targetDifficulty < 0.75) return [...this.questionPool.medium, ...this.questionPool.hard];
        return [...this.questionPool.hard, ...this.questionPool.expert];
    }

    scoreQuestion(question) {
        let score = 0;

        // Difficulty match score
        const difficultyMatch = 1 - Math.abs(question.difficulty - this.currentDifficulty);
        score += difficultyMatch * 0.4;

        // Category performance score
        const categoryData = this.userProfile.knowledgeAreas[question.category];
        if (categoryData) {
            const categoryScore = categoryData.skillLevel;
            score += categoryScore * 0.3;
        }

        // Novelty score (prefer less recently seen categories)
        const recentCategories = this.getRecentPerformance(5).map(p => p.category);
        const categoryFrequency = recentCategories.filter(cat => cat === question.category).length;
        const noveltyScore = Math.max(0, 1 - (categoryFrequency / 5));
        score += noveltyScore * 0.2;

        // Learning objective score
        score += this.calculateLearningObjectiveScore(question) * 0.1;

        return score;
    }

    calculateLearningObjectiveScore(question) {
        // Score based on learning objectives (areas where user needs improvement)
        const categoryData = this.userProfile.knowledgeAreas[question.category];
        if (!categoryData) return 0.5;

        // Prefer categories where user has room for improvement
        return 1 - categoryData.skillLevel;
    }

    getRandomQuestion(category = null) {
        // Fallback random question selection
        const allQuestions = [
            ...this.questionPool.easy,
            ...this.questionPool.medium,
            ...this.questionPool.hard,
            ...this.questionPool.expert
        ];

        let candidateQuestions = allQuestions;
        if (category) {
            candidateQuestions = allQuestions.filter(q => q.category === category);
        }

        if (candidateQuestions.length === 0) return null;

        return candidateQuestions[Math.floor(Math.random() * candidateQuestions.length)];
    }

    analyzeSessionPerformance(sessionData) {
        const analysis = {
            accuracy: this.sessionData.correctAnswers / this.sessionData.questionsAnswered,
            averageResponseTime: this.sessionData.averageResponseTime,
            maxStreak: this.sessionData.maxStreak,
            improvementAreas: [],
            strengths: [],
            recommendations: []
        };

        // Identify improvement areas
        Object.entries(this.userProfile.knowledgeAreas).forEach(([category, data]) => {
            if (data.accuracy < 0.6) {
                analysis.improvementAreas.push(category);
            } else if (data.accuracy > 0.8) {
                analysis.strengths.push(category);
            }
        });

        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis);

        // Update user profile based on session
        this.updateUserProfile(analysis);

        return analysis;
    }

    generateRecommendations(analysis) {
        const recommendations = [];

        if (analysis.accuracy < 0.6) {
            recommendations.push("Consider reviewing basic concepts before attempting harder questions");
            recommendations.push("Try enabling adaptive difficulty to get more suitable questions");
        } else if (analysis.accuracy > 0.9) {
            recommendations.push("Excellent performance! Try increasing difficulty for more challenge");
            recommendations.push("Consider trying time attack mode to test speed");
        }

        if (analysis.averageResponseTime > 15000) {
            recommendations.push("Take time to read questions carefully, but try to improve response speed");
        } else if (analysis.averageResponseTime < 3000) {
            recommendations.push("Great speed! Make sure to read questions thoroughly for accuracy");
        }

        analysis.improvementAreas.forEach(area => {
            recommendations.push(`Focus on ${area} topics - practice with targeted questions`);
        });

        return recommendations;
    }

    updateUserProfile(analysis) {
        // Update overall skill level
        const recentAccuracy = this.getRecentPerformance(20).reduce((sum, p) => sum + (p.isCorrect ? 1 : 0), 0) / 20;
        this.userProfile.skillLevel = (this.userProfile.skillLevel * 0.8) + (recentAccuracy * 0.2);

        // Update learning style based on performance patterns
        this.updateLearningStyle();

        // Update preferences based on behavior
        this.updateAdaptationPreferences();

        this.saveAIData();
    }

    updateLearningStyle() {
        // Analyze response patterns to determine learning style
        const recentPerformance = this.getRecentPerformance(50);

        // Simple heuristics for learning style detection
        const avgResponseTime = recentPerformance.reduce((sum, p) => sum + p.responseTime, 0) / recentPerformance.length;

        if (avgResponseTime < 5000) {
            this.userProfile.learningStyle = 'fast-paced';
        } else if (avgResponseTime > 12000) {
            this.userProfile.learningStyle = 'methodical';
        } else {
            this.userProfile.learningStyle = 'balanced';
        }
    }

    updateAdaptationPreferences() {
        const recentPerformance = this.getRecentPerformance(30);
        const accuracy = recentPerformance.reduce((sum, p) => sum + (p.isCorrect ? 1 : 0), 0) / recentPerformance.length;

        // Update challenge preference based on performance and engagement
        if (accuracy > 0.85) {
            this.userProfile.adaptationPreferences.wantsChallenge = true;
        } else if (accuracy < 0.6) {
            this.userProfile.adaptationPreferences.wantsChallenge = false;
        }
    }

    getCurrentSessionId() {
        // Simple session ID based on timestamp
        return Math.floor(Date.now() / (1000 * 60 * 30)); // 30-minute sessions
    }

    calculateOptimalDifficulty() {
        if (this.performanceHistory.length < 10) return 0.5;

        const recentPerformance = this.getRecentPerformance(20);
        const accuracy = recentPerformance.reduce((sum, p) => sum + (p.isCorrect ? 1 : 0), 0) / recentPerformance.length;

        // Use neural network approach if available, otherwise use rule-based
        if (this.aiModel.neuralNetwork) {
            return this.neuralNetworkPredict(recentPerformance);
        } else {
            return this.ruleBasedDifficultyCalculation(accuracy);
        }
    }

    ruleBasedDifficultyCalculation(accuracy) {
        // Rule-based difficulty calculation
        if (accuracy > 0.9) return Math.min(0.9, this.currentDifficulty + 0.1);
        if (accuracy > 0.8) return Math.min(0.8, this.currentDifficulty + 0.05);
        if (accuracy > 0.7) return this.currentDifficulty;
        if (accuracy > 0.6) return Math.max(0.3, this.currentDifficulty - 0.05);
        return Math.max(0.2, this.currentDifficulty - 0.1);
    }

    initializeNeuralNetwork() {
        // Placeholder for neural network initialization
        // In a real implementation, this would initialize a TensorFlow.js model
        this.aiModel.neuralNetwork = {
            predict: (inputs) => {
                // Simple linear combination for demo
                return inputs.reduce((sum, input, index) => {
                    const weights = Object.values(this.aiModel.weights);
                    return sum + (input * (weights[index] || 0.1));
                }, 0) / inputs.length;
            }
        };
    }

    neuralNetworkPredict(performanceData) {
        // Extract features for neural network
        const features = [
            performanceData.reduce((sum, p) => sum + (p.isCorrect ? 1 : 0), 0) / performanceData.length, // accuracy
            performanceData.reduce((sum, p) => sum + p.responseTime, 0) / performanceData.length / 10000, // normalized avg time
            this.sessionData.maxStreak / 10, // normalized streak
            performanceData.reduce((sum, p) => sum + p.confidence, 0) / performanceData.length, // avg confidence
            this.calculateEngagementScore() // engagement
        ];

        return this.aiModel.neuralNetwork.predict(features);
    }

    calculateEngagementScore() {
        // Calculate engagement based on session length, consistency, etc.
        const sessionLength = this.sessionData.questionsAnswered;
        const consistency = 1 - (Math.abs(this.sessionData.averageResponseTime - 8000) / 8000);

        return Math.min(1, (sessionLength / 20) * 0.6 + consistency * 0.4);
    }

    // Export AI data
    exportAIData() {
        return {
            userProfile: this.userProfile,
            performanceHistory: this.performanceHistory,
            currentDifficulty: this.currentDifficulty,
            adaptationSettings: this.adaptationSettings
        };
    }

    // Import AI data
    importAIData(data) {
        if (data.userProfile) this.userProfile = { ...this.userProfile, ...data.userProfile };
        if (data.performanceHistory) this.performanceHistory = data.performanceHistory;
        if (data.currentDifficulty) this.currentDifficulty = data.currentDifficulty;
        if (data.adaptationSettings) this.adaptationSettings = { ...this.adaptationSettings, ...data.adaptationSettings };

        this.saveAIData();
    }

    // Get AI insights for user
    getAIInsights() {
        const recentPerformance = this.getRecentPerformance(50);
        const accuracy = recentPerformance.length > 0 ?
            recentPerformance.reduce((sum, p) => sum + (p.isCorrect ? 1 : 0), 0) / recentPerformance.length : 0;

        return {
            currentDifficulty: this.currentDifficulty,
            recommendedDifficulty: this.calculateOptimalDifficulty(),
            skillLevel: this.userProfile.skillLevel,
            learningStyle: this.userProfile.learningStyle,
            strongAreas: Object.entries(this.userProfile.knowledgeAreas)
                .filter(([_, data]) => data.accuracy > 0.8)
                .map(([category, _]) => category),
            improvementAreas: Object.entries(this.userProfile.knowledgeAreas)
                .filter(([_, data]) => data.accuracy < 0.6)
                .map(([category, _]) => category),
            recentAccuracy: accuracy,
            adaptationEnabled: this.adaptationSettings.enabled
        };
    }
}

// Global AI adaptive difficulty system
window.aiAdaptiveDifficulty = new AIAdaptiveDifficulty();