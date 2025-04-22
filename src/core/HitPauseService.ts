export class HitPauseService {
    private paused = false
    private pauseTimer = 0

    start(duration: number) {
        this.paused = true
        this.pauseTimer = duration
    }

    update(deltaTime: number): number {
        if (!this.paused) return deltaTime

        this.pauseTimer -= deltaTime
        if (this.pauseTimer <= 0) {
            this.paused = false
            return deltaTime
        }

        return 0
    }

    isPaused() {
        return this.paused
    }
}

export const hitPauseService = new HitPauseService()
