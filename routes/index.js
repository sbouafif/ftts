var https = require('https'),
    $ = require('jquery');

/*
 * GET home page.
 */

var appId = '501528346569865',
    appSec = 'a4a3d6e899c2e732148c368ef97d30f6',
    groupId = '133155273419183';



exports.index = function(req, res){
  res.render('index', { title: '#FTTS' });
};

exports.token = function(req, res) {
  if(req.method === 'POST' && req.session.fbToken !== req.body.token) {
    var getToken = function() {
      req.session.regenerate(function(){

        req.session.fbToken = req.body.token;


      });
      req.session.options = {
        host: 'graph.facebook.com',
        port: 443,
        method: 'GET'
      };        
      req.session.fbToken = req.body.token;
      req.session.options.path = '/'+groupId+'/feed?access_token='+req.session.fbToken;
//      console.log(req.session);

      req.session.save(function(err){
        // session saved
        console.log('session saved');
        //console.log(err);
      });

      res.locals.session = req.session;
    };

    getToken();
  };

};

exports.search = function(req, res) {
  console.log(req.session);
  console.log(res.locals);

  if(req.session.fbToken !== undefined) {
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
    
    var reqGet = https.request(req.session.options, function(res){
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
  } else {
    console.log('fbtoken undefined');
//    res.redirect(
  }
};
