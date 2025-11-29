const canvas = document.getElementById("kanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// --------------------
// TAUSTAKUVA (COVER)
// --------------------
const bg = new Image();
bg.src = "maisema3koe.jpg";

function drawBackground() {
    const imgW = bg.width;
    const imgH = bg.height;

    const canvasW = canvas.width;
    const canvasH = canvas.height;

    // Kuvasuhde
    const imgRatio = imgW / imgH;
    const canvasRatio = canvasW / canvasH;

    let drawW, drawH;

    // cover: täyttää koko tilan, leikkaa ylimääräisen
    if (canvasRatio > imgRatio) {
        drawW = canvasW;
        drawH = canvasW / imgRatio;
    } else {
        drawH = canvasH;
        drawW = canvasH * imgRatio;
    }

    const x = (canvasW - drawW) / 2;
    const y = (canvasH - drawH) / 2;

    ctx.drawImage(bg, x, y, drawW, drawH);
}

// --------------------
// JOULUKUUSI
// --------------------
const kuusi = new Image();
kuusi.src = "joulukuusi.png";

const tahti = new Image();
tahti.src = "latvatahti.png";

let starFrame = 0;

const tonttu = new Image();
tonttu.src = "tonttu.png";

let elfX = -200;  // tontun aloitus vasemmalta
let elfSpeed = 1.8;   // kävelyn nopeus


function drawTree() {
    if (!kuusi.complete) return;

    // Kuusen koko suhteessa näytön pienempään sivuun
    const base = Math.min(canvas.width, canvas.height);

    const treeWidth = base * 0.35;    // isompi mobiilissa
    const treeHeight = treeWidth * 1.45;

    // kuusi on keskellä const x = canvas.width / 2 - treeWidth / 2;
    const x = canvas.width - treeWidth - 20;
    const y = canvas.height - treeHeight * 0.9;

    ctx.drawImage(kuusi, x, y, treeWidth, treeHeight);
}

function drawStar() {
    if (!tahti.complete || !kuusi.complete) return;

    // Kuusen koko lasketaan samalla logiikalla kuin drawTree()
    const base = Math.min(canvas.width, canvas.height);
    const treeWidth = base * 0.35;
    const treeHeight = treeWidth * 1.45;

    // tähti keskelläconst treeX = canvas.width / 2 - treeWidth / 2;
    const treeX = canvas.width - treeWidth - 20; //tähti oikealle
    const treeY = canvas.height - treeHeight * 0.9;

    // Tähden koko suhteessa kuuseen
    const starWidth = treeWidth * 0.28;
    const starHeight = starWidth;

    const starX = treeX + treeWidth / 2 - starWidth / 2;
    const starY = treeY - starHeight * 0.35;

    // Vilkutus (siniaalto, pehmeä pulssi)
    const alpha = 0.5 + Math.sin(starFrame * 0.1) * 0.5;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(tahti, starX, starY, starWidth, starHeight);
    ctx.restore();

    starFrame++;
}

// --------------------
// LUMISADE
// --------------------
const snowflakes = [];

function drawSnow() {
    ctx.fillStyle = "white";

    for (let flake of snowflakes) {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fill();

        flake.y += flake.speed;
        flake.x += flake.drift;

        // Kun hiutale menee ruudun ulkopuolelle, aloita uudelleen ylhäältä
        if (flake.y > canvas.height || flake.x < -10 || flake.x > canvas.width + 10) {
            flake.y = -10;
            flake.x = Math.random() * canvas.width;
        }
    }
}

function createSnowflakes() {
    const count = Math.floor((canvas.width + canvas.height) / 25); 
    snowflakes.length = 0;

    for (let i = 0; i < count; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 3 + 1,               // koko
            speed: Math.random() * 1.2 + 0.4,       // putoamisnopeus
            drift: Math.random() * 0.6 - 0.3        // tuulenpuuska sivulle
        });
    }
}

createSnowflakes();
window.addEventListener("resize", createSnowflakes);

function drawElf() {
    if (!tonttu.complete) return;

    // Skaalaus pienemmän sivun mukaan → mobiilissa isompi
    const base = Math.min(canvas.width, canvas.height);

    const elfWidth = base * 0.18;
    const elfHeight = elfWidth * 1.0; // säädä jos kuvasuhde on eri

    // tonttu "seisoo" maassa kuusen vierellä
    const elfY = canvas.height - elfHeight * 0.92;

    ctx.drawImage(tonttu, elfX, elfY, elfWidth, elfHeight);

    // liikuta tonttua
    elfX += elfSpeed;

    // aloita ruudun vasemmalta uudelleen
    if (elfX > canvas.width + 50) {
        elfX = -elfWidth - 50;
    }
}


// --------------------
// TEKSTI
// --------------------
function drawText() {
    const text = "Hyvää Joulua";

    // Tekstin koko suht. leveydestä
    const fontSize = canvas.width * 0.08; // esim. 8 % näytön leveydestä

    ctx.font = `${fontSize}px 'Meie Script'`;
    ctx.textAlign = "center";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 18;

    const x = canvas.width / 2;
    const y = canvas.height * 0.18;

    ctx.fillStyle = "crimson";
    ctx.fillText(text, x, y);

    // heijastus
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.scale(1, -1);
    ctx.fillText(text, x, -y - 20);
    ctx.restore();
}

// --------------------
// PIIRTO
// --------------------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawTree();
    drawStar();   // ← uusi
    drawSnow();    // ← täällä!
    drawElf();     // ← TÄMÄ
    drawText();

    requestAnimationFrame(draw);
}

bg.onload = draw;

// ---------------------------
//   MUSIIKKI + PLAY-NAPPI
// ---------------------------
const playButton = document.getElementById("playButton");
const bgAudio = document.getElementById("bgAudio");

playButton.addEventListener("click", () => {
    bgAudio.volume = 0.7;   // miellyttävä äänenvoimakkuus
    bgAudio.play()
        .then(() => {
            // Piilotetaan nappi, kun ääni alkaa
            playButton.style.display = "none";
        })
        .catch(err => {
            console.log("Äänen toistoa ei voitu käynnistää:", err);
        });
});
