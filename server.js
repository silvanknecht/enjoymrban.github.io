const express = require("express");
const mail = require("./routes/mail");
const fs = require("fs");
const app = express();
const path = require("path");
const compression = require("compression");

// middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(compression());

app.use(express.static("public"));

// index
app.get("/", function(req, res) {
  // let filePath = `/home/pi/Documents/data/ipadresses.txt`;
  // let stats = fs.statSync(filePath);
  // if (stats["size"] < 5000000) {
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

// routes
app.use("/mail", mail);

// add the router
module.exports = app;

if (require.main === module) {
  app.listen(process.env.port || 3000, function() {
    console.log("Running at Port 3000");
  });
}
