// Import components
import { Workouts } from './components/Workouts.js';
import { ThemeService } from './services/ThemeService.js';

// Initialize theme service
const themeService = new ThemeService();
themeService.initialize();

// Initialize workouts manager
let workoutsManager = null;

// Initialize workouts manager when container is available
const workoutsContainer = document.querySelector('#workoutSection');
if (workoutsContainer) {
    workoutsManager = new Workouts(workoutsContainer);
}

// Theme toggle functionality
const themeToggle = document.querySelector('#theme-toggle');
if (themeToggle) {
    themeToggle.checked = themeService.isDarkMode();
    themeToggle.addEventListener('change', () => {
        themeService.toggleTheme();
    });
}

// Subscribe to theme changes
themeService.subscribe((theme) => {
    if (themeToggle) {
        themeToggle.checked = theme === 'dark';
    }
    console.log('Theme changed:', theme);
});

function handleWorkoutStart(workout = null) {
    if (!workoutsManager) {
        const workoutSection = document.getElementById('workoutSection');
        if (!workoutSection) {
            console.error('Workout section not found');
            return;
        }
        workoutsManager = new Workouts(workoutSection);
    }
    
    const workoutToStart = workout || getDefaultWorkout();
    workoutsManager.startWorkout(workoutToStart);
}

function getDefaultWorkout() {
    return {
        id: Date.now().toString(),
        name: 'New Workout',
        exercises: [],
        duration: 30,
        description: 'Custom workout'
    };
}

function initializeApp() {
    console.log('Initializing app');
    
    // Initialize theme first to avoid flash of wrong theme
    setupThemeSettings();
    
    // Then initialize other components
    initializeLocalStorage();
    setupEventListeners();
    setupNavigation();
    showInitialSection();
}

function setupEventListeners() {
    const startWorkoutBtn = document.getElementById('startWorkoutBtn');
    const createWorkoutBtn = document.getElementById('createWorkoutBtn');
    
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', () => handleWorkoutStart());
    }
    
    if (createWorkoutBtn) {
        createWorkoutBtn.addEventListener('click', () => handleWorkoutStart());
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
            updateActiveLink(link);
            
            // Render workout list when navigating to workouts section
            if (targetId === 'workouts') {
                renderWorkoutList();
            }
        });
    });
}

function showInitialSection() {
    // Get section from URL hash or default to dashboard
    const hash = window.location.hash.substring(1);
    const validSections = ['dashboard', 'workouts', 'nutrition', 'progress', 'settings'];
    const initialSection = validSections.includes(hash) ? hash : 'dashboard';
    
    console.log(`Initial section: ${initialSection}`);
    showSection(initialSection);
    
    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        if (validSections.includes(newHash)) {
            showSection(newHash);
        }
    });
}

function showSection(sectionId) {
    console.log(`Attempting to show section: ${sectionId}`);
    
    // Map section IDs to match HTML
    const sectionMap = {
        'workouts': 'workout',
        'dashboard': 'dashboard',
        'nutrition': 'nutrition',
        'progress': 'progress',
        'settings': 'settings'
    };
    
    const mappedId = sectionMap[sectionId] || sectionId;
    
    // If leaving workouts section and there's an active workout, check with workouts manager
    if (sectionId !== 'workouts' && workoutsManager && workoutsManager.hasActiveWorkout()) {
        console.log('Cannot change section while workout is active');
        return;
    }

    // Hide all sections first
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Show the target section
    const targetSection = document.getElementById(`${mappedId}Section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        console.log(`Successfully showed section: ${sectionId}`);
        
        // Update navigation
        updateActiveLink(document.querySelector(`.nav-links a[href="#${sectionId}"]`));
        
        // Update URL without triggering navigation
        window.history.pushState({}, '', `#${sectionId}`);
        
        // Special handling for workouts section
        if (sectionId === 'workouts') {
            if (!workoutsManager) {
                workoutsManager = new Workouts(targetSection);
            }
            workoutsManager.renderWorkoutCards();
        }
    } else {
        console.error(`Section not found: ${mappedId}Section`);
    }
}

function updateActiveLink(activeLink) {
    if (!activeLink) return;
    
    // Remove active class from all links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
    });
    
    // Add active class to current link
    activeLink.parentElement.classList.add('active');
}

function renderWorkoutList() {
    console.log('Rendering workout list');
    if (!workoutsManager) {
        const workoutSection = document.getElementById('workoutSection');
        if (workoutSection) {
            workoutsManager = new Workouts(workoutSection);
        } else {
            console.error('Workout section not found');
            return;
        }
    }
    workoutsManager.renderWorkoutCards();
}

function initializeLocalStorage() {
    if (!localStorage.getItem('workouts')) {
        console.log('Initializing default workouts in localStorage');
        const defaultWorkouts = getDefaultWorkouts();
        localStorage.setItem('workouts', JSON.stringify(defaultWorkouts));
    }
}

function getDefaultWorkouts() {
    return [
        {
            id: '1',
            name: 'Upper Body Chest Focus',
            description: 'Build strength and muscle mass with this chest-focused upper body workout',
            duration: 45,
            category: 'Strength',
            exercises: [
                {
                    name: 'Barbell Bench Press',
                    sets: [
                        { weight: 135, reps: 12, completed: false },
                        { weight: 155, reps: 10, completed: false },
                        { weight: 175, reps: 8, completed: false }
                    ]
                }
            ]
        }
    ];
}

function setupThemeSettings() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.error('Theme toggle element not found');
        return;
    }

    // Set initial state
    themeToggle.checked = themeService.isDarkMode();
    
    // Theme toggle handler
    themeToggle.addEventListener('change', () => {
        themeService.toggleTheme();
    });

    // Subscribe to theme changes
    themeService.subscribe((theme) => {
        themeToggle.checked = theme === 'dark';
        console.log(`Theme changed to: ${theme}`);
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);