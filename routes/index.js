var https = require('https'),
    $ = require('jquery'),
    io = require('socket.io');
/*
 * GET home page.
 */

var appId = '501528346569865',
    appSec = 'a4a3d6e899c2e732148c368ef97d30f6',
    groupId = '137037586478824';

var options = {
  host: 'graph.facebook.com',
  port: 443,
  path: '/133155273419183/feed?access_token=AAAHIIyrxLIkBAD4ZB71ZCVZBmxqC2Ay2Am5jyCOEhqWuHwkui56CYGIr4CWCAbFChN9Ic4gTK6MXKQbsEZBygRGOpBZA6euwTuxCQFt7GqAZDZD',
  method: 'GET'
};

var fttsData = "";

exports.index = function(req, res){
  res.render('index', { title: '#FTTS' });
};

exports.search = function(req, res) {

  var reqGet = https.request(options, function(res){
    var data = "";
    res.setEncoding('utf8');
    console.log("status code :"+res.statusCode);
    res.on('data', function(chunck) {
      data += chunck;
    });
    res.on('end', function() {
      data = JSON.parse(data);
      search(data, req.body.search);
    });
  });
  
  reqGet.end();
  reqGet.on('error', function(e) {
    console.error(e);
  });

  var search = function(fttsData, s) {
    $.each(fttsData.data, function(i, d) {
      if(String(d.name).toLowerCase().search(s.toLowerCase()) != -1)
        //res.send(d.name);
        console.log(d.name);
    });
  };
  
  io.sockets.on('connection', function (socket) {
    socket.emit('news', {ftts: 'music'});
  });
  res.render('index', {title: '#FTTS'});
};
