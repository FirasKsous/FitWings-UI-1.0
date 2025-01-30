class TimerService {
    constructor() {
        this.timer = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.onTick = null;
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.isRunning = true;
            this.timer = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
                if (this.onTick) {
                    this.onTick(this.formatTime(this.elapsedTime));
                }
            }, 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timer);
            this.isRunning = false;
        }
    }

    reset() {
        this.pause();
        this.elapsedTime = 0;
        if (this.onTick) {
            this.onTick(this.formatTime(0));
        }
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

export { TimerService };