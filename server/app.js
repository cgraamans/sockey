// Initialize Application
var sockey = require('./lib/sockey');
	sockey.opt = require('./lib/options'),
	sockey.io = require('socket.io')(sockey.opt.port),
	sockey.modules = {},
	routes = require('./lib/routes'),
	timers = intervals = [],
	sockey.helpers = {};

// Global NodeJS Modules
sockey.opt.modules.forEach(function(load) {

	sockey.modules[load.name] = require(load.mod);

});

// Global Sockey Helpers
sockey.opt.helpers.forEach(function(helper){

	if (!(helper in sockey)) {

		sockey[helper] = require('./helpers/sockey.'+helper);

	}

});

// For authorizations, you will need a separate route to the sockey.token.auth library 
routes.route.push({

	controller:'./helpers/sockey.token.auth',
	sock:sockey.opt.auth.socket,

});

sockey.io.on('connection', function(socket) {

	var $state = {};

	$state.db = sockey.db.connect(sockey.opt.db);
	$state.socket = socket;


	// User Routes
	routes.route.forEach(function(route) {

		socket.on(route.sock,function(data) {

			require(route.controller)(sockey,$state,route.sock,function(times){

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

		$state.db.end();

	});

});
