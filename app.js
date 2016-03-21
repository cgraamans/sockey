// Initialize Application
var io = require('socket.io')(8080),
	mysql = require('mysql'),
	opt = require('./lib/options').init,
	routes = require('./lib/routes').init,
	data = {},
	socket = false,
	intervals = [];

// start connection socket-server
io.on('connection', function(socket) {
	
	// ROUTING GOES HERE.
	routes.pages.forEach(function(a) {

		// Notes:
		// 	- Default Routes use socket.emit themselves; return value is always socket name + _data (set in opt). 
		// 	- Socks configed in routes.
		// 	- Always accept io,socket,mysql,opt,aa.sock. Mysql connections go elsewhere. This is simply passing on the library.
		// 	- Callback is for interval notation and cancellation on disconnect.

		socket.on(a.sock,require(opt.ctrls+a.controller)(io,socket,opt,a.sock,function(rtnedIntervals){
			rtnedIntervals.forEach(function(ival){
				intervals.push(ival);
			});

		}));

	});

	socket.on('disconnect',function(){

		// clear all intervals, if passed
		intervals.forEach(function(iv){	
			clearInterval(iv);
		}) 

	});

});
