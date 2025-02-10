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

export class Calendar {
    constructor(container) {
        if (!container) {
            console.error('Calendar container is required');
            return;
        }
        this.container = container;
        this.currentView = 'week';
        this.currentDate = new Date();
        this.workouts = new Map();
        this.draggedElement = null;
        this.ghostElement = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.sourceDate = null;
        this._dragDropListeners = null;

        // Initialize immediately
        this.init();
    }

    init() {
        console.log('Initializing calendar...');
        this.createCalendarStructure();
        this.setupEventListeners();
        this.setupDragAndDrop();
        
        // Add sample workouts for testing
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const sampleWorkouts = [
            {
                id: '1',
                title: 'Upper Body Strength',
                duration: '45 min',
                type: 'Strength',
                intensity: 'High',
                color: '#4F46E5',
                isCompleted: false
            },
            {
                id: '2',
                title: 'HIIT Cardio',
                duration: '30 min',
                type: 'Cardio',
                intensity: 'High',
                color: '#EF4444',
                isCompleted: false
            },
            {
                id: '3',
                title: 'Lower Body Focus',
                duration: '50 min',
                type: 'Strength',
                intensity: 'Medium',
                color: '#8B5CF6',
                isCompleted: false
            }
        ];

        // Add workouts to today's date
        const todayStr = this.formatDate(today);
        this.workouts.set(todayStr, sampleWorkouts.map(workout => new WorkoutEvent(workout)));
        
        this.renderCalendar();
        console.log('Calendar initialized with workouts:', this.workouts);
    }

    createCalendarStructure() {
        this.container.innerHTML = `
            <div class="calendar-section">
                <div class="calendar-header">
                    <div class="calendar-controls">
                        <button class="nav-button prev" aria-label="Previous">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="nav-button today" aria-label="Today">Today</button>
                        <h2 class="calendar-title"></h2>
                        <button class="nav-button next" aria-label="Next">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="view-switcher">
                        <button class="view-button" data-view="day">Day</button>
                        <button class="view-button active" data-view="week">Week</button>
                        <button class="view-button" data-view="month">Month</button>
                    </div>
                </div>
                <div class="calendar-content">
                    <div class="weekday-headers"></div>
                    <div class="calendar-days"></div>
                </div>
                <div class="calendar-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading calendar...</p>
                </div>
                <div class="calendar-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p class="error-message"></p>
                    <button class="retry-button">
                        <i class="fas fa-redo"></i>
                        Retry
                    </button>
                </div>
            </div>
        `;

        // Cache DOM elements
        this.calendarTitle = this.container.querySelector('.calendar-title');
        this.calendarDays = this.container.querySelector('.calendar-days');
        this.weekdayHeaders = this.container.querySelector('.weekday-headers');
        this.loadingElement = this.container.querySelector('.calendar-loading');
        this.errorElement = this.container.querySelector('.calendar-error');
        
        this.renderWeekdayHeaders();
    }

    renderWeekdayHeaders() {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.weekdayHeaders.innerHTML = weekdays.map(day => 
            `<div class="weekday-header">${day}</div>`
        ).join('');
    }

