class AirspeedIndicator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.speed = 0;
        this.maxSpeed = 400;
        this.greenArc = { min: 60, max: 240 };
        this.yellowArc = { min: 240, max: 350 };
    }

    draw(ctx) {
        // Draw common background first
        this.drawInstrumentBackground(ctx);

        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw colored arcs
        const radius = this.size / 2 - 5;

        // Convert speeds to angles (0 at bottom, clockwise)
        const speedToAngle = (speed) => {
            return ((speed / this.maxSpeed) * 300 - 90) * Math.PI / 180;
        };

        // Draw green arc (normal operating range)
        ctx.beginPath();
        ctx.arc(0, 0, radius,
            speedToAngle(this.greenArc.min),
            speedToAngle(this.greenArc.max));
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.stroke();

        // Draw yellow arc (caution range)
        ctx.beginPath();
        ctx.arc(0, 0, radius,
            speedToAngle(this.yellowArc.min),
            speedToAngle(this.yellowArc.max));
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.stroke();

        // Draw speed graduations
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.colors.markings;
        ctx.fillStyle = this.colors.numbers;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${this.size / 15}px Arial`;

        for (let speed = 0; speed <= this.maxSpeed; speed += 20) {
            const angle = speedToAngle(speed);
            const isMainGraduation = speed % 100 === 0;
            const gradLength = isMainGraduation ? 15 : 10;

            // Draw graduation line
            ctx.beginPath();
            ctx.moveTo(
                Math.cos(angle) * (radius - gradLength),
                Math.sin(angle) * (radius - gradLength)
            );
            ctx.lineTo(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );
            ctx.stroke();

            // Draw number for main graduations
            if (isMainGraduation) {
                const textRadius = radius - 25;
                ctx.fillText(
                    speed.toString(),
                    Math.cos(angle) * textRadius,
                    Math.sin(angle) * textRadius
                );
            }
        }

        // Draw the needle
        const angle = speedToAngle(this.speed);

        // Create needle path
        const needlePath = new Path2D();
        const needleLength = radius - 10;
        const needleWidth = 4;
        const blackPartLength = needleLength * 0.3;

        // Calculate points for needle shape
        const tip = {
            x: Math.cos(angle) * needleLength,
            y: Math.sin(angle) * needleLength
        };
        const leftBase = {
            x: Math.cos(angle - Math.PI / 2) * needleWidth,
            y: Math.sin(angle - Math.PI / 2) * needleWidth
        };
        const rightBase = {
            x: Math.cos(angle + Math.PI / 2) * needleWidth,
            y: Math.sin(angle + Math.PI / 2) * needleWidth
        };
        const blackTip = {
            x: Math.cos(angle) * blackPartLength,
            y: Math.sin(angle) * blackPartLength
        };

        // Draw needle shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Draw white border
        ctx.beginPath();
        ctx.moveTo(leftBase.x, leftBase.y);
        ctx.lineTo(tip.x, tip.y);
        ctx.lineTo(rightBase.x, rightBase.y);
        ctx.closePath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fill white part
        ctx.fillStyle = 'white';
        ctx.fill();

        // Draw black part
        ctx.beginPath();
        ctx.moveTo(leftBase.x, leftBase.y);
        ctx.lineTo(blackTip.x, blackTip.y);
        ctx.lineTo(rightBase.x, rightBase.y);
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();

        ctx.restore();

        // Draw center cap
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Draw speed value
        ctx.font = `${this.size / 12}px Arial`;
        ctx.fillStyle = this.colors.numbers;
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(this.speed), this.x, this.y + this.size / 4);
        ctx.font = `${this.size / 15}px Arial`;
        ctx.fillText('KNOTS', this.x, this.y + this.size / 3);
    }

    update(speed) {
        this.speed = Math.max(0, Math.min(this.maxSpeed, speed));
    }
}
