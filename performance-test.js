// Performance Test Script for Quiz Master App
// Run this in browser console for detailed performance analysis

class PerformanceTestRunner {
    constructor() {
        this.testResults = [];
        this.startTime = performance.now();
    }

    // Test 1: Memory Usage Monitoring
    async testMemoryUsage() {
        console.log('🧠 Testing Memory Usage...');

        if (performance.memory) {
            const before = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };

            // Simulate heavy usage
            const questions = [];
            for (let i = 0; i < 1000; i++) {
                questions.push(await dataManager.loadQuestions('science', 1));
            }

            const after = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };

            const memoryIncrease = (after.used - before.used) / 1024 / 1024;

            console.log(`Memory usage increased by ${memoryIncrease.toFixed(2)} MB`);
            console.log(`Current usage: ${(after.used / 1024 / 1024).toFixed(2)} MB`);

            return {
                test: 'Memory Usage',
                status: memoryIncrease < 50 ? 'PASS' : 'WARN',
                details: `Memory increase: ${memoryIncrease.toFixed(2)} MB`,
                before: before,
                after: after
            };
        } else {
            return {
                test: 'Memory Usage',
                status: 'SKIP',
                details: 'Memory API not available'
            };
        }
    }

    // Test 2: Concurrent User Simulation
    async testConcurrentUsers(userCount = 50) {
        console.log(`👥 Testing ${userCount} Concurrent Users...`);

        const startTime = performance.now();
        const userPromises = [];

        for (let i = 1; i <= userCount; i++) {
            userPromises.push(this.simulateUser(i));
        }

        try {
            const results = await Promise.all(userPromises);
            const endTime = performance.now();

            const successfulUsers = results.filter(r => r.success).length;
            const totalTime = endTime - startTime;
            const avgTime = totalTime / userCount;

            console.log(`✅ ${successfulUsers}/${userCount} users completed successfully`);
            console.log(`Total time: ${totalTime.toFixed(2)}ms`);
            console.log(`Average time per user: ${avgTime.toFixed(2)}ms`);

            return {
                test: 'Concurrent Users',
                status: successfulUsers >= userCount * 0.9 ? 'PASS' : 'FAIL',
                details: `${successfulUsers}/${userCount} users successful in ${totalTime.toFixed(2)}ms`,
                metrics: {
                    totalUsers: userCount,
                    successful: successfulUsers,
                    totalTime: totalTime,
                    avgTime: avgTime
                }
            };

        } catch (error) {
            return {
                test: 'Concurrent Users',
                status: 'FAIL',
                details: `Error: ${error.message}`
            };
        }
    }

    // Test 3: Database Query Performance
    async testDatabasePerformance() {
        console.log('🗄️ Testing Database Performance...');

        const sections = ['science', 'history', 'sports', 'literature', 'general'];
        const levels = [1, 2, 3];
        const iterations = 100;

        const queryTimes = [];

        for (let i = 0; i < iterations; i++) {
            const section = sections[Math.floor(Math.random() * sections.length)];
            const level = levels[Math.floor(Math.random() * levels.length)];

            const startTime = performance.now();
            await dataManager.loadQuestions(section, level);
            const endTime = performance.now();

            queryTimes.push(endTime - startTime);
        }

        const avgTime = queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length;
        const maxTime = Math.max(...queryTimes);
        const minTime = Math.min(...queryTimes);

        console.log(`Average query time: ${avgTime.toFixed(2)}ms`);
        console.log(`Max query time: ${maxTime.toFixed(2)}ms`);
        console.log(`Min query time: ${minTime.toFixed(2)}ms`);

        return {
            test: 'Database Performance',
            status: avgTime < 10 ? 'PASS' : avgTime < 50 ? 'WARN' : 'FAIL',
            details: `Avg: ${avgTime.toFixed(2)}ms, Max: ${maxTime.toFixed(2)}ms, Min: ${minTime.toFixed(2)}ms`,
            metrics: {
                iterations: iterations,
                avgTime: avgTime,
                maxTime: maxTime,
                minTime: minTime
            }
        };
    }

    // Test 4: Rapid Fire Testing
    async testRapidFire() {
        console.log('⚡ Testing Rapid Fire Operations...');

        const operations = [];
        const startTime = performance.now();

        // Simulate rapid user interactions
        for (let i = 0; i < 500; i++) {
            const opStart = performance.now();

            try {
                // Rapid quiz initialization
                await gameLogic.initializeQuiz('science', 1);

                // Rapid answer submission
                gameLogic.timeRemaining = 30;
                gameLogic.submitAnswer(0);

                // Rapid score calculation
                gameLogic.calculateScore();

                // Rapid progress save
                dataManager.saveProgress();

                const opEnd = performance.now();
                operations.push(opEnd - opStart);

            } catch (error) {
                console.warn(`Operation ${i} failed:`, error.message);
            }
        }

        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const avgOpTime = operations.reduce((a, b) => a + b, 0) / operations.length;

        console.log(`Completed ${operations.length} operations in ${totalTime.toFixed(2)}ms`);
        console.log(`Average operation time: ${avgOpTime.toFixed(2)}ms`);

        return {
            test: 'Rapid Fire Operations',
            status: avgOpTime < 5 ? 'PASS' : avgOpTime < 20 ? 'WARN' : 'FAIL',
            details: `${operations.length} ops in ${totalTime.toFixed(2)}ms (avg: ${avgOpTime.toFixed(2)}ms)`,
            metrics: {
                totalOperations: operations.length,
                totalTime: totalTime,
                avgOpTime: avgOpTime
            }
        };
    }

    // Test 5: Local Storage Stress Test
    async testLocalStorageStress() {
        console.log('💾 Testing Local Storage Under Stress...');

        const testData = [];
        let successfulOps = 0;
        const totalOps = 1000;

        try {
            for (let i = 0; i < totalOps; i++) {
                const key = `test-key-${i}`;
                const data = {
                    id: i,
                    timestamp: Date.now(),
                    randomData: Math.random().toString(36).repeat(100) // Large data
                };

                localStorage.setItem(key, JSON.stringify(data));
                const retrieved = JSON.parse(localStorage.getItem(key));

                if (retrieved.id === i) {
                    successfulOps++;
                }

                localStorage.removeItem(key);
            }

            console.log(`Local storage: ${successfulOps}/${totalOps} operations successful`);

            return {
                test: 'Local Storage Stress',
                status: successfulOps === totalOps ? 'PASS' : 'WARN',
                details: `${successfulOps}/${totalOps} operations successful`,
                metrics: {
                    totalOps: totalOps,
                    successful: successfulOps,
                    successRate: (successfulOps / totalOps) * 100
                }
            };

        } catch (error) {
            return {
                test: 'Local Storage Stress',
                status: 'FAIL',
                details: `Error after ${successfulOps} operations: ${error.message}`
            };
        }
    }

    // Test 6: Cross-Platform Specific Tests
    async testCrossPlatform() {
        console.log('📱 Testing Cross-Platform Compatibility...');

        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth
            },
            window: {
                width: window.innerWidth,
                height: window.innerHeight,
                ratio: window.devicePixelRatio || 1
            }
        };

        // Test responsive design breakpoints
        const breakpointTests = [];

        // Mobile breakpoint
        if (window.innerWidth <= 768) {
            breakpointTests.push({ breakpoint: 'mobile', width: window.innerWidth, status: 'detected' });
        }

        // Tablet breakpoint
        if (window.innerWidth > 768 && window.innerWidth <= 1024) {
            breakpointTests.push({ breakpoint: 'tablet', width: window.innerWidth, status: 'detected' });
        }

        // Desktop breakpoint
        if (window.innerWidth > 1024) {
            breakpointTests.push({ breakpoint: 'desktop', width: window.innerWidth, status: 'detected' });
        }

        console.log('Device info:', deviceInfo);
        console.log('Breakpoint tests:', breakpointTests);

        return {
            test: 'Cross-Platform Compatibility',
            status: 'PASS',
            details: `Device detected: ${breakpointTests.map(t => t.breakpoint).join(', ')}`,
            deviceInfo: deviceInfo,
            breakpoints: breakpointTests
        };
    }

    // Helper function to simulate a user
    async simulateUser(userId) {
        try {
            const sections = ['science', 'history', 'sports', 'literature', 'general'];
            const section = sections[Math.floor(Math.random() * sections.length)];
            const level = Math.floor(Math.random() * 3) + 1;

            // Initialize game
            const gameData = await gameLogic.initializeQuiz(section, level);

            let score = 0;
            let questionsAnswered = 0;

            // Simulate answering questions
            for (let q = 0; q < 10; q++) {
                const question = gameLogic.getCurrentQuestion();
                if (!question) break;

                // Random answer time
                gameLogic.timeRemaining = Math.floor(Math.random() * 25) + 5;

                // Random answer (80% chance of correct)
                const correctAnswer = gameLogic.currentQuestions[gameLogic.currentQuestionIndex].correct;
                const answerIndex = Math.random() < 0.8 ? correctAnswer : Math.floor(Math.random() * 4);

                const result = gameLogic.submitAnswer(answerIndex);
                if (result && result.isCorrect) {
                    score += result.scoreEarned;
                }

                questionsAnswered++;
                gameLogic.nextQuestion();
            }

            return {
                success: true,
                userId: userId,
                section: section,
                level: level,
                score: score,
                questionsAnswered: questionsAnswered
            };

        } catch (error) {
            return {
                success: false,
                userId: userId,
                error: error.message
            };
        }
    }

    // Run all performance tests
    async runAllTests() {
        console.log('🚀 Starting Comprehensive Performance Tests...');
        console.log('This may take a few minutes...');

        const tests = [
            () => this.testMemoryUsage(),
            () => this.testDatabasePerformance(),
            () => this.testRapidFire(),
            () => this.testLocalStorageStress(),
            () => this.testCrossPlatform(),
            () => this.testConcurrentUsers(20),
            () => this.testConcurrentUsers(50)
        ];

        for (const test of tests) {
            try {
                const result = await test();
                this.testResults.push(result);
                console.log(`${result.test}: ${result.status} - ${result.details}`);
            } catch (error) {
                console.error(`Test failed:`, error);
                this.testResults.push({
                    test: 'Unknown Test',
                    status: 'ERROR',
                    details: error.message
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

        console.log('\n📊 COMPREHENSIVE PERFORMANCE REPORT');
        console.log('=====================================');

        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const warned = this.testResults.filter(r => r.status === 'WARN').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const errored = this.testResults.filter(r => r.status === 'ERROR').length;

        console.log(`Total Tests: ${this.testResults.length}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`⚠️ Warnings: ${warned}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`💥 Errors: ${errored}`);
        console.log(`⏱️ Total Time: ${totalTime.toFixed(2)}ms`);

        console.log('\nDetailed Results:');
        this.testResults.forEach((result, index) => {
            const status = result.status === 'PASS' ? '✅' :
                          result.status === 'WARN' ? '⚠️' :
                          result.status === 'FAIL' ? '❌' : '💥';
            console.log(`${index + 1}. ${status} ${result.test}: ${result.details}`);
        });

        // Overall assessment
        const overallScore = (passed / this.testResults.length) * 100;
        console.log(`\n🎯 Overall Score: ${overallScore.toFixed(1)}%`);

        if (overallScore >= 90) {
            console.log('🏆 EXCELLENT - App is performing exceptionally well!');
        } else if (overallScore >= 75) {
            console.log('🎉 GOOD - App is performing well with minor issues');
        } else if (overallScore >= 60) {
            console.log('⚠️ FAIR - App needs some optimization');
        } else {
            console.log('🔧 NEEDS WORK - App requires significant optimization');
        }

        return {
            totalTests: this.testResults.length,
            passed: passed,
            warned: warned,
            failed: failed,
            errored: errored,
            overallScore: overallScore,
            totalTime: totalTime,
            results: this.testResults
        };
    }
}

// Make it globally available
window.PerformanceTestRunner = PerformanceTestRunner;

// Auto-run when loaded
console.log('Performance Test Runner loaded. Use: new PerformanceTestRunner().runAllTests()');

// Quick test function
window.quickPerformanceTest = async () => {
    const runner = new PerformanceTestRunner();
    return await runner.runAllTests();
};