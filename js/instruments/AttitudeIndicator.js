class AttitudeIndicator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.pitch = 0;  // degrees (-90 to +90)
        this.roll = 0;   // degrees (-180 to +180)
    }
    
    draw(ctx) {
        ctx.save();
        
        // Clip to circular instrument area
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.clip();
        
        // Move to center and rotate for roll
        ctx.translate(this.x, this.y);
        ctx.rotate(this.roll * Math.PI / 180);
        
        // Draw sky and ground
        const pitchOffset = this.pitch * this.size/180;
        
        // Sky (blue)
        ctx.fillStyle = '#7EC0EE';
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size/2 + pitchOffset);
        
        // Ground (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-this.size/2, pitchOffset, this.size, this.size/2 - pitchOffset);
        
        // Draw pitch lines
        ctx.strokeStyle = 'white';
        for(let i = -30; i <= 30; i += 10) {
            const y = -i * this.size/180 + pitchOffset;
            const width = this.size/4;
            
            ctx.beginPath();
            ctx.moveTo(-width/2, y);
            ctx.lineTo(width/2, y);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Draw fixed aircraft symbol
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - 30, this.y);
        ctx.lineTo(this.x + 30, this.y);
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - 10);
        ctx.stroke();
        ctx.lineWidth = 1;
    }
    
    update(data) {
        this.pitch = Math.max(-90, Math.min(90, data.pitch));
        this.roll = data.roll;
    }
}
