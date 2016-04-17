exports = module.exports = function(sockey,socket,sock,callback) {


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
				socket.emit(sock+sockey.opt.socket.error,emit);
				callback(dataCallback);

			} else {

				if (typeof data.user.key === 'undefined') {

					emit.err = 'User key not passed.';
					socket.emit(sock+sockey.opt.socket.error,emit);
					callback(dataCallback);

				} else {

					if (typeof data.user.name === 'undefined') {

						emit.err = 'User name not passed.';
						socket.emit(sock+sockey.opt.socket.error,emit);
						callback(dataCallback);

					} else {

						/**
							Example Token Check. Note, this is asynchronous. Use the async module to use this in a synchronous context.
						*/
						sockey.token.check(sockey,socket,data.user,function(u){


							var usedSocket;
							if (u.ok === true) {

								// Your Code here
								// Note: u.res is user's id

								usedSocket = sock+sockey.opt.socket.data;
								emit.ok = true;
								emit.res = 'User is logged in';

							} else {

								// Your Code here

								usedSocket = sock+sockey.opt.socket.error;
								emit.err = u.err;

							}
							socket.emit(usedSocket,emit);
							callback(dataCallback);

						});

					}

				}

			}

		// CONTROLLER CODE ENDS HERE

	}

};