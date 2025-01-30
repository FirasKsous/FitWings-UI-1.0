import { WorkoutSheet } from '../components/WorkoutSheet.js';
import { WorkoutService } from '../services/WorkoutService.js';

export class WorkoutController {
    constructor() {
        console.log('Creating WorkoutController instance');
        this.initialized = false;
        this.workoutGrid = null;
        this.workoutSection = null;
        this.workouts = [];
        this.workoutService = new WorkoutService();
        this.currentWorkoutSheet = null;
        this.setupEventListeners();
    }

    initialize() {
        console.log('Initializing WorkoutController');
        
        // Find the workout section first
        this.workoutSection = document.getElementById('workoutSection');
        console.log('Workout section found:', this.workoutSection);
        
        if (!this.workoutSection) {
            console.error('Workout section not found');
            return false;
        }
        
        // Check if section is visible
        const isVisible = this.workoutSection.style.display !== 'none' && 
                         !this.workoutSection.classList.contains('hidden');
        console.log('Workout section visibility:', isVisible);
        
        if (!isVisible) {
            console.log('Workout section is not visible, initialization deferred');
            return false;
        }
        
        // Find the workout grid
        this.workoutGrid = this.workoutSection.querySelector('.workout-grid');
        console.log('Workout grid found:', this.workoutGrid);
        
        if (!this.workoutGrid) {
            console.error('Workout grid not found');
            return false;
        }
        
        try {
            if (!this.initialized) {
                this.clearWorkoutGrid();
                this.loadWorkouts();
                this.setupEventListeners();
                this.initialized = true;
                console.log('WorkoutController initialization complete');
            } else {
                console.log('WorkoutController already initialized');
            }
            return true;
        } catch (error) {
            console.error('Error during WorkoutController initialization:', error);
            this.initialized = false;
            return false;
        }
    }

    clearWorkoutGrid() {
        console.log('Clearing workout grid');
        if (!this.workoutGrid) {
            console.error('Cannot clear workout grid: grid not initialized');
            return;
        }
        
        while (this.workoutGrid.firstChild) {
            this.workoutGrid.removeChild(this.workoutGrid.firstChild);
        }
        console.log('Workout grid cleared');
    }

    loadWorkouts() {
        try {
            console.log('Loading workouts from localStorage');
            const workoutsData = localStorage.getItem('workouts');
            
            if (workoutsData) {
                this.workouts = JSON.parse(workoutsData);
                console.log('Loaded workouts:', this.workouts);
            } else {
                console.log('No workouts found in localStorage, initializing defaults');
                this.workouts = this.getDefaultWorkouts();
                this.saveWorkouts(this.workouts);
            }
            
            if (Array.isArray(this.workouts) && this.workouts.length > 0) {
                this.renderWorkouts(this.workouts);
                    } else {
                console.error('No valid workouts to render');
                throw new Error('No valid workouts found');
            }
        } catch (error) {
            console.error('Error loading workouts:', error);
            throw error;
        }
    }

    renderWorkouts() {
        if (!this.workoutGrid) {
            console.error('Cannot render workouts: workout grid not found');
            return;
        }

        console.log('Rendering workouts:', this.workouts);
        this.clearWorkoutGrid();

        this.workouts.forEach(workout => {
            try {
                const card = this.createWorkoutCardElement(workout);
                if (card) {
                    this.workoutGrid.appendChild(card);
                    console.log(`Rendered workout card: ${workout.name}`);
                }
            } catch (error) {
                console.error(`Error creating card for workout ${workout.name}:`, error);
            }
        });

        console.log('Finished rendering workouts');
        this.setupEventListeners();
    }

    getDefaultWorkouts() {
        return [
            {
                id: '1',
                name: 'Full Body Strength',
                description: 'A comprehensive full-body workout focusing on major muscle groups with compound movements for maximum strength gains.',
                duration: 60,
                category: 'Strength',
                isFavorite: false,
                exercises: [
                    {
                        name: 'Barbell Squat',
                        sets: [
                            { weight: 60, reps: 10, completed: false },
                            { weight: 70, reps: 8, completed: false },
                            { weight: 80, reps: 6, completed: false }
                        ]
                    },
                    {
                        name: 'Bench Press',
                        sets: [
                            { weight: 50, reps: 10, completed: false },
                            { weight: 60, reps: 8, completed: false },
                            { weight: 70, reps: 6, completed: false }
                        ]
                    }
                ]
            },
            {
                id: '2',
                name: 'HIIT Cardio Blast',
                description: 'High-intensity interval training to boost cardiovascular fitness and maximize calorie burn in minimal time.',
                duration: 30,
                category: 'Cardio',
                isFavorite: true,
                exercises: [
                    {
                        name: 'Burpees',
                        sets: [
                            { reps: 15, completed: false },
                            { reps: 15, completed: false },
                            { reps: 15, completed: false }
                        ]
                    }
                ]
            }
        ];
    }

