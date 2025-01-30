class AirspeedIndicator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.speed = 0;
    }
    
    draw(ctx) {
        // Draw the main dial
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw speed graduations
        for(let i = 0; i < 10; i++) {
            const angle = (i * Math.PI * 2) / 10;
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
        
        // Draw the speed value
        ctx.fillText(Math.round(this.speed) + " kts", this.x - 20, this.y + 40);
    }
    
    update(speed) {
        this.speed = speed;
    }
}
