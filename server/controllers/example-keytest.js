/**
	Example Token Check. 

	Note, this is asynchronous. Use the async module to use this in a synchronous context.
*/
exports = module.exports = function(sockey,$state,callback) {


	return function(data) {
		// Note: Data is the request object passed by the socket.
		var timings = {timers:[],intervals:[]};

		// CONTROLLER CODE

			var emit = {
				ok:false,
				err:false,
			};

			if (typeof data.user === 'undefined') {

				$state.error('User data not passed.');
				callback(timings);

			} else {

				if (typeof data.user.key === 'undefined') {

					$state.error('User key not passed.');
					callback(timings);

				} else {

					if (typeof data.user.name === 'undefined') {

						$state.error('User name not passed.');
						callback(timings);

					} else {

						sockey.token.check(sockey,$state,data.user,function(u){

							if (u.ok === true) {

								//
								// Your Code Goes Here
								//
								// Note: u.res is returned as the user's id.

								emit.ok = true;
								emit.res = 'User is logged in';
								$state.emit(emit);
							} else {

								$state.error(u.err);

							}

							callback(timings);

						});

					}

				}

			}

		// CONTROLLER CODE ENDS HERE

	}

};