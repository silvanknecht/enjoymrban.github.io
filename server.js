const express = require('express');
const mail = require('./routes/mail');
const languages = require('./routes/languages');
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
  res.sendFile(path.join(__dirname+'/index.html'));
});

// routes
app.use('/mail', mail);
app.use('/languages', languages);

// add the router
app.listen(process.env.port || 3000);
console.log('Running at Port 3000');






