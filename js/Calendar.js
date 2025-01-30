class WorkoutEvent {
    constructor(workout) {
        this.id = workout.id || Date.now().toString();
        this.title = workout.title;
        this.type = workout.type;
        this.duration = workout.duration;
        this.intensity = workout.intensity;
        this.color = workout.color || '#0066FF';
        this.isCompleted = workout.isCompleted || false;
    }
}

class Calendar {
    constructor(container) {
        if (!container) {
            console.error('Calendar container is required');
            return;
        }
        this.container = container;
        this.currentDate = new Date();
        this.selectedDate = null;
        this.workouts = new Map();
        this.draggedWorkout = null;
        this.workoutManager = null;
        this.currentView = 'month';
        
        // Clear any existing content and setup
        this.container.innerHTML = '';
        this.container.className = 'calendar-section';
        
        this.init();
    }

    setWorkoutManager(manager) {
        this.workoutManager = manager;
    }

    init() {
        this.createCalendarStructure();
        this.setupEventListeners();
        this.renderCalendar();
    }

    createCalendarStructure() {
        this.container.innerHTML = `
            <div class="calendar-container">
                <div class="calendar-header">
                    <div class="calendar-title-section">
                        <div class="calendar-controls">
                            <button class="nav-button prev-month" aria-label="Previous month">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <h2 class="calendar-title"></h2>
                            <button class="nav-button next-month" aria-label="Next month">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <div class="view-switcher">
                            <button class="view-option active" data-view="month">
                                <i class="fas fa-calendar-alt"></i>
                                Month
                            </button>
                            <button class="view-option" data-view="week">
                                <i class="fas fa-calendar-week"></i>
                                Week
                            </button>
                        </div>
                    </div>
                </div>
                <div class="calendar-content">
                    <div class="weekday-headers"></div>
                    <div class="calendar-days"></div>
                </div>
            </div>
        `;

        // Cache DOM elements after creating structure
        this.calendarTitle = this.container.querySelector('.calendar-title');
        this.calendarDays = this.container.querySelector('.calendar-days');
        this.weekdayHeaders = this.container.querySelector('.weekday-headers');
        this.viewSwitcher = this.container.querySelector('.view-switcher');
        this.viewOptions = this.container.querySelectorAll('.view-option');
        
        this.renderWeekdayHeaders();
    }

