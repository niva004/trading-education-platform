// Mongolia Trading Education Platform - Main JavaScript

class TradingPlatform {
    constructor() {
        this.tasks = [];
        this.currentTask = null;
        this.userAnswers = {};
        this.init();
    }

    init() {
        this.loadSampleTasks();
        this.setupEventListeners();
        this.renderTasks();
        this.initAnimations();
    }

    // Sample tasks data
    loadSampleTasks() {
        this.tasks = [
            {
                id: 1,
                title: "Mongolia Trading - Podstawy",
                description: "Podstawowe zasady tradingu dla mongolskich traderów",
                videoUrl: "https://www.youtube.com/embed/GCMfE8CfIeY",
                category: "technical-analysis",
                difficulty: "beginner",
                questions: [
                    {
                        type: "multiple-choice",
                        question: "Co jest najważniejsze w tradingu?",
                        options: [
                            "Szybkie zyski",
                            "Dyscyplina i plan",
                            "Intuicja",
                            "Szczęście"
                        ],
                        correct: 1,
                        explanation: "Dyscyplina i plan tradingowy to fundamenty sukcesu w tradingu."
                    },
                    {
                        type: "multiple-choice",
                        question: "Jakie ryzyko zaleca się na jedną transakcję?",
                        options: [
                            "10% kapitału",
                            "5% kapitału",
                            "1-2% kapitału",
                            "20% kapitału"
                        ],
                        correct: 2,
                        explanation: "Profesjonalni traderzy zalecają ryzyko 1-2% kapitału na jedną transakcję."
                    }
                ]
            },
            {
                id: 2,
                title: "Formacja świecowa - Hammer",
                description: "Zidentyfikuj formację świecową Hammer i jej znaczenie",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                category: "technical-analysis",
                difficulty: "intermediate",
                questions: [
                    {
                        type: "multiple-choice",
                        question: "Co sygnalizuje formacja Hammer?",
                        options: [
                            "Kontynuację spadków",
                            "Możliwe odwrócenie trendu",
                            "Brak zmian",
                            "Silną wyprzedaż"
                        ],
                        correct: 1,
                        explanation: "Hammer jest formacją odwrócenia trendu, sygnalizującą potencjalne zakończenie spadków."
                    }
                ]
            },
            {
                id: 3,
                title: "Zarządzanie ryzykiem - Stop Loss",
                description: "Naucz się ustawiać odpowiedni poziom Stop Loss",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                category: "risk-management",
                difficulty: "beginner",
                questions: [
                    {
                        type: "multiple-choice",
                        question: "Jakie jest zalecane ryzyko na jedną transakcję?",
                        options: [
                            "1-2% kapitału",
                            "5-10% kapitału",
                            "20% kapitału",
                            "50% kapitału"
                        ],
                        correct: 0,
                        explanation: "Profesjonalni traderzy zalecają ryzyko na poziomie 1-2% kapitału na jedną transakcję."
                    }
                ]
            },
            {
                id: 4,
                title: "Psychologia tradingu - FOMO",
                description: "Jak radzić sobie z FOMO (Fear of Missing Out)",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                category: "psychology",
                difficulty: "advanced",
                questions: [
                    {
                        type: "multiple-choice",
                        question: "Jak przeciwdziałać FOMO?",
                        options: [
                            "Handlować częściej",
                            "Śledzić media społecznościowe",
                            "Stosować plan tradingowy",
                            "Używać większej dźwigni"
                        ],
                        correct: 2,
                        explanation: "Plan tradingowy pomaga podejmować racjonalne decyzje i unikać emocjonalnych reakcji."
                    }
                ]
            },
            {
                id: 5,
                title: "Analiza fundamentalna - GDP",
                description: "Jak wpływają dane makroekonomiczne na rynek",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                category: "fundamental-analysis",
                difficulty: "intermediate",
                questions: [
                    {
                        type: "multiple-choice",
                        question: "Jak wpływa wyższe niż oczekiwane GDP?",
                        options: [
                            "Osłabia walutę",
                            "Wzmacnia walutę",
                            "Nie ma wpływu",
                            "Zależy od sytuacji"
                        ],
                        correct: 1,
                        explanation: "Lepsze od oczekiwań dane o GDP wzmacniają walutę, świadcząc o dobrej kondycji gospodarki."
                    }
                ]
            },
            {
                id: 6,
                title: "Strategia Price Action",
                description: "Zastosowanie Price Action w tradingu",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                category: "technical-analysis",
                difficulty: "advanced",
                questions: [
                    {
                        type: "multiple-choice",
                        question: "Co jest najważniejsze w Price Action?",
                        options: [
                            "Wskaźniki techniczne",
                            "Cena i jej zachowanie",
                            "Wiadomości fundamentalne",
                            "Opinie analityków"
                        ],
                        correct: 1,
                        explanation: "Price Action koncentruje się na analizie samego zachowania ceny, bez użycia wskaźników."
                    }
                ]
            }
        ];
    }

