var express = require("express");
var fs = require('fs');
var http = require('http');
var path = require('path');

var app = express();
app.set('port', 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve up our static resources
app.get('/', function(req, res) {
  fs.readFile('index.html', function(err, data) {
    res.end(data);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var clients = [];
// Poll endpoint
app.get('/poll/*', function(req, res) {
  clients.push(res);
});
app.post('/msg', function(req, res) {
  message = req.body;
  var msg = JSON.stringify(message);
  while(clients.length > 0) {
    var client = clients.pop();
    client.end(msg);
  }
  res.end();
});