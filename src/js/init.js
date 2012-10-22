/*
 * init.js
 * Initialization and defaults setup.
 */

BS = {}

BS.settings = {

    // Hacks
    forceWebGL:         true,
    
    // Technical parameters
    boidRadius:         20,
    spherSegments:      20,
    defaultSpeed:       10,

    // World parameters

    swarmSize:          100,
    maxSpeed:           0,
    
    // Behavior parameters

    visibility:         250,
    community:          100,
    cohesion:           0.05,
    separation:         0.7,
    resistance:         2.0,
    alignment:          2.5

};
