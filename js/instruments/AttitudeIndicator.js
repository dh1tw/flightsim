class AttitudeIndicator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.pitch = 0;  // degrees (-90 to +90)
        this.roll = 0;   // degrees (-180 to +180)
    }

    draw(ctx) {
        ctx.save();

        // Draw the instrument border
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.strokeStyle = this.colors.case;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Clip to circular instrument area
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.clip();

        // Move to center and rotate for roll
        ctx.translate(this.x, this.y);
        ctx.rotate(this.roll * Math.PI / 180);

        // Draw sky and ground
        const pitchOffset = this.pitch * this.size / 180;

        // Sky (blue)
        ctx.fillStyle = '#7EC0EE';
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2 + pitchOffset);

        // Ground (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-this.size / 2, pitchOffset, this.size, this.size / 2 - pitchOffset);

        // Draw pitch lines
        ctx.strokeStyle = 'white';
        for (let i = -30; i <= 30; i += 5) {
            // Skip 5 degree positive mark
            if (i === 5) continue;
            
            const y = -i * this.size / 180 + pitchOffset;
            let width;
            
            // Set line width and length based on angle
            if (i % 20 === 0) {  // 20° marks
                // Longer width for higher angles
                width = this.size / 2 + (Math.abs(i) * this.size / 360);
                ctx.lineWidth = 2;
                
                // Add numbers for 20° marks
                ctx.textAlign = 'left';
                ctx.fillText('20', width/2 + 5, y);
                ctx.textAlign = 'right';
                ctx.fillText('20', -width/2 - 5, y);
                
            } else if (i % 10 === 0) {  // 10° marks
                // Longer width for higher angles
                width = this.size / 3 + (Math.abs(i) * this.size / 360);
                ctx.lineWidth = 2;
                
                // Add numbers for 10° marks
                ctx.textAlign = 'left';
                ctx.fillText('10', width/2 + 5, y);
                ctx.textAlign = 'right';
                ctx.fillText('10', -width/2 - 5, y);
                
            } else {  // 15° and -5° marks
                width = this.size / 6;  // Shorter lines
                ctx.lineWidth = 4;  // Thicker lines
            }

            ctx.beginPath();
            ctx.moveTo(-width / 2, y);
            ctx.lineTo(width / 2, y);
            ctx.stroke();
        }

        // Draw roll angle reference marks
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        const rollMarks = [
            -60, -45, -30, -20, -10,   // Left side marks
            0,                         // Center mark
            10, 20, 30, 45, 60        // Right side marks
        ];

        rollMarks.forEach(angle => {
            ctx.save();
            ctx.rotate(angle * Math.PI / 180);

            // Draw different sizes based on angle
            let length = 10;
            if (Math.abs(angle) === 30 || Math.abs(angle) === 60) length = 15;
            if (angle === 0) length = 20;  // Longer mark for level

            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2 + 5);
            ctx.lineTo(0, -this.size / 2 + 5 + length);
            ctx.stroke();

            // Add angle numbers for 10, 20, 30, 45, 60
            // if (angle !== 0 && angle % 10 === 0) {
            //     ctx.save();
            //     ctx.translate(0, -this.size/2 + 25);
            //     ctx.rotate(-angle * Math.PI / 180);  // Keep text upright
            //     ctx.fillStyle = 'white';
            //     ctx.textAlign = 'center';
            //     ctx.fillText(Math.abs(angle).toString(), 0, 0);
            //     ctx.restore();
            // }

            ctx.restore();
        });

        // Draw pitch reference lines on the sides
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        const sideLength = 40;

        // Left reference line
        ctx.beginPath();
        ctx.moveTo(-this.size / 3, 0);
        ctx.lineTo(-this.size / 3 + sideLength, 0);
        ctx.stroke();

        // Right reference line
        ctx.beginPath();
        ctx.moveTo(this.size / 3 - sideLength, 0);
        ctx.lineTo(this.size / 3, 0);
        ctx.stroke();

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

        // Add yellow reference triangle at top center (0° mark)
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size / 2 + 25);  // Point at top
        ctx.lineTo(this.x - 10, this.y - this.size / 2 + 40); // Left point
        ctx.lineTo(this.x + 10, this.y - this.size / 2 + 40); // Right point
        ctx.closePath();
        ctx.fillStyle = 'yellow';
        ctx.fill();
    }

    update(data) {
        this.pitch = Math.max(-90, Math.min(90, data.pitch));
        this.roll = data.roll;
    }
}
