// UI Components for Quiz Master

class UIComponents {
    // Show Profile Modal
    static showProfile() {
        const modal = document.getElementById('profile-modal') || this.createProfileModal();
        modal.classList.add('show');
        this.updateProfileDisplay();
    }

    static createProfileModal() {
        const modal = document.createElement('div');
        modal.id = 'profile-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="UIComponents.closeModal('profile-modal')">×</button>
                <h2>👤 Profile</h2>
                <div style="text-align: center; margin: 20px 0;">
                    <div id="current-avatar" style="font-size: 5em;">${gameSystem.profile.avatar}</div>
                    <input type="text" id="username-input" value="${gameSystem.profile.username}"
                           style="font-size: 1.5em; padding: 10px; border-radius: 10px; border: 2px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: white; text-align: center; margin-top: 10px;">
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="profile-level">${gameSystem.profile.level}</div>
                        <div class="stat-label">Level</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="profile-xp">${gameSystem.profile.xp}</div>
                        <div class="stat-label">XP</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="profile-coins">${gameSystem.coins}</div>
                        <div class="stat-label">💰 Coins</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="profile-streak">${gameSystem.streaks.current}</div>
                        <div class="stat-label">🔥 Streak</div>
                    </div>
                </div>

                <h3 style="margin-top: 30px;">Choose Avatar</h3>
                <div class="avatar-grid" id="avatar-selector"></div>

                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="UIComponents.saveProfile()" style="padding: 12px 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold;">
                        💾 Save Profile
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.populateAvatars();
        return modal;
    }

    static populateAvatars() {
        const avatars = ['😊', '🎓', '🤓', '😎', '🤠', '👨‍🎓', '👩‍🎓', '🧑‍💻', '👨‍🏫', '👩‍🏫', '🦸', '🦹', '🧙', '🧚', '🤖', '👾', '🐱', '🐶', '🐼', '🦊'];
        const container = document.getElementById('avatar-selector');
        if (!container) return;

        container.innerHTML = '';
        avatars.forEach(avatar => {
            const div = document.createElement('div');
            div.className = 'avatar-option';
            div.textContent = avatar;

            if (!gameSystem.unlockedAvatars.includes(avatar)) {
                div.classList.add('locked');
                div.title = 'Locked - Unlock by leveling up';
            } else {
                if (avatar === gameSystem.profile.avatar) {
                    div.classList.add('selected');
                }
                div.onclick = () => {
                    document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
                    div.classList.add('selected');
                    document.getElementById('current-avatar').textContent = avatar;
                };
            }
            container.appendChild(div);
        });
    }

    static saveProfile() {
        const username = document.getElementById('username-input').value;
        const avatar = document.getElementById('current-avatar').textContent;

        gameSystem.profile.username = username || 'Player';
        gameSystem.profile.avatar = avatar;
        gameSystem.save();
        gameSystem.updateUI();

        gameSystem.showNotification('✅ Profile saved!');
        this.closeModal('profile-modal');
    }

    static updateProfileDisplay() {
        document.getElementById('profile-level').textContent = gameSystem.profile.level;
        document.getElementById('profile-xp').textContent = gameSystem.profile.xp;
        document.getElementById('profile-coins').textContent = gameSystem.coins;
        document.getElementById('profile-streak').textContent = gameSystem.streaks.current;
    }

    // Show Shop Modal
    static showShop() {
        const modal = document.getElementById('shop-modal') || this.createShopModal();
        modal.classList.add('show');
    }

