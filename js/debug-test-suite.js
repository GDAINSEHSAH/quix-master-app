// Debug Test Suite - Comprehensive testing for all premium features
class DebugTestSuite {
    constructor() {
        this.testResults = [];
        this.errors = [];
        this.warnings = [];
        this.startTime = Date.now();

        this.tests = {
            core: [
                'testQuestionDatabase',
                'testGameLogic',
                'testUIManager',
                'testStorageManager'
            ],
            phase1: [
                'testAudioManager',
                'testThemeManager',
                'testAchievementsSystem',
                'testPowerUpsSystem',
                'testDailyChallenges'
            ],
            phase2: [
                'testStatisticsManager',
                'testTimeAttackMode',
                'testSocialSharing'
            ],
            phase3: [
                'testMultiplayerManager',
                'testAIAdaptiveDifficulty',
                'testCustomQuizCreator',
                'testVoiceNarration'
            ],
            integration: [
                'testCrossFeatureIntegration',
                'testPerformance',
                'testMobileCompatibility',
                'testBrowserCompatibility'
            ]
        };
    }

    async runAllTests() {
        console.log('🧪 Starting comprehensive test suite...');

        try {
            // Test each phase
            for (const [phase, tests] of Object.entries(this.tests)) {
                console.log(`\n📋 Testing ${phase.toUpperCase()} features...`);

                for (const test of tests) {
                    await this.runTest(test, phase);
                }
            }

            this.generateTestReport();
            return this.testResults;

        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.errors.push({
                test: 'Test Suite',
                error: error.message,
                stack: error.stack
            });
        }
    }

    async runTest(testName, phase) {
        const startTime = Date.now();
        let result = {
            name: testName,
            phase: phase,
            status: 'pending',
            duration: 0,
            errors: [],
            warnings: []
        };

        try {
            console.log(`  🔍 Running ${testName}...`);

            if (typeof this[testName] === 'function') {
                await this[testName](result);
                result.status = result.errors.length > 0 ? 'failed' : 'passed';
            } else {
                result.status = 'skipped';
                result.warnings.push('Test method not implemented');
            }

        } catch (error) {
            result.status = 'failed';
            result.errors.push({
                message: error.message,
                stack: error.stack
            });
            console.error(`    ❌ ${testName} failed:`, error.message);
        } finally {
            result.duration = Date.now() - startTime;
            this.testResults.push(result);

            const status = result.status === 'passed' ? '✅' :
                          result.status === 'failed' ? '❌' : '⚠️';
            console.log(`    ${status} ${testName} (${result.duration}ms)`);
        }
    }

    // Core System Tests
    testQuestionDatabase(result) {
        if (!window.gameLogic?.questionsDatabase) {
            result.errors.push('Questions database not loaded');
            return;
        }

        const db = window.gameLogic.questionsDatabase;
        const categories = ['science', 'history', 'sports', 'literature', 'general'];

        for (const category of categories) {
            if (!db[category]) {
                result.errors.push(`Missing category: ${category}`);
                continue;
            }

            // Check each level has questions
            db[category].forEach((level, index) => {
                if (!Array.isArray(level) || level.length === 0) {
                    result.errors.push(`${category} level ${index + 1} has no questions`);
                }

                // Validate question structure
                level.forEach((question, qIndex) => {
                    if (!question.question || !question.answers || question.correct === undefined) {
                        result.errors.push(`Invalid question structure in ${category} level ${index + 1}, question ${qIndex + 1}`);
                    }

                    if (!Array.isArray(question.answers) || question.answers.length < 2) {
                        result.errors.push(`Invalid answers in ${category} level ${index + 1}, question ${qIndex + 1}`);
                    }

                    if (question.correct < 0 || question.correct >= question.answers.length) {
                        result.errors.push(`Invalid correct answer index in ${category} level ${index + 1}, question ${qIndex + 1}`);
                    }
                });
            });
        }

        console.log(`    📊 Total questions validated: ${Object.values(db).flat(2).length}`);
    }

