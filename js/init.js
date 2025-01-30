import { Calendar } from './Calendar.js';

// Single calendar instance
let calendar = null;

// Initialize calendar only once
function initializeCalendar() {
    if (calendar) {
        calendar.renderCalendar();
        return;
    }

    const calendarView = document.getElementById('calendar-view');
    if (!calendarView) {
        console.error('Calendar view container not found');
        return;
    }

    // Clear any existing content
    calendarView.innerHTML = '';
    
    // Create new calendar instance
    calendar = new Calendar(calendarView);

    // Add sample workouts
    const today = new Date();
    calendar.addWorkout(today, {
        id: 'test-1',
        title: 'Morning Workout',
        duration: '45 min',
        type: 'strength',
        intensity: 'Medium'
    });

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    calendar.addWorkout(tomorrow, {
        id: 'test-2',
        title: 'Evening Cardio',
        duration: '30 min',
        type: 'cardio',
        intensity: 'High'
    });
}

// Handle view switching
function setupViewSwitching() {
    const toggleButtons = document.querySelectorAll('.toggle-button');
    const views = document.querySelectorAll('.view');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const viewType = button.dataset.view;
            
            // Update button states
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update view states
            views.forEach(view => {
                if (view.id === `${viewType}-view`) {
                    view.classList.add('active');
                    if (viewType === 'calendar') {
                        initializeCalendar();
                    }
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    try {
        setupViewSwitching();
        
        // Initialize calendar if we're starting in calendar view
        const calendarButton = document.querySelector('[data-view="calendar"]');
        if (calendarButton?.classList.contains('active')) {
            initializeCalendar();
        }
    } catch (error) {
        console.error('Failed to initialize calendar:', error);
    }
}); 