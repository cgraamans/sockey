// Initialize Application
var sockey = require('./lib/sockey');
	sockey.opt = require('./lib/options'),
	sockey.io = require('socket.io')(sockey.opt.port),
	sockey.token = require('./lib/sockey.token'),
	routes = require('./lib/routes'),
	timers = intervals = [];

sockey.opt.modules.autoload.forEach(function(load) {

	sockey.opt.modules.obj[load.name] = require(load.mod);

});

sockey.io.on('connection', function(socket) {

	var run = {};

	run.db = sockey.db.connect(sockey.opt.db);
	run.socket = socket;
	
	routes.route.forEach(function(route) {

		socket.on(route.sock,function(data) {

			require(sockey.opt.ctrls+route.controller)(sockey,run,route.sock,function(times){

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

			})(data);

		});

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

		run.db.end();

	});

});
