document.addEventListener("keypress", myKeyPress);
//let scoreCounter;

function myKeyPress(e) {
  var keynum;

  if (window.event) { // IE                    
    keynum = e.keyCode;
  } else if (e.which) { // Netscape/Firefox/Opera                   
    keynum = e.which;
  }


  let pressedLetter = String.fromCharCode(keynum).match(/[a-z]+/g);
  if (!pressedLetter) {
    return;
  }
  pressedLetter = pressedLetter[0].toUpperCase();
  if (!gd.letters[pressedLetter]) {
    score -= 2;
    $("#score").html("Score: " + score);
    if (score < 0) {
      $("#score").html("Score: 0");
    }
    return;
  }

  if (gd.letters[pressedLetter].length < 2) {
    score -= 2;
    gd.letters[pressedLetter] = [];
    $("#score").html("Score: " + score);
    if (score < 0) {
      $("#score").html("Score: 0");
    }
    return;
  }

  gd.letters[pressedLetter] = [];
  score++;
  $("#score").html("Score: " + score);
}

let score = 0;
let fallSpeed = 0.1;
let timerFromLastLetter = 0;
let isRunning = false;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("holder");
  colorMode(HSB, 255);
  background(220);
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(0)
  text("WELCOME", width / 2, height / 2 - 100);
  textSize(20);
  text("Press Start", width / 2, height / 2);
  //scoreCounter = document.getElementById("counter");
}

function startStop() {
  isRunning = !isRunning;
  $("#score").html("Score: " + score);
}

function draw() {
  if (isRunning) {
    if (score < 0) {
      score = 0;
    }
    fallSpeed = map(score, 0, 50, 10, 35);
    background(220);
    let isDown = false;
    for (let letter of Object.keys(gd.letters)) {
      for (let item of gd.letters[letter]) {
        isDown = item.fall();
        if (isDown) {
          break;
        }
        item.show();
      }
      if (isDown) {
        break;
      }
    }

    timerFromLastLetter += deltaTime / 1000;
    if (timerFromLastLetter > map(score, 0, 50, 1, 0.2)) {
      generateLetter();
      timerFromLastLetter = 0;
    }
    if (isDown) {
      background(220);
      textSize(64);
      textAlign(CENTER, CENTER);
      fill(0)
      text("GAME OVER", width / 2, height / 2 - 100);
      textSize(20);
      text("Score: " + score, width / 2, height / 2);
      gd.letters = {};
      isRunning = false;
      timerFromLastLetter = 0;
      score = 0;
    }
    if (score >= 50) {
      background(220);
      textSize(64);
      textAlign(CENTER, CENTER);
      fill(0)
      text("YOU WIN!", width / 2, height / 2);
      gd.letters = {};
      isRunning = false;
      timerFromLastLetter = 0;
      score = 0;
    }
  }
}

function generateLetter() {
  let letter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1).toUpperCase();
  if (!gd.letters[letter]) {
    gd.letters[letter] = [];
  }
  let bgSize = random(20, 80);
  gd.letters[letter].push(new Letter(random(width - bgSize), -85, letter, bgSize, random(15, bgSize - 2)))
}

class Letter {
  constructor(x, y, char, size, fontSize) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.size = size;
    this.fontSize = fontSize;
  }
  fall() {
    this.y += fallSpeed * (deltaTime / 1000);
    return this.y + this.size > height;
  }
  show() {
    fill(map(this.char.charCodeAt(0), "A".charCodeAt(0), "Z".charCodeAt(0), 0, 240), 200, 200);
    square(this.x, this.y, this.size);

    textSize(this.fontSize);
    textAlign(CENTER, CENTER);
    fill(0)
    text(this.char, this.x + this.size / 2, this.y + this.size / 2);
  }
}