// Compatibility Checker - Ensures app works across all devices and browsers
class CompatibilityChecker {
    constructor() {
        this.issues = [];
        this.browserInfo = this.getBrowserInfo();
        this.deviceInfo = this.getDeviceInfo();

        console.log('🔍 Starting compatibility check...');
        console.log('Browser:', this.browserInfo);
        console.log('Device:', this.deviceInfo);
    }

    async runAllChecks() {
        console.log('🧪 Running comprehensive compatibility checks...');

        // Browser compatibility
        this.checkWebAudioSupport();
        this.checkLocalStorageSupport();
        this.checkServiceWorkerSupport();
        this.checkSpeechAPISupport();
        this.checkTouchSupport();

        // Mobile compatibility
        this.checkViewportSettings();
        this.checkTouchEventHandlers();
        this.checkMobileUIElements();

        // Performance checks
        this.checkPerformanceAPIs();
        this.checkMemoryUsage();

        // CSS compatibility
        this.checkCSSFeatures();

        // Generate compatibility report
        this.generateCompatibilityReport();

        // Apply automatic fixes
        await this.applyCompatibilityFixes();
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        const browsers = {
            chrome: /Chrome/i.test(ua),
            firefox: /Firefox/i.test(ua),
            safari: /Safari/i.test(ua) && !/Chrome/i.test(ua),
            edge: /Edge/i.test(ua),
            ie: /MSIE|Trident/i.test(ua)
        };

        return {
            userAgent: ua,
            browsers,
            currentBrowser: Object.keys(browsers).find(key => browsers[key]) || 'unknown'
        };
    }

    getDeviceInfo() {
        return {
            mobile: /Mobi|Android/i.test(navigator.userAgent),
            tablet: /Tablet|iPad/i.test(navigator.userAgent),
            desktop: !/Mobi|Android|Tablet|iPad/i.test(navigator.userAgent),
            touchScreen: 'ontouchstart' in window,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            pixelRatio: window.devicePixelRatio || 1
        };
    }

