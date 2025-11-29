const canvas = document.getElementById("kanvas");
const ctx = canvas.getContext("2d");

// --------------------
// RESIZE
// --------------------
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", () => {
    resizeCanvas();
    drawStatic(); // piirretään staattiset uudelleen kun koko muuttuu
});

// --------------------
// KUVAT
// --------------------
const bg = new Image();
bg.src = "maisema3koe.jpg";

const kuusi = new Image();
kuusi.src = "joulukuusi.png";

const tahti = new Image();
tahti.src = "latvatahti.png";

const tonttu = new Image();
tonttu.src = "tonttu.png";

// --------------------
// STAATTINEN BUFFERI
// --------------------
const staticCanvas = document.createElement("canvas");
const staticCtx = staticCanvas.getContext("2d");

function drawStatic() {
    staticCanvas.width = canvas.width;
    staticCanvas.height = canvas.height;

    // Tausta (cover)
    const imgW = bg.width;
    const imgH = bg.height;
    const canvasW = staticCanvas.width;
    const canvasH = staticCanvas.height;

    const imgRatio = imgW / imgH;
    const canvasRatio = canvasW / canvasH;

    let drawW, drawH;
    if (canvasRatio > imgRatio) {
        drawW = canvasW;
        drawH = canvasW / imgRatio;
    } else {
        drawH = canvasH;
        drawW = canvasH * imgRatio;
    }
    const x = (canvasW - drawW) / 2;
    const y = (canvasH - drawH) / 2;
    staticCtx.drawImage(bg, x, y, drawW, drawH);

    // Kuusi
    const base = Math.min(canvasW, canvasH);
    const treeWidth = base * 0.35;
    const treeHeight = treeWidth * 1.45;
    const treeX = canvasW - treeWidth - 20;
    const treeY = canvasH - treeHeight * 0.9;
    staticCtx.drawImage(kuusi, treeX, treeY, treeWidth, treeHeight);
}

// --------------------
// ANIMAATIO-OSAT
// --------------------
let starFrame = 0;
let elfX = -200;
elfSpeed = Math.max(1.2, canvas.width / 800 * 1.5);


function drawStar() {
    if (!tahti.complete || !kuusi.complete) return;

    const base = Math.min(canvas.width, canvas.height);
    const treeWidth = base * 0.35;
    const treeHeight = treeWidth * 1.45;
    const treeX = canvas.width - treeWidth - 20;
    const treeY = canvas.height - treeHeight * 0.9;

    const starWidth = treeWidth * 0.28;
    const starHeight = starWidth;
    const starX = treeX + treeWidth / 2 - starWidth / 2;
    const starY = treeY - starHeight * 0.35;

    const alpha = 0.5 + Math.sin(starFrame * 0.1) * 0.5;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(tahti, starX, starY, starWidth, starHeight);
    ctx.restore();

    starFrame++;
}

const snowflakes = [];
function createSnowflakes() {
    const count = Math.floor((canvas.width + canvas.height) / 25);
    snowflakes.length = 0;
    for (let i = 0; i < count; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 3 + 1,
            speed: Math.random() * 1.2 + 0.4,
            drift: Math.random() * 0.6 - 0.3
        });
    }
}
createSnowflakes();
window.addEventListener("resize", createSnowflakes);

function drawSnow() {
    ctx.fillStyle = "white";
    for (let flake of snowflakes) {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fill();
        flake.y += flake.speed;
        flake.x += flake.drift;
        if (flake.y > canvas.height || flake.x < -10 || flake.x > canvas.width + 10) {
            flake.y = -10;
            flake.x = Math.random() * canvas.width;
        }
    }
}

function drawElf() {
    if (!tonttu.complete) return;
    const base = Math.min(canvas.width, canvas.height);
    const elfWidth = base * 0.18;
    const elfHeight = elfWidth;
    const elfY = canvas.height - elfHeight * 0.92;
    ctx.drawImage(tonttu, elfX, elfY, elfWidth, elfHeight);
    elfX += elfSpeed;
    if (elfX > canvas.width + 50) {
        elfX = -elfWidth - 50;
    }
}

function drawText() {
    const text = "Hyvää Joulua";
    const fontSize = canvas.width * 0.08;
    ctx.font = `${fontSize}px 'Meie Script'`;
    ctx.textAlign = "center";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 8;
    const x = canvas.width / 2;
    const y = canvas.height * 0.18;
    ctx.fillStyle = "crimson";
    ctx.fillText(text, x, y);
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.scale(1, -1);
    ctx.fillText(text, x, -y - 20);
    ctx.restore();
}

// --------------------
// PIIRTOLOOPPI
// --------------------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Kopioi staattinen tausta + kuusi
    ctx.drawImage(staticCanvas, 0, 0);

    // Dynaamiset elementit
    drawStar();
    drawSnow();
    drawElf();
    drawText();
}

// Kun kuvat ladattu → piirretään staattinen ja käynnistetään animaatio
let loadedCount = 0;
const images = [bg, kuusi, tahti, tonttu]; // odotetaan kaikki kuvat

images.forEach(img => {
  img.onload = () => {
    loadedCount++;
    if (loadedCount === images.length) {
      drawStatic();              // piirretään tausta + kuusi bufferiin
      setInterval(draw, 33);     // käynnistetään animaatio 30 FPS
    }
  };
});

