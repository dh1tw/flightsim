class MagneticCompass extends Instrument {
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
        
        // Draw compass housing
        ctx.fillStyle = '#2a2a2a';
        ctx.beginPath();
        ctx.roundRect(-radius, -radius/2, radius*2, radius, 10);
        ctx.fill();
        ctx.strokeStyle = '#404040';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw viewing window
        ctx.beginPath();
        ctx.roundRect(-radius/2, -radius/3, radius, radius/2, 5);
        ctx.strokeStyle = '#505050';
        ctx.stroke();
        
        // Create clipping region for card
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(-radius/2, -radius/3, radius, radius/2, 5);
        ctx.clip();
        
        // Draw compass card
        ctx.translate(-radius/2, -radius/6);
        ctx.scale(-1, 1); // Mirror the numbers
        ctx.rotate(this.heading * Math.PI / 180);
        
        // Draw numbers and marks
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${this.size/15}px Arial`;
        ctx.fillStyle = this.colors.numbers;
        
        for(let i = 0; i < 360; i += 30) {
            const x = (i - this.heading) * radius/90;
            
            // Draw number
            let label = i === 0 ? 'N' :
                       i === 90 ? 'E' :
                       i === 180 ? 'S' :
                       i === 270 ? 'W' :
                       (i/10).toString();
            
            ctx.fillText(label, x, 0);
            
            // Draw graduation marks
            ctx.beginPath();
            ctx.moveTo(x, -radius/6);
            ctx.lineTo(x, radius/6);
            ctx.strokeStyle = this.colors.markings;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Draw lubber line
        ctx.beginPath();
        ctx.moveTo(0, -radius/3);
        ctx.lineTo(0, radius/6);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw liquid effect
        const liquidGradient = ctx.createLinearGradient(0, -radius/3, 0, radius/6);
        liquidGradient.addColorStop(0, 'rgba(255,255,255,0.1)');
        liquidGradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = liquidGradient;
        ctx.fillRect(-radius/2, -radius/3, radius, radius/2);
        
        // Draw resize handles if in edit mode
        if (this.isEditMode) {
            this.drawResizeHandles(ctx);
        }

        ctx.restore();
    }
    
    update(heading) {
        this.heading = heading % 360;
        if (this.heading < 0) this.heading += 360;
    }
}
