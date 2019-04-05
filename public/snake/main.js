var c = document.getElementById("snakeCanvas");
var ctx = c.getContext("2d");
const WIDTH = 600;
const HEIGHT = 600;
const BODYHIGHT = 15;
const BODYWIDTH = 15;

var socket = io("http://localhost:3000");
socket.on("connect", function() {
  console.log("Connected to Server!");
});
socket.on("event", function(data) {});
socket.on("disconnect", function() {
  socket.close();
});

ctx.fillStyle = "black";
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.stroke();

socket.on("move", clients => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.stroke();
  let height = 25;

  for (let c of clients) {
    drawBody(c.snake.body, c.color);
    ctx.strokeStyle = c.color;
    ctx.font = "16px Verdana";
    ctx.strokeText(c.name + ": " + c.snake.score, WIDTH - 200, height);
    height += 25;
  }

  //if (gameRunning) move();
  //eat();
});

socket.on("food", food => {
  if (food.x !== null) drawFood(food);
});

function drawBody(body, color) {
  for (let [i, bp] of body.entries()) {
    let { x, y } = bp;

    //ctx.strokeStyle = "red";
    ctx.fillStyle = color;
    ctx.fillRect(x, y, BODYWIDTH, BODYHIGHT);
    //ctx.stroke();
    if (i === 0) {
      ctx.fillStyle = "green";
      ctx.fillRect(x, y, BODYWIDTH, BODYHIGHT);
    }
  }
}

function drawFood(food) {
  ctx.strokeStyle = "red";
  ctx.strokeRect(food.x, food.y, BODYHIGHT, BODYWIDTH);
}

document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37: // left
      socket.emit("changeDirection", "left");
      break;
    case 38: // up
      socket.emit("changeDirection", "up");
      break;
    case 39: // right
      socket.emit("changeDirection", "right");
      break;
    case 40: // down
      socket.emit("changeDirection", "down");
      break;
  }
};

const nameButton = document.getElementById("nameButton");
nameButton.addEventListener("click", () => {
  const nickname = document.getElementById("nameInput").value;
  socket.emit("nameChange", nickname);
});
