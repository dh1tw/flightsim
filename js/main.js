// Création du cockpit
const cockpit = new Cockpit('cockpit');

// Boucle d'animation
function animate() {
    // Simuler des données de vol
    const flightData = {
        altimeter: Math.random() * 10000,
        airspeed: Math.random() * 300,
        vsi: (Math.random() - 0.5) * 4000,
        heading: (Date.now() / 50) % 360,
        attitude: {
            pitch: Math.sin(Date.now() / 1000) * 20,
            roll: Math.sin(Date.now() / 2000) * 45
        },
        turnRate: Math.sin(Date.now() / 1000) * 3,
        slipSkid: Math.sin(Date.now() / 500) * 0.5
    };
    
    // Mettre à jour et redessiner
    cockpit.update(flightData);
    cockpit.draw();
    
    requestAnimationFrame(animate);
}

// Démarrer l'animation
animate();
