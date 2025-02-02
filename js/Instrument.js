class Instrument {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        
        // Common colors for all instruments
        this.colors = {
            background: '#202020',      // Dark gray background
            markings: '#ffffff',        // White markings
            numbers: '#ffffff',         // White numbers
            case: '#2a2a2a',           // Instrument case color
            needles: '#ffffff',         // White needles
            needleShadow: 'rgba(0,0,0,0.5)', // Needle shadow
            graduations: '#ffffff'      // White graduations
        };
    }

    containsPoint(px, py) {
        const dx = px - this.x;
        const dy = py - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.size/2;
    }
    
    startDrag(mouseX, mouseY) {
        this.isDragging = true;
        this.dragOffsetX = mouseX - this.x;
        this.dragOffsetY = mouseY - this.y;
    }
    
    drag(mouseX, mouseY) {
        if (this.isDragging) {
            this.x = mouseX - this.dragOffsetX;
            this.y = mouseY - this.dragOffsetY;
        }
    }
    
    stopDrag() {
        this.isDragging = false;
    }
    
    drawInstrumentBackground(ctx) {
        // Draw outer case (slightly larger than the instrument)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2 + 5, 0, Math.PI * 2);
        ctx.fillStyle = this.colors.case;
        ctx.fill();
        
        // Draw main background
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.fillStyle = this.colors.background;
        ctx.fill();
        
        // Add subtle gradient overlay for depth
        const gradient = ctx.createRadialGradient(
            this.x - this.size/4, 
            this.y - this.size/4, 
            0,
            this.x, 
            this.y, 
            this.size/2
        );
        gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add glass effect (subtle white arc at the top)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2 - 2, -Math.PI/2, Math.PI/6);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    draw(ctx) {
        // Draw common background first
        this.drawInstrumentBackground(ctx);
        // Specific instrument drawing will be implemented in subclasses
    }
    
    update(data) {
        // To be implemented in subclasses
    }
}