    setupEventListeners() {
        if (!this.container) {
            console.error('Cannot setup event listeners: container is null');
            return;
        }

        // Navigation buttons
        const prevButton = this.container.querySelector('.prev-month');
        const nextButton = this.container.querySelector('.next-month');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (this.calendarDays) {
                    this.calendarDays.classList.add('fade-out');
                    setTimeout(() => {
                        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                        this.renderCalendar();
                    }, 200);
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (this.calendarDays) {
                    this.calendarDays.classList.add('fade-out');
                    setTimeout(() => {
                        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                        this.renderCalendar();
                    }, 200);
                }
            });
        }

        // View switching
        if (this.viewOptions) {
            this.viewOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const view = option.dataset.view;
                    this.switchView(view);
                });
            });
        }

        // Day cell click handler using event delegation
        if (this.calendarDays) {
            this.calendarDays.addEventListener('click', (e) => {
                const dayCell = e.target.closest('.day-cell');
                if (!dayCell) return;

                const dateStr = dayCell.dataset.date;
                if (!dateStr) return;

                const date = new Date(dateStr);
                if (isNaN(date.getTime())) return;

                this.selectDate(date);
            });
        }

        // Workout event handling using event delegation
        this.container.addEventListener('click', (e) => {
            const workoutEvent = e.target.closest('.workout-event');
            if (workoutEvent) {
                e.stopPropagation(); // Prevent day cell selection
                const workoutId = workoutEvent.dataset.workoutId;
                if (workoutId) {
                    const workout = this.getWorkoutById(workoutId);
                    if (workout) {
                        this.showWorkoutDetails(workout);
                    }
                }
            }
        });

        // Setup drag and drop if elements exist
        if (this.calendarDays) {
            this.setupDragAndDrop();
        }
    }

    setupDragAndDrop() {
        // Drag start
        this.container.addEventListener('dragstart', (e) => {
            // First try to find the workout event from the target
            let workoutEvent = e.target;
            if (!workoutEvent.classList.contains('workout-event')) {
                workoutEvent = e.target.closest('.workout-event');
            }
            
            if (workoutEvent) {
                const dayCell = workoutEvent.closest('.day-cell');
                if (!dayCell) return;
                
                this.draggedWorkout = {
                    id: workoutEvent.dataset.workoutId,
                    sourceDate: dayCell.dataset.date
                };
                workoutEvent.classList.add('dragging');
                
                // Set drag image
                const dragImage = workoutEvent.cloneNode(true);
                dragImage.style.position = 'absolute';
                dragImage.style.top = '-1000px';
                document.body.appendChild(dragImage);
                e.dataTransfer.setDragImage(dragImage, 10, 10);
                setTimeout(() => dragImage.remove(), 0);
            }
        });

        // Drag end
        this.container.addEventListener('dragend', (e) => {
            const workoutEvent = e.target.closest('.workout-event');
            if (workoutEvent) {
                workoutEvent.classList.remove('dragging');
                this.container.querySelectorAll('.day-cell').forEach(day => {
                    day.classList.remove('drag-over');
                });
                this.draggedWorkout = null;
            }
        });

        // Drag over
        this.container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dayElement = e.target.closest('.day-cell');
            if (dayElement && this.draggedWorkout) {
                dayElement.classList.add('drag-over');
            }
        });

        // Drag leave
        this.container.addEventListener('dragleave', (e) => {
            const dayElement = e.target.closest('.day-cell');
            if (dayElement) {
                dayElement.classList.remove('drag-over');
            }
        });

        // Drop
        this.container.addEventListener('drop', (e) => {
            e.preventDefault();
            const dayElement = e.target.closest('.day-cell');
            if (dayElement && this.draggedWorkout) {
                const targetDate = dayElement.dataset.date;
                if (targetDate !== this.draggedWorkout.sourceDate) {
                    this.moveWorkout(
                        this.draggedWorkout.id,
                        new Date(this.draggedWorkout.sourceDate),
                        new Date(targetDate)
                    );
                }
                dayElement.classList.remove('drag-over');
            }
        });
    }

    renderWeekdayHeaders() {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.weekdayHeaders.innerHTML = weekdays.map(day => 
            `<div class="weekday-header">${day}</div>`
        ).join('');
    }

    renderCalendar() {
        if (!this.calendarTitle || !this.calendarDays) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Update title
        this.calendarTitle.textContent = `${this.getMonthName(month)} ${year}`;

        // Clear previous calendar days
        this.calendarDays.innerHTML = '';

        if (this.currentView === 'month') {
            this.renderMonthView();
        } else if (this.currentView === 'week') {
            this.renderWeekView();
        }
    }

    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Calculate dates
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = new Date(firstDay);
        startDay.setDate(startDay.getDate() - firstDay.getDay());

        let currentDay = new Date(startDay);
        let daysHTML = '';
        let animationOrder = 0;

        // Generate calendar days
        while (currentDay <= lastDay || currentDay.getDay() !== 0) {
            const isOtherMonth = currentDay.getMonth() !== month;
            daysHTML += this.createDayCell(currentDay, isOtherMonth, animationOrder++);
            currentDay.setDate(currentDay.getDate() + 1);
        }

        this.calendarDays.innerHTML = daysHTML;
        this.calendarDays.classList.remove('fade-out');

        // Reattach drag and drop handlers
        this.setupDragAndDrop();
    }

    renderWeekView() {
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        let daysHTML = '';
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(currentDay.getDate() + i);
            daysHTML += this.createDayCell(currentDay, false);
        }

        this.calendarDays.innerHTML = daysHTML;
        this.calendarDays.classList.remove('fade-out');

        // Reattach drag and drop handlers
        this.setupDragAndDrop();
    }

    createDayCell(date, isOtherMonth, animationOrder) {
        const dateStr = date.toISOString().split('T')[0];
        const isToday = date.toDateString() === new Date().toDateString();
        const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
        
        const classes = [
            'day-cell',
            isOtherMonth ? 'other-month' : '',
            isToday ? 'today' : '',
            isSelected ? 'selected' : ''
        ].filter(Boolean).join(' ');

        // Get workouts for this date
        const workouts = this.workouts.get(dateStr) || [];
        
        return `
            <div class="${classes}" data-date="${dateStr}" style="--animation-order: ${animationOrder}">
                <span class="day-number">${date.getDate()}</span>
                ${this.renderWorkoutList(workouts)}
            </div>
        `;
    }

    renderWorkoutList(workouts) {
        if (!workouts.length) return '';
        
        return `
            <div class="workout-list">
                ${workouts.map(workout => `
                    <div class="workout-event" data-workout-id="${workout.id}" draggable="true">
                        <span class="workout-title">${workout.title}</span>
                        <span class="workout-duration">${workout.duration}</span>
                        ${workout.isCompleted ? '<i class="fas fa-check-circle workout-completed-icon"></i>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    selectDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        
        // If clicking the same date that's already selected, unselect it
        if (this.selectedDate && this.isSameDay(this.selectedDate, date)) {
            this.selectedDate = null;
            const prevSelected = this.container.querySelector('.day-cell.selected');
            if (prevSelected) {
                prevSelected.classList.remove('selected');
            }
            return;
        }

        // Remove previous selection
        const prevSelected = this.container.querySelector('.day-cell.selected');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }

        // Add selection to new date
        const newSelected = this.container.querySelector(`[data-date="${dateStr}"]`);
        if (newSelected) {
            newSelected.classList.add('selected');
        }

        this.selectedDate = date;

        // Dispatch date selection event
        this.container.dispatchEvent(new CustomEvent('dateSelected', {
            detail: { date: this.selectedDate }
        }));
    }

    addWorkout(date, workout) {
        const dateStr = date.toISOString().split('T')[0];
        if (!this.workouts.has(dateStr)) {
            this.workouts.set(dateStr, []);
        }
        const workoutEvent = new WorkoutEvent(workout);
        this.workouts.get(dateStr).push(workoutEvent);
        this.renderCalendar();
    }

    moveWorkout(workoutId, fromDate, toDate) {
        const fromDateStr = fromDate.toISOString().split('T')[0];
        const toDateStr = toDate.toISOString().split('T')[0];
        
        if (this.workouts.has(fromDateStr)) {
            const workouts = this.workouts.get(fromDateStr);
            const workoutIndex = workouts.findIndex(w => w.id === workoutId);
            
            if (workoutIndex !== -1) {
                const workout = workouts[workoutIndex];
                workouts.splice(workoutIndex, 1);
                
                if (!this.workouts.has(toDateStr)) {
                    this.workouts.set(toDateStr, []);
                }
                this.workouts.get(toDateStr).push(workout);
                
                if (workouts.length === 0) {
                    this.workouts.delete(fromDateStr);
                }
                
                this.renderCalendar();
            }
        }
    }

    getWorkoutById(id) {
        for (const [_, workouts] of this.workouts) {
            const workout = workouts.find(w => w.id === id);
            if (workout) return workout;
        }
        return null;
    }

    showWorkoutDetails(workout) {
        if (this.workoutManager) {
            // Use workout manager to show details if available
            this.workoutManager.startWorkout(workout);
        } else {
            console.log('Show workout details:', workout);
        }
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    switchView(view) {
        if (view === this.currentView) return;

        // Update active state of view options
        this.viewOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.view === view);
        });

        // Add fade-out animation
        if (this.calendarDays) {
            this.calendarDays.classList.add('fade-out');
        }

        setTimeout(() => {
            this.currentView = view;
            this.renderCalendar();
            
            // Add fade-in animation
            if (this.calendarDays) {
                this.calendarDays.classList.remove('fade-out');
                this.calendarDays.classList.add('fade-in');
                
                // Remove the fade-in class after animation completes
                setTimeout(() => {
                    this.calendarDays.classList.remove('fade-in');
                }, 300);
            }
        }, 200);
    }

    getMonthName(month) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[month];
    }
}

export { Calendar }; 