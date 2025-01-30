class Altimeter extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.altitude = 0;
    }
    
    draw(ctx) {
        // Dessiner le cadran
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Graduations
        for(let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            const startRadius = this.size/2 - 10;
            const endRadius = this.size/2;
            
            const startX = this.x + Math.cos(angle) * startRadius;
            const startY = this.y + Math.sin(angle) * startRadius;
            const endX = this.x + Math.cos(angle) * endRadius;
            const endY = this.y + Math.sin(angle) * endRadius;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
    
    update(altitude) {
        this.altitude = altitude;
    }
}
