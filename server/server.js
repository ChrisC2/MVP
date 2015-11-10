var express = require('express');
var app = express();
var restify = require('restify');
var https = require('https');
var Promise = require('bluebird');
var tokenKey = require('./tokenKeys');
var morgan = require('morgan');
var request = require('request');
app.use(morgan('dev'));

var server = https.Server(app);
var server = restify.createServer({
  name: 'spectacle',
  version: '1.0.0'
});

app.use(restify.acceptParser(server.acceptable));
app.use(restify.queryParser());
app.use(restify.bodyParser());


app.use(express.static(__dirname + '/../client/www'));

app.get('/igcall', function (req, res) {
  var lat = req.query.lat;
  var lng = req.query.lng;
  request("https://api.instagram.com/v1/media/search?lat=" + lat + "&lng="+ lng + "&distance=5000&access_token=" + tokenKey.key, function (error, response, body) {
    if(error){
        return console.log('Error:', error);
    }
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }
    res.json(JSON.parse(body))
  })
})




console.log('Shortly is listening on 8000');
app.listen(process.env.PORT || 8000);
