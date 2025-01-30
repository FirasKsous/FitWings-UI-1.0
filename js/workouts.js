import { WorkoutController } from './controllers/WorkoutController.js';
import { WorkoutService } from './services/WorkoutService.js';
import { WorkoutSheet } from './components/WorkoutSheet.js';

// Initialize workout view
document.addEventListener('DOMContentLoaded', () => {
    const workoutSection = document.getElementById('workoutSection');
    if (workoutSection) {
        initializeWorkoutView();
    }
});

function initializeWorkoutView() {
    const workoutService = new WorkoutService();
    const workoutGrid = document.querySelector('.workout-grid');
    let currentWorkoutSheet = null;

    // Render initial workouts
    renderWorkouts();

    // Initialize view toggle
    initializeViewToggle();

    function renderWorkouts() {
        const workouts = workoutService.getWorkouts();
        if (!workoutGrid) return;

        // Clear existing content
        workoutGrid.innerHTML = '';

        // Render workout cards
        workouts.forEach(workout => {
            const card = createWorkoutCard(workout);
            workoutGrid.appendChild(card);
        });

        // Setup event listeners
        setupWorkoutCardListeners();
    }

    function createWorkoutCard(workout) {
        const card = document.createElement('div');
        card.className = 'workout-card';
        card.dataset.id = workout.id;
        
        card.innerHTML = `
            <div class="workout-type">
                <i class="fas fa-dumbbell"></i> ${workout.category}
            </div>
            <h2 class="workout-title">${workout.name}</h2>
            <p class="workout-description">${workout.description}</p>
            <div class="workout-meta">
                <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    ${workout.duration} mins
                </div>
                <div class="meta-item">
                    <i class="fas fa-dumbbell"></i>
                    ${workout.exercises.length} exercises
                </div>
            </div>
            <button class="start-workout-btn">
                <i class="fas fa-play"></i>
                Start Workout
            </button>
        `;

        return card;
    }

    async function setupWorkoutCardListeners() {
        const startButtons = workoutGrid.querySelectorAll('.start-workout-btn');
        
        startButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (button.classList.contains('loading')) return;
                
                const workoutCard = button.closest('.workout-card');
                if (!workoutCard) return;

                const workoutId = workoutCard.dataset.id;
                if (!workoutId) return;

                // Add loading state
                button.classList.add('loading');
                button.innerHTML = '<div class="spinner"></div> Starting...';

                try {
                    // Clean up any existing workout sheet
                    if (currentWorkoutSheet) {
                        await new Promise(resolve => {
                            currentWorkoutSheet.close();
                            setTimeout(resolve, 300); // Wait for close animation
                        });
                    }

                    // Get workout data
                    const workout = workoutService.getWorkoutById(workoutId);
                    if (!workout) {
                        throw new Error('Workout not found');
                    }

                    console.log('Starting workout:', workout.name);
                    
                    // Create and initialize new workout sheet
                    currentWorkoutSheet = new WorkoutSheet(workout);
                    const initialized = await currentWorkoutSheet.initialize();
                    
                    if (!initialized) {
                        throw new Error('Failed to initialize workout sheet');
                    }
                    
                    console.log('Workout sheet initialized successfully');
                } catch (error) {
                    console.error('Failed to start workout:', error);
                    currentWorkoutSheet = null;
                } finally {
                    // Reset button state
                    button.classList.remove('loading');
                    button.innerHTML = '<i class="fas fa-play"></i> Start Workout';
                    button.disabled = false;
                }
            });
        });
    }

    // Handle workout sheet closure
    window.addEventListener('workoutSheetClosed', () => {
        console.log('Workout sheet closed event received');
        
        // Save workout state if needed
        if (currentWorkoutSheet && currentWorkoutSheet.workout) {
            workoutService.saveWorkoutState(currentWorkoutSheet.workout);
        }
        
        // Reset current workout sheet
        currentWorkoutSheet = null;
        
        // Reset all button states
        const startButtons = workoutGrid.querySelectorAll('.start-workout-btn');
        startButtons.forEach(button => {
            button.disabled = false;
            button.classList.remove('loading');
            button.innerHTML = '<i class="fas fa-play"></i> Start Workout';
        });
    });
}

function initializeViewToggle() {
    const toggleButtons = document.querySelectorAll('.view-toggle .toggle-btn');
    const listView = document.querySelector('.workout-list-view');
    const calendarView = document.querySelector('.workout-calendar-view');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update button states
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update view
            const view = button.dataset.view;
            if (view === 'list') {
                listView?.classList.remove('hidden');
                calendarView?.classList.add('hidden');
            } else {
                listView?.classList.add('hidden');
                calendarView?.classList.remove('hidden');
            }
        });
    });
}