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
    magneticCompass: 0,
    attitude: {
        pitch: 0,
        roll: 0
    },
    turnRate: 0,
    slipSkid: 0,
    radio: {
        activeFreq: 118.00,
        standbyFreq: 136.97
    },
    vor: {
        course: 0,
        bearing: 0,
        deviation: 0,
        fromFlag: true,
        isValid: true
    },
    ndb: {
        bearing: 0,
        heading: 0
    }
};

// Target values for smooth transitions
let targetState = {
    altimeter: {
        altitude: 5000,
        pressure: 29.92
    },
    airspeed: 120,
    vsi: 0,
    heading: 0,
    magneticCompass: 0,
    attitude: {
        pitch: 0,
        roll: 0
    },
    turnRate: 0,
    slipSkid: 0,
    vor: {
        course: 0,
        bearing: 0,
        deviation: 0,
        fromFlag: true,
        isValid: true
    },
    ndb: {
        bearing: 0,
        heading: 0
    }
};

// Update targets every 5 seconds
setInterval(() => {
    targetState = {
        altimeter: {
            altitude: 3000 + Math.sin(Date.now() / 10000) * 2000,
            pressure: 29.92 + Math.sin(Date.now() / 20000) * 0.1
        },
        airspeed: 120 + Math.sin(Date.now() / 15000) * 40,
        vsi: Math.sin(Date.now() / 8000) * 1000,
        heading: (targetState.heading + 0.5) % 360,
        magneticCompass: targetState.heading, // Use same heading as directional gyro
        attitude: {
            pitch: Math.sin(Date.now() / 12000) * 10,
            roll: Math.sin(Date.now() / 10000) * 15
        },
        turnIndicator: {
            turnRate: Math.sin(Date.now() / 8000) * 2,
            slipSkid: Math.sin(Date.now() / 6000) * 0.3
        },
        vor: {
            course: (targetState.vor?.course || 0) + 0.1,  // Slowly rotate course
            bearing: Math.sin(Date.now() / 10000) * 180,   // Oscillate bearing
            deviation: Math.sin(Date.now() / 5000) * 0.5,  // Oscillate deviation
            fromFlag: Date.now() % 10000 > 5000,          // Toggle TO/FROM every 5 seconds
            isValid: true
        },
        ndb: {
            bearing: Math.sin(Date.now() / 15000) * 180,   // Oscillate bearing
            heading: targetState.heading  // Use same heading as directional gyro
        }
        // radio: {
        //     activeFreq: flightState.radio.activeFreq,
        //     standbyFreq: flightState.radio.standbyFreq
        // }
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
        altimeter: {
            altitude: lerp(flightState.altimeter.altitude, targetState.altimeter.altitude, 0.1),
            pressure: lerp(flightState.altimeter.pressure, targetState.altimeter.pressure, 0.1)
        },
        airspeed: lerp(flightState.airspeed, targetState.airspeed, 0.1),
        vsi: lerp(flightState.vsi, targetState.vsi, 0.1),
        heading: lerp(flightState.heading, targetState.heading, 0.1),
        attitude: {
            pitch: lerp(flightState.attitude.pitch, targetState.attitude.pitch, 0.1),
            roll: lerp(flightState.attitude.roll, targetState.attitude.roll, 0.1)
        },
        turnRate: lerp(flightState.turnRate, targetState.turnRate, 0.1),
        slipSkid: lerp(flightState.slipSkid, targetState.slipSkid, 0.1),
        ndb: {
            bearing: lerp(flightState.ndb.bearing, targetState.ndb.bearing, 0.1),
            heading: flightState.heading
        }
    };

    // Update and redraw
    cockpit.update(flightState);
    cockpit.draw();

    requestAnimationFrame(animate);
}

// Start animation
animate();
