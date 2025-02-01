class Radio extends Instrument {
    constructor(x, y, width, height) {
        super(x, y, width);
        this.width = width;
        this.height = height || width / 2;
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
        const displayHeight = this.height * 0.4;  // Make displays taller
        const padding = 10;
        const displayWidth = (this.width - 3 * padding) / 2;  // Width for each frequency display

        // Left display (COM1)
        // Active frequency display
        ctx.fillStyle = '#000';
        ctx.fillRect(
            this.x + padding, 
            this.y + (this.height - displayHeight)/2,  // Center vertically
            displayWidth, 
            displayHeight
        );

        // Right display (COM1 Standby)
        ctx.fillRect(
            this.x + displayWidth + 2 * padding,
            this.y + (this.height - displayHeight)/2,  // Center vertically
            displayWidth, 
            displayHeight
        );

        // Draw frequencies
        ctx.font = `${displayHeight * 0.6}px 'DS-Digital', monospace`;
        
        // Active frequency (left)
        ctx.fillStyle = '#00ff00';  // Active freq in green
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.activeFreq.toFixed(3),
            this.x + padding + displayWidth/2,
            this.y + this.height/2
        );

        // Standby frequency (right)
        ctx.fillStyle = '#ffff00';  // Standby freq in yellow
        ctx.fillText(
            this.standbyFreq.toFixed(3),
            this.x + displayWidth + 2 * padding + displayWidth/2,
            this.y + this.height/2
        );
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
        ctx.font = `${size * 0.7}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + size / 2, y + size / 2);
    }

    update(data) {
        if (data.activeFreq) this.activeFreq = data.activeFreq;
        if (data.standbyFreq) this.standbyFreq = data.standbyFreq;
    }
}