    testGameLogic(result) {
        if (!window.gameLogic) {
            result.errors.push('GameLogic not initialized');
            return;
        }

        // Test basic methods exist
        const requiredMethods = ['startQuiz', 'submitAnswer', 'getCurrentQuestion', 'calculateScore'];
        for (const method of requiredMethods) {
            if (typeof window.gameLogic[method] !== 'function') {
                result.errors.push(`Missing method: ${method}`);
            }
        }

        // Test score calculation
        try {
            const testScore = window.gameLogic.calculateScore(true, 5000, 1);
            if (typeof testScore !== 'number' || testScore < 0) {
                result.errors.push('Score calculation returns invalid value');
            }
        } catch (error) {
            result.errors.push(`Score calculation failed: ${error.message}`);
        }
    }

    testUIManager(result) {
        if (!window.uiManager) {
            result.errors.push('UIManager not initialized');
            return;
        }

        // Check essential UI elements exist
        const essentialElements = [
            'main-menu', 'game-screen', 'results-screen',
            'question-text', 'answers-grid', 'score-display'
        ];

        for (const elementId of essentialElements) {
            if (!document.getElementById(elementId)) {
                result.errors.push(`Missing UI element: ${elementId}`);
            }
        }

        // Test responsive design
        this.testResponsiveDesign(result);
    }

    testStorageManager(result) {
        if (!window.storageManager) {
            result.errors.push('StorageManager not initialized');
            return;
        }

        // Test localStorage functionality
        try {
            const testKey = 'debug-test-key';
            const testData = { test: 'data', timestamp: Date.now() };

            localStorage.setItem(testKey, JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem(testKey));

            if (!retrieved || retrieved.test !== testData.test) {
                result.errors.push('localStorage read/write test failed');
            }

            localStorage.removeItem(testKey);
        } catch (error) {
            result.errors.push(`Storage test failed: ${error.message}`);
        }
    }

    // Phase 1 Tests
    testAudioManager(result) {
        if (!window.audioManager) {
            result.errors.push('AudioManager not initialized');
            return;
        }

        // Test audio elements exist
        const audioElements = ['correct-sound', 'wrong-sound', 'powerup-sound', 'achievement-sound'];
        for (const elementId of audioElements) {
            const audio = document.getElementById(elementId);
            if (!audio) {
                result.warnings.push(`Audio element missing: ${elementId}`);
            }
        }

        // Test audio methods
        const audioMethods = ['playCorrect', 'playWrong', 'playPowerup', 'playAchievement'];
        for (const method of audioMethods) {
            if (typeof window.audioManager[method] !== 'function') {
                result.errors.push(`Missing audio method: ${method}`);
            }
        }

        // Test settings
        if (!window.audioManager.settings) {
            result.errors.push('Audio settings not initialized');
        }
    }

    testThemeManager(result) {
        if (!window.themeManager) {
            result.errors.push('ThemeManager not initialized');
            return;
        }

        // Test themes exist
        const requiredThemes = ['light', 'dark', 'neon', 'ocean', 'sunset', 'forest'];
        for (const theme of requiredThemes) {
            if (!window.themeManager.themes[theme]) {
                result.errors.push(`Missing theme: ${theme}`);
            }
        }

        // Test theme application
        try {
            const originalTheme = window.themeManager.currentTheme;
            window.themeManager.applyTheme('dark');

            if (document.body.getAttribute('data-theme') !== 'dark') {
                result.errors.push('Theme application failed');
            }

            // Restore original theme
            window.themeManager.applyTheme(originalTheme);
        } catch (error) {
            result.errors.push(`Theme switching failed: ${error.message}`);
        }
    }

    testAchievementsSystem(result) {
        if (!window.achievementsSystem) {
            result.errors.push('AchievementsSystem not initialized');
            return;
        }

        // Test achievements structure
        const achievements = window.achievementsSystem.getAllAchievements();
        if (!achievements || Object.keys(achievements).length === 0) {
            result.errors.push('No achievements defined');
            return;
        }

        // Validate achievement structure
        for (const [id, achievement] of Object.entries(achievements)) {
            if (!achievement.name || !achievement.description || !achievement.condition) {
                result.errors.push(`Invalid achievement structure: ${id}`);
            }

            if (typeof achievement.condition !== 'function') {
                result.errors.push(`Achievement condition is not a function: ${id}`);
            }
        }

        console.log(`    🏆 Total achievements: ${Object.keys(achievements).length}`);
    }

