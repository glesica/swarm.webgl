/*
 * geom.js
 * Helper functions for geometry.
 */

BS.geom = {};

/*
 * Computes the Euclidean distance from pt1 to pt2, where 
 * these are objects with .x, .y and optionally, .z attributes.
 */
BS.geom.distance = function(pt1, pt2) {
    var z1 = pt1.z || 0;
    var z2 = pt2.z || 0;
    return Math.sqrt(
        (pt1.x - pt2.x) * (pt1.x - pt2.x) +
        (pt1.y - pt2.y) * (pt1.y - pt2.y) +
        (z1 - z2) * (z1 - z2)
    );
};

/*
 * Computes the average of an array of points, where each 
 * element is an object with .x, .y and optionally, .z attributes.
 * If weights is given, it will be used to weight each point in 
 * the mean calculation. It must be the same length as points.
 * Alternately, if weights === true then a .wt attribute on 
 * each point is expected.
 */
BS.geom.centroid = function(points, weights) {
    var x = 0;
    var y = 0;
    var z = 0;
    var k = 0; // denominator
    if (weights === true) {
        points.forEach(function(pt, i) {
            x += pt.x * pt.wt;
            y += pt.y * pt.wt;
            z += (pt.z || 0) * pt.wt;
        });
        k = BS.util.listSum(points, 'wt');
    } else if (weights) {
        points.forEach(function(pt, i) {
            x += pt.x * weights[i];
            y += pt.y * weights[i];
            z += (pt.z || 0) * weights[i];
        });
        k = BS.util.listSum(weights);
    } else {
        points.forEach(function(pt, i) {
            x += pt.x;
            y += pt.y;
            z += pt.z || 0;
        });
        k = points.length;
    }
    return {x: x / k, y: y / k, z: z / k};
};

/*
 * Computes the vector sum of the elements in vecs.
 */
BS.geom.vectorSum = function(vecs) {
    var x = 0;
    var y = 0;
    var z = 0;
    vecs.forEach(function(vec) {
        x += vec.x;
        y += vec.y;
        z += vec.z || 0;
    });
    return {x: x, y: y, z: z};
};

/*
 * Multiplies a vector by a scalar.
 */
BS.geom.scalarMult = function(vec, sca) {
    var z = vec.z || 0;
    return {x: vec.x * sca, y: vec.y * sca, z: z * sca};
};

/*
 * Computes the average of an array of vectors.
 */
BS.geom.vectorAvg = BS.geom.centroid;

/*
 * Converts a vector to a unit vector. If sca is given, then that
 * value will be treated as unity. This is equivalent to multiplying 
 * the unit vector by sca.
 */
BS.geom.unitVector = function(vec, sca) {
    var mult = sca || 1;
    var mag = BS.geom.distance({x: 0, y: 0, z: 0}, vec);
    if (mag === 0) {
        return {x: 0, y: 0, z: 0};
    }
    var z = vec.z || 0;
    return {x: vec.x * mult / mag, y: vec.y * mult / mag, z: z * mult / mag};
};

/*
 * Determines whether the vector is a zero vector.
 */
BS.geom.isZero = function(vec) {
    var z = vec.z || 0;
    return vec.x === 0 && vec.y === 0 && z === 0;
}

/*
 * Determines the magnitude of the vector.
 */
BS.geom.magnitude = function(vec) {
    var z = vec.z || 0;
    return Math.sqrt(
        vec.x * vec.x +
        vec.y * vec.y +
        z * z
    );
}

/*
 * Computes a vector from pt1 to pt2. If sca is given, the resulting 
 * vector will be scaled by that amount. Useful for reversing a vector.
 */
BS.geom.vector = function(pt1, pt2, sca) {
    var z1 = pt1.z || 0;
    var z2 = pt2.z || 0;
    var mult = sca || 1;
    return {x: (pt2.x - pt1.x) * mult, y: (pt2.y - pt1.y) * mult, z: (z2 - z1) * mult};
};












