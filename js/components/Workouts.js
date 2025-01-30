import { Calendar } from './Calendar.js';
import { WorkoutSheet } from './WorkoutSheet.js';

export class Workouts {
    constructor(container) {
        if (!container) {
            console.error('Container not found');
            return;
        }

        this.container = container;
        this.workoutSheet = null;
        this.workouts = new Map();
        this.activeWorkout = null;
        this.calendar = null;
        this.currentView = 'workouts';
        
        this.init();
    }

    init() {
        // Create the structure first
        this.createStructure();
        
        // Initialize components
        this.loadWorkouts();
        this.renderWorkoutCards();
        
        // Set up event listeners before initializing calendar
        this.setupEventListeners();
        
        // Set initial view (calendar will be initialized when needed)
        this.switchView('workouts');
    }

    createStructure() {
        // Clear existing content
        this.container.innerHTML = '';
        
        // Create view toggle
        const viewToggle = document.createElement('div');
        viewToggle.className = 'view-toggle';
        viewToggle.innerHTML = `
            <div class="toggle-buttons">
                <button class="toggle-button active" data-view="workouts">My Workouts</button>
                <button class="toggle-button" data-view="calendar">My Calendar</button>
                </div>
            `;

        // Create views container
        const viewsContainer = document.createElement('div');
        viewsContainer.className = 'views-container';

        // Create workouts view
        const workoutsView = document.createElement('div');
        workoutsView.className = 'workouts-view active';
        workoutsView.innerHTML = `
            <div class="workout-cards"></div>
        `;
        
        // Create calendar view
        const calendarView = document.createElement('div');
        calendarView.className = 'calendar-view';
        calendarView.innerHTML = `
            <div id="calendar-view"></div>
        `;
        
        // Assemble the structure
        viewsContainer.appendChild(workoutsView);
        viewsContainer.appendChild(calendarView);
        
        this.container.appendChild(viewToggle);
        this.container.appendChild(viewsContainer);
    }

    switchView(view) {
        // Update current view
        this.currentView = view;
        
        // Get view containers
        const workoutsView = this.container.querySelector('.workouts-view');
        const calendarView = this.container.querySelector('.calendar-view');
        const toggleButtons = this.container.querySelectorAll('.toggle-button');
        
        if (view === 'calendar') {
            // Switch to calendar view
            workoutsView?.classList.remove('active');
            calendarView?.classList.add('active');
            
            // Initialize calendar if not already done
            if (!this.calendar) {
                this.initializeCalendar();
            } else {
                // Just render if already initialized
                this.calendar.renderCalendar();
            }
        } else {
            // Switch to workouts view
            calendarView?.classList.remove('active');
            workoutsView?.classList.add('active');
            
            // Ensure calendar stays in its container
            const calendarElement = document.getElementById('calendar-view');
            if (calendarElement && calendarElement.parentElement !== calendarView) {
                calendarView.appendChild(calendarElement);
            }
            
            // Force re-render of workout cards
            this.renderWorkoutCards();
        }

        // Update toggle buttons
        toggleButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
    }