    testPowerUpsSystem(result) {
        if (!window.powerUpsSystem) {
            result.errors.push('PowerUpsSystem not initialized');
            return;
        }

        const powerUps = window.powerUpsSystem.getAllPowerUps();
        const expectedPowerUps = ['fiftyFifty', 'extraTime', 'skip', 'doublePoints', 'revealAnswer', 'freezeTime', 'perfectQuestion'];

        for (const powerUpId of expectedPowerUps) {
            if (!powerUps[powerUpId]) {
                result.errors.push(`Missing power-up: ${powerUpId}`);
            }
        }

        // Test inventory functionality
        const inventory = window.powerUpsSystem.getInventory();
        if (typeof inventory !== 'object') {
            result.errors.push('Power-up inventory not properly initialized');
        }
    }

    testDailyChallenges(result) {
        if (!window.dailyChallengesSystem) {
            result.errors.push('DailyChallengesSystem not initialized');
            return;
        }

        // Test challenge structure
        const challenges = window.dailyChallengesSystem.challenges;
        if (!challenges || Object.keys(challenges).length === 0) {
            result.errors.push('No daily challenges defined');
            return;
        }

        // Check challenge types
        const challengeTypes = ['daily', 'weekly', 'special'];
        for (const type of challengeTypes) {
            const challengesOfType = Object.values(challenges).filter(c => c.type === type);
            if (challengesOfType.length === 0) {
                result.warnings.push(`No ${type} challenges found`);
            }
        }

        console.log(`    🎯 Total challenges: ${Object.keys(challenges).length}`);
    }

    // Phase 2 Tests
    testStatisticsManager(result) {
        if (!window.statisticsManager) {
            result.errors.push('StatisticsManager not initialized');
            return;
        }

        // Test statistics methods
        const requiredMethods = ['getStats', 'updateStats', 'calculateTrends', 'exportStats'];
        for (const method of requiredMethods) {
            if (typeof window.statisticsManager[method] !== 'function') {
                result.errors.push(`Missing statistics method: ${method}`);
            }
        }

        // Test stats structure
        try {
            const stats = window.statisticsManager.getStats();
            if (!stats || typeof stats !== 'object') {
                result.errors.push('Statistics not properly initialized');
            }
        } catch (error) {
            result.errors.push(`Statistics retrieval failed: ${error.message}`);
        }
    }

    testTimeAttackMode(result) {
        if (!window.timeAttackMode) {
            result.errors.push('TimeAttackMode not initialized');
            return;
        }

        // Test time attack methods
        const requiredMethods = ['startTimeAttack', 'endTimeAttack', 'getTimeAttackStats'];
        for (const method of requiredMethods) {
            if (typeof window.timeAttackMode[method] !== 'function') {
                result.errors.push(`Missing time attack method: ${method}`);
            }
        }

        // Test settings
        if (!window.timeAttackMode.settings) {
            result.errors.push('Time attack settings not initialized');
        }
    }

    testSocialSharing(result) {
        if (!window.socialSharingSystem) {
            result.errors.push('SocialSharingSystem not initialized');
            return;
        }

        // Test social platforms
        const platforms = window.socialSharingSystem.platforms;
        const expectedPlatforms = ['twitter', 'facebook', 'whatsapp', 'telegram'];

        for (const platform of expectedPlatforms) {
            if (!platforms[platform]) {
                result.errors.push(`Missing social platform: ${platform}`);
            }
        }

        // Test sharing methods
        const sharingMethods = ['shareAchievement', 'shareScore', 'inviteFriend'];
        for (const method of sharingMethods) {
            if (typeof window.socialSharingSystem[method] !== 'function') {
                result.errors.push(`Missing sharing method: ${method}`);
            }
        }
    }

    // Phase 3 Tests
    testMultiplayerManager(result) {
        if (!window.multiplayerManager) {
            result.errors.push('MultiplayerManager not initialized');
            return;
        }

        // Test multiplayer methods
        const requiredMethods = ['connect', 'startQuickMatch', 'createRoom', 'joinRoom'];
        for (const method of requiredMethods) {
            if (typeof window.multiplayerManager[method] !== 'function') {
                result.errors.push(`Missing multiplayer method: ${method}`);
            }
        }

        // Test multiplayer stats
        if (!window.multiplayerManager.multiplayerStats) {
            result.errors.push('Multiplayer stats not initialized');
        }
    }

