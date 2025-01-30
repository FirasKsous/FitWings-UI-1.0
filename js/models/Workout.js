// Workout Model
export class Workout {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name || '';
        this.description = data.description || '';
        this.duration = data.duration || 45;
        this.calories = data.calories || 0;
        this.date = data.date || new Date().toISOString();
        this.completed = data.completed || false;
        this.favorite = data.favorite || false;
        this.exercises = data.exercises || [];
        this.category = data.category || 'strength';
    }

    addExercise(exercise) {
        this.exercises.push(exercise);
    }

    removeExercise(exerciseId) {
        this.exercises = this.exercises.filter(ex => ex.id !== exerciseId);
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    toggleFavorite() {
        this.favorite = !this.favorite;
    }

    calculateCalories() {
        // Basic calorie calculation based on duration and exercise intensity
        const baseRate = 6; // calories per minute for moderate exercise
        this.calories = Math.round(this.duration * baseRate);
    }
}