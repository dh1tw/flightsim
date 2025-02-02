class VORIndicator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.course = 0;      // Selected course (0-359)
        this.bearing = 0;     // Current bearing to station
        this.deviation = 0;   // Deviation from course (-1 to 1)
        this.fromFlag = true; // true = FROM, false = TO
        this.isValid = true;  // Signal validity flag
    }
    
    draw(ctx) {
        // Draw common background first
        this.drawInstrumentBackground(ctx);
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const radius = this.size/2 - 5;
        
        // Draw black background
        ctx.beginPath();
        ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        
        // Draw compass rose
        ctx.save();
        ctx.rotate(-this.course * Math.PI/180);  // Rotate for selected course
        
        // Draw degree markings
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${this.size/15}px Arial`;
        
        for (let i = 0; i < 360; i += 5) {
            const angle = i * Math.PI/180;
            const isCardinal = i % 90 === 0;
            const isMajor = i % 30 === 0;
            const length = isCardinal ? 20 : (isMajor ? 15 : 10);
            
            ctx.beginPath();
            ctx.moveTo(
                Math.sin(angle) * (radius - length - 10),
                -Math.cos(angle) * (radius - length - 10)
            );
            ctx.lineTo(
                Math.sin(angle) * (radius - 10),
                -Math.cos(angle) * (radius - 10)
            );
            ctx.stroke();
            
            if (isMajor) {
                const textRadius = radius - 35;
                let text = (i/10).toString();
                if (i === 0) text = '36';
                
                ctx.save();
                ctx.translate(
                    Math.sin(angle) * textRadius,
                    -Math.cos(angle) * textRadius
                );
                ctx.rotate(i * Math.PI/180);  // Rotate text to be readable
                ctx.fillText(text, 0, 0);
                ctx.restore();
            }
        }
        
        ctx.restore();
        
        // Draw course deviation indicator
        const deviation = Math.max(-1, Math.min(1, this.deviation)) * radius/3;
        ctx.fillStyle = 'white';
        ctx.fillRect(-2, -deviation - 40, 4, 80);  // Vertical bar
        ctx.fillRect(-40, -2, 80, 4);             // Horizontal bar
        
        // Draw TO/FROM indicator
        ctx.save();
        ctx.translate(0, radius/3);
        ctx.fillStyle = this.fromFlag ? '#00ff00' : '#ff0000';
        ctx.textAlign = 'center';
        ctx.fillText(this.fromFlag ? 'FROM' : 'TO', 0, 0);
        ctx.restore();
        
        // Draw NAV flag if signal invalid
        if (!this.isValid) {
            ctx.save();
            ctx.translate(0, -radius/3);
            ctx.fillStyle = '#ff0000';
            ctx.textAlign = 'center';
            ctx.fillText('NAV', 0, 0);
            ctx.restore();
        }
        
        // Draw course pointer
        ctx.beginPath();
        ctx.moveTo(0, -radius + 15);
        ctx.lineTo(-10, -radius + 25);
        ctx.lineTo(10, -radius + 25);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.restore();
    }
    
    update(data) {
        if (typeof data === 'object') {
            this.course = data.course % 360;
            this.bearing = data.bearing % 360;
            this.deviation = Math.max(-1, Math.min(1, data.deviation));
            this.fromFlag = data.fromFlag;
            this.isValid = data.isValid !== false;  // Default to true if not specified
        }
    }
}
