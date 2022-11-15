import {spline} from "https://cdn.skypack.dev/@georgedoescode/spline@1.0.1";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@2.4.0";

// blob

const path = document.querySelector("path");
const blob = document.querySelector("svg");

let hueNoiseOffset = 0;
let noiseStep = 0.005;

const simplex = new SimplexNoise();

const points = createPoints();

(function animate() {
    path.setAttribute("d", spline(points, 1, true));

    for (let i = 0; i < points.length; i++) {
        const point = points[i];

        const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
        const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
        const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
        const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

        point.x = x;
        point.y = y;

        point.noiseOffsetX += noiseStep;
        point.noiseOffsetY += noiseStep;
    }

    const hueNoise = noise(hueNoiseOffset, hueNoiseOffset);
    const hue = map(hueNoise, -1, 1, 0, 360);

    blob.style.setProperty("--startColor", `hsl(${hue}, 100%, 75%)`);
    blob.style.setProperty("--stopColor", `hsl(${hue + 60}, 100%, 75%)`);

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
    const numPoints = 6;
    const angleStep = (Math.PI * 2) / numPoints;
    const rad = 75;

    for (let i = 1; i <= numPoints; i++) {
        const theta = i * angleStep;

        const x = 100 + Math.cos(theta) * rad;
        const y = 100 + Math.sin(theta) * rad;

        points.push({
            x: x,
            y: y,
            originX: x,
            originY: y,
            noiseOffsetX: Math.random() * 1000,
            noiseOffsetY: Math.random() * 1000
        });
    }

    return points;
}

document.querySelector("path").addEventListener("mouseover", () => {
    noiseStep = 0.01;
});

document.querySelector("path").addEventListener("mouseleave", () => {
    noiseStep = 0.005;
});

// cursor

if ($(window).width() > 992) {
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
}

// mouse scroll

$(function () {
    $('a[href*="#intro"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: $($(this).attr('href')).offset().top},
            500,
            'linear');
    });
});

$(function () {
    $('a[href*="#business"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: $($(this).attr('href')).offset().top},
            500,
            'linear');
    });
});

$(function () {
    $('a[href*="#education"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: $($(this).attr('href')).offset().top},
            500,
            'linear');
    });
});

$(function () {
    $('a[href*="#contact"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: $($(this).attr('href')).offset().top},
            500,
            'linear');
    });
});

// emoji api import

async function load_pic() {

    const url = 'https://ranmoji.herokuapp.com/emojis/api/v.1.0/'

    const options = {
        method: "GET"
    }

    let response = await fetch(url, options)

    if (response.status === 200) {

        const result = await response.json();
        const emoji = result.emoji;

        const container = document.getElementById("random");
        container.innerHTML = emoji;
    } else {
        console.log("HTTP-Error: " + response.status)
    }
}

load_pic();