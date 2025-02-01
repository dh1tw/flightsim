class Radio extends Instrument {
    constructor(x, y, width, height) {
        super(x, y, width);
        this.width = width;
        this.height = height || width/2;
        this.activeFreq = 118.00;  // Active frequency
        this.standbyFreq = 136.97; // Standby frequency
        this.isFlipping = false;   // Animation state for freq swap
    }
    
    draw(ctx) {
        // Draw radio box
        ctx.fillStyle = '#2a2a2a';
        ctx.strokeStyle = '#404040';
        ctx.lineWidth = 2;
        
        // Main radio housing
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 5);
        ctx.fill();
        ctx.stroke();
        
        // Display areas
        const displayHeight = this.height/3;
        const padding = 10;
        
        // Active frequency display
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + padding, this.y + padding, 
                    this.width - 2*padding, displayHeight);
        
        // Standby frequency display
        ctx.fillRect(this.x + padding, this.y + 2*padding + displayHeight, 
                    this.width - 2*padding, displayHeight);
        
        // Draw frequencies
        ctx.font = `${displayHeight*0.8}px 'LCD', monospace`;
        ctx.fillStyle = '#00ff00'; // Active freq in green
        ctx.textAlign = 'center';
        ctx.fillText(
            this.activeFreq.toFixed(3),
            this.x + this.width/2,
            this.y + padding + displayHeight*0.8
        );
        
        ctx.fillStyle = '#ffff00'; // Standby freq in yellow
        ctx.fillText(
            this.standbyFreq.toFixed(3),
            this.x + this.size/2,
            this.y + 2*padding + displayHeight*1.8
        );
        
        // Draw buttons
        const buttonSize = 20;
        const buttonY = this.y + this.height - buttonSize - padding;
        
        // Left buttons
        this.drawButton(ctx, this.x + padding, buttonY, buttonSize, '⟲');
        this.drawButton(ctx, this.x + padding + buttonSize + 5, buttonY, buttonSize, '↕');
        
        // Right buttons
        this.drawButton(ctx, this.x + this.width - 2*buttonSize - padding - 5, buttonY, buttonSize, '−');
        this.drawButton(ctx, this.x + this.width - buttonSize - padding, buttonY, buttonSize, '+');
    }
    
    drawButton(ctx, x, y, size, label) {
        ctx.fillStyle = '#404040';
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 3);
        ctx.fill();
        
        ctx.strokeStyle = '#505050';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.font = `${size*0.7}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + size/2, y + size/2);
    }
    
    update(data) {
        if (data.activeFreq) this.activeFreq = data.activeFreq;
        if (data.standbyFreq) this.standbyFreq = data.standbyFreq;
    }
}