    setupEventListeners() {
        // Navigation buttons
        this.container.querySelector('.prev').addEventListener('click', () => this.navigate(-1));
        this.container.querySelector('.next').addEventListener('click', () => this.navigate(1));
        this.container.querySelector('.today').addEventListener('click', () => {
            this.currentDate = new Date();
            this.renderCalendar();
        });

        // View switcher
        const viewButtons = this.container.querySelectorAll('.view-button');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const newView = button.dataset.view;
                if (newView !== this.currentView) {
                    this.switchView(newView);
                }
            });
        });

        // Retry button
        this.container.querySelector('.retry-button')?.addEventListener('click', () => this.retryLoad());
    }

    async switchView(newView) {
        const daysContainer = this.container.querySelector('.calendar-days');
        const viewButtons = this.container.querySelectorAll('.view-button');

        // Update buttons
        viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === newView);
        });

        // Animate view transition
        daysContainer.classList.add('fade-out');
        await new Promise(resolve => setTimeout(resolve, 300));

        this.currentView = newView;
        this.renderCalendar();

        daysContainer.classList.remove('fade-out');
        daysContainer.classList.add('fade-in');
        setTimeout(() => daysContainer.classList.remove('fade-in'), 300);
    }

    navigate(direction) {
        switch (this.currentView) {
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() + direction);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
                break;
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() + direction);
                break;
        }
        this.renderCalendar();
    }

    updateTitle() {
        if (!this.calendarTitle) return;

        const options = { year: 'numeric', month: 'long' };
        let title = '';

        switch (this.currentView) {
            case 'day':
                title = this.currentDate.toLocaleDateString(undefined, { ...options, day: 'numeric' });
                break;
            case 'week': {
                const weekStart = new Date(this.currentDate);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                title = `${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString(undefined, { ...options, day: 'numeric' })}`;
                break;
            }
            case 'month':
                title = this.currentDate.toLocaleDateString(undefined, options);
                break;
        }

        this.calendarTitle.textContent = title;
    }

    renderCalendar() {
        this.updateTitle();
        if (!this.calendarDays) return;

        this.calendarDays.className = `calendar-days ${this.currentView}-view`;
        
        switch (this.currentView) {
            case 'day':
                this.renderDayView();
                break;
            case 'week':
                this.renderWeekView();
                break;
            case 'month':
                this.renderMonthView();
                break;
        }
    }

    renderDayView() {
        this.calendarDays.innerHTML = `
            <div class="day-column" data-date="${this.formatDate(this.currentDate)}">
                <div class="day-header">
                    <span class="day-name">${this.currentDate.toLocaleDateString(undefined, { weekday: 'long' })}</span>
                    <span class="day-number">${this.currentDate.getDate()}</span>
                </div>
                <div class="day-content">
                    ${this.renderWorkouts(this.currentDate) || this.renderEmptyDay()}
                </div>
            </div>
        `;
    }

    renderWeekView() {
        const weekStart = new Date(this.currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        let weekHtml = '';
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const isToday = this.isSameDay(date, new Date());
            
            weekHtml += `
                <div class="week-day-column${isToday ? ' today' : ''}" data-date="${this.formatDate(date)}">
                    <div class="day-header">
                        <span class="day-name">${date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                        <span class="day-number">${date.getDate()}</span>
                    </div>
                    <div class="day-content">
                        ${this.renderWorkouts(date) || this.renderEmptyDay()}
                    </div>
                </div>
            `;
        }
        this.calendarDays.innerHTML = weekHtml;
    }

    renderMonthView() {
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        let monthHtml = '';
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
            const isToday = this.isSameDay(date, new Date());
            
            monthHtml += `
                <div class="month-day-cell${isCurrentMonth ? ' current-month' : ' other-month'}${isToday ? ' today' : ''}" 
                     data-date="${this.formatDate(date)}">
                    <div class="day-header">
                        <span class="day-number">${date.getDate()}</span>
                    </div>
                    <div class="day-content">
                        ${this.renderWorkouts(date) || this.renderEmptyDay()}
                    </div>
                </div>
            `;

            if (date >= lastDay && (i + 1) % 7 === 0) break;
        }
        this.calendarDays.innerHTML = monthHtml;
    }

    renderWorkouts(date) {
        const dateStr = this.formatDate(date);
        const workouts = this.workouts.get(dateStr) || [];
        console.log('Rendering workouts for date:', dateStr, workouts);
        
        if (workouts.length === 0) {
            return this.renderEmptyDay();
        }
        
        return `
            <div class="day-workouts">
                ${workouts.map(workout => `
                    <div class="workout-card" draggable="true" data-workout-id="${workout.id}">
                        <div class="workout-time">
                            <i class="fas fa-clock"></i>
                            ${workout.duration}
                        </div>
                        <div class="workout-title">${workout.title}</div>
                        <div class="workout-type">
                            <i class="fas fa-dumbbell"></i>
                            ${workout.type}
                        </div>
                        ${workout.isCompleted ? '<div class="workout-status completed"><i class="fas fa-check"></i></div>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyDay() {
        return `
            <div class="empty-day">
                <i class="fas fa-plus-circle"></i>
                <p>No workouts scheduled</p>
            </div>
        `;
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    // Loading and error handling methods
    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('visible');
        }
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.remove('visible');
        }
    }

    showError(message) {
        if (this.errorElement) {
            const messageEl = this.errorElement.querySelector('.error-message');
            if (messageEl) {
                messageEl.textContent = message || 'Error loading calendar';
            }
            this.errorElement.classList.add('visible');
        }
    }

    hideError() {
        if (this.errorElement) {
            this.errorElement.classList.remove('visible');
        }
    }

    async retryLoad() {
        this.hideError();
        this.showLoading();
        try {
            await this.renderCalendar();
        } catch (error) {
            console.error('Failed to reload calendar:', error);
            this.showError('Failed to reload calendar');
        } finally {
            this.hideLoading();
        }
    }

    setWorkoutManager(manager) {
        this.workoutManager = manager;
    }

    addWorkout(date, workout) {
        console.log('Adding workout to calendar:', workout);
        const dateStr = this.formatDate(date);
        if (!this.workouts.has(dateStr)) {
            this.workouts.set(dateStr, []);
        }
        const workoutEvent = new WorkoutEvent(workout);
        this.workouts.get(dateStr).push(workoutEvent);
        this.renderCalendar();
    }

    async moveWorkout(workoutId, fromDate, toDate) {
        try {
            // Validate input parameters
            if (!workoutId) {
                console.error('moveWorkout: workoutId is missing');
                return;
            }
            
            if (!fromDate || !toDate) {
                console.error('moveWorkout: invalid dates provided', { fromDate, toDate });
                return;
            }
            
            this.showLoading();
            
        const fromDateStr = fromDate.toISOString().split('T')[0];
        const toDateStr = toDate.toISOString().split('T')[0];
        
            // Check if workout exists in source date
            if (!this.workouts.has(fromDateStr)) {
                console.error('moveWorkout: source date not found', fromDateStr);
                return;
            }
            
            const workouts = this.workouts.get(fromDateStr);
            if (!Array.isArray(workouts)) {
                console.error('moveWorkout: invalid workouts array for date', fromDateStr);
                return;
            }
            
            const workoutIndex = workouts.findIndex(w => w && w.id === workoutId);
            
            if (workoutIndex === -1) {
                console.error('moveWorkout: workout not found in source date', { workoutId, fromDateStr });
                return;
            }
            
            // Remove workout from source date
            const workout = workouts.splice(workoutIndex, 1)[0];
            
            // Validate workout object
            if (!workout || !workout.id) {
                console.error('moveWorkout: invalid workout object', workout);
                return;
            }
            
            // Initialize target date array if needed
                if (!this.workouts.has(toDateStr)) {
                    this.workouts.set(toDateStr, []);
                }
            
            // Add workout to target date
                this.workouts.get(toDateStr).push(workout);
                
            // Cleanup empty dates
                if (workouts.length === 0) {
                    this.workouts.delete(fromDateStr);
                }
                
            // Render changes
                this.renderCalendar();
                
                // Dispatch event for workout moved
                this.container.dispatchEvent(new CustomEvent('workoutMoved', {
                    detail: { workoutId, fromDate, toDate }
                }));
            
        } catch (error) {
            console.error('Error moving workout:', error);
            this.showError('Failed to move workout. Please try again.');
        } finally {
            this.hideLoading();
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
            this.workoutManager.startWorkout(workout);
        } else {
            console.log('Show workout details:', workout);
        }
    }

    getMonthName(month) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[month];
    }

    getDayName(dayIndex) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    }

    highlightToday() {
        const today = new Date();
        const todayCell = this.container.querySelector(`.day-cell[data-date="${today.toISOString().split('T')[0]}"]`);
        if (todayCell) {
            todayCell.classList.add('today');
            todayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showAddWorkoutDialog(date) {
        if (this.workoutManager) {
            this.workoutManager.createNewWorkout(date);
        } else {
            console.log('Workout manager not available');
        }
    }

    deleteWorkout(workoutId, dateStr) {
        if (this.workouts.has(dateStr)) {
            const workouts = this.workouts.get(dateStr);
            const index = workouts.findIndex(w => w.id === workoutId);
            if (index !== -1) {
                workouts.splice(index, 1);
                if (workouts.length === 0) {
                    this.workouts.delete(dateStr);
                }
                this.renderCalendar();
            }
        }
    }

    setupDragAndDrop() {
        // Clean up existing listeners if any
        if (this._dragDropListeners) {
            this.cleanupDragDropListeners();
        }

        // Store listeners for cleanup
        this._dragDropListeners = {
            dragstart: this.handleDragStart.bind(this),
            dragend: this.handleDragEnd.bind(this),
            dragover: this.handleDragOver.bind(this),
            dragleave: this.handleDragLeave.bind(this),
            drop: this.handleDrop.bind(this)
        };

        // Add listeners to container
        this.container.addEventListener('dragstart', this._dragDropListeners.dragstart);
        this.container.addEventListener('dragend', this._dragDropListeners.dragend);
        this.container.addEventListener('dragover', this._dragDropListeners.dragover);
        this.container.addEventListener('dragleave', this._dragDropListeners.dragleave);
        this.container.addEventListener('drop', this._dragDropListeners.drop);
    }

    cleanupDragDropListeners() {
        if (!this._dragDropListeners) return;

        this.container.removeEventListener('dragstart', this._dragDropListeners.dragstart);
        this.container.removeEventListener('dragend', this._dragDropListeners.dragend);
        this.container.removeEventListener('dragover', this._dragDropListeners.dragover);
        this.container.removeEventListener('dragleave', this._dragDropListeners.dragleave);
        this.container.removeEventListener('drop', this._dragDropListeners.drop);

        this._dragDropListeners = null;
    }

    handleDragStart(e) {
        const workoutCard = e.target.closest('.workout-card');
        if (!workoutCard) return;

        this.draggedElement = workoutCard;
        this.sourceDate = workoutCard.closest('[data-date]')?.dataset.date;
        
        // Create ghost element with exact dimensions
        this.ghostElement = workoutCard.cloneNode(true);
        this.ghostElement.classList.add('ghost');
        this.ghostElement.style.width = `${workoutCard.offsetWidth}px`;
        this.ghostElement.style.height = `${workoutCard.offsetHeight}px`;
        document.body.appendChild(this.ghostElement);

        // Set initial position
        const rect = workoutCard.getBoundingClientRect();
        this.dragStartX = e.clientX - rect.left;
        this.dragStartY = e.clientY - rect.top;
        
        // Update ghost position immediately
        this.updateGhostPosition(e);

        // Set data transfer
        e.dataTransfer.setData('text/plain', workoutCard.dataset.workoutId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setDragImage(new Image(), 0, 0); // Hide default drag image

        // Add dragging classes
        workoutCard.classList.add('dragging');
        document.body.classList.add('dragging');
    }

    handleDragEnd(e) {
        if (!this.draggedElement) return;

        // Remove ghost element with fade out
        if (this.ghostElement) {
            this.ghostElement.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            this.ghostElement.style.opacity = '0';
            this.ghostElement.style.transform += ' scale(0.95)';
            setTimeout(() => this.ghostElement.remove(), 200);
            this.ghostElement = null;
        }

        // Remove dragging classes
        this.draggedElement.classList.remove('dragging');
        document.body.classList.remove('dragging');

        // Clear drag state
        this.draggedElement = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.sourceDate = null;

        // Remove drop target highlights with animation
        const dropTargets = this.container.querySelectorAll('.drag-over');
        dropTargets.forEach(target => {
            target.classList.add('drag-exit');
            target.classList.remove('drag-over');
            setTimeout(() => target.classList.remove('drag-exit'), 300);
        });
    }

    handleDragOver(e) {
        if (!this.draggedElement) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Update ghost position
        requestAnimationFrame(() => this.updateGhostPosition(e));

        // Handle drop target highlighting
        const dropTarget = e.target.closest('.week-day-column, .month-day-cell');
        if (dropTarget && !dropTarget.classList.contains('drag-over')) {
            // Remove highlight from other targets
            const currentTargets = this.container.querySelectorAll('.drag-over');
            currentTargets.forEach(target => {
                if (target !== dropTarget) {
                    target.classList.remove('drag-over');
                }
            });
            dropTarget.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        const dropTarget = e.target.closest('.week-day-column, .month-day-cell');
        if (dropTarget) {
            dropTarget.classList.remove('drag-over');
        }
    }

    async handleDrop(e) {
        e.preventDefault();
        if (!this.draggedElement) return;

        const dropTarget = e.target.closest('.week-day-column, .month-day-cell');
        if (!dropTarget) return;

        const workoutId = e.dataTransfer.getData('text/plain');
        const targetDate = dropTarget.dataset.date;

        if (this.sourceDate && targetDate && this.sourceDate !== targetDate) {
            try {
                dropTarget.classList.add('drop-success');
                await this.moveWorkout(
                    workoutId,
                    new Date(this.sourceDate),
                    new Date(targetDate)
                );
                setTimeout(() => dropTarget.classList.remove('drop-success'), 300);
            } catch (error) {
                console.error('Failed to move workout:', error);
                dropTarget.classList.add('drop-error');
                setTimeout(() => dropTarget.classList.remove('drop-error'), 300);
            }
        }

        // Cleanup
        dropTarget.classList.remove('drag-over');
        this.handleDragEnd(e);
    }

    updateGhostPosition(e) {
        if (!this.ghostElement) return;

        const x = e.clientX - this.dragStartX;
        const y = e.clientY - this.dragStartY;

        this.ghostElement.style.transform = `translate(${x}px, ${y}px)`;
        this.ghostElement.classList.toggle('ghost-moving', true);
    }
} 