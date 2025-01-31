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
        ctx.save();
        ctx.rotate(-this.heading * Math.PI / 180);
        
        // Draw degree markings and numbers
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.colors.markings;
        ctx.fillStyle = this.colors.numbers;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${this.size/15}px Arial`;
        
        for(let i = 0; i < 360; i += 5) {
            const angle = (i * Math.PI / 180);
            const isCardinal = i % 90 === 0;
            const isMajor = i % 30 === 0;
            const length = isCardinal ? 20 : (isMajor ? 15 : 10);
            
            // Draw tick marks
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
            
            // Draw numbers/letters
            if (isCardinal || (isMajor && !isCardinal)) {
                const textRadius = radius - 35;
                let text;
                
                if (i === 0) text = 'N';
                else if (i === 90) text = 'E';
                else if (i === 180) text = 'S';
                else if (i === 270) text = 'W';
                else text = (i/10).toString();
                
                // Make cardinal points larger and bold
                if (isCardinal) {
                    ctx.font = `bold ${this.size/12}px Arial`;
                } else {
                    ctx.font = `${this.size/15}px Arial`;
                }
                
                ctx.fillText(
                    text,
                    Math.sin(angle) * textRadius,
                    -Math.cos(angle) * textRadius
                );
            }
        }
        
        ctx.restore();
        
        // Draw aircraft symbol in center
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.lineWidth = 2;
        
        // Aircraft body
        ctx.beginPath();
        ctx.moveTo(0, -20);  // Nose
        ctx.lineTo(-15, 15); // Left wing
        ctx.lineTo(0, 10);   // Fuselage indent
        ctx.lineTo(15, 15);  // Right wing
        ctx.closePath();
        ctx.fill();
        
        // Aircraft tail
        ctx.beginPath();
        ctx.moveTo(-10, 15);
        ctx.lineTo(10, 15);
        ctx.stroke();
        
        ctx.restore();
        
        // Draw heading number at bottom
        ctx.font = `${this.size/12}px Arial`;
        ctx.fillStyle = this.colors.numbers;
        ctx.textAlign = 'center';
        ctx.fillText(
            Math.round(this.heading).toString().padStart(3, '0') + '°',
            this.x,
            this.y + radius - 10
        );
    }
    
    update(heading) {
        this.heading = heading % 360;
        if (this.heading < 0) this.heading += 360;
    }
}