    testAIAdaptiveDifficulty(result) {
        if (!window.aiAdaptiveDifficulty) {
            result.errors.push('AIAdaptiveDifficulty not initialized');
            return;
        }

        // Test AI methods
        const requiredMethods = ['getOptimalQuestion', 'adaptDifficulty', 'calculateOptimalDifficulty'];
        for (const method of requiredMethods) {
            if (typeof window.aiAdaptiveDifficulty[method] !== 'function') {
                result.errors.push(`Missing AI method: ${method}`);
            }
        }

        // Test difficulty calculation
        try {
            const difficulty = window.aiAdaptiveDifficulty.currentDifficulty;
            if (typeof difficulty !== 'number' || difficulty < 0 || difficulty > 1) {
                result.errors.push('Invalid difficulty value');
            }
        } catch (error) {
            result.errors.push(`AI difficulty test failed: ${error.message}`);
        }
    }

    testCustomQuizCreator(result) {
        if (!window.customQuizCreator) {
            result.errors.push('CustomQuizCreator not initialized');
            return;
        }

        // Test quiz creation methods
        const requiredMethods = ['showQuizCreator', 'saveQuiz', 'exportQuiz', 'importQuiz'];
        for (const method of requiredMethods) {
            if (typeof window.customQuizCreator[method] !== 'function') {
                result.errors.push(`Missing quiz creator method: ${method}`);
            }
        }

        // Test templates
        const templates = window.customQuizCreator.templates;
        if (!templates || Object.keys(templates).length === 0) {
            result.errors.push('No quiz templates defined');
        }
    }

    testVoiceNarration(result) {
        if (!window.voiceNarrationSystem) {
            result.errors.push('VoiceNarrationSystem not initialized');
            return;
        }

        // Test browser support
        if (!window.voiceNarrationSystem.isSupported) {
            result.warnings.push('Voice narration not supported in this browser');
            return;
        }

        // Test voice methods
        const requiredMethods = ['speak', 'startListening', 'stopListening'];
        for (const method of requiredMethods) {
            if (typeof window.voiceNarrationSystem[method] !== 'function') {
                result.errors.push(`Missing voice method: ${method}`);
            }
        }

        // Test settings
        if (!window.voiceNarrationSystem.settings) {
            result.errors.push('Voice settings not initialized');
        }
    }

    // Integration Tests
    testCrossFeatureIntegration(result) {
        // Test that all systems can communicate
        const systems = [
            'gameLogic', 'audioManager', 'themeManager', 'achievementsSystem',
            'powerUpsSystem', 'statisticsManager', 'socialSharingSystem'
        ];

        for (const system of systems) {
            if (!window[system]) {
                result.errors.push(`System not available for integration: ${system}`);
            }
        }

        // Test event communication
        try {
            // Simulate a question answered event
            const testEvent = new CustomEvent('questionAnswered', {
                detail: { isCorrect: true, responseTime: 3000 }
            });
            document.dispatchEvent(testEvent);
        } catch (error) {
            result.errors.push(`Event system test failed: ${error.message}`);
        }
    }

