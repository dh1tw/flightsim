class HeadingIndicator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.heading = 0;  // degrees (0-359)
    }
    
    draw(ctx) {
        // Draw common background first
        this.drawInstrumentBackground(ctx);
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const radius = this.size/2 - 20;
        
        // Draw rotating compass card
        ctx.rotate(-this.heading * Math.PI / 180);
        
        // Draw all degree marks
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.colors.markings;
        ctx.fillStyle = this.colors.numbers;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${this.size/20}px Arial`;
        
        for(let i = 0; i < 360; i += 5) {
            const angle = (i * Math.PI / 180);
            const isCardinal = i % 90 === 0;
            const isMajor = i % 30 === 0;
            const length = isCardinal ? 20 : (isMajor ? 15 : 10);
            
            ctx.beginPath();
            ctx.moveTo(
                Math.sin(angle) * (radius - length),
                -Math.cos(angle) * (radius - length)
            );
            ctx.lineTo(
                Math.sin(angle) * radius,
                -Math.cos(angle) * radius
            );
            ctx.stroke();
            
            // Draw numbers for every 30 degrees
            if (isMajor) {
                const textRadius = radius - 30;
                const number = (i === 0) ? 'N' : 
                             (i === 90) ? 'E' : 
                             (i === 180) ? 'S' : 
                             (i === 270) ? 'W' : 
                             (i/10).toString();
                
                // Rotate text to be readable
                ctx.save();
                ctx.translate(
                    Math.sin(angle) * textRadius,
                    -Math.cos(angle) * textRadius
                );
                ctx.rotate(-angle + Math.PI/2);
                ctx.fillText(number, 0, 0);
                ctx.restore();
            }
        }
        
        ctx.restore();
        
        // Draw fixed aircraft symbol and lubber line
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Draw lubber line (triangle at top)
        ctx.beginPath();
        ctx.moveTo(0, -radius + 5);
        ctx.lineTo(-10, -radius + 20);
        ctx.lineTo(10, -radius + 20);
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();
        
        // Draw miniature aircraft
        ctx.strokeStyle = this.colors.markings;
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Aircraft body
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 10);
        // Wings
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        // Tail
        ctx.moveTo(-7, 10);
        ctx.lineTo(7, 10);
        ctx.stroke();
        
        ctx.restore();
        
        // Draw heading numbers in a digital display
        ctx.font = `${this.size/12}px Arial`;
        ctx.fillStyle = this.colors.numbers;
        ctx.textAlign = 'center';
        ctx.fillText(
            Math.round(this.heading).toString().padStart(3, '0') + '°',
            this.x,
            this.y + radius/2
        );
    }
    
    update(heading) {
        this.heading = heading % 360;
        if (this.heading < 0) this.heading += 360;
    }
}
