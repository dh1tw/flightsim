class Cockpit {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.instruments = new Map();
        this.setupInstruments();
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