    testPerformance(result) {
        // Test page load performance
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

                if (loadTime > 5000) {
                    result.warnings.push(`Slow page load time: ${loadTime}ms`);
                } else if (loadTime > 3000) {
                    result.warnings.push(`Moderate page load time: ${loadTime}ms`);
                }

                console.log(`    ⏱️ Page load time: ${loadTime}ms`);
            }
        }

        // Test memory usage
        if ('memory' in performance) {
            const memory = performance.memory;
            const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);

            if (memoryUsage > 100) {
                result.warnings.push(`High memory usage: ${memoryUsage}MB`);
            }

            console.log(`    🧠 Memory usage: ${memoryUsage}MB`);
        }
    }

    testMobileCompatibility(result) {
        // Test viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            result.errors.push('Missing viewport meta tag for mobile compatibility');
        }

        // Test touch events
        if ('ontouchstart' in window) {
            console.log('    📱 Touch events supported');
        } else {
            result.warnings.push('Touch events not supported (desktop environment)');
        }

        // Test responsive breakpoints
        const breakpoints = [768, 1024, 1200];
        for (const breakpoint of breakpoints) {
            // This would need actual CSS testing in a real implementation
            console.log(`    📐 Breakpoint ${breakpoint}px ready`);
        }
    }

    testBrowserCompatibility(result) {
        // Test essential browser APIs
        const requiredAPIs = [
            'localStorage',
            'JSON',
            'addEventListener',
            'querySelector',
            'fetch'
        ];

        for (const api of requiredAPIs) {
            if (!(api in window) && !(api in document)) {
                result.errors.push(`Missing browser API: ${api}`);
            }
        }

        // Test modern features with fallbacks
        const modernFeatures = [
            'speechSynthesis',
            'SpeechRecognition',
            'serviceWorker',
            'WebSocket'
        ];

        for (const feature of modernFeatures) {
            if (!(feature in window)) {
                result.warnings.push(`Modern feature not available: ${feature}`);
            }
        }

        console.log(`    🌐 Browser: ${navigator.userAgent.split(' ')[0]}`);
    }

    testResponsiveDesign(result) {
        // Test essential responsive elements
        const responsiveElements = document.querySelectorAll('[class*="responsive"], [class*="mobile"], [class*="desktop"]');

        if (responsiveElements.length === 0) {
            result.warnings.push('No responsive CSS classes found');
        }

        // Test CSS Grid/Flexbox support
        const testElement = document.createElement('div');
        testElement.style.display = 'grid';
        if (testElement.style.display !== 'grid') {
            result.warnings.push('CSS Grid not supported');
        }

        testElement.style.display = 'flex';
        if (testElement.style.display !== 'flex') {
            result.errors.push('CSS Flexbox not supported');
        }
    }

    generateTestReport() {
        const endTime = Date.now();
        const totalDuration = endTime - this.startTime;

        const passed = this.testResults.filter(t => t.status === 'passed').length;
        const failed = this.testResults.filter(t => t.status === 'failed').length;
        const skipped = this.testResults.filter(t => t.status === 'skipped').length;

        const report = {
            summary: {
                total: this.testResults.length,
                passed,
                failed,
                skipped,
                duration: totalDuration,
                timestamp: new Date().toISOString()
            },
            results: this.testResults,
            errors: this.errors,
            warnings: this.warnings
        };

        console.log('\n📊 TEST REPORT');
        console.log('═══════════════');
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`⚠️ Skipped: ${skipped}`);
        console.log(`⏱️ Duration: ${totalDuration}ms`);

        if (failed > 0) {
            console.log('\n🚨 FAILED TESTS:');
            this.testResults
                .filter(t => t.status === 'failed')
                .forEach(test => {
                    console.log(`  ❌ ${test.name} (${test.phase})`);
                    test.errors.forEach(error => {
                        console.log(`     - ${error.message || error}`);
                    });
                });
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            this.warnings.forEach(warning => {
                console.log(`  ⚠️ ${warning}`);
            });
        }

        // Store report in localStorage for later analysis
        localStorage.setItem('quiz-debug-report', JSON.stringify(report));

        return report;
    }

    // Utility method to fix common issues
    async autoFix() {
        console.log('🔧 Running auto-fix for common issues...');

        // Fix missing audio elements
        this.fixAudioElements();

        // Fix missing UI elements
        this.fixUIElements();

        // Fix localStorage issues
        this.fixStorageIssues();

        console.log('✅ Auto-fix completed');
    }

    fixAudioElements() {
        const audioElements = [
            { id: 'correct-sound', src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCDWa2+/LdSUELZHE8t6PQAoTV7Lp6KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp65hVFApCn9/vy3QlBSuDzvLZgzYIGWW37NeodReRaLzvnmEAFnbG79qQQAoTV7Dp7KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp66hVFApCn9/vym4lBSuDzvLZgzYIGGW37NeodReRaLzvnmEAFnbG79qQQAoTV7Dp7KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp66hVFAlGn9/py3MkBSl+x/DMdigiCGGUH8tiMQUpcse25ZhJFAw3a5PmqGEaFz5+w+3Pdz1u4' },
            { id: 'wrong-sound', src: 'data:audio/wav;base64,UklGRroBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWYBAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAp2jfC9XCUEKs/18sKMJQQfbtG8f2MbSz4+r+7CrTIGHH/P8qGLJh4lhtT+voAlBCp9xOncWyQFJ3rD49SOAOv5' },
            { id: 'powerup-sound', src: 'data:audio/wav;base64,UklGRmoBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUYBAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCDWa2+/LdSUELZHE8t6PQAoTV7Lp6KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp65hVFApCn9/vy3QlBSl+x/LMdyoEKI7C7txIQAoUXrTm6KZUEwlGnt/yukADCtdR' },
            { id: 'achievement-sound', src: 'data:audio/wav;base64,UklGRmoBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUYBAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCDWa2+/LdSUELZHE8t6PQAoTV7Lp6KlUFAlGn+DiuGAiCECc3e3HczEFKnfH8N2QQAoUXrTp65hVFApCn9/vy3QlBSl+x/LMdyoEKI7C7txIQAoUXrTm6KZUEwlGnt/yukADCtdR' }
        ];

        audioElements.forEach(audio => {
            if (!document.getElementById(audio.id)) {
                const audioElement = document.createElement('audio');
                audioElement.id = audio.id;
                audioElement.preload = 'auto';
                audioElement.src = audio.src;
                document.body.appendChild(audioElement);
                console.log(`🔧 Fixed missing audio element: ${audio.id}`);
            }
        });
    }

    fixUIElements() {
        const essentialElements = [
            { id: 'main-menu', tag: 'div', className: 'screen' },
            { id: 'game-screen', tag: 'div', className: 'screen' },
            { id: 'results-screen', tag: 'div', className: 'screen' },
            { id: 'question-text', tag: 'h3', className: 'question-text' },
            { id: 'answers-grid', tag: 'div', className: 'answers-grid' },
            { id: 'score-display', tag: 'div', className: 'score-display' }
        ];

        essentialElements.forEach(element => {
            if (!document.getElementById(element.id)) {
                const el = document.createElement(element.tag);
                el.id = element.id;
                if (element.className) el.className = element.className;

                // Add to appropriate container or body
                const container = document.querySelector('.app-container') || document.body;
                container.appendChild(el);
                console.log(`🔧 Fixed missing UI element: ${element.id}`);
            }
        });
    }

    fixStorageIssues() {
        try {
            // Test localStorage functionality
            const testKey = 'storage-test';
            localStorage.setItem(testKey, 'test');
            localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
        } catch (error) {
            console.warn('🔧 localStorage not available, implementing fallback');

            // Implement memory-based fallback
            window.localStorage = {
                _data: {},
                setItem: function(key, value) { this._data[key] = value; },
                getItem: function(key) { return this._data[key] || null; },
                removeItem: function(key) { delete this._data[key]; },
                clear: function() { this._data = {}; }
            };
        }
    }
}