    renderWorkoutCards() {
        const workoutCardsContainer = this.container.querySelector('.workout-cards');
        if (!workoutCardsContainer) {
            console.error('Workout cards container not found');
            return;
        }

        // Clear existing content
        workoutCardsContainer.innerHTML = '';

        // Show empty state if no workouts
        if (this.workouts.size === 0) {
            workoutCardsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-dumbbell"></i>
                    </div>
                    <h3>No Workouts Yet</h3>
                    <p>Create your first workout to get started!</p>
                    <button class="action-btn start-btn" onclick="createNewWorkout()">
                        <i class="fas fa-plus"></i> Create Workout
                    </button>
                </div>
            `;
            return;
        }

        // Create fragment for better performance
        const fragment = document.createDocumentFragment();

        // Create and append workout cards
        this.workouts.forEach(workout => {
            const card = this.createWorkoutCard(workout);
            fragment.appendChild(card);
        });

        // Append all cards at once
        workoutCardsContainer.appendChild(fragment);
    }

    createWorkoutCard(workout) {
        console.log('Creating workout card for:', workout);
        const card = document.createElement('div');
        card.className = 'workout-card';
        card.dataset.workoutId = workout.id;
        
        // Only show edit button for custom workouts
        const showEditButton = workout.isCustom === true;
        
        card.innerHTML = `
            <div class="workout-header">
                <span class="category-tag">
                    <i class="fas fa-dumbbell"></i>
                    ${workout.category}
                </span>
                <h3>${workout.name}</h3>
            </div>
            <p class="workout-description">${workout.description}</p>
            <div class="workout-meta">
                <span><i class="fas fa-clock"></i> ${workout.duration} mins</span>
                <span><i class="fas fa-dumbbell"></i> ${workout.exercises?.length || 0} exercises</span>
            </div>
            <div class="workout-actions">
                <button class="action-btn start-btn" type="button" data-action="start" data-workout-id="${workout.id}" style="cursor: pointer; pointer-events: auto;">
                    <i class="fas fa-play"></i> Start Workout
                </button>
                ${showEditButton ? `
                    <button class="action-btn edit-btn" type="button" data-action="edit" data-workout-id="${workout.id}" style="cursor: pointer; pointer-events: auto;">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                ` : ''}
            </div>
        `;

        // Add direct click handler for debugging and ensure button functionality
        const startBtn = card.querySelector('.start-btn');
        if (startBtn) {
            startBtn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Start button clicked for workout:', workout.id);
                
                try {
                    startBtn.disabled = true;
                    startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';
                    await this.startWorkout(workout);
                } catch (error) {
                    console.error('Failed to start workout:', error);
                    startBtn.disabled = false;
                    startBtn.innerHTML = '<i class="fas fa-play"></i> Start Workout';
                }
            };
        }

        // Prevent card click from interfering with button clicks
        card.onclick = (e) => {
            const isButton = e.target.closest('.action-btn');
            if (!isButton) {
                console.log('Card clicked but not on action button');
                e.stopPropagation();
            }
        };

        return card;
    }

    loadWorkouts() {
        try {
            // Try to load workouts from localStorage
            const savedWorkouts = localStorage.getItem('workouts');
            if (savedWorkouts) {
                const workoutsArray = JSON.parse(savedWorkouts);
                    workoutsArray.forEach(workout => {
                        this.workouts.set(workout.id, workout);
                    });
            }
            
            // If no workouts found (including after cache clear), load defaults
            if (this.workouts.size === 0) {
                console.log('No saved workouts found, loading defaults...');
                this.loadDefaultWorkouts();
                // Save default workouts to localStorage
                this.saveWorkouts();
            }
        } catch (error) {
            console.error('Error loading workouts:', error);
            // Load defaults if there's an error
            this.loadDefaultWorkouts();
            this.saveWorkouts();
        }
    }

    loadDefaultWorkouts() {
        const defaultWorkouts = [
            {
                id: '1',
                name: 'Upper Body Chest Focus',
                description: 'Build strength and muscle mass with this chest-focused upper body workout',
                duration: 45,
                category: 'Strength',
                exercises: [
                    {
                        id: '1-1',
                        name: 'Barbell Bench Press',
                        sets: [
                            { weight: 135, reps: 12, completed: false },
                            { weight: 155, reps: 10, completed: false },
                            { weight: 175, reps: 8, completed: false }
                        ]
                    },
                    {
                        id: '1-2',
                        name: 'Incline Dumbbell Press',
                        sets: [
                            { weight: 60, reps: 12, completed: false },
                            { weight: 65, reps: 10, completed: false },
                            { weight: 70, reps: 8, completed: false }
                        ]
                    },
                    {
                        id: '1-3',
                        name: 'Cable Chest Flyes',
                        sets: [
                            { weight: 40, reps: 15, completed: false },
                            { weight: 45, reps: 12, completed: false },
                            { weight: 50, reps: 10, completed: false }
                        ]
                    }
                ]
            },
            {
                id: '2',
                name: 'Upper Body Back Focus',
                description: 'Develop a strong and defined back with compound pulling movements',
                duration: 50,
                category: 'Strength',
                exercises: [
                    {
                        id: '2-1',
                        name: 'Barbell Rows',
                        sets: [
                            { weight: 135, reps: 12, completed: false },
                            { weight: 155, reps: 10, completed: false },
                            { weight: 175, reps: 8, completed: false }
                        ]
                    },
                    {
                        id: '2-2',
                        name: 'Lat Pulldowns',
                        sets: [
                            { weight: 120, reps: 12, completed: false },
                            { weight: 130, reps: 10, completed: false },
                            { weight: 140, reps: 8, completed: false }
                        ]
                    },
                    {
                        id: '2-3',
                        name: 'Seated Cable Rows',
                        sets: [
                            { weight: 140, reps: 12, completed: false },
                            { weight: 150, reps: 10, completed: false },
                            { weight: 160, reps: 8, completed: false }
                        ]
                    }
                ]
            },
            {
                id: '3',
                name: 'Lower Body Focus',
                description: 'Build powerful legs with this comprehensive lower body workout',
                duration: 55,
                category: 'Strength',
                exercises: [
                    {
                        id: '3-1',
                        name: 'Barbell Squats',
                        sets: [
                            { weight: 185, reps: 12, completed: false },
                            { weight: 205, reps: 10, completed: false },
                            { weight: 225, reps: 8, completed: false }
                        ]
                    },
                    {
                        id: '3-2',
                        name: 'Leg Extensions',
                        sets: [
                            { weight: 100, reps: 15, completed: false },
                            { weight: 110, reps: 12, completed: false },
                            { weight: 120, reps: 10, completed: false }
                        ]
                    },
                    {
                        id: '3-3',
                        name: 'Romanian Deadlifts',
                        sets: [
                            { weight: 165, reps: 12, completed: false },
                            { weight: 185, reps: 10, completed: false },
                            { weight: 205, reps: 8, completed: false }
                        ]
                    }
                ]
            }
        ];

        defaultWorkouts.forEach(workout => {
            this.workouts.set(workout.id, workout);
        });
    }

    initializeCalendar() {
        // Only initialize if calendar doesn't exist
        if (this.calendar) return;

        const calendarView = this.container.querySelector('#calendar-view');
        if (!calendarView) {
            console.error('Calendar container not found');
            return;
        }

        // Ensure calendar view is in the correct container
        const calendarViewContainer = this.container.querySelector('.calendar-view');
        if (calendarView.parentElement !== calendarViewContainer) {
            calendarViewContainer.appendChild(calendarView);
        }

        // Create calendar instance
        this.calendar = new Calendar(calendarView);
        this.calendar.setWorkoutManager(this);

        // Add existing workouts to calendar
        this.workouts.forEach((workout) => {
            if (workout.date) {
                this.calendar.addWorkout(new Date(workout.date), {
                    id: workout.id,
                    title: workout.name,
                    duration: `${workout.duration} min`,
                    type: workout.category?.toLowerCase() || 'other',
                    intensity: workout.intensity || 'Medium'
                });
            }
        });

        // Initial render
        this.calendar.renderCalendar();
    }

    renderEmptyState(container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-dumbbell"></i>
                <h3>No Workouts Yet</h3>
                <p>Create your first workout to get started!</p>
                <button class="primary-button" id="createWorkoutBtn">
                    <i class="fas fa-plus"></i> Create Workout
                </button>
            </div>
        `;

        const createWorkoutBtn = container.querySelector('#createWorkoutBtn');
        if (createWorkoutBtn) {
            createWorkoutBtn.addEventListener('click', () => this.createNewWorkout());
        }
    }

    async startWorkout(workout) {
        try {
            if (!workout) {
                console.error('No workout provided to startWorkout');
                throw new Error('No workout provided');
            }

            console.log('Starting workout:', workout.name, 'with data:', workout);

            // Clean up any existing workout sheet
            if (this.workoutSheet) {
                console.log('Cleaning up existing workout sheet');
                await this.cleanupWorkoutSheet();
            }

            // Create and initialize new workout sheet
            console.log('Creating new WorkoutSheet instance');
            this.workoutSheet = new WorkoutSheet(workout);

            // Initialize the workout sheet
            console.log('Initializing workout sheet');
            const initialized = await this.workoutSheet.initialize();
            if (!initialized) {
                console.error('Failed to initialize workout sheet');
                throw new Error('Failed to initialize workout sheet');
            }
            console.log('Workout sheet initialized successfully');

            // Save state
            this.activeWorkout = workout;
            const workoutState = {
                id: workout.id,
                startTime: Date.now(),
                elapsedTime: 0
            };
            localStorage.setItem('fitwings-current-workout', JSON.stringify(workoutState));
            console.log('Workout state saved:', workoutState);

            // Show the sheet
            console.log('Showing workout sheet');
            await this.workoutSheet.show();
            console.log('Workout sheet display triggered');

            return true;
        } catch (error) {
            console.error('Error in startWorkout:', error);
            await this.cleanupWorkoutSheet();
            throw error;
        }
    }

    async cleanupWorkoutSheet() {
        if (this.workoutSheet) {
            console.log('Starting workout sheet cleanup');
            try {
                await this.workoutSheet.close();
                this.workoutSheet = null;
                this.activeWorkout = null;
                console.log('Workout sheet cleanup completed');
            } catch (error) {
                console.error('Error during workout sheet cleanup:', error);
                // Force cleanup even if there's an error
                this.workoutSheet = null;
                this.activeWorkout = null;
            }
        }
    }

    hasActiveWorkout() {
        return this.activeWorkout !== null && this.workoutSheet && this.workoutSheet.isOpen;
    }

    showWorkoutSwitchModal(newWorkout) {
        const modal = document.createElement('div');
        modal.className = 'modal workout-switch-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Switch Workout?</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p>You have an active workout in progress. Would you like to switch to "${newWorkout.name}"?</p>
                    <div class="workout-switch-actions">
                        <button class="btn-switch-workout">
                            <i class="fas fa-exchange-alt"></i>
                            Switch Workout
                        </button>
                        <button class="btn-cancel">
                            <i class="fas fa-times"></i>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.close-btn');
        const switchBtn = modal.querySelector('.btn-switch-workout');
        const cancelBtn = modal.querySelector('.btn-cancel');

        const closeModal = () => {
            modal.remove();
        };

        const switchWorkout = () => {
            this.activeWorkout = newWorkout;
            if (this.workoutSheet) {
                this.workoutSheet.loadWorkout(newWorkout);
            }
            closeModal();
        };

        closeBtn?.addEventListener('click', closeModal);
        switchBtn?.addEventListener('click', switchWorkout);
        cancelBtn?.addEventListener('click', closeModal);
    }

    getActiveWorkout() {
        return this.activeWorkout;
    }

    createNewWorkout() {
        const workout = {
            id: Date.now().toString(),
            name: 'New Workout',
            description: 'Custom workout',
            exercises: [],
            duration: 30,
            category: 'Strength',
            isCustom: true
        };
        this.workouts.set(workout.id, workout);
        this.saveWorkouts();
        this.renderWorkoutCards();
    }

    editWorkout(workout) {
        // Implement edit workout functionality
        console.log('Edit workout:', workout);
    }

    deleteWorkout(workout) {
        this.workouts.delete(workout.id);
        this.saveWorkouts();

        // If this was the active workout, clear it
        if (this.activeWorkout && this.activeWorkout.id === workout.id) {
            this.activeWorkout = null;
            this.workoutSheet.close();
        }

        this.renderWorkoutCards();
    }

    saveWorkouts() {
        try {
            const workoutsArray = Array.from(this.workouts.values());
            localStorage.setItem('workouts', JSON.stringify(workoutsArray));
        } catch (error) {
            console.error('Error saving workouts:', error);
        }
    }

    // Update event listener setup
    setupEventListeners() {
        console.log('Setting up event listeners');
        
        // View toggle buttons
        const toggleButtons = this.container.querySelectorAll('.toggle-button');
        toggleButtons.forEach(button => {
            button.onclick = () => {
                const view = button.dataset.view;
                this.switchView(view);
            };
        });

        // Use event delegation for workout card actions
        const workoutCardsContainer = this.container.querySelector('.workout-cards');
        if (!workoutCardsContainer) {
            console.error('Workout cards container not found for event delegation');
            return;
        }

        // Direct event handling for workout cards container
        workoutCardsContainer.onclick = async (e) => {
            const actionBtn = e.target.closest('button.action-btn');
            if (!actionBtn) {
                console.log('No action button found in click path');
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (actionBtn.disabled) {
                console.log('Button is disabled, ignoring click');
                return;
            }

            const workoutId = actionBtn.dataset.workoutId;
            if (!workoutId) {
                console.error('No workout ID found on button');
                return;
            }

            const workout = this.workouts.get(workoutId);
            if (!workout) {
                console.error('Workout not found for ID:', workoutId);
                return;
            }

            const action = actionBtn.dataset.action;
            console.log('Processing action:', action, 'for workout:', workout.name);

            try {
                switch (action) {
                    case 'start':
                        // Disable the clicked button only
                        actionBtn.disabled = true;
                        actionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';

                        await this.startWorkout(workout);
                        break;
                        
                    case 'edit':
                        if (workout.isCustom) {
                            this.editWorkout(workout);
                        }
                        break;
                }
            } catch (error) {
                console.error('Error handling workout action:', error);
                // Re-enable only the clicked button
                actionBtn.disabled = false;
                if (actionBtn.classList.contains('start-btn')) {
                    actionBtn.innerHTML = '<i class="fas fa-play"></i> Start Workout';
                }
            }
        };

        // Listen for workout sheet events
        window.addEventListener('workoutSheetClosed', async () => {
            console.log('Workout sheet closed event received');
            await this.cleanupWorkoutSheet();
            
            // Reset all button states
            const startButtons = this.container.querySelectorAll('.start-btn');
            startButtons.forEach(button => {
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-play"></i> Start Workout';
            });
        });

        // Listen for calendar events if calendar exists
        if (this.calendar && this.calendar.container) {
            this.calendar.container.addEventListener('dateSelected', (e) => {
                if (e.detail.canAddWorkout) {
                    console.log('Can add workout on:', e.detail.date);
                }
            });

            this.calendar.container.addEventListener('workoutMoved', (e) => {
                console.log('Workout moved:', e.detail);
                const { workoutId, fromDate, toDate } = e.detail;
                
                const workout = this.workouts.get(workoutId);
                if (workout) {
                    workout.scheduledDate = toDate;
                    this.saveWorkouts();
                    this.renderWorkoutCards();
                }
            });
        }

        console.log('Event listeners setup complete');
    }
} 