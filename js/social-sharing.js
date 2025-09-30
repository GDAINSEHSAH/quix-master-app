// Social Sharing System - Share achievements, scores, and compete with friends
class SocialSharingSystem {
    constructor() {
        this.platforms = {
            twitter: {
                name: 'Twitter',
                icon: 'fab fa-twitter',
                color: '#1da1f2',
                baseUrl: 'https://twitter.com/intent/tweet'
            },
            facebook: {
                name: 'Facebook',
                icon: 'fab fa-facebook',
                color: '#4267b2',
                baseUrl: 'https://www.facebook.com/sharer/sharer.php'
            },
            whatsapp: {
                name: 'WhatsApp',
                icon: 'fab fa-whatsapp',
                color: '#25d366',
                baseUrl: 'https://wa.me/'
            },
            telegram: {
                name: 'Telegram',
                icon: 'fab fa-telegram',
                color: '#0088cc',
                baseUrl: 'https://t.me/share/url'
            },
            linkedin: {
                name: 'LinkedIn',
                icon: 'fab fa-linkedin',
                color: '#0077b5',
                baseUrl: 'https://www.linkedin.com/sharing/share-offsite/'
            },
            reddit: {
                name: 'Reddit',
                icon: 'fab fa-reddit',
                color: '#ff4500',
                baseUrl: 'https://reddit.com/submit'
            }
        };

        this.shareTemplates = {
            achievement: {
                title: '🏆 Achievement Unlocked!',
                templates: [
                    'Just unlocked "{achievementName}" in Quiz Master! 🎯 {description}',
                    '🔥 New achievement: "{achievementName}" - {description} #QuizMaster',
                    '💪 Achievement unlocked: {achievementName}! Can you beat my score?'
                ]
            },
            highScore: {
                title: '🎯 New High Score!',
                templates: [
                    'Just scored {score} points in Quiz Master! Can you beat it? 🏆',
                    '🔥 New personal best: {score} points! Challenge accepted? #QuizMaster',
                    '💯 Scored {score} points with {accuracy}% accuracy! Your turn!'
                ]
            },
            perfectScore: {
                title: '💯 Perfect Score!',
                templates: [
                    'Just got 100% on a Quiz Master quiz! 🎯 Feeling like a genius!',
                    '🧠 Perfect score achieved! Quiz Master challenge completed flawlessly!',
                    '💪 100% accuracy in Quiz Master! Who else can achieve perfection?'
                ]
            },
            streak: {
                title: '🔥 Amazing Streak!',
                templates: [
                    'On fire! 🔥 {streakDays}-day learning streak in Quiz Master!',
                    '💪 {streakDays} days of consistent learning! Join me in Quiz Master!',
                    '🎯 {streakDays}-day streak and counting! Can you match it?'
                ]
            },
            timeAttack: {
                title: '⚡ Time Attack Master!',
                templates: [
                    'Scored {score} points in Time Attack mode! ⚡ Lightning fast!',
                    '🏃‍♂️ Time Attack champion: {score} points in {duration} seconds!',
                    '⏱️ {score} points in Time Attack! Speed + Knowledge = Victory!'
                ]
            },
            challenge: {
                title: '🎯 Challenge Completed!',
                templates: [
                    'Completed daily challenge: "{challengeName}" 🏆',
                    '💎 Challenge conquered: {challengeName}! Next target acquired!',
                    '🔥 Daily challenge done: {challengeName} ✅'
                ]
            },
            invitation: {
                title: '🎮 Join Me in Quiz Master!',
                templates: [
                    'Test your knowledge with me in Quiz Master! 🧠 Think you can beat my score?',
                    'Challenge your brain with Quiz Master! 🎯 Join me for some fun learning!',
                    'Quiz Master is amazing! 🌟 Join me and let\'s see who\'s smarter!'
                ]
            }
        };

        this.leaderboard = [];
        this.friends = [];
        this.challenges = [];

        this.loadSocialData();
        this.initializeUI();
    }

    loadSocialData() {
        // Load friends list
        const savedFriends = localStorage.getItem('quiz-friends');
        if (savedFriends) {
            this.friends = JSON.parse(savedFriends);
        }

        // Load challenges
        const savedChallenges = localStorage.getItem('quiz-social-challenges');
        if (savedChallenges) {
            this.challenges = JSON.parse(savedChallenges);
        }

        // Load leaderboard
        const savedLeaderboard = localStorage.getItem('quiz-leaderboard');
        if (savedLeaderboard) {
            this.leaderboard = JSON.parse(savedLeaderboard);
        }
    }

