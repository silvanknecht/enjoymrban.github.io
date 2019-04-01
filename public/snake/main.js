var c = document.getElementById("snakeCanvas");
var ctx = c.getContext("2d");

let HEIGHT = c.height;
let WIDTH = c.width;
const BODYHIGHT = 15;
const BODYWIDTH = 15;

let movementX = 0;
let movementY = 0;
let gameRunning = false;
let score = 0;

var activeRegion = ZingTouch.Region(c);
new ZingTouch.Swipe({
  numInputs: 1,
  maxRestTime: 100,
  escapeVelocity: 0.1
});
activeRegion.bind(
  c,
  "swipe",
  function(e) {
    let direction = e.detail.data[0].currentDirection;

    if (direction < 225 && direction > 135 && movementX !== 1) {
      gameRunning = true;
      movementX = -1;
      movementY = 0;
    } else if (direction < 135 && direction > 45 && movementY !== 1) {
      gameRunning = true;
      movementY = -1;
      movementX = 0;
    } else if (
      (direction < 45 || direction > 315) &&
      direction >= 0 &&
      movementX !== -1
    ) {
      gameRunning = true;
      movementX = 1;
      movementY = 0;
    } else if (direction < 315 && direction > 225 && movementY !== -1) {
      {
        gameRunning = true;
        movementY = 1;
        movementX = 0;
      }
    }
    console.log(e.detail.data[0].currentDirection);
  },
  false
);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.stroke();

let snake = [];

function createBodyPart(x, y) {
  snake.unshift({ x, y });
}

let food = { x: null, y: null, eaten: false };

function createFood() {
  if (food.x === null) {
    let randX = Math.floor(Math.random() * (WIDTH / BODYWIDTH - 1)) * BODYWIDTH;
    let randY =
      Math.floor(Math.random() * (HEIGHT / BODYHIGHT - 1)) * BODYHIGHT;
    for (let bp in snake) {
      let { x, y } = bp;
      if (x === randX && y === randY) {
        createFood();
      }
    }
    food.x = randX;
    food.y = randY;
  }
}
createFood();

createBodyPart(WIDTH / 2, HEIGHT / 2);

window.setInterval(function() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.stroke();

  gameover();
  drawBody();
  if (food.x !== null) drawFood();
  if (gameRunning) move();
  eat();
  ctx.strokeStyle = "white";
  ctx.font = "30px Verdana";
  ctx.strokeText(score, WIDTH - 50, 50);
}, 50);

window.setInterval(function() {
  gameover();
}, 10);

window.setInterval(function() {
  createFood();
}, 3000);

function drawBody() {
  for (let [i, bp] of snake.entries()) {
    let { x, y } = bp;

    //ctx.strokeStyle = "red";
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, BODYWIDTH, BODYHIGHT);
    //ctx.stroke();
    if (i === 0) {
      ctx.fillStyle = "green";
      ctx.fillRect(x, y, BODYWIDTH, BODYHIGHT);
    }
  }
}

function drawFood() {
  ctx.strokeStyle = "red";
  ctx.strokeRect(food.x, food.y, BODYHIGHT, BODYWIDTH);
}

function move() {
  let { x, y } = snake[0];
  createBodyPart(x + BODYWIDTH * movementX, y + BODYWIDTH * movementY);
  if (food.eaten === false) {
    snake.pop();
  } else {
    food.eaten = false;
  }
}

function eat() {
  let { x, y } = snake[0];
  if (x === food.x && y === food.y) {
    food.eaten = true;
    food.x = null;
    food.y = null;
    score++;
  }
}

function gameover() {
  let { x, y } = snake[0];
  if (x > WIDTH || x < 0 || y > HEIGHT || y < 0) {
    restart();
  }
  for (let i = 1; i < snake.length; i++) {
    if (x === snake[i].x && y === snake[i].y) {
      restart();
    }
  }
}

function restart() {
  snake = [];
  food = { x: null, y: null, eaten: false };
  movementX = 0;
  movementY = 0;
  gameRunning = false;
  score = 0;
  createFood();
  createBodyPart(WIDTH / 2, HEIGHT / 2);
}

document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37: // left
      if (movementX !== 1) {
        gameRunning = true;
        movementX = -1;
        movementY = 0;
      }
      break;
    case 38: // up
      if (movementY !== 1) {
        gameRunning = true;
        movementY = -1;
        movementX = 0;
      }
      break;
    case 39: // right
      if (movementX !== -1) {
        gameRunning = true;
        movementX = 1;
        movementY = 0;
      }
      break;
    case 40: // down
      if (movementY !== -1) {
        gameRunning = true;
        movementY = 1;
        movementX = 0;
      }
      break;
  }
};