    static createShopModal() {
        const modal = document.createElement('div');
        modal.id = 'shop-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="UIComponents.closeModal('shop-modal')">×</button>
                <h2>🛒 Power-up Shop</h2>
                <p style="text-align: center; font-size: 1.3em; margin: 10px 0;">💰 ${gameSystem.coins} Coins</p>

                <div class="shop-grid">
                    <div class="shop-item">
                        <span class="shop-item-icon">🎯</span>
                        <div class="shop-item-name">50/50</div>
                        <p style="opacity: 0.8; font-size: 0.9em;">Remove 2 wrong answers</p>
                        <div class="shop-item-price">💰 10</div>
                        <button class="buy-btn" onclick="UIComponents.buyPowerup('fiftyFifty', 10)">Buy</button>
                    </div>

                    <div class="shop-item">
                        <span class="shop-item-icon">⏭️</span>
                        <div class="shop-item-name">Skip Question</div>
                        <p style="opacity: 0.8; font-size: 0.9em;">Skip current question</p>
                        <div class="shop-item-price">💰 15</div>
                        <button class="buy-btn" onclick="UIComponents.buyPowerup('skip', 15)">Buy</button>
                    </div>

                    <div class="shop-item">
                        <span class="shop-item-icon">💡</span>
                        <div class="shop-item-name">Hint</div>
                        <p style="opacity: 0.8; font-size: 0.9em;">Get a helpful hint</p>
                        <div class="shop-item-price">💰 5</div>
                        <button class="buy-btn" onclick="UIComponents.buyPowerup('hint', 5)">Buy</button>
                    </div>

                    <div class="shop-item">
                        <span class="shop-item-icon">⏱️</span>
                        <div class="shop-item-name">Extra Time</div>
                        <p style="opacity: 0.8; font-size: 0.9em;">+30 seconds</p>
                        <div class="shop-item-price">💰 20</div>
                        <button class="buy-btn" onclick="UIComponents.buyPowerup('extraTime', 20)">Buy</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    static buyPowerup(type, cost) {
        if (gameSystem.buyPowerup(type, cost)) {
            gameSystem.showNotification(`✅ Purchased ${type}!`);
            this.closeModal('shop-modal');
        } else {
            gameSystem.showNotification('❌ Not enough coins!');
        }
    }

    // Show Stats Modal
    static showStats() {
        const modal = document.getElementById('stats-modal') || this.createStatsModal();
        modal.classList.add('show');
        this.updateStatsDisplay();
    }

    static createStatsModal() {
        const modal = document.createElement('div');
        modal.id = 'stats-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="UIComponents.closeModal('stats-modal')">×</button>
                <h2>📊 Statistics</h2>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="total-quizzes">0</div>
                        <div class="stat-label">Total Quizzes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="total-questions">0</div>
                        <div class="stat-label">Questions Answered</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="accuracy-rate">0%</div>
                        <div class="stat-label">Accuracy Rate</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="avg-time">0s</div>
                        <div class="stat-label">Avg Time/Quiz</div>
                    </div>
                </div>

                <h3 style="margin-top: 30px;">Category Performance</h3>
                <div id="category-stats"></div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    static updateStatsDisplay() {
        document.getElementById('total-quizzes').textContent = gameSystem.stats.totalQuizzes;
        document.getElementById('total-questions').textContent = gameSystem.stats.totalQuestions;

        const accuracy = gameSystem.stats.totalQuestions > 0
            ? Math.round((gameSystem.stats.correctAnswers / gameSystem.stats.totalQuestions) * 100)
            : 0;
        document.getElementById('accuracy-rate').textContent = accuracy + '%';

        const avgTime = gameSystem.stats.totalQuizzes > 0
            ? Math.round(gameSystem.stats.totalTime / gameSystem.stats.totalQuizzes)
            : 0;
        document.getElementById('avg-time').textContent = avgTime + 's';

        // Category stats
        const categoryContainer = document.getElementById('category-stats');
        categoryContainer.innerHTML = '';
        Object.keys(gameSystem.stats.categoryStats).forEach(category => {
            const stats = gameSystem.stats.categoryStats[category];
            const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

            const div = document.createElement('div');
            div.style.cssText = 'background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px;';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="text-transform: capitalize;">${category}</strong>
                    <span>${acc}% (${stats.correct}/${stats.total})</span>
                </div>
                <div style="background: rgba(255,255,255,0.2); height: 10px; border-radius: 5px; margin-top: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); height: 100%; width: ${acc}%; transition: width 0.5s ease;"></div>
                </div>
            `;
            categoryContainer.appendChild(div);
        });
    }

    // Show Badges Modal
    static showBadges() {
        const modal = document.getElementById('badges-modal') || this.createBadgesModal();
        modal.classList.add('show');
    }

    static createBadgesModal() {
        const modal = document.createElement('div');
        modal.id = 'badges-modal';
        modal.className = 'modal';

        const allBadges = [
            { id: 'first_quiz', icon: '🎮', name: 'First Quiz', desc: 'Complete your first quiz' },
            { id: 'perfect', icon: '💯', name: 'Perfectionist', desc: 'Score 100%' },
            { id: 'speed_demon', icon: '⚡', name: 'Speed Demon', desc: 'Complete quiz under 1 min with 80%+' },
            { id: 'dedicated', icon: '📚', name: 'Dedicated', desc: 'Complete 10 quizzes' },
            { id: 'master', icon: '👑', name: 'Quiz Master', desc: 'Complete 50 quizzes' },
            { id: 'streak_master', icon: '🔥', name: 'Streak Master', desc: '30 day streak' }
        ];

        let badgesHTML = '';
        allBadges.forEach(badge => {
            const unlocked = gameSystem.badges.includes(badge.id);
            badgesHTML += `
                <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}">
                    <span class="badge-icon">${badge.icon}</span>
                    <div style="font-weight: bold;">${badge.name}</div>
                    <div style="font-size: 0.9em; opacity: 0.8; margin-top: 5px;">${badge.desc}</div>
                </div>
            `;
        });

        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="UIComponents.closeModal('badges-modal')">×</button>
                <h2>🏆 Badges</h2>
                <p style="text-align: center;">Collected: ${gameSystem.badges.length}/${allBadges.length}</p>
                <div class="badge-grid">
                    ${badgesHTML}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    // Close Modal
    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Show Game Mode Selector
    static showModeSelector(section) {
        const modal = document.createElement('div');
        modal.id = 'mode-modal';
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="document.getElementById('mode-modal').remove()">×</button>
                <h2>🎮 Select Game Mode</h2>

                <div class="mode-selector">
                    <div class="mode-card selected" onclick="UIComponents.selectMode(this, 'normal')">
                        <span class="mode-icon">📝</span>
                        <h3>Normal Mode</h3>
                        <p>Standard quiz experience</p>
                    </div>

                    <div class="mode-card" onclick="UIComponents.selectMode(this, 'timeAttack')">
                        <span class="mode-icon">⚡</span>
                        <h3>Time Attack</h3>
                        <p>Race against the clock!</p>
                    </div>

                    <div class="mode-card" onclick="UIComponents.selectMode(this, 'survival')">
                        <span class="mode-icon">❤️</span>
                        <h3>Survival Mode</h3>
                        <p>3 lives - don't fail!</p>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="UIComponents.startWithMode('${section}')" style="padding: 15px 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 1.1em;">
                        Start Quiz →
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    static selectMode(element, mode) {
        document.querySelectorAll('.mode-card').forEach(card => card.classList.remove('selected'));
        element.classList.add('selected');
        gameSystem.currentMode = mode;
    }

    static startWithMode(section) {
        document.getElementById('mode-modal').remove();
        showLevels(section);
    }
}
