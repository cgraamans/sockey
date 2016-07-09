exports = module.exports = function(sockey,$state,callback) {


	return function(data) {
		// Note: Data is the request object passed by the socket.
		var timings = {timers:[],intervals:[]};

		// CONTROLLER CODE

			// EXAMPLE CODE
			
			//testline
			$state.test = "hah";
				// Load models first
				var examples = require('../models/examples');

				// Emit on receival
				$state.emit({
					"message":"Recieved Example Request"
				});

				// INTERVALS: This is how you do Intervals
				var interval = setInterval(function(){

					$state.broadcast({
						"message":"Timed Emit To Everyone But User Every 3 seconds"
					});
					console.log('sock broadcast');
				},3000);
				timings.intervals.push(interval);

				// TIMEOUTS: This is how you do Timeouts
				var timeout = setTimeout(function(){

					sockey.emit($state.socketName,{"message":"Once-off Global Emit To Everyone After 10 seconds"});
					console.log("broadcast");
				},10000);
				timings.timers.push(timeout);

			// EXAMPLE CODE ENDS HERE

		// CONTROLLER CODE ENDS HERE

		callback(timings); // DO NOT REMOVE
		// NOTE: - callback is an array of objects for interval and time-out cancellation on socket destruction. If no timers are set, leave as is.

	}

};