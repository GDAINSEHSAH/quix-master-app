// Main Application Entry Point
class QuizMasterApp {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
    }

    // Initialize the application
    async init() {
        try {
            console.log(`🎯 Quiz Master v${this.version} - Loading...`);

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize all managers
            await this.initializeManagers();

            // Register service worker for PWA capabilities
            this.registerServiceWorker();

            // Set up global error handling
            this.setupErrorHandling();

            // Initialize UI
            uiManager.init();

            this.isInitialized = true;
            console.log('✅ Quiz Master initialized successfully!');

        } catch (error) {
            console.error('❌ Failed to initialize Quiz Master:', error);
            this.showCriticalError();
        }
    }

    // Initialize all managers
    async initializeManagers() {
        try {
            // Data manager is initialized automatically
            console.log('📊 Data Manager initialized');

            // Game logic is initialized automatically
            console.log('🎮 Game Logic initialized');

            // UI manager will be initialized after DOM is ready
            console.log('🎨 UI Manager ready');

            // Sound manager will be initialized by UI manager
            console.log('🔊 Sound Manager ready');

        } catch (error) {
            throw new Error(`Manager initialization failed: ${error.message}`);
        }
    }

    // Register service worker for PWA
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('🔧 Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('⚠️ Service Worker registration failed:', error);
                });
        }
    }

    // Set up global error handling
    setupErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (e) => {
            console.error('Global error caught:', e.error);
            this.handleError(e.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handleError(e.reason);
        });
    }

    // Handle application errors
    handleError(error) {
        if (!this.isInitialized) {
            this.showCriticalError();
            return;
        }

        // Show user-friendly error message
        if (uiManager) {
            uiManager.showError('Something went wrong. Please try again.');
        }

        // Log error for debugging
        console.error('Application error:', error);
    }

    // Show critical error when app fails to load
    showCriticalError() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-family: 'Poppins', sans-serif;
                text-align: center;
                padding: 2rem;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">😞</div>
                <h1 style="font-size: 2rem; margin-bottom: 1rem; font-weight: 600;">
                    Oops! Something went wrong
                </h1>
                <p style="font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9;">
                    Quiz Master failed to load properly. Please refresh the page and try again.
                </p>
                <button onclick="location.reload()" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'"
                   onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                    🔄 Refresh Page
                </button>
            </div>
        `;
    }

    // Get application info
    getInfo() {
        return {
            name: 'Quiz Master',
            version: this.version,
            description: 'Ultimate Knowledge Challenge Game',
            features: [
                '5 Knowledge Categories',
                '10 Difficulty Levels per Category',
                '1000+ Questions per Category',
                'Progressive Level Unlocking',
                'Score Tracking & Achievements',
                'Cross-Platform Compatible',
                'Responsive Design',
                'Sound Effects',
                'Keyboard Navigation'
            ],
            statistics: {
                totalQuestions: '5000+',
                categories: 5,
                levelsPerCategory: 10,
                maxScore: 'Unlimited'
            },
            isInitialized: this.isInitialized
        };
    }

    // Debug method to check app state
    debug() {
        console.log('🐛 Quiz Master Debug Info:');
        console.log('App Info:', this.getInfo());
        console.log('User Progress:', dataManager?.userProgress);
        console.log('Game State:', gameLogic?.getGameStats());
        console.log('Current Screen:', uiManager?.currentScreen);
        console.log('Sound Enabled:', soundManager?.enabled);
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            initTime: 0,
            memoryUsage: 0
        };
        this.startTime = performance.now();
    }

    // Record load completion
    recordLoadComplete() {
        this.metrics.loadTime = performance.now() - this.startTime;
        console.log(`⏱️ App loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
    }

    // Record initialization completion
    recordInitComplete() {
        this.metrics.initTime = performance.now() - this.startTime;
        console.log(`⏱️ App initialized in ${this.metrics.initTime.toFixed(2)}ms`);
    }

    // Monitor memory usage
    monitorMemory() {
        if (performance.memory) {
            this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
            console.log(`💾 Memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
        }
    }

    // Get performance report
    getReport() {
        return {
            ...this.metrics,
            timestamp: new Date().toISOString()
        };
    }
}

// Utility functions
const Utils = {
    // Format numbers with commas
    formatNumber(num) {
        return num.toLocaleString();
    },

    // Format time in MM:SS format
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Deep clone object
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Check if device is mobile
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Get device info
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            isMobile: this.isMobile(),
            isOnline: navigator.onLine
        };
    }
};

// Create global instances
const app = new QuizMasterApp();
const performanceMonitor = new PerformanceMonitor();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    performanceMonitor.recordLoadComplete();
    app.init().then(() => {
        performanceMonitor.recordInitComplete();
        performanceMonitor.monitorMemory();
    });
});

// Load performance check
window.addEventListener('load', () => {
    console.log('🚀 All resources loaded');
    performanceMonitor.monitorMemory();
});

// Visibility change handling (for pause/resume functionality)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameLogic.gameActive) {
        gameLogic.pauseGame();
        console.log('🔄 Game paused (tab hidden)');
    } else if (!document.hidden && gameLogic.currentSection) {
        // Game will resume when user interacts
        console.log('🔄 Tab visible (game can resume)');
    }
});

// Online/offline handling
window.addEventListener('online', () => {
    console.log('🌐 Connection restored');
    if (uiManager) {
        uiManager.showError('Connection restored!');
    }
});

window.addEventListener('offline', () => {
    console.log('📵 Connection lost');
    if (uiManager) {
        uiManager.showError('You are offline. Progress will be saved locally.');
    }
});

// Expose app to global scope for debugging
window.QuizMaster = {
    app,
    dataManager,
    gameLogic,
    uiManager,
    soundManager,
    performanceMonitor,
    Utils,
    debug: () => app.debug(),
    version: app.version
};

console.log('🎯 Quiz Master app script loaded successfully!');