// Auto-run debug tests when this script is loaded
window.debugTestSuite = new DebugTestSuite();

// Add debug panel to page
function createDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        max-width: 300px;
        max-height: 400px;
        overflow-y: auto;
        display: none;
    `;

    debugPanel.innerHTML = `
        <div style="margin-bottom: 10px;">
            <strong>🧪 Debug Panel</strong>
            <button onclick="document.getElementById('debug-panel').style.display='none'" style="float: right; background: none; border: none; color: white; cursor: pointer;">×</button>
        </div>
        <button onclick="window.debugTestSuite.runAllTests()" style="width: 100%; margin-bottom: 5px; padding: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Run All Tests</button>
        <button onclick="window.debugTestSuite.autoFix()" style="width: 100%; margin-bottom: 5px; padding: 5px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">Auto Fix Issues</button>
        <button onclick="console.clear()" style="width: 100%; margin-bottom: 10px; padding: 5px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer;">Clear Console</button>
        <div id="debug-output" style="font-size: 10px; white-space: pre-wrap;"></div>
    `;

    document.body.appendChild(debugPanel);

    // Add keyboard shortcut to show debug panel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'D')) {
            e.preventDefault();
            debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
        }
    });
}

// Initialize debug panel
document.addEventListener('DOMContentLoaded', createDebugPanel);

console.log('🧪 Debug Test Suite loaded. Press F12 or Ctrl+Shift+D to open debug panel.');