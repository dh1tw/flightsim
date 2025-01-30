class Cockpit {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.instruments = new Map();
        this.setupInstruments();
    }

    drawWindow() {
        // Window frame
        this.ctx.fillStyle = '#404040';  // Dark gray for frame
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.55);
        
        const margin = 20;
        const windowHeight = this.canvas.height * 0.55 - (margin * 2);
        
        // Create gradient for sky
        const skyGradient = this.ctx.createLinearGradient(
            0, margin, 
            0, windowHeight
        );
        skyGradient.addColorStop(0, '#3498db');    // Light blue at top
        skyGradient.addColorStop(1, '#87CEEB');    // Lighter blue at horizon
        
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(
            margin, 
            margin, 
            this.canvas.width - (margin * 2), 
            windowHeight
        );
        
        // Draw clouds
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Time-based cloud movement
        const timeOffset = Date.now() / 5000;
        
        // Draw several clouds at different heights
        const clouds = [
            { x: (timeOffset * 50) % this.canvas.width, y: 50, size: 60 },
            { x: ((timeOffset + 2) * 30) % this.canvas.width, y: 120, size: 40 },
            { x: ((timeOffset + 4) * 40) % this.canvas.width, y: 80, size: 50 },
            { x: ((timeOffset + 6) * 20) % this.canvas.width, y: 150, size: 45 },
            { x: ((timeOffset + 8) * 35) % this.canvas.width, y: 100, size: 55 }
        ];
        
        clouds.forEach(cloud => {
            this.drawCloud(
                cloud.x + margin, 
                cloud.y + margin, 
                cloud.size
            );
            
            // Draw wrapped cloud if it's crossing the edge
            if (cloud.x + cloud.size > this.canvas.width - margin * 2) {
                this.drawCloud(
                    cloud.x - (this.canvas.width - margin * 2), 
                    cloud.y + margin, 
                    cloud.size
                );
            }
        });
        
        // Window dividers
        this.ctx.fillStyle = '#404040';
        // Center post
        this.ctx.fillRect(
            this.canvas.width/2 - 10, 
            margin, 
            20, 
            windowHeight
        );
        
        // Horizontal support
        this.ctx.fillRect(
            margin,
            margin + windowHeight/3,
            this.canvas.width - (margin * 2),
            10
        );
        
        // Panel background below window
        this.ctx.fillStyle = '#2a2a2a';  // Darker gray for instrument panel
        this.ctx.fillRect(
            0, 
            this.canvas.height * 0.55, 
            this.canvas.width, 
            this.canvas.height * 0.45
        );
    }

    drawCloud(x, y, size) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Create cloud shape using multiple overlapping circles
        const circles = [
            { x: 0, y: 0, r: size * 0.4 },
            { x: size * 0.3, y: -size * 0.1, r: size * 0.4 },
            { x: size * 0.5, y: size * 0.1, r: size * 0.3 },
            { x: size * 0.3, y: size * 0.2, r: size * 0.3 },
            { x: size * 0.1, y: size * 0.15, r: size * 0.35 }
        ];
        
        // Add shadow/depth to clouds
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        circles.forEach(circle => {
            this.ctx.beginPath();
            this.ctx.arc(circle.x + 2, circle.y + 2, circle.r, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw main cloud shapes
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        circles.forEach(circle => {
            this.ctx.beginPath();
            this.ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.restore();
    }

    setupInstruments() {
        // Standard six-pack arrangement
        const size = 160; // Smaller instrument size
        const padding = 20; // Space between instruments
        
        // Row 1 (top row)
        this.instruments.set('airspeed',
            new AirspeedIndicator(
                200,
                300,
                size
            )
        );
        
        this.instruments.set('attitude',
            new AttitudeIndicator(
                200 + size + padding,
                300,
                size
            )
        );
        
        this.instruments.set('altimeter',
            new Altimeter(
                200 + (size + padding) * 2,
                300,
                size
            )
        );

        // Row 2 (bottom row)
        this.instruments.set('turn',
            new TurnCoordinator(
                200,
                300 + size + padding,
                size
            )
        );

        this.instruments.set('heading',
            new HeadingIndicator(
                200 + size + padding,
                300 + size + padding,
                size
            )
        );

        this.instruments.set('vsi',
            new VerticalSpeedIndicator(
                200 + (size + padding) * 2,
                300 + size + padding,
                size
            )
        );
    }

    draw() {
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw window view first
        this.drawWindow();
        
        // Dessiner tous les instruments
        for(let instrument of this.instruments.values()) {
            instrument.draw(this.ctx);
        }
    }

    update(data) {
        // Mettre à jour tous les instruments avec les nouvelles données
        for(let [name, instrument] of this.instruments) {
            if(data[name] !== undefined) {
                instrument.update(data[name]);
            }
        }
    }
}