    setupEventListeners() {
        if (!this.workoutGrid) {
            console.error('Cannot setup event listeners: workout grid not found');
            return;
        }

        const startButtons = this.workoutGrid.querySelectorAll('.start-workout');
        console.log('Found start buttons:', startButtons.length);

        startButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Start button clicked');
                
                const workoutCard = button.closest('.workout-card');
                if (!workoutCard) {
                    console.error('Workout card not found');
                    return;
                }

                const workoutId = workoutCard.dataset.workoutId;
                console.log('Clicked workout ID:', workoutId);

                const workout = this.workouts.find(w => w.id === workoutId);
                if (!workout) {
                    console.error('Workout not found for ID:', workoutId);
                    return;
                }

                // Check both global variable and window object
                const sheet = workoutSheet || window.workoutSheet;
                if (!sheet) {
                    console.error('WorkoutSheet not found in either global or window scope');
                    return;
                }

                try {
                    console.log('Opening workout with sheet:', sheet);
                    sheet.open(workout);
                } catch (error) {
                    console.error('Error opening workout sheet:', error);
                    console.error('Error details:', error.message);
                }
            });
        });

        // Setup favorite button listeners
        const favoriteButtons = this.workoutGrid.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const workoutCard = button.closest('.workout-card');
                const workoutId = workoutCard.dataset.workoutId;
                this.toggleFavorite(workoutId);
            });
        });

        document.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('.action-btn');
            if (!actionBtn) return;

            const workoutCard = actionBtn.closest('.workout-card');
            if (!workoutCard) return;

            const workoutId = parseInt(workoutCard.dataset.id);
            const action = actionBtn.dataset.action;

            if (action === 'start') {
                this.startWorkout(workoutId);
            } else if (action === 'edit') {
                this.editWorkout(workoutId);
            }
        });
    }

    toggleFavorite(workoutId) {
        const workout = this.workouts.find(w => w.id === workoutId);
        if (workout) {
            workout.isFavorite = !workout.isFavorite;
            this.saveWorkouts(this.workouts);
            console.log(`Toggled favorite state for workout: ${workout.name}`);
        }
    }

    saveWorkouts(workouts) {
        try {
            localStorage.setItem('workouts', JSON.stringify(workouts));
            console.log('Workouts saved successfully');
        } catch (error) {
            console.error('Error saving workouts:', error);
        }
    }

    createWorkoutCardElement(workout) {
        if (!workout || !workout.id) {
            console.error('Invalid workout data:', workout);
            return null;
        }

        console.log(`Creating workout card for: ${workout.name}`);
        const card = document.createElement('div');
        card.className = 'workout-card';
        card.dataset.workoutId = workout.id;
        
        card.innerHTML = `
            <div class="workout-card-header">
                <h3>${workout.name}</h3>
                <button class="favorite-btn ${workout.isFavorite ? 'active' : ''}" aria-label="Toggle favorite">
                    <i class="fas fa-star"></i>
                </button>
            </div>
            <div class="workout-description">
                <p>${workout.description}</p>
            </div>
                <div class="workout-meta">
                <span><i class="fas fa-clock"></i> ${workout.duration} min</span>
                <span><i class="fas fa-dumbbell"></i> ${workout.exercises.length} exercises</span>
                <span><i class="fas fa-tag"></i> ${workout.category}</span>
                </div>
            <div class="workout-card-footer">
                <button class="start-workout">
                        <i class="fas fa-play"></i> Start
                    </button>
            </div>
        `;
        
        return card;
    }

    async startWorkout(workoutId) {
        try {
            console.log('Starting workout:', workoutId);
            
            // Get the workout data
            const workout = this.workoutService.getWorkoutById(workoutId);
            if (!workout) {
                console.error('Workout not found:', workoutId);
                return;
            }

            // Close any existing workout sheet
            if (this.currentWorkoutSheet) {
                this.currentWorkoutSheet.close();
            }

            // Create and initialize new workout sheet
            this.currentWorkoutSheet = new WorkoutSheet(workout);
            const initialized = this.currentWorkoutSheet.initialize();
            
            if (!initialized) {
                console.error('Failed to initialize workout sheet');
                return;
            }

            // Show the workout sheet
            this.currentWorkoutSheet.show();

            // Save current workout state
            this.workoutService.saveCurrentWorkout(workout);

        } catch (error) {
            console.error('Error starting workout:', error);
        }
    }

    editWorkout(workoutId) {
        // Implement edit workout functionality
        console.log('Edit workout:', workoutId);
    }

    saveWorkoutProgress(workoutId, progress) {
        return this.workoutService.saveWorkoutProgress(workoutId, progress);
    }

    getCurrentWorkout() {
        return this.workoutService.getCurrentWorkout();
    }

    clearCurrentWorkout() {
        this.workoutService.clearCurrentWorkout();
        if (this.currentWorkoutSheet) {
            this.currentWorkoutSheet.close();
            this.currentWorkoutSheet = null;
        }
    }
}