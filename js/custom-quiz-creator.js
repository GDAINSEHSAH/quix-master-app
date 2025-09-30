// Custom Quiz Creator - Allow users to create and share their own quizzes
class CustomQuizCreator {
    constructor() {
        this.currentQuiz = null;
        this.savedQuizzes = [];
        this.sharedQuizzes = [];
        this.templates = {
            multiple_choice: {
                name: 'Multiple Choice',
                icon: '📝',
                description: 'Traditional 4-option multiple choice questions',
                structure: {
                    question: '',
                    answers: ['', '', '', ''],
                    correct: 0,
                    explanation: '',
                    difficulty: 'medium',
                    category: 'general',
                    timeLimit: 15
                }
            },
            true_false: {
                name: 'True/False',
                icon: '✅',
                description: 'Simple true or false questions',
                structure: {
                    question: '',
                    answers: ['True', 'False'],
                    correct: 0,
                    explanation: '',
                    difficulty: 'easy',
                    category: 'general',
                    timeLimit: 10
                }
            },
            fill_blank: {
                name: 'Fill in the Blank',
                icon: '📄',
                description: 'Questions with missing words to complete',
                structure: {
                    question: '',
                    answers: ['', '', '', ''],
                    correct: 0,
                    explanation: '',
                    difficulty: 'medium',
                    category: 'general',
                    timeLimit: 20
                }
            },
            image_based: {
                name: 'Image-Based',
                icon: '🖼️',
                description: 'Questions with images as prompts',
                structure: {
                    question: '',
                    image: '',
                    answers: ['', '', '', ''],
                    correct: 0,
                    explanation: '',
                    difficulty: 'medium',
                    category: 'general',
                    timeLimit: 20
                }
            }
        };

        this.categories = [
            { id: 'science', name: 'Science & Technology', icon: '🔬' },
            { id: 'history', name: 'History & Geography', icon: '🏛️' },
            { id: 'sports', name: 'Sports & Entertainment', icon: '⚽' },
            { id: 'literature', name: 'Literature & Arts', icon: '📚' },
            { id: 'general', name: 'General Knowledge', icon: '🧠' },
            { id: 'custom', name: 'Custom Category', icon: '✨' }
        ];

        this.difficultyLevels = [
            { id: 'easy', name: 'Easy', color: '#28a745', description: 'Basic knowledge questions' },
            { id: 'medium', name: 'Medium', color: '#ffc107', description: 'Moderate difficulty questions' },
            { id: 'hard', name: 'Hard', color: '#dc3545', description: 'Challenging questions' },
            { id: 'expert', name: 'Expert', color: '#6f42c1', description: 'Expert level questions' }
        ];

        this.loadCustomQuizzes();
        this.initializeCreatorUI();
    }

    loadCustomQuizzes() {
        const saved = localStorage.getItem('quiz-custom-quizzes');
        if (saved) {
            this.savedQuizzes = JSON.parse(saved);
        }

        const shared = localStorage.getItem('quiz-shared-quizzes');
        if (shared) {
            this.sharedQuizzes = JSON.parse(shared);
        }
    }

    saveCustomQuizzes() {
        localStorage.setItem('quiz-custom-quizzes', JSON.stringify(this.savedQuizzes));
        localStorage.setItem('quiz-shared-quizzes', JSON.stringify(this.sharedQuizzes));
    }

