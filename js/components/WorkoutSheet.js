export class WorkoutSheet {
    constructor(workout) {
        if (!workout) {
            throw new Error('Workout is required');
        }
        
        this.workout = workout;
        this.sheet = null;
        this.isMinimized = false;
        this.isDragging = false;
        this.startY = 0;
        this.currentY = 0;
        this.initialHeight = 0;
        this.timer = {
            seconds: 0,
            isRunning: false,
            interval: null
        };
        this.isOpen = false;
        this.isInitialized = false;
    }

    async initialize() {
        console.log('Initializing workout sheet');
        
        // Clean up any existing workout sheets first
        await this.cleanupExistingSheets();
        
        // Create new sheet
        console.log('Creating new workout sheet');
        this.sheet = this.createSheet();
        if (!this.sheet) {
            console.error('Failed to create workout sheet');
            return false;
        }

        // Setup initial state
        this.resetState();
        
        // Setup all event listeners
        this.setupEventListeners();
        this.setupContentEventListeners();
        this.setupTimerEventListeners();
        this.setupDragBehavior();
        this.setupWarmupEventListeners();
        
        // Setup event listeners for initial sets
        const setRows = this.sheet.querySelectorAll('.set-row');
        setRows.forEach(setRow => {
            this.setupSetEventListeners(setRow);
        });

        this.isInitialized = true;
        return true;
    }

    async cleanupExistingSheets() {
        const existingSheet = document.querySelector('.workout-sheet');
        const existingBackdrop = document.querySelector('.workout-sheet-backdrop');
        
        if (existingSheet || existingBackdrop) {
            return new Promise(resolve => {
                const cleanup = () => {
                    if (existingSheet) existingSheet.remove();
                    if (existingBackdrop) existingBackdrop.remove();
                    resolve();
                };
                
                if (existingSheet && existingSheet.classList.contains('open')) {
                    existingSheet.addEventListener('transitionend', cleanup, { once: true });
                    existingSheet.classList.remove('open');
                } else {
                    cleanup();
        }
            });
        }
    }

    resetState() {
        this.timer = {
            seconds: 0,
            isRunning: false,
            interval: null
        };
        this.isOpen = false;
        this.isMinimized = false;
        this.isDragging = false;
        this.startY = 0;
        this.currentY = 0;
        this.initialHeight = 0;
    }

    async show() {
        if (!this.sheet || !this.isInitialized) {
            console.error('Cannot show workout sheet - not initialized');
            return false;
        }

        return new Promise(resolve => {
            // Reset any existing state
            this.sheet.classList.remove('minimized', 'will-minimize', 'dragging');
            
            // Set initial state
            this.sheet.style.display = 'block';
            this.sheet.style.opacity = '0';
            this.sheet.style.visibility = 'visible';
            this.sheet.style.transform = 'translateY(100%)';
            
            // Force reflow
            this.sheet.offsetHeight;
            
            // Add transition end listener
            const transitionEndHandler = () => {
                this.sheet.removeEventListener('transitionend', transitionEndHandler);
                this.isOpen = true;
                this.initializeProgress();
                this.startTimer();
                resolve(true);
            };
            
            this.sheet.addEventListener('transitionend', transitionEndHandler);
            
            // Trigger animation
            requestAnimationFrame(() => {
                this.sheet.style.opacity = '1';
                this.sheet.style.transform = 'translateY(0)';
                this.sheet.classList.add('open');
            });
        });
    }

    async close() {
        if (!this.sheet) return;

        console.log('Closing workout sheet');

        return new Promise((resolve) => {
            // Stop timer if running
            this.stopTimer();

            // Add transition end listener
            const transitionEndHandler = () => {
                this.sheet.removeEventListener('transitionend', transitionEndHandler);
                this.cleanupSheet();
                window.dispatchEvent(new CustomEvent('workoutSheetClosed'));
                resolve();
            };
            
            this.sheet.addEventListener('transitionend', transitionEndHandler);

            // Start closing animation
            this.sheet.classList.remove('open', 'minimized', 'will-minimize');
            this.sheet.style.transform = 'translateY(100%)';
            this.sheet.style.opacity = '0';
            
            // Hide backdrop
            const backdrop = document.querySelector('.workout-sheet-backdrop');
            if (backdrop) {
                backdrop.style.opacity = '0';
                backdrop.style.visibility = 'hidden';
                backdrop.style.pointerEvents = 'none';
            }
        });
    }

    cleanupSheet() {
        console.log('Cleaning up workout sheet');
        
        // Clear intervals
        if (this.timer.interval) {
            clearInterval(this.timer.interval);
            this.timer.interval = null;
        }

        // Remove elements from DOM
        if (this.sheet && this.sheet.parentNode) {
            this.sheet.parentNode.removeChild(this.sheet);
        }
        
        const backdrop = document.querySelector('.workout-sheet-backdrop');
        if (backdrop && backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
        }

        // Reset state
        this.resetState();
        this.sheet = null;
        this.isInitialized = false;
        
        // Remove all event listeners
        this.removeEventListeners();
        }

    minimize() {
        if (!this.sheet || this.isMinimized) return;
        
        this.isMinimized = true;
        this.sheet.classList.remove('will-minimize', 'dragging');
        this.sheet.classList.add('minimized');
        
        // Hide backdrop with transition
        const backdrop = document.querySelector('.workout-sheet-backdrop');
        if (backdrop) {
            backdrop.style.opacity = '0';
            backdrop.style.visibility = 'hidden';
            backdrop.style.pointerEvents = 'none';
        }
    }

    maximize() {
        if (!this.sheet || !this.isMinimized) return;
        
        this.isMinimized = false;
        this.sheet.classList.remove('minimized', 'will-minimize', 'dragging');
        
        // Show backdrop with transition
        const backdrop = document.querySelector('.workout-sheet-backdrop');
        if (backdrop) {
            backdrop.style.opacity = '1';
            backdrop.style.visibility = 'visible';
            backdrop.style.pointerEvents = 'auto';
        }
    }

    createSheet() {
        console.log('Creating new workout sheet elements');

        // Remove any existing elements first
        const existingSheet = document.querySelector('.workout-sheet');
        const existingBackdrop = document.querySelector('.workout-sheet-backdrop');
        if (existingSheet) existingSheet.remove();
        if (existingBackdrop) existingBackdrop.remove();

        // Create the backdrop
        const backdrop = document.createElement('div');
        backdrop.classList.add('workout-sheet-backdrop');
        document.body.appendChild(backdrop);

        // Create the sheet
        const sheet = document.createElement('div');
        sheet.classList.add('workout-sheet');
        sheet.innerHTML = `
            <div class="workout-sheet-handle"></div>
            <div class="workout-sheet-content">
                <div class="workout-header">
                    <div class="header-content">
                        <div class="workout-type-badge">
                            <i class="fas fa-dumbbell"></i>
                            ${this.workout.type || 'Strength'}
                        </div>
                        <h2>${this.workout.name}</h2>
                        <div class="workout-meta">
                            <span>
                                <i class="fas fa-clock"></i>
                                ${this.workout.duration || '50'} mins
                            </span>
                            <span>
                                <i class="fas fa-dumbbell"></i>
                                ${this.workout.exercises.length} exercises
                            </span>
                            <span>
                                <i class="fas fa-fire"></i>
                                ${this.workout.calories || '300'} cal
                            </span>
                        </div>
                    </div>
                    <div class="progress-ring">
                        <svg width="72" height="72" viewBox="0 0 72 72">
                            <circle class="progress-ring-circle-bg" cx="36" cy="36" r="32"/>
                            <circle class="progress-ring-circle" cx="36" cy="36" r="32"/>
                        </svg>
                        <div class="progress-text">0%</div>
                    </div>
                </div>
                <div class="warmup-section">
                    <h3>Warm-up</h3>
                    <div class="warmup-exercises">
                        <div class="warmup-exercise" data-duration="180">
                            <div class="warmup-exercise-info">
                                <span class="exercise-name">Dynamic Stretching</span>
                                <span class="exercise-duration">3:00</span>
                            </div>
                            <button class="timer-control" aria-label="Start warmup timer">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="complete-warmup" aria-label="Mark warmup as complete">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                        <div class="warmup-exercise" data-duration="120">
                            <div class="warmup-exercise-info">
                                <span class="exercise-name">Mobility Work</span>
                                <span class="exercise-duration">2:00</span>
                            </div>
                            <button class="timer-control" aria-label="Start warmup timer">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="complete-warmup" aria-label="Mark warmup as complete">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="exercise-section">
                    ${this.renderExercises()}
                </div>
            </div>
            <div class="minimized-controls">
                <div class="workout-info">
                    <h3>${this.workout.name}</h3>
                    <div class="workout-timer">00:00</div>
                </div>
                <button class="timer-control">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;

        // Add to document
        document.body.appendChild(sheet);

        // Store references
        this.progressRing = sheet.querySelector('.progress-ring-circle');
        this.progressText = sheet.querySelector('.progress-text');

        // Setup circle properties
        if (this.progressRing) {
            const radius = this.progressRing.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            this.progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
            this.progressRing.style.strokeDashoffset = circumference;
        }

        // Show backdrop when sheet is open
        sheet.addEventListener('transitionend', () => {
            if (sheet.classList.contains('open')) {
                backdrop.classList.add('visible');
            } else {
                backdrop.classList.remove('visible');
            }
        });

        // Close sheet when clicking backdrop
        backdrop.addEventListener('click', () => {
            if (!this.isMinimized) {
                this.close();
            }
        });

        console.log('Workout sheet elements created successfully');
        return sheet;
    }

    setupEventListeners() {
        if (!this.sheet) return;

        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', () => {
            if (!this.isMinimized) {
                this.close(true); // true indicates it's a user-initiated close
            }
        });
        this.sheet.querySelector('.workout-header').appendChild(closeButton);

        // Timer controls
        const timerControls = this.sheet.querySelectorAll('.timer-control');
        timerControls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.timerInterval) {
                    this.stopTimer();
                    control.innerHTML = '<i class="fas fa-play"></i>';
                    control.classList.remove('active');
                } else {
                    this.startTimer();
                    control.innerHTML = '<i class="fas fa-pause"></i>';
                    control.classList.add('active');
                }
            });
        });

        // Double click to minimize/maximize
        this.sheet.querySelector('.workout-sheet-handle').addEventListener('dblclick', () => {
            if (this.isMinimized) {
                this.maximize();
            } else {
                this.minimize();
            }
        });

        // Click on minimized sheet to maximize
        this.sheet.addEventListener('click', (e) => {
            if (this.isMinimized && !e.target.closest('.timer-control')) {
                this.maximize();
            }
        });

        // Backdrop click
        const backdrop = document.querySelector('.workout-sheet-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => {
                if (!this.isMinimized) {
                    this.minimize();
                }
            });
        }

        // Prevent clicks inside the sheet from closing it
        this.sheet.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    setupContentEventListeners() {
        if (!this.sheet) return;

        // Add set buttons
        const addSetButtons = this.sheet.querySelectorAll('.add-set-btn');
        addSetButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const exerciseRow = e.target.closest('.exercise-row');
                if (exerciseRow) {
                    const exerciseId = parseInt(exerciseRow.dataset.exerciseId);
                    this.addSet(exerciseId);
                }
            });
        });

        // Remove set buttons - using event delegation for dynamically added buttons
        this.sheet.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-set-btn');
            if (removeBtn) {
                const setRow = removeBtn.closest('.set-row');
                const exerciseRow = setRow.closest('.exercise-row');
                if (setRow && exerciseRow) {
                    const exerciseId = parseInt(exerciseRow.dataset.exerciseId);
                    const setId = parseInt(setRow.dataset.setId);
                    this.removeSet(exerciseId, setId);
                }
            }
        });

        // Weight and reps inputs
        const inputs = this.sheet.querySelectorAll('.workout-input');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const exerciseRow = input.closest('.exercise-row');
                const setRow = input.closest('.set-row');
                if (exerciseRow && setRow) {
                    const exerciseId = parseInt(exerciseRow.dataset.exerciseId);
                    const setId = parseInt(setRow.dataset.setId);
                    const type = input.dataset.type;
                    const value = parseFloat(input.value) || 0;
                    this.updateSet(exerciseId, setId, type, value);
                }
            });
        });

        // Completion checkboxes
        const checkboxes = this.sheet.querySelectorAll('.set-complete');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const exerciseIndex = parseInt(checkbox.dataset.exercise);
                const setIndex = parseInt(checkbox.dataset.set);
                this.toggleSetCompletion(exerciseIndex, setIndex, checkbox.checked);
            });
        });
    }

    setupTimerEventListeners() {
        // Implementation of setupTimerEventListeners method
        // This method should set up event listeners for timer-related actions
    }

    setupDragBehavior() {
        const handle = this.sheet.querySelector('.workout-sheet-handle');
        if (!handle) return;

        // Constants for drag behavior
        const MIN_HEIGHT = 72; // Height when minimized
        const MAX_HEIGHT = window.innerHeight * 0.8;
        const MINIMIZE_THRESHOLD = window.innerHeight * 0.2;
        const VELOCITY_THRESHOLD = 0.5;
        
        let startY = 0;
        let startHeight = 0;
        let lastY = 0;
        let lastTime = 0;
        let velocity = 0;
        
        const handleDragStart = (e) => {
            if (this.isMinimized) return;
            
            this.isDragging = true;
            startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
            startHeight = this.sheet.offsetHeight;
            lastY = startY;
            lastTime = Date.now();
            
            this.sheet.classList.add('dragging');
            document.body.style.overflow = 'hidden';
        };

        const handleDrag = (e) => {
            if (!this.isDragging) return;
            
            e.preventDefault();
            const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            
            // Calculate velocity
            if (deltaTime > 0) {
                velocity = (currentY - lastY) / deltaTime;
            }
            
            const deltaY = currentY - startY;
            const newHeight = Math.max(MIN_HEIGHT, Math.min(startHeight - deltaY, MAX_HEIGHT));
            
            this.sheet.style.height = `${newHeight}px`;
            
            // Show minimize preview
            if (newHeight < MINIMIZE_THRESHOLD || (velocity > VELOCITY_THRESHOLD && deltaY > 0)) {
                this.sheet.classList.add('will-minimize');
                // Show minimized controls with preview
                const minimizedControls = this.sheet.querySelector('.minimized-controls');
                if (minimizedControls) {
                    minimizedControls.style.display = 'flex';
                    minimizedControls.style.opacity = '1';
                    minimizedControls.style.transform = 'translateY(0)';
                }
            } else {
                this.sheet.classList.remove('will-minimize');
                // Hide minimized controls
                const minimizedControls = this.sheet.querySelector('.minimized-controls');
                if (minimizedControls) {
                    minimizedControls.style.opacity = '0';
                    minimizedControls.style.transform = 'translateY(10px)';
                }
            }
            
            lastY = currentY;
            lastTime = currentTime;
        };

        const handleDragEnd = () => {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            this.sheet.classList.remove('dragging');
            document.body.style.overflow = '';
            
            const currentHeight = this.sheet.offsetHeight;
            const shouldMinimize = currentHeight < MINIMIZE_THRESHOLD || 
                                 (velocity > VELOCITY_THRESHOLD && lastY > startY);
            
            requestAnimationFrame(() => {
                if (shouldMinimize) {
                    this.minimize();
                } else {
                    this.maximize();
                }
            });
            
            // Reset tracking
            velocity = 0;
        };

        // Mouse events
        handle.addEventListener('mousedown', handleDragStart);
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);

        // Touch events
        handle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleDragStart(e);
        });
        
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                handleDrag(e);
            }
        }, { passive: false });
        
        document.addEventListener('touchend', handleDragEnd);

        // Double click to minimize/maximize
        handle.addEventListener('dblclick', () => {
            if (this.isMinimized) {
                this.maximize();
            } else {
                this.minimize();
            }
        });
    }

    setupWarmupEventListeners() {
        // Implementation of setupWarmupEventListeners method
        // This method should set up event listeners for warmup-related actions
    }

    renderExercises() {
        return this.workout.exercises.map((exercise, index) => `
            <div class="exercise-row" data-exercise-id="${index}">
                <div class="exercise-header">
                    <h3 class="exercise-name">${exercise.name}</h3>
                </div>
                <div class="set-rows">
                    ${this.renderSets(exercise, index)}
                </div>
                <button class="add-set-btn">
                    <i class="fas fa-plus"></i>
                    Add Set
                </button>
            </div>
        `).join('');
    }
    
    renderSets(exercise, exerciseIndex) {
        return exercise.sets.map((set, index) => this.renderSet(set, exerciseIndex, index)).join('');
    }

    renderSet(set, exerciseIndex, setIndex) {
        return `
            <div class="set-row ${set.completed ? 'completed' : ''}" data-set-id="${setIndex}">
                <span class="set-number">Set ${setIndex + 1}</span>
                <input type="number" 
                    class="workout-input weight-input" 
                    data-exercise="${exerciseIndex}" 
                    data-set="${setIndex}" 
                    data-type="weight" 
                    value="${set.weight || ''}" 
                    placeholder="Weight"
                    min="0" 
                    step="2.5">
                <input type="number" 
                    class="workout-input reps-input" 
                    data-exercise="${exerciseIndex}" 
                    data-set="${setIndex}" 
                    data-type="reps" 
                    value="${set.reps || ''}" 
                    placeholder="Reps"
                    min="0" 
                    step="1">
                <div class="set-controls">
                    <button class="rpe-button" data-rpe="${set.rpe || ''}">
                        ${set.rpe ? 'RPE ' + set.rpe : 'RPE'}
                    </button>
                    <button class="complete-set" title="Mark set as complete">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
                <button class="remove-set-btn" title="Remove set">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    initializeDragHandling() {
        const handle = this.sheet.querySelector('.workout-sheet-handle');
        if (!handle) {
            console.warn('Workout sheet handle not found');
                return;
            }

        // Touch events
        handle.addEventListener('touchstart', (e) => {
            this.startDragging(e);
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.handleDrag(e);
            }
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            if (this.isDragging) {
                this.stopDragging();
            }
        });
        
        // Mouse events
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startDragging(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.handleDrag(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.stopDragging();
            }
        });
    }

    startDragging(e) {
        this.isDragging = true;
        this.sheet.classList.add('dragging');
        
        if (e.type === 'touchstart') {
            this.dragStartY = e.touches[0].clientY;
            this.initialTouchY = e.touches[0].clientY;
            this.touchStartTime = Date.now();
        } else {
            this.dragStartY = e.clientY;
        }
        
        this.sheetStartY = this.getSheetTranslateY();
    }

    handleDrag(e) {
        if (!this.isDragging) return;
        
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - this.dragStartY;
        let newTranslateY = Math.max(0, deltaY);
        
        // Update touch tracking for velocity
        if (e.type === 'touchmove') {
            this.currentTouchY = e.touches[0].clientY;
            this.lastTouchY = this.currentTouchY;
        }
        
        // Add resistance when dragging down
        if (deltaY > 0) {
            newTranslateY = Math.pow(deltaY, 0.8);
        }
        
        // Add minimize threshold feedback
        const minimizeThreshold = window.innerHeight * 0.15;
        const closeThreshold = window.innerHeight * 0.5;
        
        if (newTranslateY > minimizeThreshold && newTranslateY < closeThreshold) {
            this.sheet.classList.add('will-minimize');
        } else {
            this.sheet.classList.remove('will-minimize');
        }
        
        this.sheet.style.transform = `translateY(${newTranslateY}px)`;
    }

    stopDragging() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.sheet.classList.remove('dragging');
        
        const currentTranslateY = this.getSheetTranslateY();
        const minimizeThreshold = window.innerHeight * 0.15;
        const closeThreshold = window.innerHeight * 0.5;
        
        // Calculate velocity for touch events
        if (this.lastTouchY) {
            const touchDuration = Date.now() - this.touchStartTime;
            const touchDistance = this.lastTouchY - this.initialTouchY;
            this.velocityY = touchDistance / touchDuration;
        }
        
        // Determine action based on position and velocity
        if (currentTranslateY > closeThreshold || this.velocityY > 0.5) {
            this.close();
        } else if (currentTranslateY > minimizeThreshold || this.velocityY > 0.2) {
            this.minimize();
        } else {
            this.maximize();
        }
        
        // Reset tracking
        this.lastTouchY = 0;
        this.velocityY = 0;
    }

    getSheetTranslateY() {
        const transform = window.getComputedStyle(this.sheet).transform;
        if (transform === 'none') return 0;
        
        const matrix = new DOMMatrix(transform);
        return matrix.m42; // The Y translation value
    }
            
    show() {
        if (!this.sheet) {
            console.error('Cannot show workout sheet - not initialized');
            return;
            }

        // Reset any existing state
        this.sheet.classList.remove('minimized', 'will-minimize', 'dragging');
        
        // Set initial state
        this.sheet.style.display = 'block';
        this.sheet.style.opacity = '0';
        this.sheet.style.visibility = 'visible';
        this.sheet.style.transform = 'translateX(-50%) translateY(100%)';
        
        // Force reflow
        this.sheet.offsetHeight;
            
        // Trigger animation in next frame
            requestAnimationFrame(() => {
            this.sheet.style.opacity = '1';
            this.sheet.style.transform = 'translateX(-50%) translateY(0)';
            this.sheet.classList.add('open');
                this.isOpen = true;
            this.isMinimized = false;
            
            // Initialize after animation
            setTimeout(() => {
                if (!this.sheet) return;
                this.initializeProgress();
                this.startTimer();
            }, 300);
        });
    }

    close(isUserInitiated = false) {
        if (!this.sheet) return;

        console.log('Closing workout sheet');

        // Stop timer if running
        this.stopTimer();

        // Animate out
        this.sheet.classList.remove('open', 'minimized', 'will-minimize');
        this.sheet.style.transform = 'translateX(-50%) translateY(100%)';
        this.sheet.style.opacity = '0';
        this.isOpen = false;
        
        // Hide backdrop
        const backdrop = document.querySelector('.workout-sheet-backdrop');
        if (backdrop) {
            backdrop.classList.remove('visible');
            backdrop.style.display = 'none';
        }
        
        // Clean up after animation
        setTimeout(() => {
            console.log('Cleaning up workout sheet');
            
            // Remove elements from DOM
            if (this.sheet && this.sheet.parentNode) {
                this.sheet.parentNode.removeChild(this.sheet);
                this.sheet = null;
            }
            if (backdrop && backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
            }

            // Reset state but preserve workout data
            this.isMinimized = false;
            this.isDragging = false;
            this.startY = 0;
            this.currentY = 0;
            this.initialHeight = 0;
            this.timer = {
                seconds: 0,
                isRunning: false,
                interval: null
            };
            this.progressRing = null;
            this.progressText = null;
            this.elapsedTime = 0;

            // Clear intervals
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }

            // Dispatch event to notify that workout sheet is fully closed
            window.dispatchEvent(new CustomEvent('workoutSheetClosed'));
            
            console.log('Workout sheet cleanup complete');
        }, 300);
    }

    removeEventListeners() {
        if (!this.sheet) return;

        // Remove all event listeners using event delegation
        const sheet = this.sheet;
        const newSheet = sheet.cloneNode(true);
        if (sheet.parentNode) {
            sheet.parentNode.replaceChild(newSheet, sheet);
        }

        // Remove backdrop click listener
        const backdrop = document.querySelector('.workout-sheet-backdrop');
        if (backdrop) {
            const newBackdrop = backdrop.cloneNode(true);
            if (backdrop.parentNode) {
                backdrop.parentNode.replaceChild(newBackdrop, backdrop);
            }
        }

        // Clear any remaining intervals or timeouts
        if (this.timer.interval) {
            clearInterval(this.timer.interval);
            this.timer.interval = null;
        }
    }

    minimize() {
        if (!this.sheet) return;
        
        this.isMinimized = true;
        this.sheet.classList.remove('will-minimize', 'dragging');
        this.sheet.classList.add('minimized');
        
        // Reset transform to use CSS-based transform
        this.sheet.style.transform = 'translateX(-50%) translateY(0)';
        this.sheet.style.height = '';

        // Hide backdrop
        const backdrop = document.querySelector('.workout-sheet-backdrop');
        if (backdrop) {
            backdrop.style.display = 'none';
            backdrop.classList.remove('visible');
        }

        // Ensure minimized controls are visible
        const minimizedControls = this.sheet.querySelector('.minimized-controls');
        if (minimizedControls) {
            minimizedControls.style.display = 'flex';
            minimizedControls.style.opacity = '1';
            minimizedControls.style.transform = 'translateY(0)';
        }
    }

    maximize() {
        if (!this.sheet) return;
        
        this.isMinimized = false;
        this.sheet.classList.remove('minimized', 'will-minimize', 'dragging');
        
        // Show backdrop
        const backdrop = document.querySelector('.workout-sheet-backdrop');
        if (backdrop) {
            backdrop.style.display = 'block';
            backdrop.classList.add('visible');
        }
        
        // Reset to full height with animation
        requestAnimationFrame(() => {
            this.sheet.style.transform = 'translateX(-50%) translateY(0)';
            this.sheet.style.height = '80vh';
            
            // Hide minimized controls
            const minimizedControls = this.sheet.querySelector('.minimized-controls');
            if (minimizedControls) {
                minimizedControls.style.opacity = '0';
                minimizedControls.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    if (!this.isMinimized) {
                        minimizedControls.style.display = 'none';
                    }
                }, 300);
            }
        });
    }

    initializeExerciseInteractions() {
        // Add set button handling
        const addSetButtons = this.sheet.querySelectorAll('.add-set-btn');
        addSetButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const exerciseRow = e.target.closest('.exercise-row');
                const exerciseId = parseInt(exerciseRow.dataset.exerciseId);
                this.addSet(exerciseId);
            });
        });
        
        // Remove set button handling
        this.sheet.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-set-btn')) {
                const setRow = e.target.closest('.set-row');
                const exerciseRow = setRow.closest('.exercise-row');
                const exerciseId = parseInt(exerciseRow.dataset.exerciseId);
                const setId = parseInt(setRow.dataset.setId);
                this.removeSet(exerciseId, setId);
            }
        });
        
        // Set completion handling
        this.sheet.addEventListener('change', (e) => {
            if (e.target.classList.contains('set-complete')) {
                const setRow = e.target.closest('.set-row');
                setRow.classList.toggle('completed', e.target.checked);
                this.updateProgress();
            }
        });
    }

    addSet(exerciseIndex) {
        if (!this.workout.exercises[exerciseIndex]) return;
        
        // Create new set object
        const newSet = {
            weight: '',
            reps: '',
            rpe: '',
            completed: false
        };
        
        // Add to workout data
        this.workout.exercises[exerciseIndex].sets.push(newSet);
        
        // Find the exercise row and sets container
        const exerciseRow = this.sheet.querySelector(`[data-exercise-id="${exerciseIndex}"]`);
        if (!exerciseRow) return;
        
        const setRows = exerciseRow.querySelector('.set-rows');
        if (!setRows) return;
        
        // Create new set row
        const setIndex = this.workout.exercises[exerciseIndex].sets.length - 1;
        const setHtml = this.renderSet(newSet, exerciseIndex, setIndex);
        
        // Create temporary container
        const temp = document.createElement('div');
        temp.innerHTML = setHtml;
        const newSetRow = temp.firstElementChild;
        
        // Add to DOM
        setRows.appendChild(newSetRow);
        
        // Setup animation
        requestAnimationFrame(() => {
            newSetRow.classList.add('adding');
            
            // Remove animation class after completion
            setTimeout(() => {
                newSetRow.classList.remove('adding');
            }, 300);
        });
        
        // Setup event listeners for the new set
        this.setupSetEventListeners(newSetRow);
        
        // Update progress
        this.updateProgress();
    }

    removeSet(exerciseIndex, setIndex) {
        const exercise = this.workout.exercises[exerciseIndex];
        if (!exercise || !exercise.sets[setIndex]) return;
        
        // Find the set row
        const setRow = this.sheet.querySelector(`[data-exercise-id="${exerciseIndex}"] [data-set-id="${setIndex}"]`);
        if (!setRow || setRow.classList.contains('removing')) return;
        
        // Add removal animation
        setRow.classList.add('removing');
        
        // Remove after animation
        setTimeout(() => {
            // Remove from data
            exercise.sets.splice(setIndex, 1);
            
            // Remove from DOM
            setRow.remove();
            
            // Update remaining set numbers
            this.updateSetNumbers(exerciseIndex);
            
            // Update progress
            this.updateProgress();
        }, 300);
    }

    toggleSetCompletion(exerciseIndex, setIndex, completed) {
        const exercise = this.workout.exercises[exerciseIndex];
        if (!exercise || !exercise.sets[setIndex]) return;

        exercise.sets[setIndex].completed = completed;
        
        // Update visual state
        const setRow = this.sheet.querySelector(`[data-exercise-id="${exerciseIndex}"] [data-set-id="${setIndex}"]`);
        if (setRow) {
            if (completed) {
                setRow.classList.add('completed');
                // Add completion animation
                const animation = document.createElement('div');
                animation.className = 'completion-animation';
                setRow.appendChild(animation);
                setTimeout(() => animation.remove(), 600);
            } else {
                setRow.classList.remove('completed');
            }
        }
        
        this.updateProgress();
    }

    updateSetNumbers(exerciseIndex) {
        const setRows = this.sheet.querySelectorAll(`[data-exercise-id="${exerciseIndex}"] .set-row`);
        setRows.forEach((row, index) => {
            const setNumber = row.querySelector('.set-number');
            if (setNumber) {
                setNumber.textContent = `Set ${index + 1}`;
            }
            row.dataset.setId = index;
            
            // Update data attributes on inputs and buttons
            const inputs = row.querySelectorAll('.workout-input');
            inputs.forEach(input => {
                input.dataset.set = index;
            });
            
            const removeBtn = row.querySelector('.remove-set-btn');
            if (removeBtn) {
                removeBtn.dataset.set = index;
            }
        });
    }

    initializeProgress() {
        this.updateProgress();
        
        // Set up the progress circle
        const circle = this.progressRing;
        if (circle) {
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
        }
    }

    updateProgress() {
        let completedSets = 0;
        let totalSets = 0;
        
        this.workout.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
                totalSets++;
                if (set.completed) completedSets++;
            });
            });

        const progress = totalSets === 0 ? 0 : (completedSets / totalSets) * 100;
        
        if (this.progressRing && this.progressText) {
            const radius = this.progressRing.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            const offset = circumference - (progress / 100) * circumference;
            this.progressRing.style.strokeDashoffset = offset;
            this.progressText.textContent = `${Math.round(progress)}%`;
        }

    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const startTime = Date.now() - (this.elapsedTime * 1000);
        
        // Update immediately before starting interval
        this.updateTimer();
        
        this.timerInterval = setInterval(() => {
            if (!this.sheet) {
                this.stopTimer();
                return;
            }
            this.elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer() {
        if (!this.sheet) return;
        
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = this.elapsedTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timer = this.sheet.querySelector('.workout-timer');
        if (timer) {
            timer.textContent = timeString;
        }
    }

    getComputedTransform() {
        const transform = window.getComputedStyle(this.sheet).transform;
        if (transform === 'none') return 0;
        const matrix = new DOMMatrix(transform);
        return matrix.m42; // Y translation value
    }

    setupSetEventListeners(setRow) {
        if (!setRow) return;

        // Weight and reps inputs
        const inputs = setRow.querySelectorAll('.workout-input');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const exerciseRow = setRow.closest('.exercise-row');
                if (exerciseRow) {
                    const exerciseId = parseInt(exerciseRow.dataset.exerciseId);
                    const setId = parseInt(setRow.dataset.setId);
                    const type = input.dataset.type;
                    const value = parseFloat(input.value) || 0;
                    this.updateSet(exerciseId, setId, type, value);
                }
            });

            // Prevent sheet dragging when interacting with inputs
            input.addEventListener('mousedown', (e) => e.stopPropagation());
            input.addEventListener('touchstart', (e) => e.stopPropagation());
        });

        // Complete button
        const completeBtn = setRow.querySelector('.complete-set');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                const exerciseRow = setRow.closest('.exercise-row');
                if (exerciseRow) {
                    const exerciseId = parseInt(exerciseRow.dataset.exerciseId);
                    const setId = parseInt(setRow.dataset.setId);
                    const isCompleted = setRow.classList.contains('completed');
                    this.toggleSetCompletion(exerciseId, setId, !isCompleted);
                }
        });
    }
            
        // Remove button
        const removeBtn = setRow.querySelector('.remove-set-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                const exerciseRow = setRow.closest('.exercise-row');
                const exerciseId = parseInt(exerciseRow.dataset.exerciseId);
                const setId = parseInt(setRow.dataset.setId);
                this.removeSet(exerciseId, setId);
        });
    }

        // RPE button
        const rpeBtn = setRow.querySelector('.rpe-button');
        if (rpeBtn) {
            rpeBtn.addEventListener('click', () => {
                // RPE button click handling can be added here
            });
        }
    }
}