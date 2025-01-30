class HeadingIndicator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.heading = 0;  // degrees (0-359)
    }
    
    draw(ctx) {
        ctx.save();
        
        // Draw the main dial
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw rotating compass card
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.heading * Math.PI / 180);
        
        // Draw cardinal and ordinal directions
        const directions = [
            [0, "N"], [45, "NE"], [90, "E"], [135, "SE"],
            [180, "S"], [225, "SW"], [270, "W"], [315, "NW"]
        ];
        
        ctx.font = `${this.size/15}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        directions.forEach(([angle, label]) => {
            const rad = angle * Math.PI / 180;
            const radius = this.size/2 - 20;
            
            // Draw tick mark
            ctx.beginPath();
            ctx.moveTo(
                Math.sin(rad) * (radius - 10),
                -Math.cos(rad) * (radius - 10)
            );
            ctx.lineTo(
                Math.sin(rad) * radius,
                -Math.cos(rad) * radius
            );
            ctx.stroke();
            
            // Draw label
            ctx.fillText(
                label,
                Math.sin(rad) * (radius - 25),
                -Math.cos(rad) * (radius - 25)
            );
        });
        
        ctx.restore();
        
        // Draw lubber line
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size/2);
        ctx.lineTo(this.x, this.y - this.size/2 + 15);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.strokeStyle = 'black';
    }
    
    update(heading) {
        this.heading = heading % 360;
        if (this.heading < 0) this.heading += 360;
    }
}
