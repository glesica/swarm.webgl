/*
 * boids.js
 */

BS.Boid = function(position, heading) {
    this.position           = position || {x: 0, y: 0, z: 0};
    this.heading            = heading || {x: 0, y: 0, z: 0};
    this.newHeading         = {};
    this.mesh               = new THREE.Mesh(
        new THREE.SphereGeometry(
            BS.settings.boidRadius,
            BS.settings.sphereSegments,
            BS.settings.sphereSegments
        ),
        new THREE.MeshBasicMaterial({
            color:      0x00ff00,
            wireframe:  true,
            position:   this.position
        })
    );
};

BS.Boid.prototype.update = function() {
    // Clamp the speed of the boid
    if (BS.geom.magnitude(this.newHeading) > BS.settings.maxSpeed && BS.settings.maxSpeed != 0) {
        this.newHeading = BS.geom.unitVector(this.newHeading, BS.settings.maxSpeed);
    }
    this.heading = this.newHeading;
    this.position = BS.geom.vectorSum([this.position, this.heading]);
    this.mesh.position = this.position;
};

BS.Swarm = function(bounds, size) {
    this.size        = size || BS.settings.swarmSize;
    this.boids       = [];
    // Create <size> boids
    for (i = 0; i < this.size; i++) {
        var x   = (Math.random() - 0.5) * bounds.x;
        var y   = (Math.random() - 0.5) * bounds.y;
        var z   = (Math.random() - 0.5) * bounds.z;
        var dx  = (Math.random() - 0.5) * Math.max((BS.settings.maxSpeed * 2), BS.settings.defaultSpeed);
        var dy  = (Math.random() - 0.5) * Math.max((BS.settings.maxSpeed * 2), BS.settings.defaultSpeed);
        var dz  = (Math.random() - 0.5) * Math.max((BS.settings.maxSpeed * 2), BS.settings.defaultSpeed);
        this.boids.push(new BS.Boid({x: x, y: y, z: z}, {x: dx, y: dy, z: dz}));
    }
};

BS.Swarm.prototype.tick = function() {
    this.boids.forEach(function(boid, i) {
        var positions = [];
        var nbPositions = [];
        var headings = [];
        var nbHeadings = [];
        var weights = [];
        var nbWeights = [];
        this.boids.forEach(function(boid2, i2) {
            if (i != i2) {
                var dist = BS.geom.distance(boid.position, boid2.position);
                if (BS.settings.visibility === 0) {
                    positions.push(boid2.position);
                    headings.push(boid2.heading);
                    weights.push(1 / (dist * dist));
                } else if (dist <= BS.settings.visibility) {
                    positions.push(boid2.position);
                    headings.push(boid2.heading);
                    weights.push(1);
                }
                // Is boid2 considered "nearby"?
                if (dist <= BS.settings.community) {
                    nbPositions.push(boid2.position);
                    nbHeadings.push(boid2.heading);
                    nbWeights.push(1 / (dist * dist));
                }
            }
        }, this);

        var parameterVectors = [];
        
        // Cohesion
        if (positions.length > 0) {
            parameterVectors.push(
                BS.geom.vector(boid.position, BS.geom.centroid(positions, weights), BS.settings.cohesion)
            );
        }

        // Separation
        if (nbPositions.length > 0) {
            parameterVectors.push(
                BS.geom.vector(boid.position, BS.geom.centroid(nbPositions, nbWeights), -BS.settings.separation)
            );
        }

        // Alignment
        if (nbPositions.length > 0) {
            parameterVectors.push(
                BS.geom.scalarMult(BS.geom.vectorAvg(nbHeadings, nbWeights), BS.settings.alignment)
            );
        }

        // Resistance
        parameterVectors.push(
            BS.geom.scalarMult(boid.heading, BS.settings.resistance)
        );

        boid.newHeading = BS.geom.vectorAvg(parameterVectors);
        
    }, this);
    // New headings have been calculated, now flip all the positions
    // and let them renderer update the display.
    this.boids.forEach(function(boid) {
        boid.update();
    }, this);
};

BS.Display = function() {
    var bounds = {
        x: window.innerWidth,
        y: window.innerHeight,
        z: window.innerWidth
    };
    this.camera = new THREE.PerspectiveCamera(
        90, bounds.x / bounds.y, 1, 10000
    );
    this.camera.position.z = 1000;
    this.scene = new THREE.Scene();

    this.swarm = new BS.Swarm(bounds);
    this.swarm.boids.forEach(function(boid) {
        this.scene.add(boid.mesh);
    }, this);

    // Use canvas unless the browser supports WebGL and it actually works
    this.renderer = new THREE.CanvasRenderer();
    if (window.WebGLRenderingContext) {
        var canvas = document.createElement('canvas');
        if (canvas.getContext('webgl') || BS.settings.forceWebGL) {
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: canvas
            });
        }
    }
    this.renderer.setSize(bounds.x, bounds.y);
    document.body.appendChild(this.renderer.domElement);

    this.running = false;
};

BS.start = function() {
    var display = new BS.Display();
    display.running = true;

    function animate() {
        requestAnimationFrame(animate);

        if (display.running) {
            display.swarm.tick();
            display.renderer.render(display.scene, display.camera);
        }
    }

    animate();

    return display;
};

