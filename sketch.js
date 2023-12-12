let titleImage;
let hiScoreImage;
let crosshairImage;
let alienImage;
let targets = [];
let score = 0;
let hiScore = 0;
let timer = 30; 
let gameState = "title"; 

function preload() {
  titleImage = loadImage('assets/martian_mayhem_text.png');
  hiScoreImage = loadImage('assets/hi-score_text.png');
  crosshairImage = loadImage('assets/crosshair_sprite.png');
  alienImage = loadImage('assets/alien_sprite_large_titlescreen.png')
}

function setup() {
  createCanvas(800, 600);
  frameRate(60);
  noCursor(); 
  textFont('VT323', 20);
}

function draw() {
  background(0);

  switch (gameState) {
    case "title":
      titleScreen();
      break;
    case "game":
      gameScreen();
      break;
    case "result":
      resultScreen();
      break;
  }
}

function titleScreen() {
  // Display title image
  image(titleImage, width / 2 - titleImage.width / 2, 200);
  // Display alien image
  let alienX = width / 2 + titleImage.width / 2 + 10;
  image(alienImage, alienX, 185);
  // Display text
  fill(255);
  textAlign(CENTER);
  textSize(35);
  text("PRESS SPACEBAR", width / 2, height / 2 + 25);
}

function gameScreen() {
  handleInput();

  // Display score, timer, and hi-score
  fill(255);
  textAlign(LEFT);
  textSize(20);
  text("Score: " + score, 20, 30);
  text("Time: " + formatTime(timer), width / 2 - 30, 30);
  text("Hi-Score: " + hiScore, width - 150, 30);

  // Update and display martian targets
  for (let target of targets) {
    target.display();
  }

  // Update and display timer
  if (frameCount % 60 === 0 && timer > 0) { // Count down timer if 60fps
    timer--;
  }

  // Check if the game is over
  if (timer === 0) {
    gameState = "result";
    updateHiScore();
  }

  // Display crosshair cursor
  image(crosshairImage, mouseX - crosshairImage.width / 2, mouseY - crosshairImage.height / 2);

  // Repeatedly spawn new targets if needed (ie. someone is cracked out of their mind or the targets overlap into place)
  while (targets.length < 3) {
    targets.push(new Target());
  }

  // Spawn a new target each time one is pressed
  if (targets.length < 3) {
    targets.push(new Target());
  }
}

function resultScreen() {
  // Display hi-score image
  image(hiScoreImage, width / 2 - hiScoreImage.width / 2, height / 2 - 200);

  // Display hi-score and recent score
  fill(255);
  textAlign(CENTER);
  textSize(84);
  text(hiScore, width / 2, height / 2 - 50);
  textSize(32);
  text("RECENT SCORE: " + score, width / 2, height / 2 + 50);

  // Display "Press Spacebar to Restart" text
  textSize(20);
  text("PRESS SPACEBAR TO RESTART", width / 2, height / 2 + 100);

  // Display "Press 'S' to Save" text
  textSize(20);
  text("PRESS 'S' TO SAVE", width / 2, height / 2 + 130);
}

function handleInput() {
  // Check if mouse hits current target & removes it from the canvas
  for (let i = targets.length - 1; i >= 0; i--) {
    if (targets[i].hit(mouseX, mouseY) && mouseIsPressed) {
      score += 10;
      targets.splice(i, 1);
    }
  }
}

// Replace old score with new score
function updateHiScore() {
  if (score > hiScore) {
    hiScore = score;
  }
}

function keyPressed() {
  if (keyCode === 32) { // Spacebar
    if (gameState === "title") {
      gameState = "game";
      // Reset variables (score, timer, targets array)
      score = 0;
      timer = 30;
      targets = [];
    } else if (gameState === "result") {
      gameState = "title";
    }
    // Allow save if on result screen
  } else if (keyCode === 83) { // 'S' key
    if (gameState === "result") {
      saveGameCanvas();
    }
  }
}

// Capture hi score up to four decimal places
function saveGameCanvas() {
  let fileName = 'martian_mayhem_' + nf(score, 4) + '.png';
  saveCanvas(fileName, 'png');
}

// Clean integers
function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return nf(minutes, 2) + ':' + nf(remainingSeconds, 2);
}

class Target {
  constructor() {
    // Ensure targets spawn closer to the center & don't get cut off
    let spawnRadius = min(width, height) * 0.4;
    let angle = random(TWO_PI);
    this.x = width / 2 + cos(angle) * spawnRadius;
    this.y = height / 2 + sin(angle) * spawnRadius;

    this.width = 60;
    this.height = 53;
    this.image = loadImage('assets/alien_sprite_ingame.png'); 
  }

  display() {
    // Call upon martian image in assets folder
    image(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }

  hit(x, y) {
    // Define hitbox 
    return (
      x > this.x - this.width / 2 &&
      x < this.x + this.width / 2 &&
      y > this.y - this.height / 2 &&
      y < this.y + this.height / 2
    );
  }
}
