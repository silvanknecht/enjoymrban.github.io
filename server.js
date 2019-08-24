const express = require("express");
const mail = require("./routes/mail");
const fs = require("fs");
const app = express();
const path = require("path");
const compression = require("compression");
const httpServer = require("http").createServer(app);

if (process.env.NODE_ENV === "production") {
    // Certificate
    const privateKey = fs.readFileSync(
        "/etc/letsencrypt/live/silvanknecht.ch/privkey.pem",
        "utf8"
    );
    const certificate = fs.readFileSync(
        "/etc/letsencrypt/live/silvanknecht.ch/cert.pem",
        "utf8"
    );
    const ca = fs.readFileSync(
        "/etc/letsencrypt/live/silvanknecht.ch/chain.pem",
        "utf8"
    );

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

}


// middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(compression());

app.use(express.static("public"));

if (process.env.NODE_ENV === "production") {
    app.use(function (req, res, next) {
        if (!req.secure) {
            return res.redirect(["https://", req.get("Host"), req.url].join(""));
        }
        next();
    });
}




// index
app.get("/", function(req, res) {
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
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/snake", function(req, res) {
  res.sendFile(path.join("./snake/index.html"));
});

// routes
app.use("/mail", mail);

// add the router
module.exports = app;

if (process.env.NODE_ENV === "production") {
    const httpsServer = require("https").createServer(credentials, app);
    httpsServer.listen(process.env.port || 3001, function () {
        console.log("HTTPS - httpsServer running at Port 3001");
    });
}

httpServer.listen(process.env.port || 3000, function() {
  console.log("HTTP - Server running at Port 3000");
});



/** ****************************************************************** */

const HEIGHT = 600;
const WIDTH = 600;
const BODYHIGHT = 15;
const BODYWIDTH = 15;

let food = {
  x: null,
  y: null,
  eaten: false
};

let clients = [];
let io;
if (process.env.NODE_ENV === "production") {
    io = require("socket.io")(httpsServer);
} else {
    io = require("socket.io")(httpServer);

}
 
io.on("connection", client => {
  console.log("connected to snake Server!");
  let newClient = {
    id: client.id,
    snake: new Snake(),
    color: getRandomColor(),
    name: "Anonymous"
  };
  clients.push(newClient);

  client.on("changeDirection", dir => {
    let snakeToUpdate = clients.find(x => x.id === client.id).snake;

    switch (dir) {
      case "left": // left
        if (snakeToUpdate.mov.x !== 1) {
          snakeToUpdate.created = true;
          snakeToUpdate.mov.x = -1;
          snakeToUpdate.mov.y = 0;
        }
        break;
      case "up": // up
        if (snakeToUpdate.mov.y !== 1) {
          snakeToUpdate.created = true;
          snakeToUpdate.mov.y = -1;
          snakeToUpdate.mov.x = 0;
        }
        break;
      case "right": // right
        if (snakeToUpdate.mov.x !== -1) {
          snakeToUpdate.created = true;
          snakeToUpdate.mov.x = 1;
          snakeToUpdate.mov.y = 0;
        }
        break;
      case "down": // down
        if (snakeToUpdate.mov.y !== -1) {
          snakeToUpdate.created = true;
          snakeToUpdate.mov.y = 1;
          snakeToUpdate.mov.x = 0;
        }
        break;
    }
  });

  client.on("disconnect", () => {
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].id === client.id) {
        clients.splice(i, 1);
      }
    }
  });

  client.on("nameChange", data => {
    let clientToUpdate = clients.find(x => x.id === client.id);
    clientToUpdate.name = data;
    console.log("Name Changed to " + clientToUpdate.name);
  });
});

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
class Snake {
  constructor() {
    this.mov = {
      x: 0,
      y: 0
    };
    this.body = [{ x: WIDTH / 2, y: HEIGHT / 2 }];
    this.score = 0;
    this.created = false;
    this.ateFood = false;
  }

  createBodyPart(x, y) {
    this.body.unshift({
      x,
      y
    });
  }

  move() {
    if (this.created) {
      this.createBodyPart(
        this.body[0].x + BODYWIDTH * this.mov.x,
        this.body[0].y + BODYWIDTH * this.mov.y
      );
      if (this.ateFood === false) {
        this.body.pop();
      } else {
        this.ateFood = false;
      }
    }
  }

  checkForGameover() {
    let { x, y } = this.body[0];

    // leaving the playground
    if (x > WIDTH - BODYWIDTH || x < 0 || y > HEIGHT - BODYWIDTH || y < 0) {
      this.restart();
    }

    // touching my own body tiles
    for (let i = 1; i < this.body.length; i++) {
      if (x === this.body[i].x && y === this.body[i].y) {
        this.restart();
      }
    }
  }

  restart() {
    this.mov = {
      x: 0,
      y: 0
    };
    this.body = [{ x: WIDTH / 2, y: HEIGHT / 2 }];
    this.score = 0;
    this.created = false;
    this.ateFood = false;
  }

  eat() {
    let { x, y } = this.body[0];
    if (x === food.x && y === food.y) {
      this.ateFood = true;
      food.x = null;
      food.y = null;
      this.score++;
      createFood();
    }
  }
}

function createFood() {
  if (food.x === null) {
    let randX = Math.floor(Math.random() * (WIDTH / BODYWIDTH - 1)) * BODYWIDTH;
    let randY =
      Math.floor(Math.random() * (HEIGHT / BODYHIGHT - 1)) * BODYHIGHT;
    for (let c of clients) {
      let { snake } = c;
      if (snake.body.x === randX && snake.body.y === randY) {
        createFood();
      }
    }
    food.x = randX;
    food.y = randY;
  }
}
createFood();

setInterval(function() {
  for (let c of clients) {
    c.snake.move();
    c.snake.checkForGameover();
    c.snake.eat();
  }
  io.emit("move", clients);
  io.emit("food", food);
}, 100);


