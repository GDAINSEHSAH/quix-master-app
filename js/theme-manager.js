// Theme Manager - Handle different visual themes and appearance settings
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themes = {
            light: {
                name: 'Light',
                icon: 'fas fa-sun',
                colors: {
                    primary: '#667eea',
                    secondary: '#764ba2',
                    accent: '#00ff88',
                    background: '#f8f9fa',
                    surface: '#ffffff',
                    text: '#2c3e50'
                }
            },
            dark: {
                name: 'Dark',
                icon: 'fas fa-moon',
                colors: {
                    primary: '#667eea',
                    secondary: '#764ba2',
                    accent: '#00ff88',
                    background: '#1a1a1a',
                    surface: '#2d2d2d',
                    text: '#ffffff'
                }
            },
            neon: {
                name: 'Neon',
                icon: 'fas fa-bolt',
                colors: {
                    primary: '#ff006e',
                    secondary: '#8338ec',
                    accent: '#00f5ff',
                    background: '#0a0a0a',
                    surface: '#1a1a1a',
                    text: '#00f5ff'
                }
            },
            ocean: {
                name: 'Ocean',
                icon: 'fas fa-water',
                colors: {
                    primary: '#0077be',
                    secondary: '#00a8cc',
                    accent: '#40e0d0',
                    background: '#001122',
                    surface: '#002244',
                    text: '#ffffff'
                }
            },
            sunset: {
                name: 'Sunset',
                icon: 'fas fa-sun',
                colors: {
                    primary: '#ff6b35',
                    secondary: '#f7931e',
                    accent: '#ffed4e',
                    background: '#2c1810',
                    surface: '#4a2c18',
                    text: '#ffffff'
                }
            },
            forest: {
                name: 'Forest',
                icon: 'fas fa-tree',
                colors: {
                    primary: '#2d5016',
                    secondary: '#3d6b1f',
                    accent: '#7cb342',
                    background: '#0f1a0a',
                    surface: '#1a2f14',
                    text: '#ffffff'
                }
            }
        };

        this.loadTheme();
        this.initializeThemeSelector();
    }

    loadTheme() {
        const saved = localStorage.getItem('quiz-theme');
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        }
        this.applyTheme(this.currentTheme);
    }

    applyTheme(themeName) {
        if (!this.themes[themeName]) return;

        this.currentTheme = themeName;
        document.body.setAttribute('data-theme', themeName);

        // Update theme colors in CSS custom properties
        const theme = this.themes[themeName];
        const root = document.documentElement;

        // Apply theme colors as CSS variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--theme-${key}`, value);
        });

        // Update theme selector UI
        this.updateThemeSelector();

        // Save theme preference
        localStorage.setItem('quiz-theme', themeName);

        // Trigger theme change event
        this.triggerThemeChangeEvent(themeName);
    }

    updateThemeSelector() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            const theme = btn.getAttribute('data-theme');
            if (theme === this.currentTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    initializeThemeSelector() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createThemeSelector();
            });
        } else {
            this.createThemeSelector();
        }
    }

    createThemeSelector() {
        const themeSelector = document.querySelector('.theme-selector');
        if (!themeSelector) return;

        // Clear existing content
        themeSelector.innerHTML = '';

        // Create theme buttons
        Object.entries(this.themes).forEach(([themeId, theme]) => {
            const button = document.createElement('button');
            button.className = 'theme-btn';
            button.setAttribute('data-theme', themeId);
            button.innerHTML = `<i class="${theme.icon}"></i> ${theme.name}`;

            if (themeId === this.currentTheme) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                this.applyTheme(themeId);

                // Play sound effect
                if (window.audioManager) {
                    window.audioManager.playSound('powerup');
                }

                // Add click animation
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            });

            themeSelector.appendChild(button);
        });
    }

    // Get current theme colors
    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }

    // Get all available themes
    getAllThemes() {
        return this.themes;
    }

    // Add custom theme
    addCustomTheme(id, theme) {
        this.themes[id] = theme;
        this.createThemeSelector();
    }

    // Theme-specific animations
    getThemeAnimations() {
        const animations = {
            light: {
                particles: ['✨', '💫', '⭐'],
                colors: ['#ffd700', '#ffed4e', '#fff']
            },
            dark: {
                particles: ['🌟', '💜', '🔮'],
                colors: ['#667eea', '#764ba2', '#00ff88']
            },
            neon: {
                particles: ['⚡', '💥', '🌈'],
                colors: ['#ff006e', '#8338ec', '#00f5ff']
            },
            ocean: {
                particles: ['🌊', '🐠', '💎'],
                colors: ['#40e0d0', '#0077be', '#00a8cc']
            },
            sunset: {
                particles: ['🔥', '🧡', '☀️'],
                colors: ['#ff6b35', '#f7931e', '#ffed4e']
            },
            forest: {
                particles: ['🍃', '🌿', '🌱'],
                colors: ['#7cb342', '#2d5016', '#3d6b1f']
            }
        };

        return animations[this.currentTheme] || animations.light;
    }

    // Trigger theme change event for other components
    triggerThemeChangeEvent(themeName) {
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: themeName,
                colors: this.themes[themeName].colors
            }
        });
        document.dispatchEvent(event);
    }

    // Auto theme based on time of day
    setAutoTheme() {
        const hour = new Date().getHours();
        let autoTheme;

        if (hour >= 6 && hour < 12) {
            autoTheme = 'light'; // Morning
        } else if (hour >= 12 && hour < 18) {
            autoTheme = 'light'; // Afternoon
        } else if (hour >= 18 && hour < 21) {
            autoTheme = 'sunset'; // Evening
        } else {
            autoTheme = 'dark'; // Night
        }

        this.applyTheme(autoTheme);
    }

    // Seasonal themes
    setSeasonalTheme() {
        const month = new Date().getMonth();
        let seasonalTheme;

        if (month >= 2 && month <= 4) {
            seasonalTheme = 'forest'; // Spring
        } else if (month >= 5 && month <= 7) {
            seasonalTheme = 'light'; // Summer
        } else if (month >= 8 && month <= 10) {
            seasonalTheme = 'sunset'; // Autumn
        } else {
            seasonalTheme = 'ocean'; // Winter
        }

        this.applyTheme(seasonalTheme);
    }

    // Theme preview
    previewTheme(themeName, duration = 2000) {
        const originalTheme = this.currentTheme;
        this.applyTheme(themeName);

        setTimeout(() => {
            this.applyTheme(originalTheme);
        }, duration);
    }

    // Dynamic theme based on quiz performance
    setPerformanceTheme(accuracy) {
        let performanceTheme;

        if (accuracy >= 90) {
            performanceTheme = 'sunset'; // Gold/celebration
        } else if (accuracy >= 70) {
            performanceTheme = 'forest'; // Growth/nature
        } else if (accuracy >= 50) {
            performanceTheme = 'ocean'; // Calm/steady
        } else {
            performanceTheme = 'dark'; // Focus/improvement
        }

        this.applyTheme(performanceTheme);
    }

    // Get contrast color for text readability
    getContrastColor(backgroundColor) {
        // Simple contrast calculation
        const r = parseInt(backgroundColor.slice(1, 3), 16);
        const g = parseInt(backgroundColor.slice(3, 5), 16);
        const b = parseInt(backgroundColor.slice(5, 7), 16);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }

    // Export current theme settings
    exportTheme() {
        return {
            currentTheme: this.currentTheme,
            themes: this.themes
        };
    }

    // Import theme settings
    importTheme(themeData) {
        if (themeData.themes) {
            this.themes = { ...this.themes, ...themeData.themes };
        }
        if (themeData.currentTheme && this.themes[themeData.currentTheme]) {
            this.applyTheme(themeData.currentTheme);
        }
        this.createThemeSelector();
    }
}

// Create global theme manager instance
window.themeManager = new ThemeManager();