    checkWebAudioSupport() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                console.log('✅ Web Audio API - Supported');
            } else {
                console.warn('⚠️ Web Audio API - Not supported');
                this.issues.push({
                    type: 'audio',
                    severity: 'medium',
                    message: 'Web Audio API not supported',
                    fix: 'Fallback to HTML5 Audio elements'
                });
            }
        } catch (error) {
            console.error('❌ Web Audio API - Error:', error);
            this.issues.push({
                type: 'audio',
                severity: 'high',
                message: 'Web Audio API error',
                fix: 'Use HTML5 Audio fallback'
            });
        }
    }

    checkLocalStorageSupport() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            console.log('✅ Local Storage - Supported');
        } catch (error) {
            console.error('❌ Local Storage - Not supported');
            this.issues.push({
                type: 'storage',
                severity: 'high',
                message: 'Local Storage not available',
                fix: 'Use in-memory storage fallback'
            });
        }
    }

    checkServiceWorkerSupport() {
        if ('serviceWorker' in navigator) {
            console.log('✅ Service Worker - Supported');
        } else {
            console.warn('⚠️ Service Worker - Not supported');
            this.issues.push({
                type: 'pwa',
                severity: 'low',
                message: 'Service Worker not supported',
                fix: 'PWA features will be limited'
            });
        }
    }

    checkSpeechAPISupport() {
        const speechSynthesis = 'speechSynthesis' in window;
        const speechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

        if (speechSynthesis) {
            console.log('✅ Speech Synthesis - Supported');
        } else {
            console.warn('⚠️ Speech Synthesis - Not supported');
            this.issues.push({
                type: 'voice',
                severity: 'low',
                message: 'Speech Synthesis not supported',
                fix: 'Voice features will be disabled'
            });
        }

        if (speechRecognition) {
            console.log('✅ Speech Recognition - Supported');
        } else {
            console.warn('⚠️ Speech Recognition - Not supported');
            this.issues.push({
                type: 'voice',
                severity: 'low',
                message: 'Speech Recognition not supported',
                fix: 'Voice input will be disabled'
            });
        }
    }

    checkTouchSupport() {
        if (this.deviceInfo.touchScreen) {
            console.log('✅ Touch Events - Supported');

            // Check for proper touch event handlers
            const buttons = document.querySelectorAll('button, .clickable');
            let touchOptimized = 0;

            buttons.forEach(button => {
                const style = window.getComputedStyle(button);
                const minSize = parseInt(style.minHeight) || parseInt(style.height) || 0;
                if (minSize >= 44) { // iOS minimum touch target
                    touchOptimized++;
                }
            });

            if (touchOptimized / buttons.length > 0.8) {
                console.log('✅ Touch Targets - Well optimized');
            } else {
                console.warn('⚠️ Touch Targets - Need optimization');
                this.issues.push({
                    type: 'touch',
                    severity: 'medium',
                    message: 'Touch targets too small',
                    fix: 'Increase button sizes for mobile'
                });
            }
        }
    }

    checkViewportSettings() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            const content = viewport.getAttribute('content');
            if (content.includes('width=device-width')) {
                console.log('✅ Viewport - Properly configured');
            } else {
                console.warn('⚠️ Viewport - Needs optimization');
                this.issues.push({
                    type: 'mobile',
                    severity: 'medium',
                    message: 'Viewport not optimized',
                    fix: 'Update viewport meta tag'
                });
            }
        } else {
            console.error('❌ Viewport - Meta tag missing');
            this.issues.push({
                type: 'mobile',
                severity: 'high',
                message: 'Viewport meta tag missing',
                fix: 'Add viewport meta tag'
            });
        }
    }

    checkTouchEventHandlers() {
        if (this.deviceInfo.mobile || this.deviceInfo.tablet) {
            // Check for touch-specific event handlers
            const hasTouch = document.addEventListener.toString().includes('touch');
            if (hasTouch) {
                console.log('✅ Touch Events - Handlers detected');
            } else {
                console.warn('⚠️ Touch Events - May need optimization');
                this.issues.push({
                    type: 'touch',
                    severity: 'low',
                    message: 'Touch event handlers may need optimization',
                    fix: 'Add touch-specific event handling'
                });
            }
        }
    }

    checkMobileUIElements() {
        if (this.deviceInfo.mobile) {
            // Check for mobile-friendly UI elements
            const modals = document.querySelectorAll('.modal, .dialog');
            const sidePanels = document.querySelectorAll('.side-panel');

            modals.forEach(modal => {
                const style = window.getComputedStyle(modal);
                if (parseInt(style.maxWidth) > window.innerWidth) {
                    this.issues.push({
                        type: 'mobile',
                        severity: 'medium',
                        message: 'Modal too wide for mobile',
                        fix: 'Adjust modal width for mobile screens'
                    });
                }
            });
        }
    }

    checkPerformanceAPIs() {
        if ('performance' in window) {
            console.log('✅ Performance API - Supported');
        } else {
            console.warn('⚠️ Performance API - Not supported');
            this.issues.push({
                type: 'performance',
                severity: 'low',
                message: 'Performance monitoring limited',
                fix: 'Use fallback timing methods'
            });
        }
    }

    checkMemoryUsage() {
        if (performance.memory) {
            const memory = performance.memory;
            const usedMB = memory.usedJSHeapSize / 1048576;
            const limitMB = memory.jsHeapSizeLimit / 1048576;

            console.log(`Memory usage: ${usedMB.toFixed(1)}MB / ${limitMB.toFixed(1)}MB`);

            if (usedMB / limitMB > 0.8) {
                this.issues.push({
                    type: 'performance',
                    severity: 'high',
                    message: 'High memory usage detected',
                    fix: 'Optimize memory usage and cleanup'
                });
            }
        }
    }

    checkCSSFeatures() {
        const features = [
            { property: 'grid', css: 'display: grid' },
            { property: 'flexbox', css: 'display: flex' },
            { property: 'transforms', css: 'transform: rotate(1deg)' },
            { property: 'animations', css: 'animation: test 1s' }
        ];

        features.forEach(feature => {
            if (CSS.supports(feature.css)) {
                console.log(`✅ CSS ${feature.property} - Supported`);
            } else {
                console.warn(`⚠️ CSS ${feature.property} - Not supported`);
                this.issues.push({
                    type: 'css',
                    severity: 'medium',
                    message: `CSS ${feature.property} not supported`,
                    fix: 'Use fallback styles'
                });
            }
        });
    }

    generateCompatibilityReport() {
        console.log('\n📊 COMPATIBILITY REPORT');
        console.log('=' .repeat(50));

        const severityCounts = {
            high: this.issues.filter(i => i.severity === 'high').length,
            medium: this.issues.filter(i => i.severity === 'medium').length,
            low: this.issues.filter(i => i.severity === 'low').length
        };

        console.log(`Device: ${this.deviceInfo.mobile ? 'Mobile' : this.deviceInfo.tablet ? 'Tablet' : 'Desktop'}`);
        console.log(`Browser: ${this.browserInfo.currentBrowser}`);
        console.log(`Screen: ${this.deviceInfo.screenWidth}x${this.deviceInfo.screenHeight}`);
        console.log(`Touch: ${this.deviceInfo.touchScreen ? 'Yes' : 'No'}`);

        console.log('\n🚨 ISSUES FOUND:');
        console.log(`❌ High Priority: ${severityCounts.high}`);
        console.log(`⚠️ Medium Priority: ${severityCounts.medium}`);
        console.log(`💡 Low Priority: ${severityCounts.low}`);

        if (this.issues.length > 0) {
            console.log('\n📋 DETAILED ISSUES:');
            this.issues.forEach((issue, index) => {
                console.log(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.message}`);
                console.log(`   Fix: ${issue.fix}`);
            });
        }

        // Compatibility score
        const maxScore = 100;
        const deductions = severityCounts.high * 20 + severityCounts.medium * 10 + severityCounts.low * 5;
        const score = Math.max(0, maxScore - deductions);

        console.log(`\n🎯 COMPATIBILITY SCORE: ${score}/100`);

        if (score >= 90) {
            console.log('✅ EXCELLENT - Ready for all devices');
        } else if (score >= 75) {
            console.log('✅ GOOD - Minor issues only');
        } else if (score >= 60) {
            console.log('⚠️ FAIR - Some compatibility issues');
        } else {
            console.log('❌ POOR - Significant compatibility issues');
        }
    }

    async applyCompatibilityFixes() {
        console.log('\n🔧 APPLYING AUTOMATIC FIXES...');

        for (const issue of this.issues) {
            try {
                switch (issue.type) {
                    case 'mobile':
                        await this.fixMobileIssues();
                        break;
                    case 'touch':
                        await this.fixTouchIssues();
                        break;
                    case 'audio':
                        await this.fixAudioIssues();
                        break;
                    case 'css':
                        await this.fixCSSIssues();
                        break;
                }
            } catch (error) {
                console.error(`Failed to fix ${issue.type} issue:`, error);
            }
        }

        console.log('✅ Automatic fixes completed');
    }

    async fixMobileIssues() {
        // Add mobile-specific CSS if needed
        if (this.deviceInfo.mobile) {
            const mobileCSS = `
                @media (max-width: 768px) {
                    .modal, .dialog {
                        width: 95% !important;
                        max-width: none !important;
                        margin: 10px auto !important;
                    }

                    button, .clickable {
                        min-height: 44px !important;
                        min-width: 44px !important;
                    }

                    .side-panel {
                        width: 100% !important;
                    }
                }
            `;

            const style = document.createElement('style');
            style.textContent = mobileCSS;
            document.head.appendChild(style);

            console.log('📱 Applied mobile CSS fixes');
        }
    }

    async fixTouchIssues() {
        // Add touch-friendly event handlers
        if (this.deviceInfo.touchScreen) {
            const buttons = document.querySelectorAll('button');

            buttons.forEach(button => {
                button.style.cursor = 'pointer';
                button.style.webkitTapHighlightColor = 'rgba(0,0,0,0.1)';

                // Add touch feedback
                button.addEventListener('touchstart', function() {
                    this.style.opacity = '0.7';
                });

                button.addEventListener('touchend', function() {
                    this.style.opacity = '1';
                });
            });

            console.log('👆 Applied touch optimizations');
        }
    }

    async fixAudioIssues() {
        // Ensure audio context is resumed on user interaction
        if (window.audioManager && window.audioManager.audioContext) {
            const resumeAudio = () => {
                if (window.audioManager.audioContext.state === 'suspended') {
                    window.audioManager.audioContext.resume();
                }
            };

            document.addEventListener('click', resumeAudio, { once: true });
            document.addEventListener('touchstart', resumeAudio, { once: true });

            console.log('🔊 Applied audio context fixes');
        }
    }

    async fixCSSIssues() {
        // Add CSS fallbacks for unsupported features
        const fallbackCSS = `
            .no-flexbox .flex {
                display: block;
            }

            .no-grid .grid {
                display: block;
            }

            .no-transforms .transform {
                position: relative;
            }
        `;

        const style = document.createElement('style');
        style.textContent = fallbackCSS;
        document.head.appendChild(style);

        console.log('🎨 Applied CSS fallbacks');
    }
}

// Auto-initialize compatibility checker
window.addEventListener('load', () => {
    const checker = new CompatibilityChecker();
    checker.runAllChecks();

    // Make it globally available
    window.compatibilityChecker = checker;
});

console.log('🔍 Compatibility Checker loaded');