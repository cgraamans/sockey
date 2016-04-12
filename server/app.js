// Initialize Application
var opt = require('./lib/options');
var sockey = require('./lib/sockey');
sockey.io = require('socket.io')(opt.port),
	routes = require('./lib/routes'),
	timers = intervals = [];

sockey.io.on('connection', function(socket) {
	sockey.socket = socket;
	sockey.db.connect(opt.db);

	routes.route.forEach(function(route) {

		socket.on(route.sock,require(opt.ctrls+route.controller)(sockey,opt,route.sock,function(times){

			if (typeof times !== 'undefined') {

				if (times.timers.length > 0) {

					times.timers.forEach(function(timer){
						timers.push(timer);
					});

				}

				if (times.intervals.length > 0) {

					times.intervals.forEach(function(interval){
						intervals.push(interval);
					});					

				}

			}

		}));

	});

	socket.on('disconnect',function(){

		// clear all intervals, if passed
		intervals.forEach(function(iv){	
			clearInterval(iv);
		});

		// clear all timers, if passed
		timers.forEach(function(iv){	
			clearTimeout(iv);
		});

		sockey.db.disconnect();

	});

});
