// Initialize Application
var opt = require('./lib/options').init;
var	io = require('socket.io')(opt.port),
	routes = require('./lib/routes').init,
	timers = intervals = [];

io.on('connection', function(socket) {
	
	routes.pages.forEach(function(page) {

		socket.on(page.sock,require(opt.ctrls+page.controller)(io,socket,opt,page.sock,function(times){

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
		}) 		

	});

});
