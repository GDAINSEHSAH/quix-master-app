// Multiplayer Manager - Real-time multiplayer quiz competitions
class MultiplayerManager {
    constructor() {
        this.isConnected = false;
        this.isInGame = false;
        this.currentRoom = null;
        this.players = [];
        this.gameState = null;
        this.playerData = {
            id: this.generatePlayerId(),
            name: localStorage.getItem('quiz-player-name') || 'Player',
            avatar: localStorage.getItem('quiz-player-avatar') || '🎮',
            level: 1,
            score: 0,
            ready: false
        };

        this.gameSettings = {
            maxPlayers: 4,
            questionCount: 10,
            timePerQuestion: 15,
            category: 'mixed',
            difficulty: 'medium'
        };

        // Simulated WebSocket for demo (replace with real WebSocket in production)
        this.socket = null;
        this.simulatedConnection = true;

        this.rooms = [];
        this.leaderboard = [];

        this.loadMultiplayerData();
        this.initializeUI();
        this.setupEventListeners();
    }

    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }

    loadMultiplayerData() {
        // Load multiplayer statistics
        const savedStats = localStorage.getItem('quiz-multiplayer-stats');
        if (savedStats) {
            this.multiplayerStats = JSON.parse(savedStats);
        } else {
            this.multiplayerStats = {
                gamesPlayed: 0,
                gamesWon: 0,
                totalScore: 0,
                bestRank: 0,
                averageRank: 0,
                winStreak: 0,
                currentStreak: 0
            };
        }

        // Load player profile
        const savedProfile = localStorage.getItem('quiz-multiplayer-profile');
        if (savedProfile) {
            this.playerData = { ...this.playerData, ...JSON.parse(savedProfile) };
        }
    }

    saveMultiplayerData() {
        localStorage.setItem('quiz-multiplayer-stats', JSON.stringify(this.multiplayerStats));
        localStorage.setItem('quiz-multiplayer-profile', JSON.stringify(this.playerData));
    }

    initializeUI() {
        this.createMultiplayerPanel();
        this.updatePlayerProfile();
    }

    createMultiplayerPanel() {
        // Multiplayer UI will be integrated into existing game UI
        const multiplayerContainer = document.getElementById('multiplayer-container');
        if (!multiplayerContainer) return;

        multiplayerContainer.innerHTML = `
            <div class="multiplayer-panel">
                <div class="multiplayer-header">
                    <h3>Multiplayer</h3>
                    <div class="connection-status ${this.isConnected ? 'connected' : 'disconnected'}">
                        <div class="status-indicator"></div>
                        <span>${this.isConnected ? 'Connected' : 'Offline'}</span>
                    </div>
                </div>

                <div class="player-profile">
                    <div class="player-avatar">${this.playerData.avatar}</div>
                    <div class="player-info">
                        <div class="player-name">${this.playerData.name}</div>
                        <div class="player-level">Level ${this.playerData.level}</div>
                        <div class="player-stats">
                            <span>Wins: ${this.multiplayerStats.gamesWon}</span>
                            <span>Games: ${this.multiplayerStats.gamesPlayed}</span>
                        </div>
                    </div>
                    <button class="edit-profile-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>

                <div class="multiplayer-modes">
                    <button class="mode-btn quick-match" ${!this.isConnected ? 'disabled' : ''}>
                        <div class="mode-icon">⚡</div>
                        <div class="mode-info">
                            <div class="mode-name">Quick Match</div>
                            <div class="mode-desc">Find a random opponent</div>
                        </div>
                    </button>

                    <button class="mode-btn create-room" ${!this.isConnected ? 'disabled' : ''}>
                        <div class="mode-icon">🏠</div>
                        <div class="mode-info">
                            <div class="mode-name">Create Room</div>
                            <div class="mode-desc">Start a private game</div>
                        </div>
                    </button>

                    <button class="mode-btn join-room" ${!this.isConnected ? 'disabled' : ''}>
                        <div class="mode-icon">🚪</div>
                        <div class="mode-info">
                            <div class="mode-name">Join Room</div>
                            <div class="mode-desc">Enter room code</div>
                        </div>
                    </button>

                    <button class="mode-btn tournament" ${!this.isConnected ? 'disabled' : ''}>
                        <div class="mode-icon">🏆</div>
                        <div class="mode-info">
                            <div class="mode-name">Tournament</div>
                            <div class="mode-desc">Compete for prizes</div>
                        </div>
                    </button>
                </div>

                <div class="active-rooms" style="display: none;">
                    <h4>Active Rooms</h4>
                    <div class="rooms-list"></div>
                </div>

                <div class="leaderboard-preview">
                    <h4>Global Leaderboard</h4>
                    <div class="leaderboard-list">
                        <div class="leaderboard-item">
                            <span class="rank">1</span>
                            <span class="player">QuizMaster Pro</span>
                            <span class="score">15,420</span>
                        </div>
                        <div class="leaderboard-item">
                            <span class="rank">2</span>
                            <span class="player">Knowledge King</span>
                            <span class="score">14,890</span>
                        </div>
                        <div class="leaderboard-item">
                            <span class="rank">3</span>
                            <span class="player">Brain Wizard</span>
                            <span class="score">13,750</span>
                        </div>
                    </div>
                    <button class="view-full-leaderboard">View Full Leaderboard</button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-match')) {
                this.startQuickMatch();
            } else if (e.target.closest('.create-room')) {
                this.showCreateRoomDialog();
            } else if (e.target.closest('.join-room')) {
                this.showJoinRoomDialog();
            } else if (e.target.closest('.tournament')) {
                this.showTournamentDialog();
            } else if (e.target.closest('.edit-profile-btn')) {
                this.showEditProfileDialog();
            } else if (e.target.closest('.view-full-leaderboard')) {
                this.showFullLeaderboard();
            }
        });

        // Listen for game events
        document.addEventListener('gameComplete', (e) => {
            if (this.isInGame) {
                this.handleGameComplete(e.detail);
            }
        });
    }

    // Connection Management
    connect() {
        if (this.simulatedConnection) {
            // Simulate connection for demo
            this.isConnected = true;
            this.updateConnectionStatus();
            this.generateDemoRooms();
            return Promise.resolve();
        }

        // Real WebSocket connection would go here
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket('wss://your-quiz-server.com/multiplayer');

            this.socket.onopen = () => {
                this.isConnected = true;
                this.updateConnectionStatus();
                this.sendPlayerData();
                resolve();
            };

            this.socket.onmessage = (event) => {
                this.handleServerMessage(JSON.parse(event.data));
            };

            this.socket.onclose = () => {
                this.isConnected = false;
                this.updateConnectionStatus();
            };

            this.socket.onerror = (error) => {
                reject(error);
            };
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
        this.isConnected = false;
        this.updateConnectionStatus();
    }

    updateConnectionStatus() {
        const statusElement = document.querySelector('.connection-status');
        if (statusElement) {
            statusElement.className = `connection-status ${this.isConnected ? 'connected' : 'disconnected'}`;
            statusElement.querySelector('span').textContent = this.isConnected ? 'Connected' : 'Offline';
        }

        // Enable/disable mode buttons
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.disabled = !this.isConnected;
        });
    }

    // Game Modes
    startQuickMatch() {
        if (!this.isConnected) return;

        this.showLoadingDialog('Finding opponents...');

        // Simulate matchmaking
        setTimeout(() => {
            this.joinGame({
                id: 'quick_' + Date.now(),
                name: 'Quick Match',
                players: [
                    this.playerData,
                    { id: 'bot1', name: 'QuizBot Alpha', avatar: '🤖', level: 2, score: 0, ready: true },
                    { id: 'bot2', name: 'Knowledge AI', avatar: '🧠', level: 3, score: 0, ready: true }
                ],
                settings: this.gameSettings
            });
        }, 2000);
    }

    showCreateRoomDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'multiplayer-dialog';

        dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>Create Room</h3>
                    <button class="close-dialog">&times;</button>
                </div>

                <div class="dialog-body">
                    <div class="form-group">
                        <label>Room Name</label>
                        <input type="text" id="room-name" placeholder="Enter room name" value="${this.playerData.name}'s Room">
                    </div>

                    <div class="form-group">
                        <label>Max Players</label>
                        <select id="max-players">
                            <option value="2">2 Players</option>
                            <option value="3">3 Players</option>
                            <option value="4" selected>4 Players</option>
                            <option value="6">6 Players</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Questions</label>
                        <select id="question-count">
                            <option value="5">5 Questions</option>
                            <option value="10" selected>10 Questions</option>
                            <option value="15">15 Questions</option>
                            <option value="20">20 Questions</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Time per Question</label>
                        <select id="time-limit">
                            <option value="10">10 seconds</option>
                            <option value="15" selected>15 seconds</option>
                            <option value="20">20 seconds</option>
                            <option value="30">30 seconds</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Category</label>
                        <select id="category">
                            <option value="mixed" selected>Mixed</option>
                            <option value="science">Science & Technology</option>
                            <option value="history">History & Geography</option>
                            <option value="sports">Sports & Entertainment</option>
                            <option value="literature">Literature & Arts</option>
                            <option value="general">General Knowledge</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Privacy</label>
                        <div class="radio-group">
                            <label><input type="radio" name="privacy" value="public" checked> Public</label>
                            <label><input type="radio" name="privacy" value="private"> Private</label>
                        </div>
                    </div>
                </div>

                <div class="dialog-actions">
                    <button class="btn-secondary cancel-btn">Cancel</button>
                    <button class="btn-primary create-btn">Create Room</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Setup dialog events
        dialog.querySelector('.close-dialog').onclick = () => dialog.remove();
        dialog.querySelector('.dialog-overlay').onclick = () => dialog.remove();
        dialog.querySelector('.cancel-btn').onclick = () => dialog.remove();

        dialog.querySelector('.create-btn').onclick = () => {
            const roomSettings = {
                name: dialog.querySelector('#room-name').value,
                maxPlayers: parseInt(dialog.querySelector('#max-players').value),
                questionCount: parseInt(dialog.querySelector('#question-count').value),
                timePerQuestion: parseInt(dialog.querySelector('#time-limit').value),
                category: dialog.querySelector('#category').value,
                privacy: dialog.querySelector('input[name="privacy"]:checked').value
            };

            this.createRoom(roomSettings);
            dialog.remove();
        };
    }

    createRoom(settings) {
        const room = {
            id: 'room_' + Date.now(),
            name: settings.name,
            host: this.playerData.id,
            players: [this.playerData],
            settings: settings,
            state: 'waiting',
            code: this.generateRoomCode()
        };

        this.currentRoom = room;
        this.showRoomLobby(room);
    }

    showJoinRoomDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'multiplayer-dialog';

        dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>Join Room</h3>
                    <button class="close-dialog">&times;</button>
                </div>

                <div class="dialog-body">
                    <div class="form-group">
                        <label>Room Code</label>
                        <input type="text" id="room-code" placeholder="Enter 6-digit room code" maxlength="6">
                    </div>

                    <div class="available-rooms">
                        <h4>Available Rooms</h4>
                        <div class="rooms-list">
                            ${this.generateDemoRoomsList()}
                        </div>
                    </div>
                </div>

                <div class="dialog-actions">
                    <button class="btn-secondary cancel-btn">Cancel</button>
                    <button class="btn-primary join-btn">Join Room</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Setup dialog events
        dialog.querySelector('.close-dialog').onclick = () => dialog.remove();
        dialog.querySelector('.dialog-overlay').onclick = () => dialog.remove();
        dialog.querySelector('.cancel-btn').onclick = () => dialog.remove();

        dialog.querySelector('.join-btn').onclick = () => {
            const roomCode = dialog.querySelector('#room-code').value;
            if (roomCode) {
                this.joinRoomByCode(roomCode);
            }
            dialog.remove();
        };

        // Room list click handlers
        dialog.querySelectorAll('.room-item').forEach(item => {
            item.onclick = () => {
                const roomId = item.getAttribute('data-room-id');
                this.joinRoomById(roomId);
                dialog.remove();
            };
        });
    }

    generateDemoRoomsList() {
        const demoRooms = [
            { id: 'demo1', name: 'Science Quiz', players: 2, maxPlayers: 4, host: 'ScienceFan' },
            { id: 'demo2', name: 'History Battle', players: 3, maxPlayers: 4, host: 'HistoryBuff' },
            { id: 'demo3', name: 'Sports Trivia', players: 1, maxPlayers: 6, host: 'SportsMaster' }
        ];

        return demoRooms.map(room => `
            <div class="room-item" data-room-id="${room.id}">
                <div class="room-info">
                    <div class="room-name">${room.name}</div>
                    <div class="room-host">Host: ${room.host}</div>
                </div>
                <div class="room-players">${room.players}/${room.maxPlayers}</div>
                <div class="room-status">Open</div>
            </div>
        `).join('');
    }

    showRoomLobby(room) {
        const lobby = document.createElement('div');
        lobby.className = 'room-lobby';

        lobby.innerHTML = `
            <div class="lobby-overlay"></div>
            <div class="lobby-content">
                <div class="lobby-header">
                    <h3>${room.name}</h3>
                    <div class="room-code">Room Code: ${room.code}</div>
                    <button class="leave-room-btn">Leave Room</button>
                </div>

                <div class="lobby-body">
                    <div class="room-settings">
                        <h4>Game Settings</h4>
                        <div class="settings-grid">
                            <div class="setting-item">
                                <span>Questions:</span>
                                <span>${room.settings.questionCount}</span>
                            </div>
                            <div class="setting-item">
                                <span>Time Limit:</span>
                                <span>${room.settings.timePerQuestion}s</span>
                            </div>
                            <div class="setting-item">
                                <span>Category:</span>
                                <span>${room.settings.category}</span>
                            </div>
                            <div class="setting-item">
                                <span>Max Players:</span>
                                <span>${room.settings.maxPlayers}</span>
                            </div>
                        </div>
                    </div>

                    <div class="players-lobby">
                        <h4>Players (${room.players.length}/${room.settings.maxPlayers})</h4>
                        <div class="players-grid">
                            ${this.generatePlayersGrid(room.players, room.settings.maxPlayers)}
                        </div>
                    </div>

                    <div class="lobby-chat">
                        <h4>Chat</h4>
                        <div class="chat-messages">
                            <div class="chat-message">
                                <span class="message-author">System:</span>
                                <span class="message-text">Welcome to the room!</span>
                            </div>
                        </div>
                        <div class="chat-input">
                            <input type="text" placeholder="Type a message..." id="chat-input">
                            <button class="send-btn">Send</button>
                        </div>
                    </div>
                </div>

                <div class="lobby-actions">
                    <button class="ready-btn ${this.playerData.ready ? 'ready' : ''}">
                        ${this.playerData.ready ? 'Ready!' : 'Ready Up'}
                    </button>
                    <button class="start-game-btn" ${room.host !== this.playerData.id || !this.allPlayersReady(room) ? 'disabled' : ''}>
                        Start Game
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(lobby);

        // Setup lobby events
        this.setupLobbyEvents(lobby, room);
    }

    generatePlayersGrid(players, maxPlayers) {
        let html = '';

        for (let i = 0; i < maxPlayers; i++) {
            if (i < players.length) {
                const player = players[i];
                html += `
                    <div class="player-slot filled ${player.ready ? 'ready' : ''}">
                        <div class="player-avatar">${player.avatar}</div>
                        <div class="player-name">${player.name}</div>
                        <div class="player-level">Lv.${player.level}</div>
                        ${player.ready ? '<div class="ready-indicator">✓</div>' : ''}
                    </div>
                `;
            } else {
                html += `
                    <div class="player-slot empty">
                        <div class="waiting-text">Waiting for player...</div>
                    </div>
                `;
            }
        }

        return html;
    }

    setupLobbyEvents(lobby, room) {
        lobby.querySelector('.leave-room-btn').onclick = () => {
            this.leaveRoom();
            lobby.remove();
        };

        lobby.querySelector('.ready-btn').onclick = () => {
            this.toggleReady();
            // Update UI would happen via WebSocket in real implementation
        };

        lobby.querySelector('.start-game-btn').onclick = () => {
            this.startMultiplayerGame(room);
            lobby.remove();
        };

        // Chat functionality
        const chatInput = lobby.querySelector('#chat-input');
        const sendBtn = lobby.querySelector('.send-btn');

        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                this.sendChatMessage(message);
                chatInput.value = '';
            }
        };

        sendBtn.onclick = sendMessage;
        chatInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        };
    }

    startMultiplayerGame(room) {
        this.isInGame = true;
        this.gameState = {
            room: room,
            currentQuestion: 0,
            players: room.players.map(p => ({ ...p, score: 0, answers: [] })),
            startTime: Date.now()
        };

        // Start the actual quiz game
        this.loadMultiplayerQuestion();
        this.showMultiplayerGameUI();
    }

    showMultiplayerGameUI() {
        const gameUI = document.createElement('div');
        gameUI.className = 'multiplayer-game-ui';

        gameUI.innerHTML = `
            <div class="multiplayer-hud">
                <div class="question-progress">
                    Question ${this.gameState.currentQuestion + 1} of ${this.gameState.room.settings.questionCount}
                </div>

                <div class="players-scores">
                    ${this.gameState.players.map(player => `
                        <div class="player-score ${player.id === this.playerData.id ? 'current-player' : ''}">
                            <span class="player-avatar">${player.avatar}</span>
                            <span class="player-name">${player.name}</span>
                            <span class="player-points">${player.score}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="multiplayer-timer">
                    <div class="timer-text">15</div>
                    <div class="timer-bar">
                        <div class="timer-fill"></div>
                    </div>
                </div>
            </div>

            <div class="answers-status">
                ${this.gameState.players.map(player => `
                    <div class="answer-status ${player.id === this.playerData.id ? 'current-player' : ''}">
                        <span>${player.name}</span>
                        <span class="status-indicator">⏳</span>
                    </div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(gameUI);
    }

    loadMultiplayerQuestion() {
        // Get question from the database
        if (window.gameLogic && window.gameLogic.questionsDatabase) {
            const category = this.gameState.room.settings.category;
            let questions;

            if (category === 'mixed') {
                // Get random questions from all categories
                const allCategories = Object.keys(window.gameLogic.questionsDatabase);
                const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
                questions = window.gameLogic.questionsDatabase[randomCategory].flat();
            } else {
                questions = window.gameLogic.questionsDatabase[category]?.flat() || [];
            }

            if (questions.length > 0) {
                const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
                this.displayMultiplayerQuestion(randomQuestion);
            }
        }
    }

    displayMultiplayerQuestion(question) {
        // Use existing question display but with multiplayer enhancements
        const questionElement = document.getElementById('question-text');
        const answerButtons = document.querySelectorAll('.answer-btn');

        if (questionElement) {
            questionElement.textContent = question.question;
        }

        if (answerButtons.length === 4) {
            question.answers.forEach((answer, index) => {
                answerButtons[index].textContent = answer;
                answerButtons[index].disabled = false;
                answerButtons[index].className = 'answer-btn';
                answerButtons[index].onclick = () => this.submitMultiplayerAnswer(index, question.correct);
            });
        }

        // Start question timer
        this.startQuestionTimer();
    }

    submitMultiplayerAnswer(selectedIndex, correctIndex) {
        const isCorrect = selectedIndex === correctIndex;
        const answerTime = Date.now() - this.questionStartTime;

        // Calculate points based on speed and correctness
        let points = 0;
        if (isCorrect) {
            const basePoints = 100;
            const timeBonus = Math.max(0, this.gameState.room.settings.timePerQuestion - (answerTime / 1000));
            points = Math.floor(basePoints + (timeBonus * 10));
        }

        // Update player score
        const currentPlayer = this.gameState.players.find(p => p.id === this.playerData.id);
        if (currentPlayer) {
            currentPlayer.score += points;
            currentPlayer.answers.push({
                questionIndex: this.gameState.currentQuestion,
                selectedIndex,
                isCorrect,
                points,
                answerTime
            });
        }

        // Show answer feedback
        this.showMultiplayerAnswerFeedback(selectedIndex, correctIndex, points);

        // Simulate other players' answers
        this.simulateOtherPlayerAnswers(correctIndex);

        // Move to next question or end game
        setTimeout(() => {
            this.gameState.currentQuestion++;
            if (this.gameState.currentQuestion >= this.gameState.room.settings.questionCount) {
                this.endMultiplayerGame();
            } else {
                this.loadMultiplayerQuestion();
            }
        }, 3000);
    }

    simulateOtherPlayerAnswers(correctIndex) {
        // Simulate AI/bot players answering
        this.gameState.players.forEach(player => {
            if (player.id !== this.playerData.id) {
                const answerChance = Math.random();
                const isCorrect = answerChance > 0.3; // 70% chance for bots to be correct
                const selectedIndex = isCorrect ? correctIndex : Math.floor(Math.random() * 4);
                const answerTime = 2000 + (Math.random() * 8000); // Random answer time

                let points = 0;
                if (isCorrect) {
                    const basePoints = 100;
                    const timeBonus = Math.max(0, this.gameState.room.settings.timePerQuestion - (answerTime / 1000));
                    points = Math.floor(basePoints + (timeBonus * 10));
                }

                player.score += points;
                player.answers.push({
                    questionIndex: this.gameState.currentQuestion,
                    selectedIndex,
                    isCorrect,
                    points,
                    answerTime
                });
            }
        });

        this.updateMultiplayerScores();
    }

    updateMultiplayerScores() {
        const playersScores = document.querySelector('.players-scores');
        if (playersScores) {
            playersScores.innerHTML = this.gameState.players.map(player => `
                <div class="player-score ${player.id === this.playerData.id ? 'current-player' : ''}">
                    <span class="player-avatar">${player.avatar}</span>
                    <span class="player-name">${player.name}</span>
                    <span class="player-points">${player.score}</span>
                </div>
            `).join('');
        }
    }

    endMultiplayerGame() {
        this.isInGame = false;

        // Sort players by score
        const finalResults = [...this.gameState.players].sort((a, b) => b.score - a.score);
        const currentPlayerRank = finalResults.findIndex(p => p.id === this.playerData.id) + 1;

        // Update statistics
        this.updateMultiplayerStats(currentPlayerRank, finalResults.length);

        // Show results
        this.showMultiplayerResults(finalResults, currentPlayerRank);

        // Clean up UI
        const gameUI = document.querySelector('.multiplayer-game-ui');
        if (gameUI) gameUI.remove();
    }

    updateMultiplayerStats(rank, totalPlayers) {
        this.multiplayerStats.gamesPlayed++;
        this.multiplayerStats.totalScore += this.gameState.players.find(p => p.id === this.playerData.id).score;

        if (rank === 1) {
            this.multiplayerStats.gamesWon++;
            this.multiplayerStats.currentStreak++;
            this.multiplayerStats.winStreak = Math.max(this.multiplayerStats.winStreak, this.multiplayerStats.currentStreak);
        } else {
            this.multiplayerStats.currentStreak = 0;
        }

        if (this.multiplayerStats.bestRank === 0 || rank < this.multiplayerStats.bestRank) {
            this.multiplayerStats.bestRank = rank;
        }

        this.multiplayerStats.averageRank = this.multiplayerStats.gamesPlayed > 0 ?
            ((this.multiplayerStats.averageRank * (this.multiplayerStats.gamesPlayed - 1)) + rank) / this.multiplayerStats.gamesPlayed : rank;

        this.saveMultiplayerData();

        // Trigger achievement check
        if (window.achievementsSystem) {
            const stats = window.statisticsManager?.getStats() || {};
            stats.multiplayerWins = this.multiplayerStats.gamesWon;
            stats.multiplayerGames = this.multiplayerStats.gamesPlayed;
            window.achievementsSystem.checkAchievements(stats);
        }
    }

    showMultiplayerResults(results, playerRank) {
        const modal = document.createElement('div');
        modal.className = 'multiplayer-results-modal';

        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="results-header">
                    <h2>Game Complete!</h2>
                    <div class="player-rank">
                        <div class="rank-number">#${playerRank}</div>
                        <div class="rank-text">${this.getRankText(playerRank)}</div>
                    </div>
                </div>

                <div class="final-standings">
                    <h3>Final Standings</h3>
                    <div class="standings-list">
                        ${results.map((player, index) => `
                            <div class="standing-item ${player.id === this.playerData.id ? 'current-player' : ''} rank-${index + 1}">
                                <div class="standing-rank">${index + 1}</div>
                                <div class="standing-player">
                                    <span class="player-avatar">${player.avatar}</span>
                                    <span class="player-name">${player.name}</span>
                                </div>
                                <div class="standing-score">${player.score}</div>
                                <div class="standing-accuracy">
                                    ${Math.round((player.answers.filter(a => a.isCorrect).length / player.answers.length) * 100)}%
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="results-actions">
                    <button class="btn-secondary">Return to Lobby</button>
                    <button class="btn-primary">Play Again</button>
                    <button class="btn-accent">Share Results</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup result actions
        modal.querySelector('.btn-secondary').onclick = () => {
            modal.remove();
            // Return to main multiplayer screen
        };

        modal.querySelector('.btn-primary').onclick = () => {
            modal.remove();
            this.startQuickMatch();
        };

        modal.querySelector('.btn-accent').onclick = () => {
            if (window.socialSharingSystem) {
                window.socialSharingSystem.shareScore({
                    score: results.find(p => p.id === this.playerData.id).score,
                    rank: playerRank,
                    totalPlayers: results.length,
                    gameMode: 'multiplayer'
                });
            }
        };
    }

    getRankText(rank) {
        switch (rank) {
            case 1: return 'Victory!';
            case 2: return 'Great Job!';
            case 3: return 'Well Played!';
            default: return 'Good Effort!';
        }
    }

    // Utility methods
    generateRoomCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    generateDemoRooms() {
        // Create some demo rooms for the UI
        this.rooms = [
            {
                id: 'demo1',
                name: 'Science Quiz',
                host: 'ScienceFan',
                players: 2,
                maxPlayers: 4,
                category: 'science'
            },
            {
                id: 'demo2',
                name: 'History Battle',
                host: 'HistoryBuff',
                players: 3,
                maxPlayers: 4,
                category: 'history'
            }
        ];
    }

    allPlayersReady(room) {
        return room.players.every(player => player.ready);
    }

    // Export multiplayer data
    exportMultiplayerData() {
        return {
            stats: this.multiplayerStats,
            profile: this.playerData
        };
    }

    // Import multiplayer data
    importMultiplayerData(data) {
        if (data.stats) {
            this.multiplayerStats = { ...this.multiplayerStats, ...data.stats };
        }
        if (data.profile) {
            this.playerData = { ...this.playerData, ...data.profile };
        }
        this.saveMultiplayerData();
        this.updatePlayerProfile();
    }

    updatePlayerProfile() {
        const profileElement = document.querySelector('.player-profile');
        if (profileElement) {
            profileElement.querySelector('.player-avatar').textContent = this.playerData.avatar;
            profileElement.querySelector('.player-name').textContent = this.playerData.name;
            profileElement.querySelector('.player-level').textContent = `Level ${this.playerData.level}`;
        }
    }
}

// Global multiplayer manager
window.multiplayerManager = new MultiplayerManager();

// Auto-connect on load (in a real app, this might be conditional)
setTimeout(() => {
    window.multiplayerManager.connect().catch(console.error);
}, 1000);