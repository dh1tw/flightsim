class TurnIndicator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.turnRate = 0;    // degrees per second
        this.slipSkid = 0;    // -1 to 1 for ball position
        this.targetTurnRate = 0; // For smooth animation
    }
    
    draw(ctx) {
        // Draw common background first
        this.drawInstrumentBackground(ctx);
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const radius = this.size/2 - 5;
        
        // Draw black circular background
        ctx.beginPath();
        ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        
        // Draw main markings
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 2;
        
        // Draw standard rate turn markers (2 min turn = 3 degrees/sec)
        const marks = [
            {angle: -30, label: 'L'},
            {angle: -20, label: '2'},
            {angle: -10, label: '1'},
            {angle: 0, label: ''},
            {angle: 10, label: '1'},
            {angle: 20, label: '2'},
            {angle: 30, label: 'R'}
        ];
        
        marks.forEach(({angle, label}) => {
            ctx.save();
            ctx.rotate(angle * Math.PI/180);
            
            // Draw mark
            ctx.beginPath();
            ctx.moveTo(0, -radius + 15);
            ctx.lineTo(0, -radius + 30);
            ctx.stroke();
            
            // Draw label
            if (label) {
                ctx.save();
                ctx.translate(0, -radius + 45);
                ctx.rotate(-angle * Math.PI/180);  // Keep text upright
                ctx.fillText(label, 0, 0);
                ctx.restore();
            }
            
            ctx.restore();
        });
        
        // Draw aircraft pointer
        ctx.save();
        // Smooth turn rate movement
        this.targetTurnRate = this.turnRate;
        const rotationAngle = (this.targetTurnRate * 10) * Math.PI/180;
        ctx.rotate(rotationAngle);
        
        // Draw aircraft silhouette
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Wings
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        
        // Fuselage
        ctx.moveTo(0, -20);
        ctx.lineTo(0, 10);
        
        // Tail
        ctx.moveTo(-10, 8);
        ctx.lineTo(10, 8);
        
        ctx.stroke();
        ctx.restore();
        
        // Draw slip/skid indicator housing
        const ballContainerWidth = 50;
        const ballContainerHeight = 20;
        
        ctx.save();
        ctx.translate(0, radius/2);
        
        // Draw curved ball race
        ctx.beginPath();
        ctx.arc(0, 0, ballContainerWidth/2, 0, Math.PI, true);
        ctx.strokeStyle = this.colors.markings;
        ctx.lineWidth = ballContainerHeight;
        ctx.stroke();
        
        // Draw center marks
        ctx.strokeStyle = this.colors.markings;
        ctx.lineWidth = 2;
        [-10, 0, 10].forEach(x => {
            ctx.beginPath();
            ctx.moveTo(x, -ballContainerHeight/2);
            ctx.lineTo(x, ballContainerHeight/2);
            ctx.stroke();
        });
        
        // Draw ball
        const ballPosition = this.slipSkid * 20;
        ctx.beginPath();
        ctx.arc(ballPosition, 0, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.strokeStyle = this.colors.markings;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
        
        // Draw "NO PITCH INFORMATION" text at bottom
        ctx.font = `${this.size/18}px Arial`;
        ctx.fillStyle = this.colors.markings;
        ctx.fillText("NO PITCH INFORMATION", 0, radius * 0.8);
        
        // Draw resize handles if in edit mode
        if (this.isEditMode) {
            this.drawResizeHandles(ctx);
        }

        ctx.restore();
    }
    
    update(data) {
        if (typeof data === 'object') {
            // Smooth turn rate transition
            const turnRateDiff = data.turnRate - this.turnRate;
            this.turnRate += turnRateDiff * 0.1;
            
            // Update slip/skid (ball position)
            this.slipSkid = Math.max(-1, Math.min(1, data.slipSkid));
        } else {
            this.turnRate = Math.max(-6, Math.min(6, data));
        }
    }
}
