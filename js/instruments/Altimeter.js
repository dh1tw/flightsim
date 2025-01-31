class Altimeter extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.altitude = 0;
        this.barometricPressure = 29.92; // inches of mercury
    }

    draw(ctx) {
        // Draw common background first
        this.drawInstrumentBackground(ctx);

        ctx.save();
        ctx.translate(this.x, this.y);

        const radius = this.size / 2 - 5;

        // Draw main graduations (0-9)
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.colors.markings;
        ctx.fillStyle = this.colors.numbers;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${this.size / 15}px Arial`;

        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI * 2) / 10;

            // Draw main number
            const textRadius = radius - 25;
            const number = i;
            ctx.fillText(
                number.toString(),
                Math.cos(angle - Math.PI / 2) * textRadius,
                Math.sin(angle - Math.PI / 2) * textRadius
            );

            // Draw graduation lines
            for (let j = 0; j < 5; j++) {
                const subAngle = angle + (j * Math.PI * 2) / 50;
                const isMain = j === 0;
                const gradLength = isMain ? 15 : 10;

                ctx.beginPath();
                ctx.moveTo(
                    Math.cos(subAngle - Math.PI / 2) * (radius - gradLength),
                    Math.sin(subAngle - Math.PI / 2) * (radius - gradLength)
                );
                ctx.lineTo(
                    Math.cos(subAngle - Math.PI / 2) * radius,
                    Math.sin(subAngle - Math.PI / 2) * radius
                );
                ctx.stroke();
            }
        }

        // Draw needles
        const drawNeedle = (length, width, value, turns) => {
            const angle = (value * turns * Math.PI * 2) - Math.PI / 2;

            ctx.save();
            ctx.rotate(angle);

            // Draw needle shadow
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            ctx.beginPath();
            ctx.moveTo(-width, 0);
            ctx.lineTo(0, -length);
            ctx.lineTo(width, 0);
            ctx.fillStyle = this.colors.needles;
            ctx.fill();

            ctx.restore();
        };

        // 10000s needle (shortest)
        drawNeedle(radius * 0.5, 3, this.altitude / 100000, 1);

        // 1000s needle (medium)
        drawNeedle(radius * 0.7, 3, this.altitude / 10000, 1);

        // 100s needle (longest)
        drawNeedle(radius * 0.9, 3, this.altitude / 1000, 1);

        // Draw center cap
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw barometric pressure window
        ctx.restore();

        // Draw pressure setting window
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(this.x - 30, this.y + radius / 2, 60, 20);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fill();

        // Draw pressure value
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.barometricPressure.toFixed(2),
            this.x,
            this.y + radius / 2 + 10
        );
    }

    update(data) {
        if (typeof data === 'object') {
            this.altitude = data.altitude || 0;
            this.barometricPressure = data.pressure || 29.92;
        } else {
            this.altitude = data;
        }
    }
}
