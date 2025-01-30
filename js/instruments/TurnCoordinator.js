class TurnCoordinator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.turnRate = 0;    // degrees per second
        this.slipSkid = 0;    // -1 to 1
    }
    
    draw(ctx) {
        // Draw main dial
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw turn rate marks (standard rate turn is 3 degrees/second)
        const marks = [[-3, 'L'], [0, ''], [3, 'R']];
        ctx.font = `${this.size/15}px Arial`;
        ctx.textAlign = 'center';
        
        marks.forEach(([rate, label]) => {
            const angle = rate * Math.PI/12;  // 30 degrees for standard rate
            const x = this.x + Math.sin(angle) * (this.size/2 - 20);
            const y = this.y - Math.cos(angle) * (this.size/2 - 20);
            
            ctx.beginPath();
            ctx.moveTo(
                this.x + Math.sin(angle) * (this.size/2 - 25),
                this.y - Math.cos(angle) * (this.size/2 - 25)
            );
            ctx.lineTo(
                this.x + Math.sin(angle) * (this.size/2 - 15),
                this.y - Math.cos(angle) * (this.size/2 - 15)
            );
            ctx.stroke();
            
            ctx.fillText(label, x, y - 15);
        });
        
        // Draw airplane symbol
        const angle = this.turnRate * Math.PI/12;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 5);
        ctx.moveTo(-10, -5);
        ctx.lineTo(-10, 5);
        ctx.moveTo(10, -5);
        ctx.lineTo(10, 5);
        ctx.stroke();
        
        ctx.restore();
        
        // Draw slip/skid ball
        const ballX = this.x + this.slipSkid * 20;
        ctx.beginPath();
        ctx.arc(ballX, this.y + this.size/4, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ball container
        ctx.beginPath();
        ctx.moveTo(this.x - 25, this.y + this.size/4);
        ctx.lineTo(this.x + 25, this.y + this.size/4);
        ctx.stroke();
    }
    
    update(data) {
        this.turnRate = Math.max(-6, Math.min(6, data.turnRate));
        this.slipSkid = Math.max(-1, Math.min(1, data.slipSkid));
    }
}
