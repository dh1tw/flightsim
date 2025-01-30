// Création du cockpit
const cockpit = new Cockpit('cockpit');

// Boucle d'animation
function animate() {
    // Simuler des données de vol
    const flightData = {
        altimeter: Math.random() * 10000,
        airspeed: Math.random() * 300
    };
    
    // Mettre à jour et redessiner
    cockpit.update(flightData);
    cockpit.draw();
    
    requestAnimationFrame(animate);
}

// Démarrer l'animation
animate();
