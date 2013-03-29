/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , connect = require('connect')
  , RedisStore = require('connect-redis')(express)
  , helmet = require('helmet')
  , stylus = require('stylus')
  , nib = require('nib');

var app = express();
var server = http.createServer(app);



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(helmet.xframe());
  app.use(helmet.iexss());
  app.use(helmet.contentTypeOptions());
  app.use(helmet.cacheControl());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'foobar'
  }));
//  app.use(express.csrf());
  app.use(function (req, res, next) {
    res.locals.csrftoken = req.session._csrf;
    res.locals.fbToken = req.session.fbToken;
//    res.locals.session = req.session;
    next();
  });
  app.use(stylus.middleware({
    src: __dirname + '/public'
  , compile: function (str, path) {
    return stylus(str)
      .set('filename', path).use(nib());
  }
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/search', routes.search);
app.post('/token', routes.token);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
