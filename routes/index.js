var https = require('https'),
    $ = require('jquery');

/*
 * GET home page.
 */

var appId = '501528346569865',
    appSec = 'a4a3d6e899c2e732148c368ef97d30f6',
    groupId = '133155273419183',
    token = 'AAAHIIyrxLIkBABTRoNRr1rJCYfZCNditABNOBlbbAThuq4bbvlpZBfc5ugbiZAypSIuBGpspZCzE8BUyOKOr07wSJsgW7VHrUcwiH21ezAZDZD';

var options = {
  host: 'graph.facebook.com',
  port: 443,
  path: '/'+groupId+'/feed?access_token='+token,
  method: 'GET'
};

exports.index = function(req, res){
  res.render('index', { title: '#FTTS' });
};

exports.search = function(req, res) {

  var search = function(fttsData, s) {
    if(fttsData.data !== undefined) {
      var music = {data: []};
      $.each(fttsData.data, function(i, d) {
        if(String(d.name).toLowerCase().search(s.toLowerCase()) != -1) {
          music.data.push(d);
        }
      });
      res.json(music);
    } else {
      res.json({'error': 'nop'});
    }
  };

  var reqGet = https.request(options, function(res){
    var data = "";
    res.setEncoding('utf8');
    res.on('data', function(chunck) {
      data += chunck;
    });
    res.on('end', function() {
      data = JSON.parse(data);
      search(data, req.body.search);
    });
  });
  
  reqGet.end();
};
