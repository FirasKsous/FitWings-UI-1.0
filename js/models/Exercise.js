// Exercise Model
export class Exercise {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name || '';
        this.notes = data.notes || '';
        this.sets = data.sets || [];
    }

    addSet(set = {}) {
        this.sets.push({
            id: crypto.randomUUID(),
            exerciseId: this.id, // Ensure this is set correctly
            weight: set.weight || 0,
            reps: set.reps || 0,
            rpe: set.rpe || 7,
            completed: set.completed || false
        });
        return this.sets[this.sets.length - 1];
    }

    removeSet(setId) {
        const index = this.sets.findIndex(set => set.id === setId);
        if (index !== -1) {
            this.sets.splice(index, 1);
            return true;
        }
        return false;
    }

    updateSet(setId, data) {
        const setIndex = this.sets.findIndex(set => set.id === setId);
        if (setIndex !== -1) {
            this.sets[setIndex] = { 
                ...this.sets[setIndex], 
                ...data,
                exerciseId: this.id // Ensure exerciseId is preserved
            };
            return true;
        }
        return false;
    }
}