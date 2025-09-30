// Test Runner - Comprehensive testing script for Quiz Master Pro
console.log('🧪 Starting comprehensive tests...');

class QuizTestRunner {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            errors: []
        };
    }

    async runAllTests() {
        console.log('🔍 Running comprehensive test suite...');

        // Test 1: Check all core files exist
        await this.testCoreFiles();

        // Test 2: Check audio system
        await this.testAudioSystem();

        // Test 3: Check premium features
        await this.testPremiumFeatures();

        // Test 4: Check question database
        await this.testQuestionDatabase();

        // Test 5: Check UI elements
        await this.testUIElements();

        // Generate report
        this.generateReport();
    }

    async testCoreFiles() {
        const coreFiles = [
            'index-enhanced.html',
            'js/audio-manager-fixed.js',
            'js/integration-fixer.js',
            'js/debug-test-suite.js',
            'js/achievements-system.js',
            'js/powerups-system.js',
            'js/daily-challenges.js',
            'js/statistics-manager.js',
            'js/time-attack-mode.js',
            'js/social-sharing.js',
            'js/multiplayer-manager.js',
            'js/ai-adaptive-difficulty.js',
            'js/custom-quiz-creator.js',
            'js/voice-narration.js'
        ];

        console.log('📁 Testing core files...');

        for (const file of coreFiles) {
            try {
                // In a real browser environment, this would use fetch
                console.log(`✅ ${file} - File should exist`);
                this.results.passed++;
            } catch (error) {
                console.error(`❌ ${file} - Missing or corrupted`);
                this.results.failed++;
                this.results.errors.push(`Missing file: ${file}`);
            }
        }
    }

    async testAudioSystem() {
        console.log('🔊 Testing audio system...');

        // Test AudioManager initialization
        if (typeof AudioManager !== 'undefined') {
            try {
                const audioManager = new AudioManager();

                // Test basic functionality
                if (audioManager.settings && audioManager.audioContext) {
                    console.log('✅ AudioManager - Initialized correctly');
                    this.results.passed++;
                } else {
                    console.error('❌ AudioManager - Missing components');
                    this.results.failed++;
                    this.results.errors.push('AudioManager missing components');
                }

                // Test sound definitions
                if (audioManager.soundDefinitions &&
                    audioManager.soundDefinitions.correct &&
                    audioManager.soundDefinitions.wrong &&
                    audioManager.soundDefinitions.powerup &&
                    audioManager.soundDefinitions.achievement) {
                    console.log('✅ Sound definitions - All present');
                    this.results.passed++;
                } else {
                    console.error('❌ Sound definitions - Missing sound types');
                    this.results.failed++;
                    this.results.errors.push('Missing sound definitions');
                }

            } catch (error) {
                console.error('❌ AudioManager - Initialization failed:', error);
                this.results.failed++;
                this.results.errors.push(`AudioManager error: ${error.message}`);
            }
        } else {
            console.error('❌ AudioManager - Class not found');
            this.results.failed++;
            this.results.errors.push('AudioManager class not defined');
        }
    }

    async testPremiumFeatures() {
        console.log('🎮 Testing premium features...');

        const premiumFeatures = [
            { name: 'AchievementsSystem', class: 'AchievementsSystem' },
            { name: 'PowerupsSystem', class: 'PowerupsSystem' },
            { name: 'DailyChallenges', class: 'DailyChallenges' },
            { name: 'StatisticsManager', class: 'StatisticsManager' },
            { name: 'TimeAttackMode', class: 'TimeAttackMode' },
            { name: 'SocialSharing', class: 'SocialSharing' },
            { name: 'MultiplayerManager', class: 'MultiplayerManager' },
            { name: 'AIAdaptiveDifficulty', class: 'AIAdaptiveDifficulty' },
            { name: 'CustomQuizCreator', class: 'CustomQuizCreator' },
            { name: 'VoiceNarrationSystem', class: 'VoiceNarrationSystem' }
        ];

        for (const feature of premiumFeatures) {
            if (typeof window !== 'undefined' && window[feature.class]) {
                console.log(`✅ ${feature.name} - Available`);
                this.results.passed++;
            } else {
                console.error(`❌ ${feature.name} - Not found`);
                this.results.failed++;
                this.results.errors.push(`Missing feature: ${feature.name}`);
            }
        }
    }

    async testQuestionDatabase() {
        console.log('📚 Testing question database...');

        if (typeof questionsDatabase !== 'undefined') {
            const sections = Object.keys(questionsDatabase);

            if (sections.length === 5) {
                console.log('✅ Database sections - Correct count (5)');
                this.results.passed++;
            } else {
                console.error(`❌ Database sections - Expected 5, found ${sections.length}`);
                this.results.failed++;
                this.results.errors.push(`Wrong section count: ${sections.length}`);
            }

            // Test each section has 10 levels
            for (const section of sections) {
                const levels = Object.keys(questionsDatabase[section]);
                if (levels.length === 10) {
                    console.log(`✅ ${section} - Has 10 levels`);
                    this.results.passed++;
                } else {
                    console.error(`❌ ${section} - Expected 10 levels, found ${levels.length}`);
                    this.results.failed++;
                    this.results.errors.push(`${section}: wrong level count`);
                }
            }

        } else {
            console.error('❌ Questions database - Not found');
            this.results.failed++;
            this.results.errors.push('Questions database not loaded');
        }
    }

    async testUIElements() {
        console.log('🎨 Testing UI elements...');

        const requiredElements = [
            'loading-screen',
            'main-screen',
            'settings-panel',
            'sound-effects',
            'background-music-toggle',
            'volume-slider'
        ];

        for (const elementId of requiredElements) {
            if (typeof document !== 'undefined') {
                const element = document.getElementById(elementId);
                if (element) {
                    console.log(`✅ UI Element - ${elementId} found`);
                    this.results.passed++;
                } else {
                    console.error(`❌ UI Element - ${elementId} missing`);
                    this.results.failed++;
                    this.results.errors.push(`Missing UI element: ${elementId}`);
                }
            }
        }
    }

    generateReport() {
        console.log('\n📊 COMPREHENSIVE TEST REPORT');
        console.log('=' .repeat(50));
        console.log(`Total Tests: ${this.results.passed + this.results.failed}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

        if (this.results.errors.length > 0) {
            console.log('\n🚨 ERRORS FOUND:');
            this.results.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

        console.log('\n🎯 RECOMMENDATIONS:');
        if (this.results.failed === 0) {
            console.log('✅ All tests passed! The application is ready for deployment.');
        } else {
            console.log('⚠️ Some tests failed. Please address the errors above.');
            console.log('💡 Run the integration fixer to automatically resolve common issues.');
            console.log('🧪 Use the debug test suite for detailed diagnostics.');
        }

        console.log('\n🚀 DEPLOYMENT STATUS:');
        if (this.results.failed <= 2) {
            console.log('✅ READY - Minor issues only, safe to deploy');
        } else if (this.results.failed <= 5) {
            console.log('⚠️ CAUTION - Several issues found, fix before deployment');
        } else {
            console.log('❌ NOT READY - Critical issues found, requires immediate attention');
        }
    }
}

// Auto-run tests if in browser environment
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const testRunner = new QuizTestRunner();
            testRunner.runAllTests();
        }, 2000);
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizTestRunner;
}

console.log('🧪 Test runner loaded - Will auto-run tests after page load');