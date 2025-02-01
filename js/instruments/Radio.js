class Radio extends Instrument {
    constructor(x, y, width, height) {
        super(x, y, width);
        this.width = width;
        this.height = height || width / 2;
        this.activeFreq = 128.30;      // Active COMM frequency
        this.standbyFreq = 118.70;     // Standby COMM frequency
        this.activeNavFreq = 113.00;   // Active NAV frequency
        this.standbyNavFreq = 117.20;  // Standby NAV frequency
        this.isFlipping = false;   // Animation state for freq swap
        this.knobPosition = 0;  // Fixed to FULL position
    }

    draw(ctx) {
        // Draw radio box
        ctx.fillStyle = '#5a5a5a';
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
        ctx.font = `${fontSize}px 'DS-Digital', monospace`;
        ctx.textBaseline = 'middle';
        const yPos = this.y + 15 + displayHeight / 2;

        // Get width of active frequency text
        const activeFreqWidth = ctx.measureText(this.activeFreq.toFixed(2)).width;

        // Draw frequencies with proper spacing
        // COMM frequencies (left side)
        ctx.fillStyle = '#a14318';
        ctx.textAlign = 'left';
        ctx.fillText(
            this.activeFreq.toFixed(2),    // Active COMM
            this.x + padding + 3,
            yPos
        );
        ctx.fillText(
            this.standbyFreq.toFixed(2),   // Standby COMM
            this.x + padding + activeFreqWidth + 15,
            yPos
        );

        // NAV frequencies
        const navActiveX = this.x + padding + activeFreqWidth + 15 + activeFreqWidth + 20;
        ctx.fillText(
            this.activeNavFreq.toFixed(2),    // Active NAV
            navActiveX,
            yPos
        );

        // NAV Standby frequency (right-aligned)
        ctx.textAlign = 'right';
        ctx.fillText(
            this.standbyNavFreq.toFixed(2),    // Standby NAV
            this.x + this.width - padding - 3,  // Align to right edge with padding
            yPos
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
            this.y + 15 + displayHeight + 7  // 2px below the frequency display
        );

        // STBY label (below standby frequency)
        ctx.textAlign = 'right';
        ctx.fillText(
            'STBY',
            this.x + this.width - padding - 3,  // Same alignment as standby frequency
            this.y + 15 + displayHeight + 7  // 2px below the frequency display
        );

        ctx.font = '6px monospace';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(
            'Radio Control',
            this.x + padding + 5,  // Same left padding as frequency display
            this.y + 5        // 2px from top
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
        const labelOffset = 20;  // Distance from knob center to labels

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
        const dotAngle = 4;  // Fixed to FULL position
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

        // Draw double-headed arrow label
        const arrowLabelX = knobCenterX + 1;  // Position right of first knob
        const arrowLabelY = knobCenterY - 35;  // Center vertically with knob
        const arrowLabelWidth = 35;
        const arrowLabelHeight = 15;

        // Draw white background rectangle with rounded edges
        ctx.beginPath();
        ctx.roundRect(
            arrowLabelX,
            arrowLabelY,
            arrowLabelWidth,
            arrowLabelHeight,
            5  // Corner radius
        );
        ctx.fillStyle = '#d9d989';
        ctx.fill();

        // Draw double-headed arrow
        ctx.beginPath();
        ctx.moveTo(arrowLabelX + 5, arrowLabelY + arrowLabelHeight / 2);  // Start from left
        ctx.lineTo(arrowLabelX + arrowLabelWidth - 5, arrowLabelY + arrowLabelHeight / 2);  // Main line

        // Left arrowhead (smaller)
        ctx.moveTo(arrowLabelX + 5, arrowLabelY + arrowLabelHeight / 2);
        ctx.lineTo(arrowLabelX + 10, arrowLabelY + arrowLabelHeight / 2 - 3);  // Upper point (reduced from 10 to 3)
        ctx.moveTo(arrowLabelX + 5, arrowLabelY + arrowLabelHeight / 2);
        ctx.lineTo(arrowLabelX + 10, arrowLabelY + arrowLabelHeight / 2 + 3);  // Lower point (reduced from 10 to 3)

        // Right arrowhead (smaller)
        ctx.moveTo(arrowLabelX + arrowLabelWidth - 5, arrowLabelY + arrowLabelHeight / 2);
        ctx.lineTo(arrowLabelX + arrowLabelWidth - 10, arrowLabelY + arrowLabelHeight / 2 - 3);  // Upper point (reduced from 10 to 3)
        ctx.moveTo(arrowLabelX + arrowLabelWidth - 5, arrowLabelY + arrowLabelHeight / 2);
        ctx.lineTo(arrowLabelX + arrowLabelWidth - 10, arrowLabelY + arrowLabelHeight / 2 + 3);  // Lower point (reduced from 10 to 3)

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw second (larger) rotary knob
        const knob2CenterX = knobCenterX + 40 + 24;  // 30px margin + first knob radius
        const knob2CenterY = knobCenterY - 12;  // Same vertical alignment
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

        // Draw arc with arrowheads for second knob
        const arcRadius = knob2Radius + 8;  // Slightly larger than knob
        const startAngle = -Math.PI / 5;  // -45 degrees
        const endAngle = Math.PI / 5;     // +45 degrees

        // Draw the arc
        ctx.beginPath();
        ctx.arc(knob2CenterX, knob2CenterY, arcRadius, startAngle, endAngle);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Helper function to draw arrowhead
        const drawArrowhead = (x, y, angle) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            // Draw arrowhead
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-6, -3);
            ctx.lineTo(-6, 3);
            ctx.closePath();
            ctx.fillStyle = 'white';
            ctx.fill();

            ctx.restore();
        };

        // Draw upper arrowhead with plus sign
        const upperX = knob2CenterX + arcRadius * Math.cos(startAngle);
        const upperY = knob2CenterY + arcRadius * Math.sin(startAngle);
        drawArrowhead(upperX, upperY, startAngle - Math.PI / 2);

        // Draw lower arrowhead with minus sign
        const lowerX = knob2CenterX + arcRadius * Math.cos(endAngle);
        const lowerY = knob2CenterY + arcRadius * Math.sin(endAngle);
        drawArrowhead(lowerX, lowerY, endAngle + Math.PI / 2);

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
        if (data.activeNavFreq) this.activeNavFreq = data.activeNavFreq;
        if (data.standbyNavFreq) this.standbyNavFreq = data.standbyNavFreq;
        if (data.knobPosition !== undefined) {
            this.knobPosition = data.knobPosition;
        }
    }
}
