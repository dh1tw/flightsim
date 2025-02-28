class Cockpit {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.instruments = new Map();
        this.setupInstruments();
        this.setupMouseHandlers();
        this.draggedInstrument = null;
        this.isEditMode = false;
        this.setupEditModeToggle();
    }

    setupEditModeToggle() {
        const button = document.createElement('button');
        button.textContent = 'Toggle Edit Mode';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.left = '10px';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            this.isEditMode = !this.isEditMode;
            button.textContent = this.isEditMode ? 'Exit Edit Mode' : 'Toggle Edit Mode';
            for (let instrument of this.instruments.values()) {
                instrument.isEditMode = this.isEditMode;
            }
        });
    }

    setupMouseHandlers() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Only handle mouse events if in edit mode
            if (this.isEditMode) {
                const instruments = Array.from(this.instruments.values()).reverse();
                for (let instrument of instruments) {
                    if (instrument.isEditMode && instrument.isOverResizeHandle(mouseX, mouseY)) {
                        instrument.startResize(mouseX, mouseY);
                        this.draggedInstrument = instrument;
                        break;
                    } else if (instrument.containsPoint(mouseX, mouseY)) {
                        instrument.startDrag(mouseX, mouseY);
                        this.draggedInstrument = instrument;
                        break;
                    }
                }
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.draggedInstrument) {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                if (this.draggedInstrument.isResizing) {
                    this.draggedInstrument.resize(mouseX, mouseY);
                } else {
                    this.draggedInstrument.drag(mouseX, mouseY);
                }
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            if (this.draggedInstrument) {
                if (this.draggedInstrument.isResizing) {
                    this.draggedInstrument.stopResize();
                } else {
                    this.draggedInstrument.stopDrag();
                }
                this.draggedInstrument = null;
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            if (this.draggedInstrument) {
                this.draggedInstrument.stopDrag();
                this.draggedInstrument = null;
            }
        });
    }

    drawWindow() {
        // Base panel color
        this.ctx.fillStyle = '#2a2a2a';  // Dark gray for main panel
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const margin = 10;
        const windowHeight = this.canvas.height * 0.6 - (margin * 2);

        // Create gradient for sky
        const skyGradient = this.ctx.createLinearGradient(
            0, margin,
            0, windowHeight
        );
        skyGradient.addColorStop(0, '#3498db');    // Light blue at top
        skyGradient.addColorStop(1, '#87CEEB');    // Lighter blue at horizon

        // Draw windshield frame with depth effect
        const frameWidth = 5;
        const frameColor = '#303030';
        const frameShadow = '#151515';
        const frameHighlight = '#505050';

        // Function to draw frame segment with 3D effect
        const drawFrameSegment = (path, width) => {
            // Dark shadow
            this.ctx.strokeStyle = frameShadow;
            this.ctx.lineWidth = width + 4;
            this.ctx.stroke(path);

            // Main frame color
            this.ctx.strokeStyle = frameColor;
            this.ctx.lineWidth = width + 2;
            this.ctx.stroke(path);

            // Highlight
            this.ctx.strokeStyle = frameHighlight;
            this.ctx.lineWidth = 2;
            this.ctx.stroke(path);
        };

        // Create windshield path
        const windshieldPath = new Path2D();
        windshieldPath.moveTo(margin + 100, margin + 20); // Top left
        windshieldPath.lineTo(this.canvas.width - margin - 100, margin + 20); // Top
        windshieldPath.lineTo(this.canvas.width - margin - 20, margin + windowHeight * 0.3); // Top right angle
        windshieldPath.lineTo(this.canvas.width - margin - 20, windowHeight); // Right side
        windshieldPath.lineTo(margin + 20, windowHeight); // Bottom
        windshieldPath.lineTo(margin + 20, margin + windowHeight * 0.3); // Left side
        windshieldPath.closePath();

        // Draw the frame
        drawFrameSegment(windshieldPath, frameWidth);

        // Draw the sky (clipped to inside of frame)
        this.ctx.save();
        this.ctx.clip(windshieldPath);

        // Fill sky gradient
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw clouds
        const timeOffset = Date.now() / 5000;
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

            if (cloud.x + cloud.size > this.canvas.width - margin * 2) {
                this.drawCloud(
                    cloud.x - (this.canvas.width - margin * 2),
                    cloud.y + margin,
                    cloud.size
                );
            }
        });

        this.ctx.restore();

        // Add subtle reflection effect on the windshield
        this.ctx.save();
        this.ctx.clip(windshieldPath);
        const glassGradient = this.ctx.createLinearGradient(
            0, margin,
            0, windowHeight
        );
        glassGradient.addColorStop(0, 'rgba(255,255,255,0.1)');
        glassGradient.addColorStop(0.5, 'rgba(255,255,255,0.05)');
        glassGradient.addColorStop(1, 'rgba(255,255,255,0)');
        this.ctx.fillStyle = glassGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
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
        // Calculate positions based on canvas size
        const size = 180; // Instrument size
        const padding = 30; // Space between instruments

        // Start Y position at 55% of canvas height
        const startY = this.canvas.height * 0.55;

        // Calculate starting X to center the instruments
        const totalWidth = (size * 4.5) + (padding * 3);
        const startX = (this.canvas.width - totalWidth) / 2;

        // Row 1 (top row)
        this.instruments.set('airspeed',
            new AirspeedIndicator(
                startX,
                startY,
                size
            )
        );

        this.instruments.set('attitude',
            new AttitudeIndicator(
                startX + size + padding,
                startY,
                size
            )
        );

        this.instruments.set('altimeter',
            new Altimeter(
                startX + (size + padding) * 2,
                startY,
                size
            )
        );

        // Row 2 (bottom row)
        this.instruments.set('turnIndicator',
            new TurnIndicator(
                startX,
                startY + size + padding,
                size
            )
        );

        this.instruments.set('heading',
            new HeadingIndicator(
                startX + size + padding,
                startY + size + padding,
                size
            )
        );

        this.instruments.set('magneticCompass',
            new MagneticCompass(
                startX + (size + padding) * 2,
                startY + size + padding,
                size
            )
        );

        this.instruments.set('vsi',
            new VerticalSpeedIndicator(
                startX + (size + padding) * 3,
                startY + size + padding,
                size
            )
        );

        // Add NDB indicator (to the right of altimeter)
        this.instruments.set('ndb',
            new NDBIndicator(
                startX + (size + padding) * 3,
                startY,  // Same Y as top row
                size
            )
        );

        // Add VOR indicator
        this.instruments.set('vor',
            new VORIndicator(
                startX + (size + padding) * 3,
                startY + size + padding,  // Bottom row
                size
            )
        );

        // Add radio to the right of the instruments
        this.instruments.set('radio',
            new Radio(
                startX + (size + padding) * 3,
                startY,  // Same Y as top row
                size * 2.25,  // Increased from 1.5 to 1.8 (20% wider)
                size * 0.8   // Keep same height
            )
        );
    }

    draw() {
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw window view first
        this.drawWindow();

        // Dessiner tous les instruments
        for (let instrument of this.instruments.values()) {
            instrument.draw(this.ctx);
        }
    }

    update(data) {
        // Mettre à jour tous les instruments avec les nouvelles données
        for (let [name, instrument] of this.instruments) {
            if (data[name] !== undefined) {
                instrument.update(data[name]);
            }
        }
    }
}
