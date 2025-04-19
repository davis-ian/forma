export class AttackRegistry {
    private attackMap = new Map<string, Set<number>>() // attackId  =>  set(entityId)

    register(attackId: string, entityId: number) {
        if (!this.attackMap.has(attackId)) {
            this.attackMap.set(attackId, new Set())
        }
        this.attackMap.get(attackId)!.add(entityId)
    }

    unregister(attackId: string, entityId: number) {
        const set = this.attackMap.get(attackId)
        if (!set) return

        set.delete(entityId)
        if (set.size === 0) {
            this.attackMap.delete(attackId)
            return true
        }
        return false
    }

    getActiveAttacks(): string[] {
        return Array.from(this.attackMap.keys())
    }
}
