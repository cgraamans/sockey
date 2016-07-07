exports = module.exports = function(sockey,$state,sock,callback) {


	return function(data) {
		// Note: Data is the request object passed by the socket.
		var dataCallback = {timers:[],intervals:[]};

		// CONTROLLER CODE

			// EXAMPLE CODE

				// Load models first
				var examples = require('../models/examples');

				// Emit on receival
				$state.socket.emit(sock+sockey.opt.socket.data,{
					"message":"Recieved Example Request"
				});

				// INTERVALS: This is how you do Intervals
				var interval = setInterval(function(){

					$state.socket.broadcast.emit(sock+sockey.opt.socket.data,{
						"message":"Global Timed Emit To Everyone But User Every 5 seconds"
					});

				},5000);
				dataCallback.intervals.push(interval);

				// TIMEOUTS: This is how you do Timeouts
				var timeout = setTimeout(function(){

					sockey.io.emit(sock+sockey.opt.socket.data,{"message":"Global Emit To Everyone After 10 seconds"});

				},10000);
				dataCallback.timers.push(timeout);

			// EXAMPLE CODE ENDS HERE

		// CONTROLLER CODE ENDS HERE

		callback(dataCallback); // DO NOT REMOVE
		// NOTE: - callback is an array of objects for interval and time-out cancellation on socket destruction. If no timers are set, leave as is.

	}

};