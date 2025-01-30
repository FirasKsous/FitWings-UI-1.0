// Workout Service - Handles data management and storage
export class WorkoutService {
    constructor() {
        this.workouts = this.loadWorkouts();
    }

    loadWorkouts() {
        const defaultWorkouts = [
            {
                id: '1',
                name: 'Upper Body Chest Focus',
                category: 'Strength',
                description: 'Build strength and muscle mass with this chest-focused upper body workout',
                duration: 45,
                exercises: [
                    {
                        name: 'Barbell Bench Press',
                        sets: [
                            { weight: '', reps: '', completed: false },
                            { weight: '', reps: '', completed: false },
                            { weight: '', reps: '', completed: false }
                        ]
                    }
                ]
            },
            {
                id: '2',
                name: 'Upper Body Back Focus',
                category: 'Strength',
                description: 'Develop a strong and defined back with compound pulling movements',
                duration: 50,
                exercises: [
                    {
                        name: 'Barbell Rows',
                        sets: [
                            { weight: '', reps: '', completed: false },
                            { weight: '', reps: '', completed: false },
                            { weight: '', reps: '', completed: false }
                        ]
                    }
                ]
            },
            {
                id: '3',
                name: 'Lower Body Focus',
                category: 'Strength',
                description: 'Build powerful legs with this comprehensive lower body workout',
                duration: 55,
                exercises: [
                    {
                        name: 'Barbell Squat',
                        sets: [
                            { weight: '', reps: '', completed: false },
                            { weight: '', reps: '', completed: false },
                            { weight: '', reps: '', completed: false }
                        ]
                    }
                ]
            }
        ];

        return defaultWorkouts;
    }

    getWorkouts() {
        return this.workouts;
    }

    getWorkoutById(id) {
        // Create a deep copy of the workout to prevent state issues
        const workout = this.workouts.find(w => w.id === id);
        if (!workout) return null;
        return JSON.parse(JSON.stringify(workout));
    }

    saveWorkoutState(workout) {
        if (!workout || !workout.id) return;
        const index = this.workouts.findIndex(w => w.id === workout.id);
        if (index !== -1) {
            this.workouts[index] = workout;
        }
    }
}