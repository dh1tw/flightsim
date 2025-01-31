class TurnCoordinator extends Instrument {
    constructor(x, y, size) {
        super(x, y, size);
        this.turnRate = 0;    // degrees per second
        this.slipSkid = 0;    // -1 to 1
    }
    
    draw(ctx) {
        // Draw common background first
        this.drawInstrumentBackground(ctx);
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const radius = this.size/2 - 5;
        
        // Draw main markings
        ctx.strokeStyle = this.colors.markings;
        ctx.fillStyle = this.colors.markings;
        ctx.lineWidth = 2;
        
        // Draw "2 MIN TURN" text at top
        ctx.font = `${this.size/15}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText("2 MIN TURN", 0, -radius/2);
        
        // Draw turn rate marks and labels
        const marks = [
            {angle: -30, label: 'L'},
            {angle: 0, label: ''},
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
        
        // Draw miniature aircraft
        ctx.save();
        ctx.rotate(this.turnRate * Math.PI/12);  // Scale turn rate to rotation
        
        // Draw aircraft symbol
        ctx.strokeStyle = this.colors.markings;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Wings
        ctx.moveTo(-20, 0);
        ctx.lineTo(20, 0);
        
        // Fuselage
        ctx.moveTo(0, -15);
        ctx.lineTo(0, 15);
        
        // Stabilizers
        ctx.moveTo(-10, 10);
        ctx.lineTo(10, 10);
        
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
        
        ctx.restore();
    }
    
    update(data) {
        this.turnRate = Math.max(-6, Math.min(6, data.turnRate));
        this.slipSkid = Math.max(-1, Math.min(1, data.slipSkid));
    }
}
