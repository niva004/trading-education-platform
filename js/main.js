// The Syndicate Trading Education Platform - Main JavaScript

class TradingPlatform {
    constructor() {
        this.tasks = [];
        this.currentTask = null;
        this.userAnswers = {};
        this.isLoggedIn = false;
        this.currentUser = null;
        this.userProgress = this.loadUserProgress();
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.setupEventListeners();
        this.loadSampleTasks();
        this.renderTasks();
        this.initAnimations();
    }

    checkLoginStatus() {
        const loggedIn = localStorage.getItem('syndicate_logged_in');
        const username = localStorage.getItem('syndicate_username');
        
        console.log('Checking login status:', { loggedIn, username });
        
        // Check URL parameters for login confirmation
        const urlParams = new URLSearchParams(window.location.search);
        const fromLogin = urlParams.get('v') === '1';
        
        if (loggedIn === 'true' && username) {
            this.isLoggedIn = true;
            this.currentUser = username;
            this.showUserInterface();
            console.log('User logged in, showing interface');
        } else if (fromLogin) {
            // User came from login but localStorage might not work in incognito
            // Redirect to login page to get proper credentials
            console.log('User came from login but localStorage not available, redirecting to login');
            window.location.href = 'login.html?v=1';
        } else {
            console.log('User not logged in, redirecting to welcome page');
            window.location.href = 'welcome.html?v=1';
        }
    }

    showUserInterface() {
        console.log('Showing user interface for:', this.currentUser);
        
        try {
            // Update navigation elements
            const userWelcome = document.getElementById('user-welcome');
            const usernameDisplay = document.getElementById('username-display');
            const loginBtn = document.getElementById('login-btn');
            const logoutBtn = document.getElementById('logout-btn');
            
            console.log('Navigation elements found:', {
                userWelcome: !!userWelcome,
                usernameDisplay: !!usernameDisplay,
                loginBtn: !!loginBtn,
                logoutBtn: !!logoutBtn
            });
            
            if (userWelcome) {
                userWelcome.classList.remove('hidden');
                console.log('User welcome shown');
            }
            if (usernameDisplay) {
                usernameDisplay.textContent = this.currentUser;
                console.log('Username set to:', this.currentUser);
            }
            if (loginBtn) {
                loginBtn.classList.add('hidden');
                console.log('Login button hidden');
            }
            if (logoutBtn) {
                logoutBtn.classList.remove('hidden');
                console.log('Logout button shown');
            }
            
            // Show tasks section only for logged in users
            const tasksSection = document.getElementById('tasks-section');
            if (tasksSection) {
                tasksSection.classList.remove('hidden');
                console.log('Tasks section shown:', !tasksSection.classList.contains('hidden'));
            } else {
                console.error('Tasks section not found!');
            }
            
            // Update navigation based on user role
            this.updateNavigationForUser();
            
            // Update hero button for logged in users
            const heroButtons = document.getElementById('hero-buttons');
            if (heroButtons) {
                heroButtons.innerHTML = `
                    <button class="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors" id="start-learning-btn">
                        Rozpocznij Naukę
                    </button>
                `;
                console.log('Hero buttons updated');
                
                // Add event listener for the new button
                const startBtn = document.getElementById('start-learning-btn');
                if (startBtn) {
                    startBtn.addEventListener('click', () => {
                        document.querySelector('#tasks-container').scrollIntoView({ behavior: 'smooth' });
                    });
                    console.log('Start learning button event listener added');
                }
            }
            
            // Re-render tasks to make them clickable
            this.renderTasks();
            console.log('Tasks re-rendered');
            
        } catch (error) {
            console.error('Error in showUserInterface:', error);
        }
    }