    initializeCreatorUI() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.create-new-quiz-btn')) {
                this.showQuizCreator();
            } else if (e.target.closest('.edit-quiz-btn')) {
                const quizId = e.target.closest('.quiz-item').getAttribute('data-quiz-id');
                this.editQuiz(quizId);
            } else if (e.target.closest('.delete-quiz-btn')) {
                const quizId = e.target.closest('.quiz-item').getAttribute('data-quiz-id');
                this.deleteQuiz(quizId);
            } else if (e.target.closest('.share-quiz-btn')) {
                const quizId = e.target.closest('.quiz-item').getAttribute('data-quiz-id');
                this.shareQuiz(quizId);
            } else if (e.target.closest('.import-quiz-btn')) {
                this.showImportDialog();
            }
        });
    }

    showQuizCreator() {
        const modal = document.createElement('div');
        modal.className = 'quiz-creator-modal';

        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content quiz-creator">
                <div class="creator-header">
                    <h2>Create Custom Quiz</h2>
                    <button class="close-creator">&times;</button>
                </div>

                <div class="creator-body">
                    <div class="quiz-metadata">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Quiz Title</label>
                                <input type="text" id="quiz-title" placeholder="Enter quiz title">
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea id="quiz-description" placeholder="Brief description of your quiz"></textarea>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Category</label>
                                <select id="quiz-category">
                                    ${this.categories.map(cat =>
                                        `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Default Difficulty</label>
                                <select id="quiz-difficulty">
                                    ${this.difficultyLevels.map(diff =>
                                        `<option value="${diff.id}">${diff.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Time per Question (seconds)</label>
                                <input type="number" id="quiz-time-limit" value="15" min="5" max="60">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Tags (comma-separated)</label>
                                <input type="text" id="quiz-tags" placeholder="education, fun, challenging">
                            </div>
                            <div class="form-group">
                                <label>Visibility</label>
                                <select id="quiz-visibility">
                                    <option value="private">Private</option>
                                    <option value="public">Public</option>
                                    <option value="friends">Friends Only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="questions-section">
                        <div class="questions-header">
                            <h3>Questions</h3>
                            <div class="question-templates">
                                ${Object.entries(this.templates).map(([type, template]) => `
                                    <button class="template-btn" data-template="${type}">
                                        <span class="template-icon">${template.icon}</span>
                                        <span class="template-name">${template.name}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="questions-list" id="questions-list">
                            <div class="no-questions">
                                <p>No questions yet. Click a template above to add your first question!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="creator-footer">
                    <button class="btn-secondary preview-quiz-btn">Preview Quiz</button>
                    <button class="btn-primary save-quiz-btn">Save Quiz</button>
                    <button class="btn-accent publish-quiz-btn">Save & Publish</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        this.setupCreatorEvents(modal);
    }

    setupCreatorEvents(modal) {
        // Close creator
        modal.querySelector('.close-creator').onclick = () => modal.remove();
        modal.querySelector('.modal-overlay').onclick = () => modal.remove();

        // Template buttons
        modal.querySelectorAll('.template-btn').forEach(btn => {
            btn.onclick = () => {
                const templateType = btn.getAttribute('data-template');
                this.addQuestion(templateType, modal);
            };
        });

        // Save buttons
        modal.querySelector('.save-quiz-btn').onclick = () => {
            this.saveQuiz(modal, false);
        };

        modal.querySelector('.publish-quiz-btn').onclick = () => {
            this.saveQuiz(modal, true);
        };

        modal.querySelector('.preview-quiz-btn').onclick = () => {
            this.previewQuiz(modal);
        };
    }

    addQuestion(templateType, modal) {
        const template = this.templates[templateType];
        const questionsList = modal.querySelector('#questions-list');
        const noQuestions = questionsList.querySelector('.no-questions');

        if (noQuestions) {
            noQuestions.remove();
        }

        const questionElement = document.createElement('div');
        questionElement.className = 'question-editor';
        const questionId = 'q_' + Date.now();

        questionElement.innerHTML = `
            <div class="question-header">
                <div class="question-info">
                    <span class="question-type">${template.icon} ${template.name}</span>
                    <span class="question-number">Question ${questionsList.children.length + 1}</span>
                </div>
                <div class="question-actions">
                    <button class="duplicate-question-btn" title="Duplicate">📋</button>
                    <button class="delete-question-btn" title="Delete">🗑️</button>
                </div>
            </div>

            <div class="question-body">
                <div class="form-group">
                    <label>Question</label>
                    <textarea class="question-text" placeholder="Enter your question here..."></textarea>
                </div>

                ${templateType === 'image_based' ? `
                    <div class="form-group">
                        <label>Image URL (optional)</label>
                        <input type="url" class="question-image" placeholder="https://example.com/image.jpg">
                        <div class="image-preview" style="display: none;">
                            <img src="" alt="Question image">
                        </div>
                    </div>
                ` : ''}

                <div class="answers-section">
                    <label>Answer Options</label>
                    <div class="answers-list">
                        ${template.structure.answers.map((answer, index) => `
                            <div class="answer-option">
                                <div class="answer-input-group">
                                    <input type="radio" name="correct_${questionId}" value="${index}" ${index === 0 ? 'checked' : ''}>
                                    <input type="text" class="answer-text" placeholder="Answer option ${index + 1}" value="${answer}">
                                    ${templateType !== 'true_false' ? `<button class="remove-answer-btn" style="display: none;">×</button>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ${templateType === 'multiple_choice' ? `
                        <button class="add-answer-btn">+ Add Answer Option</button>
                    ` : ''}
                </div>

                <div class="question-settings">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Difficulty</label>
                            <select class="question-difficulty">
                                ${this.difficultyLevels.map(diff =>
                                    `<option value="${diff.id}" ${diff.id === template.structure.difficulty ? 'selected' : ''}>${diff.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Time Limit (seconds)</label>
                            <input type="number" class="question-time-limit" value="${template.structure.timeLimit}" min="5" max="60">
                        </div>
                        <div class="form-group">
                            <label>Points</label>
                            <input type="number" class="question-points" value="10" min="1" max="100">
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Explanation (optional)</label>
                    <textarea class="question-explanation" placeholder="Explain why this is the correct answer..."></textarea>
                </div>
            </div>
        `;

        questionsList.appendChild(questionElement);

        this.setupQuestionEvents(questionElement, templateType);
        this.updateQuestionNumbers(modal);
    }

    setupQuestionEvents(questionElement, templateType) {
        // Delete question
        questionElement.querySelector('.delete-question-btn').onclick = () => {
            questionElement.remove();
            this.updateQuestionNumbers(questionElement.closest('.quiz-creator'));
        };

        // Duplicate question
        questionElement.querySelector('.duplicate-question-btn').onclick = () => {
            const clone = questionElement.cloneNode(true);
            questionElement.parentNode.insertBefore(clone, questionElement.nextSibling);
            this.setupQuestionEvents(clone, templateType);
            this.updateQuestionNumbers(questionElement.closest('.quiz-creator'));
        };

        // Add answer option (for multiple choice)
        const addAnswerBtn = questionElement.querySelector('.add-answer-btn');
        if (addAnswerBtn) {
            addAnswerBtn.onclick = () => {
                const answersList = questionElement.querySelector('.answers-list');
                const answerCount = answersList.children.length;
                const questionId = 'q_' + Date.now();

                const answerOption = document.createElement('div');
                answerOption.className = 'answer-option';
                answerOption.innerHTML = `
                    <div class="answer-input-group">
                        <input type="radio" name="correct_${questionId}" value="${answerCount}">
                        <input type="text" class="answer-text" placeholder="Answer option ${answerCount + 1}">
                        <button class="remove-answer-btn">×</button>
                    </div>
                `;

                answersList.appendChild(answerOption);

                // Setup remove button
                answerOption.querySelector('.remove-answer-btn').onclick = () => {
                    answerOption.remove();
                    this.updateAnswerNumbers(questionElement);
                };

                this.updateRemoveButtons(questionElement);
            };
        }

        // Image preview
        const imageInput = questionElement.querySelector('.question-image');
        if (imageInput) {
            imageInput.onchange = () => {
                const preview = questionElement.querySelector('.image-preview');
                const img = preview.querySelector('img');

                if (imageInput.value) {
                    img.src = imageInput.value;
                    preview.style.display = 'block';
                } else {
                    preview.style.display = 'none';
                }
            };
        }

        // Remove answer buttons
        questionElement.querySelectorAll('.remove-answer-btn').forEach(btn => {
            btn.onclick = () => {
                btn.closest('.answer-option').remove();
                this.updateAnswerNumbers(questionElement);
            };
        });

        this.updateRemoveButtons(questionElement);
    }

    updateQuestionNumbers(modal) {
        const questions = modal.querySelectorAll('.question-editor');
        questions.forEach((question, index) => {
            const numberElement = question.querySelector('.question-number');
            if (numberElement) {
                numberElement.textContent = `Question ${index + 1}`;
            }
        });
    }

    updateAnswerNumbers(questionElement) {
        const answers = questionElement.querySelectorAll('.answer-option');
        answers.forEach((answer, index) => {
            const input = answer.querySelector('.answer-text');
            input.placeholder = `Answer option ${index + 1}`;
        });
    }

    updateRemoveButtons(questionElement) {
        const removeButtons = questionElement.querySelectorAll('.remove-answer-btn');
        const answerCount = questionElement.querySelectorAll('.answer-option').length;

        removeButtons.forEach(btn => {
            btn.style.display = answerCount > 2 ? 'block' : 'none';
        });
    }

    saveQuiz(modal, publish = false) {
        const quizData = this.extractQuizData(modal);

        if (!this.validateQuiz(quizData)) {
            return;
        }

        quizData.id = quizData.id || 'quiz_' + Date.now();
        quizData.createdAt = quizData.createdAt || new Date().toISOString();
        quizData.updatedAt = new Date().toISOString();
        quizData.published = publish;
        quizData.author = localStorage.getItem('quiz-player-name') || 'Anonymous';
        quizData.plays = quizData.plays || 0;
        quizData.ratings = quizData.ratings || [];

        // Save to local storage
        const existingIndex = this.savedQuizzes.findIndex(q => q.id === quizData.id);
        if (existingIndex >= 0) {
            this.savedQuizzes[existingIndex] = quizData;
        } else {
            this.savedQuizzes.push(quizData);
        }

        if (publish) {
            this.publishQuiz(quizData);
        }

        this.saveCustomQuizzes();
        this.showToast(publish ? 'Quiz published successfully!' : 'Quiz saved successfully!');
        modal.remove();

        // Refresh quiz list if visible
        this.refreshQuizList();
    }

    extractQuizData(modal) {
        const questions = [];

        modal.querySelectorAll('.question-editor').forEach(questionEl => {
            const question = {
                question: questionEl.querySelector('.question-text').value,
                answers: [],
                correct: 0,
                explanation: questionEl.querySelector('.question-explanation').value,
                difficulty: questionEl.querySelector('.question-difficulty').value,
                timeLimit: parseInt(questionEl.querySelector('.question-time-limit').value),
                points: parseInt(questionEl.querySelector('.question-points').value),
                image: questionEl.querySelector('.question-image')?.value || null
            };

            // Extract answers
            questionEl.querySelectorAll('.answer-text').forEach(answerEl => {
                question.answers.push(answerEl.value);
            });

            // Find correct answer
            const correctRadio = questionEl.querySelector('input[type="radio"]:checked');
            if (correctRadio) {
                question.correct = parseInt(correctRadio.value);
            }

            questions.push(question);
        });

        return {
            title: modal.querySelector('#quiz-title').value,
            description: modal.querySelector('#quiz-description').value,
            category: modal.querySelector('#quiz-category').value,
            difficulty: modal.querySelector('#quiz-difficulty').value,
            timeLimit: parseInt(modal.querySelector('#quiz-time-limit').value),
            tags: modal.querySelector('#quiz-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            visibility: modal.querySelector('#quiz-visibility').value,
            questions: questions
        };
    }

    validateQuiz(quizData) {
        if (!quizData.title.trim()) {
            this.showToast('Please enter a quiz title', 'error');
            return false;
        }

        if (quizData.questions.length === 0) {
            this.showToast('Please add at least one question', 'error');
            return false;
        }

        for (let i = 0; i < quizData.questions.length; i++) {
            const question = quizData.questions[i];

            if (!question.question.trim()) {
                this.showToast(`Question ${i + 1} is empty`, 'error');
                return false;
            }

            if (question.answers.some(answer => !answer.trim())) {
                this.showToast(`Question ${i + 1} has empty answer options`, 'error');
                return false;
            }

            if (question.answers.length < 2) {
                this.showToast(`Question ${i + 1} needs at least 2 answer options`, 'error');
                return false;
            }
        }

        return true;
    }

    publishQuiz(quizData) {
        // Add to shared quizzes (in a real app, this would be sent to a server)
        this.sharedQuizzes.push({
            ...quizData,
            published: true,
            publishedAt: new Date().toISOString()
        });
    }

    previewQuiz(modal) {
        const quizData = this.extractQuizData(modal);

        if (!this.validateQuiz(quizData)) {
            return;
        }

        // Create preview modal
        const previewModal = document.createElement('div');
        previewModal.className = 'quiz-preview-modal';

        previewModal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content quiz-preview">
                <div class="preview-header">
                    <h2>Quiz Preview: ${quizData.title}</h2>
                    <button class="close-preview">&times;</button>
                </div>

                <div class="preview-body">
                    <div class="quiz-info">
                        <div class="info-item">
                            <span class="info-label">Category:</span>
                            <span class="info-value">${this.categories.find(c => c.id === quizData.category)?.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Questions:</span>
                            <span class="info-value">${quizData.questions.length}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Difficulty:</span>
                            <span class="info-value">${this.difficultyLevels.find(d => d.id === quizData.difficulty)?.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Time per Question:</span>
                            <span class="info-value">${quizData.timeLimit}s</span>
                        </div>
                    </div>

                    <div class="questions-preview">
                        ${quizData.questions.map((question, index) => `
                            <div class="preview-question">
                                <div class="question-header">
                                    <span class="question-number">Q${index + 1}</span>
                                    <span class="question-difficulty ${question.difficulty}">${question.difficulty}</span>
                                </div>
                                <div class="question-text">${question.question}</div>
                                ${question.image ? `<div class="question-image"><img src="${question.image}" alt="Question image"></div>` : ''}
                                <div class="answer-options">
                                    ${question.answers.map((answer, answerIndex) => `
                                        <div class="answer-option ${answerIndex === question.correct ? 'correct' : ''}">
                                            <span class="answer-label">${String.fromCharCode(65 + answerIndex)}.</span>
                                            <span class="answer-text">${answer}</span>
                                            ${answerIndex === question.correct ? '<span class="correct-indicator">✓</span>' : ''}
                                        </div>
                                    `).join('')}
                                </div>
                                ${question.explanation ? `
                                    <div class="question-explanation">
                                        <strong>Explanation:</strong> ${question.explanation}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="preview-footer">
                    <button class="btn-secondary">Back to Editor</button>
                    <button class="btn-primary test-quiz-btn">Test Quiz</button>
                </div>
            </div>
        `;

        document.body.appendChild(previewModal);

        // Setup preview events
        previewModal.querySelector('.close-preview').onclick = () => previewModal.remove();
        previewModal.querySelector('.modal-overlay').onclick = () => previewModal.remove();
        previewModal.querySelector('.btn-secondary').onclick = () => previewModal.remove();

        previewModal.querySelector('.test-quiz-btn').onclick = () => {
            previewModal.remove();
            this.testQuiz(quizData);
        };
    }

    testQuiz(quizData) {
        // Start the quiz in test mode
        if (window.gameLogic) {
            window.gameLogic.startCustomQuiz(quizData);
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : '#28a745'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 3000;
            animation: toastSlideIn 3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }

    refreshQuizList() {
        const quizList = document.querySelector('.custom-quizzes-list');
        if (quizList) {
            this.renderQuizList(quizList);
        }
    }

    renderQuizList(container) {
        container.innerHTML = this.savedQuizzes.map(quiz => `
            <div class="quiz-item" data-quiz-id="${quiz.id}">
                <div class="quiz-header">
                    <h4 class="quiz-title">${quiz.title}</h4>
                    <div class="quiz-status ${quiz.published ? 'published' : 'draft'}">
                        ${quiz.published ? '🌐 Published' : '📝 Draft'}
                    </div>
                </div>

                <div class="quiz-meta">
                    <span class="quiz-category">${this.categories.find(c => c.id === quiz.category)?.icon} ${quiz.category}</span>
                    <span class="quiz-questions">${quiz.questions.length} questions</span>
                    <span class="quiz-difficulty ${quiz.difficulty}">${quiz.difficulty}</span>
                </div>

                <p class="quiz-description">${quiz.description || 'No description'}</p>

                <div class="quiz-actions">
                    <button class="btn-sm btn-primary play-quiz-btn">Play</button>
                    <button class="btn-sm btn-secondary edit-quiz-btn">Edit</button>
                    <button class="btn-sm btn-accent share-quiz-btn">Share</button>
                    <button class="btn-sm btn-danger delete-quiz-btn">Delete</button>
                </div>

                <div class="quiz-stats">
                    <span>Created: ${new Date(quiz.createdAt).toLocaleDateString()}</span>
                    <span>Plays: ${quiz.plays}</span>
                </div>
            </div>
        `).join('');
    }

    // Export quiz data
    exportQuiz(quizId) {
        const quiz = this.savedQuizzes.find(q => q.id === quizId);
        if (!quiz) return null;

        return {
            version: '1.0',
            quiz: quiz,
            exportedAt: new Date().toISOString(),
            exportedBy: localStorage.getItem('quiz-player-name') || 'Anonymous'
        };
    }

    // Import quiz data
    importQuiz(data) {
        if (!data.quiz || !data.quiz.title) {
            this.showToast('Invalid quiz data', 'error');
            return false;
        }

        const importedQuiz = {
            ...data.quiz,
            id: 'quiz_' + Date.now(),
            imported: true,
            importedAt: new Date().toISOString(),
            originalAuthor: data.quiz.author
        };

        this.savedQuizzes.push(importedQuiz);
        this.saveCustomQuizzes();
        this.showToast('Quiz imported successfully!');
        this.refreshQuizList();
        return true;
    }

    // Get custom quiz statistics
    getCreatorStats() {
        return {
            totalQuizzes: this.savedQuizzes.length,
            publishedQuizzes: this.savedQuizzes.filter(q => q.published).length,
            totalQuestions: this.savedQuizzes.reduce((sum, q) => sum + q.questions.length, 0),
            totalPlays: this.savedQuizzes.reduce((sum, q) => sum + (q.plays || 0), 0),
            averageRating: this.calculateAverageRating(),
            categoriesCreated: [...new Set(this.savedQuizzes.map(q => q.category))].length
        };
    }

    calculateAverageRating() {
        const allRatings = this.savedQuizzes.flatMap(q => q.ratings || []);
        if (allRatings.length === 0) return 0;
        return allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
    }
}

// Global custom quiz creator
window.customQuizCreator = new CustomQuizCreator();

// Add CSS for quiz creator
const creatorStyles = document.createElement('style');
creatorStyles.textContent = `
    .quiz-creator-modal {
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

    .quiz-creator {
        max-width: 1000px;
        width: 95%;
        max-height: 90vh;
        overflow-y: auto;
    }

    .creator-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--bg-tertiary);
        margin-bottom: 1.5rem;
    }

    .quiz-metadata {
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: 10px;
        margin-bottom: 2rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        font-weight: 600;
        color: var(--text-primary);
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
        padding: 0.75rem;
        border: 1px solid var(--bg-tertiary);
        border-radius: 8px;
        background: var(--bg-card);
        color: var(--text-primary);
        font-family: inherit;
    }

    .question-templates {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }

    .template-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border: 2px solid var(--bg-tertiary);
        border-radius: 10px;
        background: var(--bg-card);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 100px;
    }

    .template-btn:hover {
        border-color: var(--accent-color);
        background: var(--bg-secondary);
    }

    .template-icon {
        font-size: 1.5rem;
    }

    .template-name {
        font-size: 0.8rem;
        font-weight: 600;
        text-align: center;
    }

    .question-editor {
        background: var(--bg-card);
        border: 1px solid var(--bg-tertiary);
        border-radius: 10px;
        margin-bottom: 1rem;
        overflow: hidden;
    }

    .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--bg-tertiary);
    }

    .question-info {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .question-type {
        font-weight: 600;
        color: var(--accent-color);
    }

    .question-number {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .question-actions {
        display: flex;
        gap: 0.5rem;
    }

    .question-actions button {
        padding: 0.5rem;
        border: none;
        border-radius: 5px;
        background: var(--bg-tertiary);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .question-actions button:hover {
        background: var(--accent-color);
        color: white;
    }

    .question-body {
        padding: 1.5rem;
    }

    .answers-section {
        margin: 1rem 0;
    }

    .answer-option {
        margin-bottom: 0.5rem;
    }

    .answer-input-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .answer-input-group input[type="text"] {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--bg-tertiary);
        border-radius: 5px;
        background: var(--bg-card);
        color: var(--text-primary);
    }

    .remove-answer-btn {
        padding: 0.25rem 0.5rem;
        border: none;
        border-radius: 3px;
        background: var(--error-color);
        color: white;
        cursor: pointer;
        font-weight: bold;
    }

    .add-answer-btn {
        padding: 0.5rem 1rem;
        border: 1px dashed var(--accent-color);
        border-radius: 5px;
        background: transparent;
        color: var(--accent-color);
        cursor: pointer;
        margin-top: 0.5rem;
        transition: all 0.3s ease;
    }

    .add-answer-btn:hover {
        background: var(--accent-color);
        color: white;
    }

    .creator-footer {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        padding-top: 1rem;
        border-top: 1px solid var(--bg-tertiary);
    }

    .quiz-preview {
        max-width: 800px;
        width: 95%;
        max-height: 90vh;
        overflow-y: auto;
    }

    .preview-question {
        background: var(--bg-secondary);
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 1rem;
    }

    .preview-question .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .question-difficulty {
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .question-difficulty.easy { background: #28a745; color: white; }
    .question-difficulty.medium { background: #ffc107; color: black; }
    .question-difficulty.hard { background: #dc3545; color: white; }
    .question-difficulty.expert { background: #6f42c1; color: white; }

    .answer-option.correct {
        background: rgba(40, 167, 69, 0.1);
        border-left: 3px solid #28a745;
        padding-left: 1rem;
    }

    .correct-indicator {
        color: #28a745;
        font-weight: bold;
        margin-left: 0.5rem;
    }

    @keyframes toastSlideIn {
        0% { transform: translateX(400px); opacity: 0; }
        10% { transform: translateX(0); opacity: 1; }
        90% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(400px); opacity: 0; }
    }

    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }

        .question-templates {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
        }

        .creator-footer {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(creatorStyles);