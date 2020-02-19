document.addEventListener("keypress", myKeyPress);
let scoreCounter;

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
  if (!letters[pressedLetter]) {
    score -= 2;
    scoreCounter.text = "score: " + score;
    return;
  }

  if (letters[pressedLetter].length < 2) {
    score -= 2;
    letters[pressedLetter] = [];
    scoreCounter.text = "score: " + score;
    return;
  }

  letters[pressedLetter] = [];
  scoreCounter.text = "score: " + score;
  score++;
}

let score = 0;
let letters = {};
let fallSpeed = 0.1;
let newTime = 0;
let isRunning = false;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("holder");
  background(220);
  scoreCounter = document.getElementById("counter");
  console.log(scoreCounter);
}

function startStop() {
  isRunning = !isRunning;
}

function draw() {
  if (isRunning) {
    if (score < 0) {
      score = 0;
    }
    fallSpeed = map(score, 0, 50, 2, 4);
    background(220);
    let isDown = false;
    for (let letter of Object.keys(letters)) {
      for (let item of letters[letter]) {
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

    newTime += deltaTime / 100;
    if (newTime > map(score, 0, 50, 4.5, 1.5)) {
      generateLetter();
      newTime = 0;
    }
    if (isDown) {
      background(220);
      textSize(64);
      textAlign(CENTER, CENTER);
      fill(0)
      text("GAME OVER", width / 2, height / 2 - 100);
      textSize(20);
      text("score: " + score, width / 2, height / 2);
      letters = {};
      isRunning = false;
      newTime = 0;
      score = 0;
    }
    if (score >= 50) {
      background(220);
      textSize(64);
      textAlign(CENTER, CENTER);
      fill(0)
      text("YOU WIN!", width / 2, height / 2);
      letters = {};
      isRunning = false;
      newTime = 0;
      score = 0;
    }
  }
}

function generateLetter() {
  let letter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1).toUpperCase();
  if (!letters[letter]) {
    letters[letter] = [];
  }
  let bgSize = random(20, 60);
  letters[letter].push(new Letter(random(width - bgSize), -75, letter, bgSize, random(15, bgSize - 3)))
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
    this.y += fallSpeed * (deltaTime / 100);
    return this.y + this.size > height;
  }
  show() {
    fill(100);
    square(this.x, this.y, this.size);

    textSize(this.fontSize);
    textAlign(CENTER, CENTER);
    fill(0)
    text(this.char, this.x + this.size / 2, this.y + this.size / 2);
  }
}