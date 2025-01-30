// Import components
import { Settings } from './js/components/Settings.js';
import { ThemeService } from './js/services/ThemeService.js';
import { Workouts } from './js/components/Workouts.js';
import './styles/main.css';
import './styles/components/workouts.css';

// Initialize theme service
const themeService = new ThemeService();
themeService.initialize();

// Initialize workout manager only (no direct workout sheet initialization)
let workoutsManager = null;

// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing app...');
    
    // Initialize theme first to avoid flash of wrong theme
    setupThemeSettings();
    
    initializeLocalStorage();
    initializeWorkoutComponents();
    setupEventListeners();
    setupNavigation();
    showInitialSection();
});

function initializeWorkoutComponents() {
    try {
        let workoutSection = document.getElementById('workoutSection');
        if (!workoutSection) {
            console.log('Creating workout section...');
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                const section = document.createElement('section');
                section.id = 'workoutSection';
                section.className = 'section';
                mainContent.appendChild(section);
                workoutSection = section;
            }
        }
        
        if (workoutSection) {
            workoutsManager = new Workouts(workoutSection);
            console.log('Workouts manager initialized');
        } else {
            console.error('Could not create or find workout section');
        }
    } catch (error) {
        console.error('Error initializing Workouts manager:', error);
    }
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
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggleSidebar');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Handle sidebar toggle
    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });
    }

    // Handle navigation
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

function handleWorkoutStart(workout = null) {
    if (!workoutsManager) {
        const workoutSection = document.getElementById('workoutSection');
        if (!workoutSection) {
            console.error('Workout section not found');
            return;
        }
        workoutsManager = new Workouts(workoutSection);
    }
    
    if (workout) {
        workoutsManager.startWorkout(workout);
    } else {
        const defaultWorkout = getDefaultWorkout();
        workoutsManager.startWorkout(defaultWorkout);
    }
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
    const defaultData = {
        workouts: [
            {
                id: '1',
                name: 'Full Body Strength',
                description: 'Focus on chest, shoulders, and triceps with compound movements',
                duration: 45,
                category: 'strength',
                date: new Date().toISOString(),
                completed: false,
                favorite: true,
                exercises: [
                    {
                        id: '1-1',
                        name: 'Bench Press',
                        sets: [
                            { weight: 135, reps: 12, completed: false },
                            { weight: 155, reps: 10, completed: false },
                            { weight: 175, reps: 8, completed: false }
                        ]
                    }
                ]
            },
            {
                id: '2',
                name: 'HIIT Cardio',
                description: 'High-intensity interval training for maximum calorie burn',
                duration: 30,
                category: 'hiit',
                date: new Date(Date.now() + 86400000).toISOString(),
                completed: false,
                favorite: false,
                exercises: [
                    {
                        id: '2-1',
                        name: 'Burpees',
                        sets: [
                            { reps: 20, completed: false },
                            { reps: 20, completed: false },
                            { reps: 20, completed: false }
                        ]
                    }
                ]
            }
        ],
        settings: {
            theme: 'dark',
            units: 'metric',
            notifications: true
        }
    };

    if (!localStorage.getItem('fitwings-data')) {
        localStorage.setItem('fitwings-data', JSON.stringify(defaultData));
    }
}