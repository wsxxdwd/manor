
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index');
var user = require('./routes/user');
var dev = require('./dev/admin');
var http = require('http');
var path = require('path');
var socket = require('socket.io');//websocket
var filter = require('./server/filter');
//var utils = require('./server/utils');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({secret:"flower dance"}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/:page',filter.authorize,function(req,res,next){
	if(routes[req.params.page]){
		routes[req.params.page](req,res,next);
	}else{
		res.status(404);
		res.end();
	}
});
app.get('/', routes.index);
app.get('/game',routes.game);
app.get('/admin/index',routes.admin);

app.post('/login', user.login);
app.post('/logout', user.logout);
app.post('/register', user.register);
app.post('/admin/data', dev.data);
app.post('/admin/edit', dev.edit);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var Game = require('./server/game.js');
var Logger = require('./server/logger.js');
io = socket.listen(server);
logger = new Logger();

game = new Game();
game.init();
//侦听websocket
game.addListener(io);