    updateNavigationForUser() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.textContent.includes('Panel Admina')) {
                // Show admin panel only for admin user
                if (this.currentUser === 'admin') {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
            } else if (link.textContent.includes('Moje postępy')) {
                // Show "My Progress" for all users except admin
                if (this.currentUser !== 'admin') {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
            }
        });
    }

    logout() {
        try {
            localStorage.removeItem('syndicate_logged_in');
            localStorage.removeItem('syndicate_username');
        } catch (error) {
            console.log('localStorage not available, continuing with logout');
        }
        this.isLoggedIn = false;
        this.currentUser = null;
        window.location.href = 'welcome.html?v=1';
    }

    // User progress management
    loadUserProgress() {
        try {
            const progress = localStorage.getItem('syndicate_user_progress');
            return progress ? JSON.parse(progress) : {};
        } catch (error) {
            console.log('Could not load user progress, starting fresh');
            return {};
        }
    }

    saveUserProgress() {
        try {
            localStorage.setItem('syndicate_user_progress', JSON.stringify(this.userProgress));
        } catch (error) {
            console.log('Could not save user progress');
        }
    }

    updateUserProgress(taskId, score, totalQuestions) {
        if (!this.currentUser) return;
        
        const userKey = this.currentUser;
        if (!this.userProgress[userKey]) {
            this.userProgress[userKey] = {};
        }
        
        this.userProgress[userKey][taskId] = {
            score: score,
            totalQuestions: totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            completedAt: new Date().toISOString(),
            attempts: (this.userProgress[userKey][taskId]?.attempts || 0) + 1
        };
        
        this.saveUserProgress();
        console.log(`Progress updated for ${userKey} on task ${taskId}: ${score}/${totalQuestions}`);
    }

    getUserProgress(user = null) {
        const targetUser = user || this.currentUser;
        return this.userProgress[targetUser] || {};
    }

    getAllUsersProgress() {
        return this.userProgress;
    }

    // Sample tasks data - different tasks for different users
    loadSampleTasks() {
        const allTasks = {
            admin: [
                {
                    id: 1,
                    title: "The Syndicate - Podstawy Tradingu",
                    description: "Elitarne podstawy tradingu dla członków The Syndicate",
                    videoUrl: "https://www.youtube.com/embed/SlWxhzhLo3A",
                    category: "technical-analysis",
                    difficulty: "beginner",
                    questions: [
                        {
                            type: "multiple-choice",
                            question: "Co jest najważniejsze w profesjonalnym tradingu?",
                            options: [
                                "Szybkie zyski",
                                "Dyscyplina i plan",
                                "Intuicja",
                                "Szczęście"
                            ],
                            correct: 1,
                            explanation: "Dyscyplina i plan tradingowy to fundamenty sukcesu w profesjonalnym tradingu."
                        },
                        {
                            type: "multiple-choice",
                            question: "Jakie ryzyko zaleca The Syndicate na jedną transakcję?",
                            options: [
                                "10% kapitału",
                                "5% kapitału",
                                "1-2% kapitału",
                                "20% kapitału"
                            ],
                            correct: 2,
                            explanation: "The Syndicate zaleca ryzyko 1-2% kapitału na jedną transakcję dla bezpieczeństwa."
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
                }
            ],
            user1: [
                {
                    id: 11,
                    title: "Analiza Techniczna - Poziomy Wsparcia i Oporu",
                    description: "Naucz się identyfikować kluczowe poziomy na wykresie",
                    videoUrl: "https://www.youtube.com/embed/GCMfE8CfIeY",
                    category: "technical-analysis",
                    difficulty: "beginner",
                    questions: [
                        {
                            type: "multiple-choice",
                            question: "Co to jest poziom wsparcia?",
                            options: [
                                "Miejsce gdzie cena spada",
                                "Miejsce gdzie cena znajduje opór przed spadkiem",
                                "Miejsce gdzie cena rośnie",
                                "Miejsce gdzie cena się zatrzymuje"
                            ],
                            correct: 1,
                            explanation: "Poziom wsparcia to miejsce gdzie cena znajduje opór przed dalszym spadkiem."
                        },
                        {
                            type: "multiple-choice",
                            question: "Jakie znaczenie ma przebicie poziomu oporu?",
                            options: [
                                "Sygnalizuje spadek ceny",
                                "Sygnalizuje możliwy wzrost ceny",
                                "Nie ma znaczenia",
                                "Oznacza konsolidację"
                            ],
                            correct: 1,
                            explanation: "Przebicie poziomu oporu często sygnalizuje możliwy wzrost ceny."
                        }
                    ]
                },
                {
                    id: 12,
                    title: "Zarządzanie Ryzykiem - Podstawy",
                    description: "Podstawowe zasady zarządzania ryzykiem w tradingu",
                    videoUrl: "https://www.youtube.com/embed/cS8942LZ5Uw",
                    category: "risk-management",
                    difficulty: "beginner",
                    questions: [
                        {
                            type: "multiple-choice",
                            question: "Jakie jest maksymalne ryzyko na jedną transakcję?",
                            options: [
                                "5% kapitału",
                                "2% kapitału",
                                "10% kapitału",
                                "1% kapitału"
                            ],
                            correct: 1,
                            explanation: "Zaleca się ryzyko nie większe niż 2% kapitału na jedną transakcję."
                        }
                    ]
                }
            ],
            user2: [
                {
                    id: 21,
                    title: "Świece Japońskie - Podstawy",
                    description: "Poznaj podstawowe formacje świec japońskich",
                    videoUrl: "https://www.youtube.com/embed/GCMfE8CfIeY",
                    category: "technical-analysis",
                    difficulty: "intermediate",
                    questions: [
                        {
                            type: "multiple-choice",
                            question: "Co oznacza długi górny cień świecy?",
                            options: [
                                "Silny wzrost",
                                "Odpór na górze",
                                "Silny spadek",
                                "Konsolidacja"
                            ],
                            correct: 1,
                            explanation: "Długi górny cień oznacza odpór na górze - cena próbowała wzrosnąć ale została odrzucona."
                        }
                    ]
                },
                {
                    id: 22,
                    title: "Psychologia Tradingu - Emocje",
                    description: "Jak kontrolować emocje podczas tradingu",
                    videoUrl: "https://www.youtube.com/embed/cS8942LZ5Uw",
                    category: "psychology",
                    difficulty: "intermediate",
                    questions: [
                        {
                            type: "multiple-choice",
                            question: "Która emocja jest najbardziej niebezpieczna w tradingu?",
                            options: [
                                "Radość",
                                "Chciwość",
                                "Strach",
                                "Złość"
                            ],
                            correct: 1,
                            explanation: "Chciwość prowadzi do podejmowania zbyt dużego ryzyka i ignorowania zasad."
                        }
                    ]
                }
            ],
            user3: [
                {
                    id: 31,
                    title: "Strategie Scalping",
                    description: "Podstawy strategii scalpingowych",
                    videoUrl: "https://www.youtube.com/embed/GCMfE8CfIeY",
                    category: "technical-analysis",
                    difficulty: "advanced",
                    questions: [
                        {
                            type: "multiple-choice",
                            question: "Jaki jest główny cel scalpinga?",
                            options: [
                                "Długoterminowe zyski",
                                "Krótkoterminowe małe zyski",
                                "Średnioterminowe zyski",
                                "Spekulacja"
                            ],
                            correct: 1,
                            explanation: "Scalping polega na osiąganiu wielu małych zysków w krótkim czasie."
                        }
                    ]
                },
                {
                    id: 32,
                    title: "Analiza Fundamentalna - Wskaźniki Ekonomiczne",
                    description: "Jak analizować wskaźniki makroekonomiczne",
                    videoUrl: "https://www.youtube.com/embed/cS8942LZ5Uw",
                    category: "fundamental-analysis",
                    difficulty: "advanced",
                    questions: [
                        {
                            type: "multiple-choice",
                            question: "Który wskaźnik ma największy wpływ na waluty?",
                            options: [
                                "CPI",
                                "Stopa procentowa",
                                "GDP",
                                "Bezrobocie"
                            ],
                            correct: 1,
                            explanation: "Stopa procentowa ma największy wpływ na wartość waluty."
                        }
                    ]
                }
            ]
        };

        // Get tasks for current user
        const currentUser = this.currentUser;
        
        if (!currentUser) {
            console.error('No current user set, cannot load tasks');
            this.tasks = [];
            return;
        }
        
        if (currentUser === 'admin') {
            // Admin sees all tasks from all users
            this.tasks = [];
            Object.values(allTasks).forEach(userTasks => {
                this.tasks = this.tasks.concat(userTasks);
            });
            console.log(`Admin loaded ${this.tasks.length} tasks from all users`);
        } else {
            // Regular users see only their tasks
            this.tasks = allTasks[currentUser] || [];
            console.log(`Loaded ${this.tasks.length} tasks for user: ${currentUser}`);
        }
    }

    setupEventListeners() {
        // Hero button - scroll to tasks if logged in
        const heroButtons = document.getElementById('hero-buttons');
        if (heroButtons) {
            heroButtons.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && e.target.href.includes('login.html')) {
                    return; // Let the link work normally
                }
                if (this.isLoggedIn) {
                    document.querySelector('#tasks-container').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

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

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (link.textContent.includes('Panel Admina') && this.currentUser === 'admin') {
                    this.openAdminModal();
                } else if (link.textContent.includes('Moje postępy')) {
                    this.showMyProgress();
                } else if (link.textContent.includes('Zadania')) {
                    // Scroll to tasks section
                    document.getElementById('tasks-section')?.scrollIntoView({ behavior: 'smooth' });
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
                targets: '#hero-buttons',
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
        if (!container) {
            console.error('Tasks container not found!');
            return;
        }
        
        container.innerHTML = '';

        this.tasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            container.appendChild(taskCard);
        });
        
        console.log(`Rendered ${this.tasks.length} tasks`);
        
        // Re-initialize scroll animations for new task cards
        setTimeout(() => {
            this.initScrollAnimations();
        }, 100);
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

        // Get user progress for this task
        let userProgress, taskProgress, progressText, userInfo = '';
        
        if (this.currentUser === 'admin') {
            // Admin sees progress for the original user of this task
            const originalUser = this.getTaskOriginalUser(task.id);
            userProgress = this.userProgress[originalUser] || {};
            taskProgress = userProgress[task.id];
            userInfo = `<div class="text-xs text-blue-400 mb-1">Użytkownik: ${originalUser}</div>`;
        } else {
            userProgress = this.getUserProgress();
            taskProgress = userProgress[task.id];
        }
        
        progressText = taskProgress ? 
            `Ukończone: ${taskProgress.score}/${taskProgress.totalQuestions} (${taskProgress.percentage}%)` : 
            'Nie rozpoczęte';

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <span class="category-badge ${categoryClass}">${this.getCategoryName(task.category)}</span>
                <span class="${difficultyColor[task.difficulty]} text-sm font-medium">${task.difficulty}</span>
            </div>
            ${userInfo}
            <h3 class="text-xl font-bold text-white mb-2">${task.title}</h3>
            <p class="text-gray-300 mb-4">${task.description}</p>
            <div class="mb-3">
                <div class="text-sm text-gray-400 mb-1">Postęp:</div>
                <div class="text-sm ${taskProgress ? 'text-green-400' : 'text-gray-500'}">${progressText}</div>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-400">${task.questions.length} pytań</span>
                <button class="btn-primary px-4 py-2 rounded-md text-sm font-medium">
                    ${taskProgress ? 'Powtórz' : 'Rozpocznij'}
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

    getTaskOriginalUser(taskId) {
        // Map task IDs to their original users
        const taskUserMap = {
            1: 'admin', 2: 'admin',
            11: 'user1', 12: 'user1',
            21: 'user2', 22: 'user2',
            31: 'user3', 32: 'user3'
        };
        return taskUserMap[taskId] || 'admin';
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
                
                // Update progress indicator
                this.updateProgressIndicator();
            });
        });
        
        // Initialize progress indicator
        this.updateProgressIndicator();
    }

    updateProgressIndicator() {
        if (!this.currentTask) return;
        
        const totalQuestions = this.currentTask.questions.length;
        const answeredQuestions = Object.keys(this.userAnswers).length;
        const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
        
        const progressCounter = document.getElementById('progress-counter');
        const progressBar = document.getElementById('progress-bar');
        const submitButton = document.getElementById('submit-answers');
        
        if (progressCounter) {
            progressCounter.textContent = `${answeredQuestions}/${totalQuestions}`;
        }
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        if (submitButton) {
            submitButton.disabled = answeredQuestions < totalQuestions;
            if (answeredQuestions === totalQuestions) {
                submitButton.classList.remove('disabled:bg-gray-500', 'disabled:cursor-not-allowed');
                submitButton.classList.add('bg-red-600', 'hover:bg-red-700');
            } else {
                submitButton.classList.add('disabled:bg-gray-500', 'disabled:cursor-not-allowed');
                submitButton.classList.remove('bg-red-600', 'hover:bg-red-700');
            }
        }
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

        // Check if all questions are answered
        const totalQuestions = this.currentTask.questions.length;
        const answeredQuestions = Object.keys(this.userAnswers).length;
        
        if (answeredQuestions < totalQuestions) {
            alert(`Odpowiedz na wszystkie pytania! Ukończono: ${answeredQuestions}/${totalQuestions}`);
            return;
        }

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

        // Update user progress
        if (this.currentTask) {
            this.updateUserProgress(this.currentTask.id, correctCount, totalQuestions);
        }

        let resultsHTML = `
            <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-lg font-semibold">Wynik: ${correctCount}/${totalQuestions}</span>
                    <span class="text-2xl font-bold text-yellow-400">${percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="mt-2 text-sm text-gray-400">
                    Postęp zapisany dla użytkownika: ${this.currentUser}
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

        // Add navigation buttons
        this.addNavigationButtons();

        // Animate progress bar
        setTimeout(() => {
            document.querySelector('.progress-fill').style.width = percentage + '%';
        }, 100);
    }

    addNavigationButtons() {
        const resultsSection = document.getElementById('results-section');
        
        // Remove existing buttons if any
        const existingButtons = document.getElementById('result-navigation-buttons');
        if (existingButtons) {
            existingButtons.remove();
        }

        // Create navigation buttons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.id = 'result-navigation-buttons';
        buttonsDiv.className = 'mt-6 flex gap-4 justify-center';

        // Get next task
        const currentIndex = this.tasks.findIndex(t => t.id === this.currentTask.id);
        const hasNextTask = currentIndex >= 0 && currentIndex < this.tasks.length - 1;

        buttonsDiv.innerHTML = `
            <button id="close-task-btn" class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Zamknij
            </button>
            ${hasNextTask ? `
                <button id="next-task-btn" class="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    Przejdź do następnego →
                </button>
            ` : ''}
        `;

        resultsSection.appendChild(buttonsDiv);

        // Add event listeners
        document.getElementById('close-task-btn').addEventListener('click', () => {
            this.closeModal();
        });

        if (hasNextTask) {
            document.getElementById('next-task-btn').addEventListener('click', () => {
                const nextTask = this.tasks[currentIndex + 1];
                this.closeModal();
                setTimeout(() => {
                    this.openTask(nextTask);
                }, 300);
            });
        }
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
        this.loadAdminProgress();
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

    loadAdminProgress() {
        // Add progress monitoring section to admin modal
        const adminModal = document.getElementById('admin-modal');
        const existingProgressSection = document.getElementById('admin-progress-section');
        
        if (existingProgressSection) {
            existingProgressSection.remove();
        }

        const progressSection = document.createElement('div');
        progressSection.id = 'admin-progress-section';
        progressSection.className = 'border-t border-gray-600 pt-6 mt-6';
        
        const allProgress = this.getAllUsersProgress();
        const allTasks = this.getAllTasksForAdmin();
        
        let progressHTML = `
            <h4 class="text-lg font-semibold text-yellow-400 mb-4">Postępy Użytkowników</h4>
            <div class="space-y-4 max-h-64 overflow-y-auto">
        `;

        Object.keys(allProgress).forEach(username => {
            const userProgress = allProgress[username];
            const userTasks = allTasks[username] || [];
            
            progressHTML += `
                <div class="bg-gray-700 p-4 rounded-lg">
                    <h5 class="font-semibold text-white mb-2">${username}</h5>
                    <div class="space-y-2">
            `;
            
            userTasks.forEach(task => {
                const taskProgress = userProgress[task.id];
                if (taskProgress) {
                    progressHTML += `
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-300">${task.title}</span>
                            <div class="flex items-center space-x-2">
                                <span class="text-green-400">${taskProgress.score}/${taskProgress.totalQuestions}</span>
                                <span class="text-yellow-400">(${taskProgress.percentage}%)</span>
                                <span class="text-gray-400 text-xs">${taskProgress.attempts} prób</span>
                            </div>
                        </div>
                    `;
                } else {
                    progressHTML += `
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-300">${task.title}</span>
                            <span class="text-gray-500">Nie rozpoczęte</span>
                        </div>
                    `;
                }
            });
            
            progressHTML += `
                    </div>
                </div>
            `;
        });

        progressHTML += `
            </div>
            <div class="mt-4 text-sm text-gray-400">
                Łącznie użytkowników: ${Object.keys(allProgress).length}
            </div>
        `;

        progressSection.innerHTML = progressHTML;
        adminModal.querySelector('.p-6').appendChild(progressSection);
    }

    getAllTasksForAdmin() {
        return {
            admin: [
                { id: 1, title: "The Syndicate - Podstawy Tradingu" },
                { id: 2, title: "Formacja świecowa - Hammer" }
            ],
            user1: [
                { id: 11, title: "Analiza Techniczna - Poziomy Wsparcia i Oporu" },
                { id: 12, title: "Zarządzanie Ryzykiem - Podstawy" }
            ],
            user2: [
                { id: 21, title: "Świece Japońskie - Podstawy" },
                { id: 22, title: "Psychologia Tradingu - Emocje" }
            ],
            user3: [
                { id: 31, title: "Strategie Scalping" },
                { id: 32, title: "Analiza Fundamentalna - Wskaźniki Ekonomiczne" }
            ]
        };
    }

    showMyProgress() {
        // Create progress modal
        const progressModal = document.createElement('div');
        progressModal.id = 'progress-modal';
        progressModal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        
        const userProgress = this.getUserProgress();
        const userTasks = this.tasks;
        
        let progressHTML = `
            <div class="bg-gray-800 rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-red-500">Moje Postępy - ${this.currentUser}</h3>
                        <button id="close-progress-modal" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <div class="space-y-6">
        `;
        
        // Overall statistics
        const completedTasks = Object.keys(userProgress).length;
        const totalTasks = userTasks.length;
        const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        progressHTML += `
            <div class="bg-gray-700 p-6 rounded-lg">
                <h4 class="text-xl font-bold text-white mb-4">Podsumowanie Ogólne</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-red-500">${completedTasks}</div>
                        <div class="text-gray-300">Ukończone zadania</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-yellow-400">${totalTasks}</div>
                        <div class="text-gray-300">Wszystkie zadania</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-green-400">${overallPercentage}%</div>
                        <div class="text-gray-300">Postęp ogólny</div>
                    </div>
                </div>
            </div>
        `;
        
        // Individual task progress
        progressHTML += `
            <div class="bg-gray-700 p-6 rounded-lg">
                <h4 class="text-xl font-bold text-white mb-4">Szczegóły Zadań</h4>
                <div class="space-y-4">
        `;
        
        userTasks.forEach(task => {
            const taskProgress = userProgress[task.id];
            if (taskProgress) {
                progressHTML += `
                    <div class="bg-gray-600 p-4 rounded-lg">
                        <div class="flex justify-between items-start mb-2">
                            <h5 class="font-semibold text-white">${task.title}</h5>
                            <span class="text-green-400 font-bold">${taskProgress.percentage}%</span>
                        </div>
                        <div class="text-sm text-gray-300 mb-2">${task.description}</div>
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-400">Wynik: ${taskProgress.score}/${taskProgress.totalQuestions}</span>
                            <span class="text-gray-400">Próby: ${taskProgress.attempts}</span>
                            <span class="text-gray-400">Data: ${new Date(taskProgress.completedAt).toLocaleDateString('pl-PL')}</span>
                        </div>
                        <div class="mt-2 w-full bg-gray-500 rounded-full h-2">
                            <div class="bg-green-400 h-2 rounded-full" style="width: ${taskProgress.percentage}%"></div>
                        </div>
                    </div>
                `;
            } else {
                progressHTML += `
                    <div class="bg-gray-600 p-4 rounded-lg opacity-60">
                        <div class="flex justify-between items-start mb-2">
                            <h5 class="font-semibold text-white">${task.title}</h5>
                            <span class="text-gray-500 font-bold">0%</span>
                        </div>
                        <div class="text-sm text-gray-300 mb-2">${task.description}</div>
                        <div class="text-sm text-gray-500">Nie rozpoczęte</div>
                        <div class="mt-2 w-full bg-gray-500 rounded-full h-2">
                            <div class="bg-gray-500 h-2 rounded-full" style="width: 0%"></div>
                        </div>
                    </div>
                `;
            }
        });
        
        progressHTML += `
                </div>
            </div>
        `;
        
        progressHTML += `
                    </div>
                </div>
            </div>
        `;
        
        progressModal.innerHTML = progressHTML;
        document.body.appendChild(progressModal);
        
        // Add close functionality
        document.getElementById('close-progress-modal').addEventListener('click', () => {
            progressModal.remove();
        });
        
        progressModal.addEventListener('click', (e) => {
            if (e.target.id === 'progress-modal') {
                progressModal.remove();
            }
        });
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
    console.log('DOM loaded, initializing platform...');
    console.log('Current URL:', window.location.href);
    console.log('LocalStorage logged_in:', localStorage.getItem('syndicate_logged_in'));
    console.log('LocalStorage username:', localStorage.getItem('syndicate_username'));
    
    try {
        new TradingPlatform();
    } catch (error) {
        console.error('Error initializing platform:', error);
    }
});