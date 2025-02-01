class Radio extends Instrument {
    constructor(x, y, width, height) {
        super(x, y, width);
        this.width = width;
        this.height = height || width / 2;
        this.activeFreq = 118.00;  // Active frequency
        this.standbyFreq = 136.97; // Standby frequency
        this.isFlipping = false;   // Animation state for freq swap
        this.knobPosition = 0;  // Fixed to FULL position
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
        const fontSize = this.height * 0.3;  // Base font size for frequencies
        ctx.font = `${fontSize}px 'DS-Digital', monospace`;
        const displayHeight = fontSize + 6;  // Height is font size plus 3px margin top and bottom
        const padding = 10;
        const displayWidth = (this.width - 3 * padding) / 2;  // Width for each frequency display

        // Draw black background with gray border
        ctx.beginPath();
        ctx.roundRect(
            this.x + padding,
            this.y + 15,  // Keep same top position
            this.width - 2 * padding,
            displayHeight,  // Now using the new calculated height
            5  // 5px radius for rounded corners
        );
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.strokeStyle = '#404040';  // Gray border
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw frequencies
        ctx.font = `${fontSize}px 'DS-Digital', monospace`;  // Set font size before drawing text

        // Active frequency (left)
        ctx.fillStyle = '#00ff00';  // Active freq in green
        ctx.textAlign = 'left';     // Align left
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.activeFreq.toFixed(3),
            this.x + padding + 3,   // 3px from left border
            this.y + 15 + displayHeight / 2  // Center in the new display height
        );

        // Standby frequency (right)
        ctx.fillStyle = '#ffff00';  // Standby freq in yellow
        ctx.textAlign = 'right';    // Align right
        ctx.fillText(
            this.standbyFreq.toFixed(3),
            this.x + this.width - padding - 3,  // 3px from right border
            this.y + 15 + displayHeight / 2  // Center in the new display height
        );

        // Add labels below frequencies
        ctx.font = '10px monospace';
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top';

        // COMM1 label (below active frequency)
        ctx.textAlign = 'left';
        ctx.fillText(
            'COMM1',
            this.x + padding + 3,   // Same alignment as active frequency
            this.y + 15 + displayHeight + 2  // 2px below the frequency display
        );

        // STBY label (below standby frequency)
        ctx.textAlign = 'right';
        ctx.fillText(
            'STBY',
            this.x + this.width - padding - 3,  // Same alignment as standby frequency
            this.y + 15 + displayHeight + 2  // 2px below the frequency display
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

        // Draw rotary knob positions labels
        ctx.font = '10px monospace';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Position labels on the left side
        const knobCenterX = this.x + 64;  // Keep same X position
        const knobCenterY = this.y + this.height - 20;  // Move down below frequency display
        const knobRadius = 12;  // Make knob slightly smaller
        const labelOffset = 25;  // Distance from knob center to labels

        // Draw position labels
        ['FULL', 'TEST', 'OFF'].forEach((label, index) => {
            const angle = -Math.PI / 3 + (index * Math.PI / 3);  // Keep same angle distribution
            ctx.fillText(
                label,
                knobCenterX - labelOffset,
                knobCenterY + Math.sin(angle) * 12  // Adjust label positioning
            );
        });

        // Draw the knob
        ctx.beginPath();
        ctx.arc(knobCenterX, knobCenterY, knobRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#404040';
        ctx.fill();
        ctx.strokeStyle = '#505050';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add position indicator (white dot)
        const dotAngle = -Math.PI / 3;  // Fixed to FULL position
        const dotRadius = 9;  // Slightly adjust dot distance from center
        ctx.beginPath();
        ctx.arc(
            knobCenterX + Math.cos(dotAngle) * dotRadius,
            knobCenterY + Math.sin(dotAngle) * dotRadius,
            2,  // Make dot slightly smaller
            0,
            Math.PI * 2
        );
        ctx.fillStyle = 'white';
        ctx.fill();

        // Add knob center detail
        ctx.beginPath();
        ctx.arc(knobCenterX, knobCenterY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#303030';
        ctx.fill();

        // Draw second (larger) rotary knob
        const knob2CenterX = knobCenterX + 30 + 24;  // 30px margin + first knob radius
        const knob2CenterY = knobCenterY;  // Same vertical alignment
        const knob2Radius = 24;  // Twice the size of first knob (12 * 2)

        // Draw outer ring
        ctx.beginPath();
        ctx.arc(knob2CenterX, knob2CenterY, knob2Radius, 0, Math.PI * 2);
        ctx.fillStyle = '#404040';
        ctx.fill();
        ctx.strokeStyle = '#505050';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw decorative ring
        ctx.beginPath();
        ctx.arc(knob2CenterX, knob2CenterY, knob2Radius - 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#303030';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Add knob center detail
        ctx.beginPath();
        ctx.arc(knob2CenterX, knob2CenterY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#303030';
        ctx.fill();

        // Add position indicator line
        ctx.beginPath();
        ctx.moveTo(knob2CenterX, knob2CenterY - knob2Radius + 8);
        ctx.lineTo(knob2CenterX, knob2CenterY);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw control buttons
        const buttonY = this.y + this.height - 30; // Position buttons at bottom
        const buttonWidth = 40;
        const buttonHeight = 20;
        const buttonSpacing = 10;

        // Calculate starting X position to align buttons to the right
        let currentX = this.x + this.width - (3 * buttonWidth + 2 * buttonSpacing + padding);

        // Helper function to draw a button
        const drawButton = (x, y, label) => {
            // Button background
            ctx.fillStyle = '#404040';
            ctx.beginPath();
            ctx.roundRect(x, y, buttonWidth, buttonHeight, 5);
            ctx.fill();

            // Button border
            ctx.strokeStyle = '#505050';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Button label
            ctx.fillStyle = 'white';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x + buttonWidth / 2, y + buttonHeight / 2);
        };

        // Draw the buttons with new labels
        ['TIMER', 'SWAP', 'OBS'].forEach(label => {
            drawButton(currentX, buttonY, label);
            currentX += buttonWidth + buttonSpacing;
        });
    }

    update(data) {
        if (data.activeFreq) this.activeFreq = data.activeFreq;
        if (data.standbyFreq) this.standbyFreq = data.standbyFreq;
        if (data.knobPosition !== undefined) {
            this.knobPosition = data.knobPosition;
        }
    }
}
