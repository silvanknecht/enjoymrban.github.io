const express = require('express');
const mail = require('./routes/mail');
const fs = require('fs');
const app = express();
const path = require('path');
const compression = require('compression');
const server = require('http').createServer(app);

const HEIGHT = 600;
const WIDTH = 600;
const BODYHIGHT = 15;
const BODYWIDTH = 15;

let gameRunning = false;
let food = {
  x: null,
  y: null,
  eaten: false
};

let clients = [];
const io = require('socket.io')(server);
io.on('connection', client => {
  console.log("connected to server!");
  let newClient = {
    id: client.id,
    snake: new Snake()
  };
  newClient.snake.createBodyPart(WIDTH / 2, HEIGHT / 2);
  clients.push(newClient);
  console.log(clients[0].snake.body);

});

class Snake {

  constructor() {
    this.mov = {
      x: 0,
      y: 0
    };
    this.body = [];
    this.score = 0;
    this.created = false;
  }

  createBodyPart(x, y) {
    this.body.unshift({
      x,
      y
    });
  }
}





function createFood() {
  if (food.x === null) {
    let randX = Math.floor(Math.random() * (WIDTH / BODYWIDTH - 1)) * BODYWIDTH;
    let randY =
      Math.floor(Math.random() * (HEIGHT / BODYHIGHT - 1)) * BODYHIGHT;
    for (let c in clients) {
      let {
        snake
      } = c;
      if (snake.posX === randX && snake.posY === randY) {
        createFood();
      }
    }
    food.x = randX;
    food.y = randY;
  }
}
createFood();


setInterval(function () {
  io.emit('move', clients);
  // ctx.fillStyle = "black";
  // ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // ctx.stroke();

  //gameover();
  // drawBody();
  // if (food.x !== null) drawFood();
  // if (gameRunning) move();
  // eat();
  // ctx.strokeStyle = "white";
  // ctx.font = "30px Verdana";
  // ctx.strokeText(score, WIDTH - 50, 50);
}, 50);


io.on("changeDirection", (dir) => {
  console.log(dir);

  switch (dir) {
    case "left": // left
      if (movementX !== 1) {
        gameRunning = true;
        movementX = -1;
        movementY = 0;
      }
      break;
    case "up": // up
      if (movementY !== 1) {
        gameRunning = true;
        movementY = -1;
        movementX = 0;
      }
      break;
    case "right": // right
      if (movementX !== -1) {
        gameRunning = true;
        movementX = 1;
        movementY = 0;
      }
      break;
    case "down": // down
      if (movementY !== -1) {
        gameRunning = true;
        movementY = 1;
        movementX = 0;
      }
      break;
  }
});
// setInterval(function() {
//   gameover();
// }, 10);

// setInterval(function() {
//   createFood();
// }, 3000);

// function drawBody() {
//   for (let [i, bp] of snake.entries()) {
//     let { x, y } = bp;

//     //ctx.strokeStyle = "red";
//     ctx.fillStyle = "white";
//     ctx.fillRect(x, y, BODYWIDTH, BODYHIGHT);
//     //ctx.stroke();
//     if (i === 0) {
//       ctx.fillStyle = "green";
//       ctx.fillRect(x, y, BODYWIDTH, BODYHIGHT);
//     }
//   }
// }

// function drawFood() {
//   ctx.strokeStyle = "red";
//   ctx.strokeRect(food.x, food.y, BODYHIGHT, BODYWIDTH);
// }

// function move() {
//   let { x, y } = snake[0];
//   createBodyPart(x + BODYWIDTH * movementX, y + BODYWIDTH * movementY);
//   if (food.eaten === false) {
//     snake.pop();
//   } else {
//     food.eaten = false;
//   }
// }

// function eat() {
//   let { x, y } = snake[0];
//   if (x === food.x && y === food.y) {
//     food.eaten = true;
//     food.x = null;
//     food.y = null;
//     score++;
//   }
// }

// function gameover() {
//   let { x, y } = snake[0];
//   if (x > WIDTH || x < 0 || y > HEIGHT || y < 0) {
//     restart();
//   }
//   for (let i = 1; i < snake.length; i++) {
//     if (x === snake[i].x && y === snake[i].y) {
//       restart();
//     }
//   }
// }

function restart() {
  snake = [];
  food = {
    x: null,
    y: null,
    eaten: false
  };
  movementX = 0;
  movementY = 0;
  gameRunning = false;
  score = 0;
  createFood();
  createBodyPart(WIDTH / 2, HEIGHT / 2);
}











































// middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(compression());

app.use(express.static('public'));


// index
app.get('/', function (req, res) {
  // let filePath = `/home/pi/Documents/data/ipadresses.txt`;
  // let stats = fs.statSync(filePath);
  // if (stats.size < 5000000) {
  //   fs.appendFile(filePath, req.connection.remoteAddress + ", ", function (err, data) {
  //     if (err) {
  //       console.log(err);
  //     }

  //   });
  // } else {
  //   console.log("save file full");
  // }
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/snake', function (req, res) {
  res.sendFile(path.join('./snake/index.html'));
})

// routes
app.use('/mail', mail);

// add the router
server.listen(process.env.port || 3000);
console.log('Running at Port 3000');

module.exports.server = server;