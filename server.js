const express = require('express');
const mail = require('./routes/mail');
const fs = require('fs');
const app = express();
const path = require('path');


// middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static('public'));


// index
app.get('/',function(req,res){
  console.log(req.connection.remoteAddress);
  fs.appendFile(`/home/pi/Documents/data/ipadresses.txt`,req.connection.remoteAddress+"/r/n",function(err,data){
    if(err){
      console.log(err);
    }
  });
  console.log(req.connection.remoteAddress);
  res.sendFile(path.join(__dirname+'/index.html'));
});

// routes
app.use('/mail', mail);

// add the router
app.listen(process.env.port || 3000);
console.log('Running at Port 3000');






