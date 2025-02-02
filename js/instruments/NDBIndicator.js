class NDBIndicator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.bearing = 0;     // Relative bearing to station (0-359)
        this.heading = 0;     // Current aircraft heading (0-359)
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
        
        // Draw fixed compass rose
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${this.size/15}px Arial`;
        
        // Draw degree markings
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
            
            // Draw numbers/letters for cardinal and major points
            if (isCardinal || isMajor) {
                const textRadius = radius - 35;
                let text;
                
                if (i === 0) text = 'N';
                else if (i === 90) text = 'E';
                else if (i === 180) text = 'S';
                else if (i === 270) text = 'W';
                else text = (i/10).toString();
                
                ctx.save();
                ctx.translate(
                    Math.sin(angle) * textRadius,
                    -Math.cos(angle) * textRadius
                );
                ctx.rotate(angle);  // Rotate text to be readable
                ctx.fillText(text, 0, 0);
                ctx.restore();
            }
        }
        
        // Draw ADF needle
        const needleAngle = (this.bearing - this.heading) * Math.PI/180;
        
        ctx.save();
        ctx.rotate(needleAngle);
        
        // Draw double-ended needle
        ctx.beginPath();
        ctx.moveTo(0, -radius + 15);  // Front tip
        ctx.lineTo(4, 0);            // Right side
        ctx.lineTo(0, radius - 15);   // Back tip
        ctx.lineTo(-4, 0);           // Left side
        ctx.closePath();
        
        // Fill front half yellow, back half white
        ctx.save();
        ctx.clip();
        ctx.fillStyle = 'yellow';
        ctx.fillRect(-10, -radius, 20, radius);
        ctx.restore();
        
        ctx.save();
        ctx.translate(0, 0);
        ctx.rotate(Math.PI);
        ctx.clip();
        ctx.fillStyle = 'white';
        ctx.fillRect(-10, -radius, 20, radius);
        ctx.restore();
        
        // Add needle outline
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
        
        // Draw center cap
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
    
    update(data) {
        if (typeof data === 'object') {
            this.bearing = data.bearing % 360;
            this.heading = data.heading % 360;
        } else {
            this.bearing = data % 360;
        }
        // Ensure positive angles
        if (this.bearing < 0) this.bearing += 360;
        if (this.heading < 0) this.heading += 360;
    }
}
