// Create cockpit
const cockpit = new Cockpit('cockpit');

// Flight data state
let flightState = {
    altimeter: {
        altitude: 5000,
        pressure: 29.92
    },
    airspeed: 120,
    vsi: 0,
    heading: 0,
    attitude: {
        pitch: 0,
        roll: 0
    },
    turnRate: 0,
    slipSkid: 0
};

// Target values for smooth transitions
let targetState = {
    altimeter: 5000,
    airspeed: 120,
    vsi: 0,
    heading: 0,
    attitude: {
        pitch: 0,
        roll: 0
    },
    turnRate: 0,
    slipSkid: 0
};

// Update targets every 5 seconds
setInterval(() => {
    targetState = {
        altimeter: 3000 + Math.sin(Date.now() / 10000) * 2000,
        airspeed: 120 + Math.sin(Date.now() / 15000) * 40,
        vsi: Math.sin(Date.now() / 8000) * 1000,
        heading: (targetState.heading + 0.5) % 360,
        attitude: {
            pitch: Math.sin(Date.now() / 12000) * 10,
            roll: Math.sin(Date.now() / 10000) * 15
        },
        turnRate: Math.sin(Date.now() / 8000) * 2,
        slipSkid: Math.sin(Date.now() / 6000) * 0.3
    };
}, 200);  // 5 times per second

// Interpolation function
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Animation loop
function animate() {
    // Smooth interpolation towards target values
    flightState = {
        altimeter: lerp(flightState.altimeter, targetState.altimeter, 0.1),
        airspeed: lerp(flightState.airspeed, targetState.airspeed, 0.1),
        vsi: lerp(flightState.vsi, targetState.vsi, 0.1),
        heading: lerp(flightState.heading, targetState.heading, 0.1),
        attitude: {
            pitch: lerp(flightState.attitude.pitch, targetState.attitude.pitch, 0.1),
            roll: lerp(flightState.attitude.roll, targetState.attitude.roll, 0.1)
        },
        turnRate: lerp(flightState.turnRate, targetState.turnRate, 0.1),
        slipSkid: lerp(flightState.slipSkid, targetState.slipSkid, 0.1)
    };
    
    // Update and redraw
    cockpit.update(flightState);
    cockpit.draw();
    
    requestAnimationFrame(animate);
}

// Start animation
animate();
