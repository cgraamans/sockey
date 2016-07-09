// Initialize Application
var sockey = require('./lib/sockey'),
	routes = require('./lib/routes'),
	timers = intervals = [];
	
// Start Sockey
sockey.init();

// For authorizations, you will need a separate route to the sockey.token.auth library 
// 
// Note: Comment this if you do not want token authorisation enabled.
//
routes.route.push({

	controller:'./helpers/sockey.token.auth',
	sock:sockey.opt.auth.socket,

});

sockey.io.on('connection', function(socket) {

	// $state 
	// - This is the current 'state' of the application, with all its variables
	var $state = require('./lib/state');

	// Prepare the $state.
	// - Every connection has a connection to the database prepared.
	// - The Current Socket is added
	// - Emitters are prepared for launch!
	$state.db = sockey.db.connect(sockey.opt.db),
	$state.socket = socket,
	$state.emitters = sockey.opt.returns;

	// Run through the routes
	routes.route.forEach(function(route) {
		$state.socket.on(route.sock,function(data) {

			$state.socketName = route.sock;

			// Here require is after socket.on so the whole application isn't loaded into memory
			require(route.controller)(sockey,$state,function(times){

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

	$state.socket.on('disconnect',function(){

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
