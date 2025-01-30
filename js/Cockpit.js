class Cockpit {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.instruments = new Map();
        this.setupInstruments();
    }

    setupInstruments() {
        // Ajouter un altimètre au centre pour commencer
        this.instruments.set('altimeter', 
            new Altimeter(
                this.canvas.width/2, 
                this.canvas.height/2, 
                200
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