    saveSocialData() {
        localStorage.setItem('quiz-friends', JSON.stringify(this.friends));
        localStorage.setItem('quiz-social-challenges', JSON.stringify(this.challenges));
        localStorage.setItem('quiz-leaderboard', JSON.stringify(this.leaderboard));
    }

    initializeUI() {
        this.createSharingButtons();
        this.setupEventListeners();
    }

    createSharingButtons() {
        // Add share buttons to various parts of the UI
        const shareContainers = document.querySelectorAll('.share-container');

        shareContainers.forEach(container => {
            container.innerHTML = this.generateShareButtons();
        });
    }

    generateShareButtons() {
        let buttonsHTML = '<div class="social-share-buttons">';

        Object.entries(this.platforms).forEach(([platform, config]) => {
            buttonsHTML += `
                <button class="share-btn ${platform}"
                        data-platform="${platform}"
                        style="background-color: ${config.color}">
                    <i class="${config.icon}"></i>
                    <span>${config.name}</span>
                </button>
            `;
        });

        buttonsHTML += '</div>';
        return buttonsHTML;
    }

    setupEventListeners() {
        // Handle share button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.share-btn')) {
                const button = e.target.closest('.share-btn');
                const platform = button.getAttribute('data-platform');
                this.handleShare(platform);
            }
        });

        // Listen for shareable events
        document.addEventListener('achievementUnlocked', (e) => {
            this.showSharePrompt('achievement', e.detail);
        });

        document.addEventListener('newHighScore', (e) => {
            this.showSharePrompt('highScore', e.detail);
        });

        document.addEventListener('perfectScore', (e) => {
            this.showSharePrompt('perfectScore', e.detail);
        });

        document.addEventListener('streakMilestone', (e) => {
            this.showSharePrompt('streak', e.detail);
        });

        document.addEventListener('timeAttackComplete', (e) => {
            if (e.detail.score > 500) { // Only share impressive scores
                this.showSharePrompt('timeAttack', e.detail);
            }
        });

        document.addEventListener('challengeCompleted', (e) => {
            this.showSharePrompt('challenge', e.detail);
        });
    }

    shareAchievement(achievement) {
        const template = this.getRandomTemplate('achievement');
        const message = template
            .replace('{achievementName}', achievement.name)
            .replace('{description}', achievement.description);

        this.createShareModal('achievement', message, {
            achievement: achievement.name,
            xp: achievement.xp,
            rarity: achievement.rarity
        });
    }

    shareScore(scoreData) {
        const template = this.getRandomTemplate('highScore');
        const message = template
            .replace('{score}', scoreData.score)
            .replace('{accuracy}', Math.round(scoreData.accuracy || 0));

        this.createShareModal('highScore', message, scoreData);
    }

    sharePerfectScore(quizData) {
        const template = this.getRandomTemplate('perfectScore');

        this.createShareModal('perfectScore', template, {
            section: quizData.section,
            level: quizData.level,
            questions: quizData.questionsCount
        });
    }

    shareStreak(streakData) {
        const template = this.getRandomTemplate('streak');
        const message = template.replace('{streakDays}', streakData.days);

        this.createShareModal('streak', message, streakData);
    }

    shareTimeAttack(timeAttackData) {
        const template = this.getRandomTemplate('timeAttack');
        const message = template
            .replace('{score}', timeAttackData.score)
            .replace('{duration}', timeAttackData.duration);

        this.createShareModal('timeAttack', message, timeAttackData);
    }

    shareChallenge(challengeData) {
        const template = this.getRandomTemplate('challenge');
        const message = template.replace('{challengeName}', challengeData.name);

        this.createShareModal('challenge', message, challengeData);
    }

    inviteFriend() {
        const template = this.getRandomTemplate('invitation');

        this.createShareModal('invitation', template, {
            appUrl: window.location.origin,
            playerName: this.getPlayerName()
        });
    }

    getRandomTemplate(type) {
        const templates = this.shareTemplates[type]?.templates || [];
        return templates[Math.floor(Math.random() * templates.length)] || '';
    }

    createShareModal(type, message, data) {
        const modal = document.createElement('div');
        modal.className = 'share-modal';

        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${this.shareTemplates[type]?.title || 'Share Your Achievement'}</h3>
                    <button class="close-modal">&times;</button>
                </div>

                <div class="share-preview">
                    <div class="share-message">
                        <textarea id="share-text" rows="3">${message}</textarea>
                    </div>
                    ${this.generateSharePreview(type, data)}
                </div>

                <div class="share-platforms">
                    ${this.generatePlatformButtons()}
                </div>

                <div class="share-actions">
                    <button class="copy-link-btn">
                        <i class="fas fa-link"></i> Copy Link
                    </button>
                    <button class="native-share-btn" style="display: none;">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal events
        this.setupModalEvents(modal, type, data);

        // Show native share if available
        if (navigator.share) {
            modal.querySelector('.native-share-btn').style.display = 'block';
        }
    }

    generateSharePreview(type, data) {
        switch (type) {
            case 'achievement':
                return `
                    <div class="achievement-preview">
                        <div class="achievement-badge ${data.rarity}">
                            <i class="fas fa-trophy"></i>
                            <span>${data.achievement}</span>
                        </div>
                        <div class="achievement-xp">+${data.xp} XP</div>
                    </div>
                `;

            case 'highScore':
                return `
                    <div class="score-preview">
                        <div class="score-display">${data.score}</div>
                        <div class="score-details">
                            <span>Accuracy: ${Math.round(data.accuracy || 0)}%</span>
                            <span>Questions: ${data.questionsAnswered || 0}</span>
                        </div>
                    </div>
                `;

            case 'timeAttack':
                return `
                    <div class="timeattack-preview">
                        <div class="time-score">${data.score} pts</div>
                        <div class="time-details">
                            <span>⚡ ${data.duration}s</span>
                            <span>🎯 ${data.correctAnswers}/${data.questionsAnswered}</span>
                        </div>
                    </div>
                `;

            default:
                return '<div class="generic-preview">🎮 Quiz Master</div>';
        }
    }

    generatePlatformButtons() {
        let buttonsHTML = '';

        Object.entries(this.platforms).forEach(([platform, config]) => {
            buttonsHTML += `
                <button class="platform-btn" data-platform="${platform}"
                        style="border-left: 4px solid ${config.color}">
                    <i class="${config.icon}"></i>
                    <span>Share on ${config.name}</span>
                </button>
            `;
        });

        return buttonsHTML;
    }

    setupModalEvents(modal, type, data) {
        // Close modal
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.querySelector('.modal-overlay').onclick = () => modal.remove();

        // Platform sharing
        modal.querySelectorAll('.platform-btn').forEach(btn => {
            btn.onclick = () => {
                const platform = btn.getAttribute('data-platform');
                const message = modal.querySelector('#share-text').value;
                this.shareOnPlatform(platform, message, data);
            };
        });

        // Copy link
        modal.querySelector('.copy-link-btn').onclick = () => {
            this.copyToClipboard(modal.querySelector('#share-text').value);
            this.showToast('Copied to clipboard!');
        };

        // Native share
        const nativeShareBtn = modal.querySelector('.native-share-btn');
        if (nativeShareBtn) {
            nativeShareBtn.onclick = () => {
                this.nativeShare(modal.querySelector('#share-text').value, data);
            };
        }
    }

    shareOnPlatform(platform, message, data = {}) {
        const config = this.platforms[platform];
        if (!config) return;

        let shareUrl = '';
        const encodedMessage = encodeURIComponent(message);
        const appUrl = encodeURIComponent(window.location.origin);

        switch (platform) {
            case 'twitter':
                shareUrl = `${config.baseUrl}?text=${encodedMessage}&url=${appUrl}&hashtags=QuizMaster,Gaming,Knowledge`;
                break;

            case 'facebook':
                shareUrl = `${config.baseUrl}?u=${appUrl}&quote=${encodedMessage}`;
                break;

            case 'whatsapp':
                shareUrl = `${config.baseUrl}?text=${encodedMessage} ${window.location.origin}`;
                break;

            case 'telegram':
                shareUrl = `${config.baseUrl}?url=${appUrl}&text=${encodedMessage}`;
                break;

            case 'linkedin':
                shareUrl = `${config.baseUrl}?url=${appUrl}&summary=${encodedMessage}`;
                break;

            case 'reddit':
                shareUrl = `${config.baseUrl}?url=${appUrl}&title=${encodedMessage}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            this.trackShare(platform, message);
        }
    }

    async nativeShare(message, data = {}) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Quiz Master Achievement',
                    text: message,
                    url: window.location.origin
                });
                this.trackShare('native', message);
            } catch (error) {
                console.log('Native sharing failed:', error);
            }
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    showSharePrompt(type, data) {
        // Auto-show share prompt for significant achievements
        if (this.shouldAutoPrompt(type, data)) {
            setTimeout(() => {
                this[`share${type.charAt(0).toUpperCase() + type.slice(1)}`](data);
            }, 1000);
        }
    }

    shouldAutoPrompt(type, data) {
        // Only auto-prompt for significant achievements
        const significantTypes = ['achievement', 'perfectScore', 'streak'];
        return significantTypes.includes(type);
    }

    trackShare(platform, message) {
        // Track sharing statistics
        const shareStats = JSON.parse(localStorage.getItem('quiz-share-stats') || '{}');

        if (!shareStats[platform]) shareStats[platform] = 0;
        shareStats[platform]++;

        shareStats.totalShares = (shareStats.totalShares || 0) + 1;
        shareStats.lastShare = new Date().toISOString();

        localStorage.setItem('quiz-share-stats', JSON.stringify(shareStats));

        // Trigger achievement check
        if (window.achievementsSystem) {
            const stats = window.statisticsManager?.getStats() || {};
            stats.sharesCount = shareStats.totalShares;
            window.achievementsSystem.checkAchievements(stats);
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--success-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 3000;
            animation: toastSlideUp 3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }

    getPlayerName() {
        return localStorage.getItem('quiz-player-name') || 'Quiz Master Player';
    }

    // Challenge friends
    challengeFriend(friendId, challengeType = 'score') {
        const challenge = {
            id: Date.now().toString(),
            fromPlayer: this.getPlayerName(),
            toPlayer: friendId,
            type: challengeType,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        this.challenges.push(challenge);
        this.saveSocialData();

        // In a real app, this would send via API
        this.showToast(`Challenge sent to ${friendId}!`);
    }

    // Get social statistics
    getSocialStats() {
        const shareStats = JSON.parse(localStorage.getItem('quiz-share-stats') || '{}');

        return {
            totalShares: shareStats.totalShares || 0,
            friendsCount: this.friends.length,
            challengesSent: this.challenges.filter(c => c.fromPlayer === this.getPlayerName()).length,
            challengesReceived: this.challenges.filter(c => c.toPlayer === this.getPlayerName()).length,
            platforms: shareStats
        };
    }

    // Export social data
    exportSocialData() {
        return {
            friends: this.friends,
            challenges: this.challenges,
            shareStats: JSON.parse(localStorage.getItem('quiz-share-stats') || '{}')
        };
    }

    // Import social data
    importSocialData(data) {
        if (data.friends) this.friends = data.friends;
        if (data.challenges) this.challenges = data.challenges;
        if (data.shareStats) {
            localStorage.setItem('quiz-share-stats', JSON.stringify(data.shareStats));
        }
        this.saveSocialData();
    }
}

// Global social sharing system
window.socialSharingSystem = new SocialSharingSystem();

// Add CSS for social sharing
const socialStyles = document.createElement('style');
socialStyles.textContent = `
    .social-share-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin: 1rem 0;
    }

    .share-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }

    .share-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .share-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
    }

    .modal-content {
        background: var(--bg-card);
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        position: relative;
        box-shadow: var(--shadow-heavy);
        max-height: 80vh;
        overflow-y: auto;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--bg-tertiary);
    }

    .modal-header h3 {
        color: var(--text-primary);
        margin: 0;
    }

    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .close-modal:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }

    .share-preview {
        margin-bottom: 1.5rem;
    }

    .share-message textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid var(--bg-tertiary);
        border-radius: 10px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        resize: vertical;
        font-family: inherit;
        margin-bottom: 1rem;
    }

    .achievement-preview, .score-preview, .timeattack-preview {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
    }

    .achievement-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .score-display, .time-score {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .score-details, .time-details {
        display: flex;
        justify-content: center;
        gap: 1rem;
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .share-platforms {
        margin-bottom: 1.5rem;
    }

    .platform-btn {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
        padding: 1rem;
        margin-bottom: 0.5rem;
        background: var(--bg-secondary);
        border: none;
        border-radius: 10px;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .platform-btn:hover {
        background: var(--bg-tertiary);
        transform: translateX(5px);
    }

    .share-actions {
        display: flex;
        gap: 1rem;
    }

    .copy-link-btn, .native-share-btn {
        flex: 1;
        padding: 1rem;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .copy-link-btn {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }

    .native-share-btn {
        background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
        color: white;
    }

    .copy-link-btn:hover, .native-share-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
    }

    @keyframes toastSlideUp {
        0% { transform: translate(-50%, 100px); opacity: 0; }
        10% { transform: translate(-50%, 0); opacity: 1; }
        90% { transform: translate(-50%, 0); opacity: 1; }
        100% { transform: translate(-50%, -100px); opacity: 0; }
    }

    @media (max-width: 768px) {
        .social-share-buttons {
            grid-template-columns: repeat(2, 1fr);
        }

        .share-btn span {
            display: none;
        }

        .modal-content {
            margin: 1rem;
            width: auto;
        }

        .share-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(socialStyles);