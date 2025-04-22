export class DamageOverlayService {
    private el: HTMLDivElement

    constructor() {
        this.el = document.getElementById('damage-overlay') as HTMLDivElement
    }

    flash(color: 'red' | 'white' = 'red') {
        if (!this.el) return

        this.el.style.background =
            color === 'red' ? 'rgba(255, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.6)'

        this.el.style.opacity = '1'
        requestAnimationFrame(() => {
            setTimeout(() => {
                this.el.style.opacity = '0'
            }, 50)
        })
    }
}
