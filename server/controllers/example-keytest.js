/**
	Example Token Check. 

	Note, this is asynchronous. Use the async module to use this in a synchronous context.
*/
exports = module.exports = function(sockey,run,sock,callback) {


	return function(data) {
		// Note: Data is the request object passed by the socket.
		var dataCallback = {timers:[],intervals:[]};

		// CONTROLLER CODE

			var emit = {
				ok:false,
				err:false,
			};

			if (typeof data.user === 'undefined') {

				emit.err = 'User data not passed.'
				run.socket.emit(sock+sockey.opt.socket.error,emit);
				callback(dataCallback);

			} else {

				if (typeof data.user.key === 'undefined') {

					emit.err = 'User key not passed.';
					run.socket.emit(sock+sockey.opt.socket.error,emit);
					callback(dataCallback);

				} else {

					if (typeof data.user.name === 'undefined') {

						emit.err = 'User name not passed.';
						run.socket.emit(sock+sockey.opt.socket.error,emit);
						callback(dataCallback);

					} else {

						sockey.token.check(sockey,run,data.user,function(u){


							var usedSocket;
							if (u.ok === true) {

								//
								// Your Code Goes Here
								//
								// Note: u.res is returned as the user's id in this case. Use it wisely for your database queries.

								usedSocket = sock+sockey.opt.socket.data;
								emit.ok = true;
								emit.res = 'User is logged in';

							} else {

								usedSocket = sock+sockey.opt.socket.error;
								emit.err = u.err;

							}
							run.socket.emit(usedSocket,emit);
							callback(dataCallback);

						});

					}

				}

			}

		// CONTROLLER CODE ENDS HERE

	}

};