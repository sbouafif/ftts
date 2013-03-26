var https = require('https'),
    express = require('express'),
    $ = require('jquery');

/*
 * GET home page.
 */

var appId = '501528346569865',
    appSec = 'a4a3d6e899c2e732148c368ef97d30f6',
    groupId = '133155273419183',
    token = '';

var express.session.options = {
  host: 'graph.facebook.com',
  port: 443,
  method: 'GET'
};


exports.index = function(req, res){
  res.render('index', { title: '#FTTS' });
};

exports.token = function(req, res) {
  if(req.method === 'POST') {
    var getToken = function() {
      token = req.body.token;
      express.session.options.path = '/'+groupId+'/feed?access_token='+token;
    };
  };
  getToken();
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

  var reqGet = https.request(express.session.options, function(res){
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
