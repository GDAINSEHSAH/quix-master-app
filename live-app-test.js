// Comprehensive Live App Testing Script
// Run this in browser console on https://gdainsehsah.github.io/quix-master-app

class LiveAppTester {
    constructor() {
        this.testResults = [];
        this.errors = [];
        this.warnings = [];
        this.startTime = performance.now();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);

        if (type === 'error') {
            this.errors.push(message);
        } else if (type === 'warning') {
            this.warnings.push(message);
        }
    }

    // Test 1: Basic App Loading
    async testAppLoading() {
        this.log('🔄 Testing app loading...');

        try {
            // Check if main elements exist
            const tests = [
                { element: 'loading-screen', name: 'Loading Screen' },
                { element: 'main-menu', name: 'Main Menu' },
                { element: 'level-selection', name: 'Level Selection' },
                { element: 'quiz-game', name: 'Quiz Game' },
                { element: 'results-screen', name: 'Results Screen' }
            ];

            let passed = 0;
            for (const test of tests) {
                const element = document.getElementById(test.element);
                if (element) {
                    this.log(`✅ ${test.name} element found`);
                    passed++;
                } else {
                    this.log(`❌ ${test.name} element missing`, 'error');
                }
            }

            return {
                test: 'App Loading',
                passed: passed,
                total: tests.length,
                status: passed === tests.length ? 'PASS' : 'FAIL'
            };
        } catch (error) {
            this.log(`❌ App loading test failed: ${error.message}`, 'error');
            return { test: 'App Loading', status: 'ERROR', error: error.message };
        }
    }

    // Test 2: Database Loading
    async testDatabaseLoading() {
        this.log('📚 Testing database loading...');

        try {
            if (typeof QUIZ_DATABASE === 'undefined') {
                this.log('❌ QUIZ_DATABASE not loaded', 'error');
                return { test: 'Database Loading', status: 'FAIL' };
            }

            const sections = Object.keys(QUIZ_DATABASE);
            this.log(`✅ Database loaded with ${sections.length} sections: ${sections.join(', ')}`);

            let totalQuestions = 0;
            let sectionsWithIssues = 0;

            for (const sectionId of sections) {
                const section = QUIZ_DATABASE[sectionId];
                if (!section.levels) {
                    this.log(`❌ Section ${sectionId} has no levels`, 'error');
                    sectionsWithIssues++;
                    continue;
                }

                const levels = Object.keys(section.levels);
                let sectionQuestions = 0;

                for (const levelId of levels) {
                    const questions = section.levels[levelId];
                    if (Array.isArray(questions)) {
                        sectionQuestions += questions.length;

                        // Validate question structure
                        for (const q of questions) {
                            if (!q.question || !q.options || !q.explanation || q.correct === undefined) {
                                this.log(`⚠️ Invalid question structure in ${sectionId} level ${levelId}`, 'warning');
                            }
                        }
                    }
                }

                totalQuestions += sectionQuestions;
                this.log(`📊 ${section.name}: ${levels.length} levels, ${sectionQuestions} questions`);
            }

            return {
                test: 'Database Loading',
                status: sectionsWithIssues === 0 ? 'PASS' : 'FAIL',
                totalQuestions: totalQuestions,
                sections: sections.length,
                issues: sectionsWithIssues
            };
        } catch (error) {
            this.log(`❌ Database loading test failed: ${error.message}`, 'error');
            return { test: 'Database Loading', status: 'ERROR', error: error.message };
        }
    }

    // Test 3: Game Logic Functions
    async testGameLogic() {
        this.log('🎮 Testing game logic...');

        try {
            const functions = [
                'dataManager',
                'gameLogic',
                'uiManager'
            ];

            let functionsFound = 0;
            for (const func of functions) {
                if (typeof window[func] !== 'undefined') {
                    this.log(`✅ ${func} loaded`);
                    functionsFound++;
                } else {
                    this.log(`❌ ${func} not found`, 'error');
                }
            }

            // Test specific game functions
            if (typeof gameLogic !== 'undefined') {
                const gameFunctions = [
                    'initializeQuiz',
                    'getCurrentQuestion',
                    'submitAnswer',
                    'calculateScore',
                    'nextQuestion'
                ];

                let gameMethodsFound = 0;
                for (const method of gameFunctions) {
                    if (typeof gameLogic[method] === 'function') {
                        this.log(`✅ gameLogic.${method} exists`);
                        gameMethodsFound++;
                    } else {
                        this.log(`❌ gameLogic.${method} missing`, 'error');
                    }
                }

                return {
                    test: 'Game Logic',
                    status: functionsFound === functions.length && gameMethodsFound === gameFunctions.length ? 'PASS' : 'FAIL',
                    coreModules: functionsFound,
                    gameMethods: gameMethodsFound
                };
            }

            return {
                test: 'Game Logic',
                status: 'FAIL',
                coreModules: functionsFound
            };
        } catch (error) {
            this.log(`❌ Game logic test failed: ${error.message}`, 'error');
            return { test: 'Game Logic', status: 'ERROR', error: error.message };
        }
    }

    // Test 4: UI Responsiveness
    async testUIResponsiveness() {
        this.log('📱 Testing UI responsiveness...');

        try {
            const breakpoints = [
                { width: 320, height: 568, name: 'Mobile Small' },
                { width: 375, height: 667, name: 'Mobile Medium' },
                { width: 768, height: 1024, name: 'Tablet' },
                { width: 1024, height: 768, name: 'Desktop Small' },
                { width: 1920, height: 1080, name: 'Desktop Large' }
            ];

            let responsiveTests = 0;
            for (const bp of breakpoints) {
                // Simulate viewport size (conceptually)
                const mediaQuery = `(max-width: ${bp.width}px)`;
                const matches = window.matchMedia(mediaQuery).matches;

                this.log(`📏 ${bp.name} (${bp.width}x${bp.height}): ${matches ? 'Matches' : 'No match'}`);
                responsiveTests++;
            }

            // Check if CSS is loaded
            const stylesheets = document.styleSheets;
            const cssLoaded = stylesheets.length > 0;
            this.log(`🎨 CSS Stylesheets loaded: ${stylesheets.length}`);

            return {
                test: 'UI Responsiveness',
                status: cssLoaded ? 'PASS' : 'FAIL',
                breakpointsTested: responsiveTests,
                stylesheetsLoaded: stylesheets.length
            };
        } catch (error) {
            this.log(`❌ UI responsiveness test failed: ${error.message}`, 'error');
            return { test: 'UI Responsiveness', status: 'ERROR', error: error.message };
        }
    }

    // Test 5: Performance Metrics
    async testPerformance() {
        this.log('⚡ Testing performance...');

        try {
            const metrics = {
                loadTime: performance.now() - this.startTime,
                memory: performance.memory ? {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                } : null,
                navigation: performance.getEntriesByType('navigation')[0]
            };

            this.log(`⏱️ Page load time: ${metrics.loadTime.toFixed(2)}ms`);

            if (metrics.memory) {
                const memoryUsedMB = (metrics.memory.used / 1024 / 1024).toFixed(2);
                this.log(`🧠 Memory usage: ${memoryUsedMB}MB`);
            }

            if (metrics.navigation) {
                const navTiming = metrics.navigation;
                this.log(`🌐 DNS lookup: ${navTiming.domainLookupEnd - navTiming.domainLookupStart}ms`);
                this.log(`🔗 Connection: ${navTiming.connectEnd - navTiming.connectStart}ms`);
                this.log(`📥 Response: ${navTiming.responseEnd - navTiming.responseStart}ms`);
            }

            const status = metrics.loadTime < 3000 ? 'PASS' : 'WARN';

            return {
                test: 'Performance',
                status: status,
                loadTime: metrics.loadTime,
                memory: metrics.memory
            };
        } catch (error) {
            this.log(`❌ Performance test failed: ${error.message}`, 'error');
            return { test: 'Performance', status: 'ERROR', error: error.message };
        }
    }

    // Test 6: Local Storage
    async testLocalStorage() {
        this.log('💾 Testing local storage...');

        try {
            const testKey = 'quiz-master-test';
            const testData = { test: true, timestamp: Date.now() };

            // Test write
            localStorage.setItem(testKey, JSON.stringify(testData));

            // Test read
            const retrieved = JSON.parse(localStorage.getItem(testKey));

            // Test delete
            localStorage.removeItem(testKey);

            const writeWorked = retrieved && retrieved.test === true;

            if (writeWorked) {
                this.log('✅ Local storage read/write working');
            } else {
                this.log('❌ Local storage read/write failed', 'error');
            }

            // Check existing quiz data
            const existingData = localStorage.getItem('quiz-master-progress');
            if (existingData) {
                this.log('📊 Existing progress data found');
            } else {
                this.log('ℹ️ No existing progress data');
            }

            return {
                test: 'Local Storage',
                status: writeWorked ? 'PASS' : 'FAIL',
                hasExistingData: !!existingData
            };
        } catch (error) {
            this.log(`❌ Local storage test failed: ${error.message}`, 'error');
            return { test: 'Local Storage', status: 'ERROR', error: error.message };
        }
    }

    // Test 7: Question Uniqueness
    async testQuestionUniqueness() {
        this.log('🔍 Testing question uniqueness...');

        try {
            if (typeof QUIZ_DATABASE === 'undefined') {
                return { test: 'Question Uniqueness', status: 'SKIP', reason: 'Database not loaded' };
            }

            const allQuestions = new Map();
            let duplicates = [];
            let totalQuestions = 0;

            Object.keys(QUIZ_DATABASE).forEach(sectionId => {
                const section = QUIZ_DATABASE[sectionId];
                Object.keys(section.levels).forEach(levelId => {
                    section.levels[levelId].forEach((q, index) => {
                        const questionText = q.question.toLowerCase().trim();
                        const location = `${sectionId}-L${levelId}-Q${index + 1}`;

                        if (allQuestions.has(questionText)) {
                            duplicates.push({
                                question: q.question,
                                locations: [allQuestions.get(questionText), location]
                            });
                        } else {
                            allQuestions.set(questionText, location);
                        }
                        totalQuestions++;
                    });
                });
            });

            if (duplicates.length === 0) {
                this.log(`✅ All ${totalQuestions} questions are unique`);
            } else {
                this.log(`❌ Found ${duplicates.length} duplicate questions`, 'error');
                duplicates.forEach(dup => {
                    this.log(`  - "${dup.question}" in ${dup.locations.join(', ')}`, 'error');
                });
            }

            return {
                test: 'Question Uniqueness',
                status: duplicates.length === 0 ? 'PASS' : 'FAIL',
                totalQuestions: totalQuestions,
                uniqueQuestions: allQuestions.size,
                duplicates: duplicates.length
            };
        } catch (error) {
            this.log(`❌ Question uniqueness test failed: ${error.message}`, 'error');
            return { test: 'Question Uniqueness', status: 'ERROR', error: error.message };
        }
    }

    // Run all tests
    async runAllTests() {
        this.log('🚀 Starting comprehensive live app testing...');
        this.log('==========================================');

        const tests = [
            () => this.testAppLoading(),
            () => this.testDatabaseLoading(),
            () => this.testGameLogic(),
            () => this.testUIResponsiveness(),
            () => this.testPerformance(),
            () => this.testLocalStorage(),
            () => this.testQuestionUniqueness()
        ];

        for (const test of tests) {
            try {
                const result = await test();
                this.testResults.push(result);

                const status = result.status === 'PASS' ? '✅' :
                              result.status === 'WARN' ? '⚠️' :
                              result.status === 'SKIP' ? '⏭️' : '❌';

                this.log(`${status} ${result.test}: ${result.status}`);
            } catch (error) {
                this.log(`💥 Test crashed: ${error.message}`, 'error');
                this.testResults.push({
                    test: 'Unknown',
                    status: 'ERROR',
                    error: error.message
                });
            }
        }

        this.generateReport();
        return this.testResults;
    }

    // Generate comprehensive report
    generateReport() {
        const endTime = performance.now();
        const totalTime = endTime - this.startTime;

        console.log('\n📊 COMPREHENSIVE LIVE APP TEST REPORT');
        console.log('=====================================');

        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const warned = this.testResults.filter(r => r.status === 'WARN').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const errored = this.testResults.filter(r => r.status === 'ERROR').length;
        const skipped = this.testResults.filter(r => r.status === 'SKIP').length;

        console.log(`🎯 Total Tests: ${this.testResults.length}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`⚠️ Warnings: ${warned}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`💥 Errors: ${errored}`);
        console.log(`⏭️ Skipped: ${skipped}`);
        console.log(`⏱️ Total Time: ${totalTime.toFixed(2)}ms`);

        console.log('\n📋 Detailed Results:');
        this.testResults.forEach((result, index) => {
            const status = result.status === 'PASS' ? '✅' :
                          result.status === 'WARN' ? '⚠️' :
                          result.status === 'SKIP' ? '⏭️' :
                          result.status === 'FAIL' ? '❌' : '💥';
            console.log(`${index + 1}. ${status} ${result.test}: ${result.status}`);

            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
        });

        // Overall assessment
        const overallScore = (passed / (this.testResults.length - skipped)) * 100;
        console.log(`\n🎯 Overall Score: ${overallScore.toFixed(1)}%`);

        if (this.errors.length > 0) {
            console.log('\n🚨 CRITICAL ERRORS FOUND:');
            this.errors.forEach((error, i) => {
                console.log(`${i + 1}. ${error}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            this.warnings.forEach((warning, i) => {
                console.log(`${i + 1}. ${warning}`);
            });
        }

        if (overallScore >= 90) {
            console.log('\n🏆 EXCELLENT - App is working perfectly!');
        } else if (overallScore >= 75) {
            console.log('\n🎉 GOOD - App is working well with minor issues');
        } else if (overallScore >= 60) {
            console.log('\n⚠️ NEEDS ATTENTION - App has some issues to fix');
        } else {
            console.log('\n🔧 CRITICAL - App requires immediate fixes');
        }

        return {
            overallScore: overallScore,
            passed: passed,
            failed: failed,
            errors: this.errors.length,
            warnings: this.warnings.length,
            results: this.testResults
        };
    }
}

// Auto-run when script is loaded
console.log('🧪 Live App Tester loaded!');
console.log('Run: new LiveAppTester().runAllTests()');

// Quick test function
window.testLiveApp = async () => {
    const tester = new LiveAppTester();
    return await tester.runAllTests();
};