class VerticalSpeedIndicator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.verticalSpeed = 0;  // feet per minute
    }
    
    draw(ctx) {
        // Draw the main dial
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw graduations (-2000 to +2000 ft/min)
        const graduations = [-2000, -1500, -1000, -500, 0, 500, 1000, 1500, 2000];
        ctx.font = `${this.size/15}px Arial`;
        ctx.textAlign = 'right';
        
        graduations.forEach(speed => {
            const angle = ((speed / 2000) * Math.PI) + Math.PI;
            const radius = this.size/2 - 25;
            
            // Draw tick
            ctx.beginPath();
            ctx.moveTo(
                this.x + Math.cos(angle) * (radius - 10),
                this.y + Math.sin(angle) * (radius - 10)
            );
            ctx.lineTo(
                this.x + Math.cos(angle) * radius,
                this.y + Math.sin(angle) * radius
            );
            ctx.stroke();
            
            // Draw number
            if (speed % 1000 === 0) {
                const textRadius = radius - 15;
                ctx.fillText(
                    Math.abs(speed/100).toString(),
                    this.x + Math.cos(angle) * textRadius,
                    this.y + Math.sin(angle) * textRadius
                );
            }
        });
        
        // Draw the needle
        const angle = (this.verticalSpeed / 2000) * Math.PI + Math.PI;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.moveTo(-5, 10);
        ctx.lineTo(0, -this.size/2 + 20);
        ctx.lineTo(5, 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        
        // Draw "UP" and "DOWN" text
        ctx.textAlign = 'center';
        ctx.fillText("UP", this.x, this.y - this.size/3);
        ctx.fillText("DOWN", this.x, this.y + this.size/3);
    }
    
    update(verticalSpeed) {
        this.verticalSpeed = Math.max(-2000, Math.min(2000, verticalSpeed));
    }
}
