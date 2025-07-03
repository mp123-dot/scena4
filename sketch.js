// ----------------------------------------------------------------
//                  KONFIGURACJA
// ----------------------------------------------------------------
let zawody = ["Lekarką", "Prezydentką", "Panią domu", "Prawniczką", "Żoną"];
let selectedIndex = -1;

const borderCol = '#a78bfa';
const fillCol   = '#d8b4fe';
const btnCol    = '#f3e8ff';

// położenie przycisku “DALEJ” od dołu
const BUTTON_Y_OFFSET = 50; // im mniejsza liczba, tym niżej przycisk
// położenie tekstu od dołu
const TEXT_Y_OFFSET   = 110;

const BTN_DIAMETER = 90;
const HOVER_SCALE  = 1.05;

let tloZawod, rawDalejImg, dalejImg, clickSound, kwiatekImg;
let glitterParticles = [];

// ----------------------------------------------------------------
//                         PRELOAD
// ----------------------------------------------------------------
function preload() {
  tloZawod    = loadImage('t.zawod.png');
  rawDalejImg = loadImage('PrzyciskDALEJ.png');
  clickSound  = loadSound('glimmer.wav');
  kwiatekImg  = loadImage('flowerMouse.png');
}

// ----------------------------------------------------------------
//                          SETUP
// ----------------------------------------------------------------
function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textFont('sans-serif');
  noCursor();

  // zamaskuj PrzyciskDALEJ na koło
  const s = min(rawDalejImg.width, rawDalejImg.height);
  dalejImg = createImage(s, s);
  rawDalejImg.loadPixels();
  dalejImg.copy(
    rawDalejImg,
    (rawDalejImg.width  - s) / 2,
    (rawDalejImg.height - s) / 2,
    s, s,
    0, 0, s, s
  );
  let maskG = createGraphics(s, s);
  maskG.noStroke(); maskG.fill(255);
  maskG.circle(s/2, s/2, s);
  dalejImg.mask(maskG);
}

// ----------------------------------------------------------------
//                          DRAW
// ----------------------------------------------------------------
function draw() {
  // 1) tło
  image(tloZawod, 0, 0, width, height);

  // 2) nagłówek
  fill('#222'); noStroke();
  textSize(32);
  text('Kim chcesz zostać?', width/2, 60);

  // 3) lista zawodów
  drawOptions();

  // 4) jeśli wybrano – najpierw tekst, potem przycisk
  if (selectedIndex !== -1) {
    const sel = zawody[selectedIndex];
    const ok  = (sel === 'Żoną' || sel === 'Panią domu');
    fill(ok ? '#2e7d32' : '#d32f2f');
    textSize(20);
    const msg = ok
      ? 'Dobra dziewczynka 😇'
      : 'Dziewczynki nie nadają się do takiej pracy...';

    // pozycja tekstu
    const textY   = height - TEXT_Y_OFFSET -40;
    text(msg, width/2, textY);

    // pozycja przycisku
    const btnX    = width/2;
    const btnY    = height - BUTTON_Y_OFFSET;
    const btnR    = BTN_DIAMETER/2;
    const over    = dist(mouseX, mouseY, btnX, btnY) < btnR;
    const sizeXY  = over ? BTN_DIAMETER*HOVER_SCALE : BTN_DIAMETER;

    imageMode(CENTER);
    image(dalejImg, btnX, btnY, sizeXY, sizeXY);
    imageMode(CORNER);
  }

  // 5) glitter
  for (let i = glitterParticles.length-1; i>=0; i--) {
    glitterParticles[i].update();
    glitterParticles[i].show();
    if (glitterParticles[i].finished()) glitterParticles.splice(i,1);
  }

  // 6) kursor
  imageMode(CENTER);
  image(kwiatekImg, mouseX, mouseY, 32, 32);
  imageMode(CORNER);
}

// ----------------------------------------------------------------
//                     DOGRYWANIE OPCJI
// ----------------------------------------------------------------
function drawOptions() {
  const w=300, h=50, gap=15, startY=120;
  for (let i=0; i<zawody.length; i++) {
    const x = width/2, y = startY + i*(h+gap);
    stroke(borderCol); strokeWeight(2);
    fill(i===selectedIndex ? fillCol : 'transparent');
    rectMode(CENTER);
    rect(x, y, w, h, h/2);

    noStroke();
    fill('#000');
    textSize(20);
    text(zawody[i], x, y);
  }
}

// ----------------------------------------------------------------
//                     OBSŁUGA KLIKNIĘĆ
// ----------------------------------------------------------------
function mousePressed() {
  // dźwięk i glitter przy każdym kliknięciu
  if (clickSound.isLoaded()) clickSound.play();
  for (let i=0; i<18; i++) {
    glitterParticles.push(new Glitter(mouseX, mouseY));
  }

  // wybór opcji
  const w=300, h=50, gap=15, startY=120;
  for (let i=0; i<zawody.length; i++) {
    const x=width/2, y=startY+i*(h+gap);
    if (
      mouseX > x - w/2 && mouseX < x + w/2 &&
      mouseY > y - h/2 && mouseY < y + h/2
    ) {
      selectedIndex = (selectedIndex===i ? -1 : i);
      return;
    }
  }

   // klik w DALEJ
  if (selectedIndex !== -1) {
    const btnX = width/2;
    const btnY = height - BUTTON_Y_OFFSET;
    const btnR = BTN_DIAMETER/2;
    if (dist(mouseX, mouseY, btnX, btnY) < btnR) {
      // Przeniesienie do scena5
      window.location.href = "https://mp123-dot.github.io/scena5/";
    }
  }
}

// ----------------------------------------------------------------
//                        KLASA GLITTER
// ----------------------------------------------------------------
class Glitter {
  constructor(x,y) {
    this.x = x; this.y = y;
    this.angle   = random(TWO_PI);
    this.life    = 0;
    this.maxLife = random(20,40);
    this.size    = random(3,7);
    this.color   = color(
      random(180,255),
      random(120,200),
      random(200,255),
      200
    );
  }
  update() {
    this.life++;
    this.x += cos(this.angle)*1.5;
    this.y += sin(this.angle)*1.5;
  }
  finished() {
    return this.life > this.maxLife;
  }
  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

// ----------------------------------------------------------------
//                     RESPONSYWNOŚĆ
// ----------------------------------------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  }

