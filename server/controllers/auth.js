exports = module.exports = function(sockey,sock,callback) {

	var run = {

		emitters: {},
		modules: {},
		registration: function(sockey,data,emit,cb) {

			var that = this;
			this.modules.auths.register(sockey,data.user,function(r) {

				if (r.ok === true) {

					emit.ok = true,
					emit.res = r.res;
					cb(emit);

				} else {

					emit.err = r.err;
					cb(emit);

				}

			});

		},

		login: function(sockey,data,emit,cb) {

			var that = this;
			this.modules.auths.login(sockey,data.user,function(l){

				if (l.ok === true) {

					emit.ok = true,
					emit.res = l.res;
					cb(emit);

				} else {

					emit.err = l.err
					cb(emit);

				}

			});

		}

	};

	return function(data) {

		// Note: Data is the request object passed by the socket.
		var dataCallback = {timers:[],intervals:[]};

		// CONTROLLER CODE
			
			var that = this;

			var emit = {
				ok:false,
				err:false,
			};

			run.emitters.error = sock+sockey.opt.socket.error;
			run.emitters.data = sock+sockey.opt.socket.data;

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

				run.modules.auths = require('../models/auths');
				if (data.type === 'register') {

					var validator = require('validator');
					if (validator.isLength(data.user.name,sockey.opt.auth.lengths.username) === true) {

						if (validator.matches(data.user.name,'^[a-zA-Z0-9!@#$%^&*]*$','g') === true) {

							if (validator.isLength(data.user.password,sockey.opt.auth.lengths.password) === true) {

								if (validator.matches(data.user.password,'^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]*$','g') === true) {

									if (sockey.opt.auth.register_email === true) {

										if (typeof data.user.email !== 'undefined') {

											if (validator.isEmail(data.user.email) === true) {

												run.registration(sockey,data,emit,function(reg) {

													var emitter = run.emitters.error;
													if (reg.ok === true ) {

														emitter = run.emitters.data;
													
													}
													sockey.socket.emit(emitter,reg);
													callback(dataCallback);

												});

											} else {

												emit.err = 'Email address is invalid.';
												sockey.socket.emit(run.emitters.error,emit);
												callback(dataCallback);

											}

										} else {

											emit.err = 'Email address needed.';
											sockey.socket.emit(run.emitters.error,emit);
											callback(dataCallback);

										}
										
									} else {

										run.registration(sockey,data,emit,function(reg){

											var emitter = run.emitters.error;
											if (reg.ok === true) {

												emitter = run.emitters.data;
											
											}
											sockey.socket.emit(emitter,reg);
											callback(dataCallback);

										});
									}

								} else {

									emit.err = 'Password must contain letters and at least one special character and one number.';
									sockey.socket.emit(run.emitters.error,emit);
									callback(dataCallback);

								}

							} else {

								emit.err = 'Password must be between 6 and 60 characters long.';
								sockey.socket.emit(run.emitters.error,emit);
								callback(dataCallback);

							}							

						} else {

							emit.err = 'Usernames may contain letters, special characters and numbers.';
							sockey.socket.emit(run.emitters.error,emit);
							callback(dataCallback);

						}

					} else {

						emit.err = 'User name must be between 3 and 32 Characters..';
						sockey.socket.emit(run.emitters.error,emit);
						callback(dataCallback);

					}

				}

				if (data.type === 'login') {

					run.login(sockey,data,emit,function(li){

						var emitter = run.emitters.error;
						if (li.ok === true) {
							emitter = run.emitters.data;
						}
						sockey.socket.emit(emitter,li);
						callback(dataCallback);

					});

				}

			} else {

				sockey.socket.emit(run.emitters.error,emit);
				callback(dataCallback);

			}

		// CONTROLLER CODE ENDS HERE

	}

};