    setupEventListeners() {
        // Hero button
        document.getElementById('hero-button').addEventListener('click', () => {
            document.querySelector('#tasks-container').scrollIntoView({ behavior: 'smooth' });
        });

        // Modal close buttons
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('close-admin-modal').addEventListener('click', () => {
            this.closeAdminModal();
        });

        // Admin panel
        document.getElementById('add-question').addEventListener('click', () => {
            this.addQuestionField();
        });

        // Submit answers
        document.getElementById('submit-answers').addEventListener('click', () => {
            this.checkAnswers();
        });

        // Admin form
        document.getElementById('admin-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (link.textContent.includes('Panel Admina')) {
                    this.openAdminModal();
                }
            });
        });

        // Close modal on outside click
        document.getElementById('task-modal').addEventListener('click', (e) => {
            if (e.target.id === 'task-modal') {
                this.closeModal();
            }
        });

        document.getElementById('admin-modal').addEventListener('click', (e) => {
            if (e.target.id === 'admin-modal') {
                this.closeAdminModal();
            }
        });
    }

    initAnimations() {
        // Hero animations
        anime.timeline()
            .add({
                targets: '#hero-title',
                opacity: [0, 1],
                translateY: [50, 0],
                duration: 1000,
                easing: 'easeOutExpo'
            })
            .add({
                targets: '#hero-subtitle',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                easing: 'easeOutExpo'
            }, '-=500')
            .add({
                targets: '#hero-button',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
                easing: 'easeOutExpo'
            }, '-=300');

        // Scroll animations
        this.initScrollAnimations();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe task cards when they are rendered
        setTimeout(() => {
            document.querySelectorAll('.task-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.6s ease';
                observer.observe(card);
            });
        }, 100);
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        container.innerHTML = '';

        this.tasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            container.appendChild(taskCard);
        });
    }

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card rounded-lg p-6 cursor-pointer';
        card.onclick = () => this.openTask(task);

        const categoryClass = `category-${task.category}`;
        const difficultyColor = {
            'beginner': 'text-green-400',
            'intermediate': 'text-yellow-400',
            'advanced': 'text-red-400'
        };

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <span class="category-badge ${categoryClass}">${this.getCategoryName(task.category)}</span>
                <span class="${difficultyColor[task.difficulty]} text-sm font-medium">${task.difficulty}</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">${task.title}</h3>
            <p class="text-gray-300 mb-4">${task.description}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-400">${task.questions.length} pytań</span>
                <button class="btn-primary px-4 py-2 rounded-md text-sm font-medium">
                    Rozpocznij
                </button>
            </div>
        `;

        return card;
    }

    getCategoryName(category) {
        const names = {
            'technical-analysis': 'Analiza Techniczna',
            'fundamental-analysis': 'Analiza Fundamentalna',
            'risk-management': 'Zarządzanie Ryzykiem',
            'psychology': 'Psychologia Tradingu'
        };
        return names[category] || category;
    }

    openTask(task) {
        this.currentTask = task;
        this.userAnswers = {};

        // Set modal content
        document.getElementById('modal-title').textContent = task.title;
        
        // Load video
        this.loadVideo(task.videoUrl);
        
        // Load questions
        this.loadQuestions(task.questions);
        
        // Show modal
        document.getElementById('task-modal').classList.remove('hidden');
        document.getElementById('task-modal').classList.add('modal-enter');
        
        // Hide results
        document.getElementById('results-section').classList.add('hidden');
    }

    loadVideo(videoUrl) {
        const container = document.getElementById('video-container');
        container.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="${videoUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }

    loadQuestions(questions) {
        const container = document.getElementById('question-section');
        container.innerHTML = '';

        // Show chart section for technical analysis tasks
        if (this.currentTask && this.currentTask.category === 'technical-analysis') {
            document.getElementById('chart-section').classList.remove('hidden');
            this.initChart();
        } else {
            document.getElementById('chart-section').classList.add('hidden');
        }

        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-multiple-choice';

            let optionsHTML = '';
            question.options.forEach((option, optIndex) => {
                optionsHTML += `
                    <div class="answer-option" data-question="${index}" data-answer="${optIndex}">
                        ${option}
                    </div>
                `;
            });

            questionDiv.innerHTML = `
                <h4 class="text-lg font-semibold text-white mb-4">
                    Pytanie ${index + 1}: ${question.question}
                </h4>
                <div class="space-y-2">
                    ${optionsHTML}
                </div>
            `;

            container.appendChild(questionDiv);
        });

        // Add click listeners to options
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', () => {
                const questionIndex = option.dataset.question;
                const answerIndex = option.dataset.answer;
                
                // Remove previous selection
                document.querySelectorAll(`[data-question="${questionIndex}"]`).forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selection to clicked option
                option.classList.add('selected');
                
                // Store answer
                this.userAnswers[questionIndex] = parseInt(answerIndex);
            });
        });
    }

    initChart() {
        // Initialize chart if ChartAnalysis is available
        if (typeof ChartAnalysis !== 'undefined') {
            const chartAnalysis = new ChartAnalysis('trading-chart');
            
            // Add some support/resistance levels for demonstration
            chartAnalysis.addSupportResistance([
                { name: 'Wsparcie 1', value: 1.1750, color: '#10b981' },
                { name: 'Opór 1', value: 1.1900, color: '#ef4444' },
                { name: 'Wsparcie 2', value: 1.1700, color: '#10b981' }
            ]);
            
            // Add drawing tools
            chartAnalysis.addDrawingTools();
        }
    }

    checkAnswers() {
        if (!this.currentTask) return;

        const results = [];
        let correctCount = 0;

        this.currentTask.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            if (isCorrect) correctCount++;

            results.push({
                question: question.question,
                userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Brak odpowiedzi',
                correctAnswer: question.options[question.correct],
                isCorrect: isCorrect,
                explanation: question.explanation
            });
        });

        this.showResults(results, correctCount, this.currentTask.questions.length);
    }

    showResults(results, correctCount, totalQuestions) {
        const container = document.getElementById('results-content');
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        let resultsHTML = `
            <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-lg font-semibold">Wynik: ${correctCount}/${totalQuestions}</span>
                    <span class="text-2xl font-bold text-yellow-400">${percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;

        results.forEach((result, index) => {
            resultsHTML += `
                <div class="mb-4 p-4 bg-gray-600 rounded-lg">
                    <h5 class="font-semibold mb-2">Pytanie ${index + 1}: ${result.question}</h5>
                    <div class="space-y-1 text-sm">
                        <p>Twoja odpowiedź: <span class="${result.isCorrect ? 'text-green-400' : 'text-red-400'}">${result.userAnswer}</span></p>
                        ${!result.isCorrect ? `<p>Poprawna odpowiedź: <span class="text-green-400">${result.correctAnswer}</span></p>` : ''}
                        <p class="text-gray-300 mt-2">${result.explanation}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML = resultsHTML;
        document.getElementById('results-section').classList.remove('hidden');

        // Animate progress bar
        setTimeout(() => {
            document.querySelector('.progress-fill').style.width = percentage + '%';
        }, 100);
    }

    closeModal() {
        document.getElementById('task-modal').classList.add('hidden');
        document.getElementById('video-container').innerHTML = '';
        this.currentTask = null;
        this.userAnswers = {};
    }

    openAdminModal() {
        document.getElementById('admin-modal').classList.remove('hidden');
        this.loadAdminQuestions();
    }

    closeAdminModal() {
        document.getElementById('admin-modal').classList.add('hidden');
        document.getElementById('admin-form').reset();
        document.getElementById('questions-list').innerHTML = '';
    }

    addQuestionField() {
        const container = document.getElementById('questions-list');
        const questionIndex = container.children.length;

        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Pytanie ${questionIndex + 1}</label>
                <input type="text" class="question-text w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-yellow-400">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Odpowiedź A</label>
                    <input type="text" class="option-a w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-yellow-400">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Odpowiedź B</label>
                    <input type="text" class="option-b w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-yellow-400">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Odpowiedź C</label>
                    <input type="text" class="option-c w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-yellow-400">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Odpowiedź D</label>
                    <input type="text" class="option-d w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-yellow-400">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Poprawna odpowiedź</label>
                <select class="correct-answer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-yellow-400">
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Wyjaśnienie</label>
                <textarea class="explanation w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-yellow-400" rows="2"></textarea>
            </div>
            <button type="button" class="remove-question bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors">
                Usuń pytanie
            </button>
        `;

        container.appendChild(questionDiv);

        // Add remove functionality
        questionDiv.querySelector('.remove-question').addEventListener('click', () => {
            questionDiv.remove();
            this.updateQuestionNumbers();
        });
    }

    updateQuestionNumbers() {
        const questions = document.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            const label = question.querySelector('label');
            label.textContent = `Pytanie ${index + 1}`;
        });
    }

    loadAdminQuestions() {
        // Load existing questions if editing
        // This is a placeholder for future functionality
    }

    saveTask() {
        const formData = {
            title: document.getElementById('task-title').value,
            videoUrl: document.getElementById('task-video').value,
            description: document.getElementById('task-description').value,
            category: document.getElementById('task-category').value,
            questions: []
        };

        // Collect questions
        document.querySelectorAll('.question-item').forEach(item => {
            const question = {
                type: 'multiple-choice',
                question: item.querySelector('.question-text').value,
                options: [
                    item.querySelector('.option-a').value,
                    item.querySelector('.option-b').value,
                    item.querySelector('.option-c').value,
                    item.querySelector('.option-d').value
                ],
                correct: parseInt(item.querySelector('.correct-answer').value),
                explanation: item.querySelector('.explanation').value
            };
            formData.questions.push(question);
        });

        // Validate form
        if (!formData.title || !formData.videoUrl || formData.questions.length === 0) {
            alert('Proszę wypełnić wszystkie wymagane pola');
            return;
        }

        // Add new task
        const newTask = {
            id: this.tasks.length + 1,
            title: formData.title,
            description: formData.description,
            videoUrl: formData.videoUrl,
            category: formData.category,
            difficulty: 'beginner', // Default difficulty
            questions: formData.questions
        };

        this.tasks.push(newTask);
        this.renderTasks();
        this.closeAdminModal();

        // Show success message
        this.showNotification('Zadanie zostało zapisane pomyślnie!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 p-4 rounded-lg text-white z-50 ${type === 'success' ? 'success-message' : 'error-message'}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TradingPlatform();
});