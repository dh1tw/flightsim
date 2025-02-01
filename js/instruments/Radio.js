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

        // Draw black background with gray border
        ctx.beginPath();
        ctx.roundRect(
            this.x + padding,
            this.y + 10,  // 5 pixels from top
            this.width - 2 * padding,
            displayHeight,
            5  // 5px radius for rounded corners
        );
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.strokeStyle = '#404040';  // Gray border
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw frequencies
        ctx.font = `${displayHeight * 0.6}px 'DS-Digital', monospace`;

        // Active frequency (left)
        ctx.fillStyle = '#00ff00';  // Active freq in green
        ctx.textAlign = 'left';     // Align left
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.activeFreq.toFixed(3),
            this.x + padding + 3,   // 3px from left border
            this.y + 5 + displayHeight / 2
        );

        // Standby frequency (right)
        ctx.fillStyle = '#ffff00';  // Standby freq in yellow
        ctx.textAlign = 'right';    // Align right
        ctx.fillText(
            this.standbyFreq.toFixed(3),
            this.x + this.width - padding - 3,  // 3px from right border
            this.y + 5 + displayHeight / 2
        );

        ctx.font = '10px monospace';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(
            'Radio Control',
            this.x + padding,  // Same left padding as frequency display
            this.y + 2        // 2px from top
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
