import { spline } from "https://cdn.skypack.dev/@georgedoescode/spline@1.0.1";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@2.4.0";

// our <path> element
const path = document.querySelector("path");
// used to set our custom property values
const root = document.documentElement;

let hueNoiseOffset = 0;
let noiseStep = 0.005;

const simplex = new SimplexNoise();

const points = createPoints();

(function animate() {
    path.setAttribute("d", spline(points, 1, true));

    // for every point...
    for (let i = 0; i < points.length; i++) {
        const point = points[i];

        // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
        const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
        const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
        // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
        const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
        const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

        // update the point's current coordinates
        point.x = x;
        point.y = y;

        // progress the point's x, y values through "time"
        point.noiseOffsetX += noiseStep;
        point.noiseOffsetY += noiseStep;
    }

    const hueNoise = noise(hueNoiseOffset, hueNoiseOffset);
    const hue = map(hueNoise, -1, 1, 0, 360);

    root.style.setProperty("--startColor", `hsl(${hue}, 100%, 75%)`);
    root.style.setProperty("--stopColor", `hsl(${hue + 60}, 100%, 75%)`);
    document.getElementById("blob").style.background = `hsl(${hue + 60}, 75%, 5%)`;

    hueNoiseOffset += noiseStep / 6;

    requestAnimationFrame(animate);
})();

function map(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

function noise(x, y) {
    return simplex.noise2D(x, y);
}

function createPoints() {
    const points = [];
    // how many points do we need
    const numPoints = 6;
    // used to equally space each point around the circle
    const angleStep = (Math.PI * 2) / numPoints;
    // the radius of the circle
    const rad = 75;

    for (let i = 1; i <= numPoints; i++) {
        // x & y coordinates of the current point
        const theta = i * angleStep;

        const x = 100 + Math.cos(theta) * rad;
        const y = 100 + Math.sin(theta) * rad;

        // store the point's position
        points.push({
            x: x,
            y: y,
            // we need to keep a reference to the point's original point for when we modulate the values later
            originX: x,
            originY: y,
            // more on this in a moment!
            noiseOffsetX: Math.random() * 1000,
            noiseOffsetY: Math.random() * 1000
        });
    }

    return points;
}

// curser

document.querySelector("path").addEventListener("mouseover", () => {
    noiseStep = 0.01;
});

document.querySelector("path").addEventListener("mouseleave", () => {
    noiseStep = 0.005;
});

const cursor = document.querySelector("#cursor");

document.addEventListener("mousemove", e => {
    cursor.style.left = e.pageX + "px";
    cursor.style.top = e.pageY + "px";
});

document.addEventListener("mouseup", () => cursor.classList.add("pulse"));
document.addEventListener("animationend", () =>
    cursor.classList.remove("pulse")
);
document.addEventListener(
    "mouseleave",
    () => (cursor.style.visibility = "hidden")
);
document.addEventListener(
    "mouseenter",
    () => (cursor.style.visibility = "visible")
);

// mouse scroll

$(function() {
    $('a[href*=#]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
    });
});