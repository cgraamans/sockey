exports = module.exports = function(sockey,opt,sock,callback) {


	return function(data) {
		// Note: Data is the request object passed by the socket.
		var dataCallback = {timers:[],intervals:[]};

		// CONTROLLER CODE
			var emit = {
				ok:false,
				err:false,
			};

			if (typeof data !== 'object') {

				emit.err = 'Bad data passed to auth.';

			}

			if (typeof (data.type) !== 'string') {

				emit.err = 'No type specified.';

			}

			if ((typeof data.user !== 'object') || (typeof (data.user.name) !== 'string') || (typeof (data.user.password) !== 'string')) {
				
				emit.err = 'User data invalid.';

			} else {

				if (data.user.name.length < 1) {
					
					emit.err = 'You need to fill in a name.';
				
				}

				if (data.user.password.length < 1) {

					emit.err = 'You need to fill in a password.';

				}

			}

			if (emit.err === false) {

				var validator = require('validator');
				if (validator.isLength(data.user.name,{max:32}) === true) {

					if (validator.matches(data.user.name,'^[a-zA-Z0-9!@#$%^&*]*$','g') === true) {

						if (validator.matches(data.user.password,'^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]*$','g') === true) {

							var auths = require('../models/auths');
							if (data.type === 'register') {

								if (opt.auth.register_email === true) {

									if (typeof data.user.email !== 'undefined') {

										if (validator.isEmail(data.user.email) === true) {

											auths.register(sockey.db,data.user,function(r) {

												if (r.ok === true) {

													// auths.login(sockey.db,data.user,function(l){

													// 	if (l.ok === true) {

													// 		emit.ok = true,
													// 		emit.res = l.res;
													// 		sockey.socket.emit(sock+opt.socket.data,emit);

													// 	} else {

													// 		emit.err = l.err
													// 		sockey.socket.emit(sock+opt.socket.error,emit);

													// 	}

													// });

												} else {

													emit.err = r.err
													sockey.socket.emit(sock+opt.socket.error,emit);

												}

											});

										} else {

											emit.err = 'Email address is invalid.';
											sockey.socket.emit(sock+opt.socket.error,emit);

										}

									} else {

										emit.err = 'Email address needed.';
										sockey.socket.emit(sock+opt.socket.error,emit);

									}
									
								} else {

									console.log('register!');

								}

							}


							if (data.type === 'login') {

								// auths.login(sockey.db,data.user,function(l) {

								// 	if (l.ok === true) {

								// 		emit.ok = true,
								// 		emit.res = l.res;
								// 		sockey.socket.emit(sock+opt.socket.data,emit);

								// 	} else {

								// 		emit.err = l.err
								// 		sockey.socket.emit(sock+opt.socket.error,emit);

								// 	}

								// });

							}

						} else {

							emit.err = 'Password must contain letters and at least one special character and one number.';
							sockey.socket.emit(sock+opt.socket.error,emit);

						}

					} else {

						emit.err = 'Usernames may contain letters, special characters and numbers.';
						sockey.socket.emit(sock+opt.socket.error,emit);

					}

				} else {

					emit.err = 'User name too long; must be under 32 Characters..';
					sockey.socket.emit(sock+opt.socket.error,emit);

				}

			} else {

				sockey.socket.emit(sock+opt.socket.error,emit);

			}

		// CONTROLLER CODE ENDS HERE

		callback(dataCallback); // DO NOT REMOVE
		// NOTE: - callback is an array of objects for interval and time-out cancellation on socket destruction. If no timers are set, leave as is.

	}

};