exports = module.exports = function(sockey,run,sock,callback) {

	var local = {

		emitters:{},

		login: function(sockey,run,user,callback) {

			var rtn = {
				ok:false,
				err:false,
				res:false,
			};

			sockey.db.exec("SELECT id, password FROM users WHERE name = ?",user.name,run,function(a){

				if (a.ok === false) {

					rtn.err = 'Password query failed.';
					callback(rtn);

				} else {

					if (a.res.length == 1) {

							var bcrypt = require('bcryptjs');
							if (bcrypt.compareSync(user.password,a.res[0].password) === true) {

								user.id = a.res[0].id;
								sockey.token.update(sockey,run,user,function(arr){

									if (arr.ok === true) {

										rtn.ok = true;
										rtn.res = arr.res;

									} else {

										rtn.err = 'User not found.';

									}
									callback(rtn);

								});


							} else {

								rtn.err = 'User not found.';
								callback(rtn);

							}
							

					} else {

						rtn.err = 'User not found.';
						callback(rtn);
					
					}		

				}

			});

		},

		registration: function(sockey,run,user,callback) {

			var rtn = {
				ok:false,
				err:false,
				res:false,
			};

			sockey.db.exec("SELECT id FROM users WHERE name = ?",user.name,run,function(a){

				if (a.ok === true) {
					
					if (a.res.length > 0) {

						rtn.err = 'User name already in use.';
						callback(rtn);

					} else {


						var ins = {
							name: user.name,
							date_register:Math.floor(Date.now() / 1000)
						};
						
						var bcrypt = require('bcryptjs');
						ins.password = bcrypt.hashSync(user.password,bcrypt.genSaltSync(10));

						if (typeof user.email !== 'undefined') {

							ins.email = user.email;

						}

						run.db.query("INSERT INTO users SET ?",ins,function(c,b) {
							
							if (c == null) {

								var token = sockey.token.generate();
								run.db.query('INSERT INTO user_keys SET ?', {
									user_id:b.insertId,
									tokey: token,
									insdate:(Math.floor(Date.now() / 1000)), 
								},function(err, result) {

									if (err) {
										
										rtn.err = 'Insert Tokey Error.';
										callback(rtn);
									
									} else {

										rtn.ok = true;
										rtn.res = {name:user.name,token:token};
										callback(rtn);

									}

								});

							} else {

								rtn.err = 'Error inserting user.';
								callback(rtn);

							}

						});

					}
					
				} else {

					rtn.err = 'Username query failed.';
					callback(rtn);

				}
				
			});

		},

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

			local.emitters.error = sock+sockey.opt.socket.error;
			local.emitters.data = sock+sockey.opt.socket.data;

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

				if (data.type === 'register') {

					var validator = require('validator');
					if (validator.isLength(data.user.name,sockey.opt.auth.lengths.username) === true) {

						if (validator.matches(data.user.name,'^[a-zA-Z0-9!@#$%^&*]*$','g') === true) {

							if (validator.isLength(data.user.password,sockey.opt.auth.lengths.password) === true) {

								if (validator.matches(data.user.password,'^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]*$','g') === true) {

									if (sockey.opt.auth.register_email === true) {

										if (typeof data.user.email !== 'undefined') {

											if (validator.isEmail(data.user.email) === true) {

												local.registration(sockey,run,data.user,function(reg) {

													var emitter = local.emitters.error;
													if (reg.ok === true ) {

														emitter = local.emitters.data;
													
													}
													run.socket.emit(emitter,reg);
													callback(dataCallback);

												});

											} else {

												emit.err = 'Email address is invalid.';
												run.socket.emit(run.emitters.error,emit);
												callback(dataCallback);

											}

										} else {

											emit.err = 'Email address needed.';
											run.socket.emit(run.emitters.error,emit);
											callback(dataCallback);

										}
										
									} else {

										data.user.email = null;
										local.registration(sockey,run,data.user,function(reg){

											var emitter = local.emitters.error;
											if (reg.ok === true) {

												emitter = local.emitters.data;
											
											}
											run.socket.emit(emitter,reg);
											callback(dataCallback);

										});
									}

								} else {

									emit.err = 'Password must contain letters and at least one special character and one number.';
									run.socket.emit(run.emitters.error,emit);
									callback(dataCallback);

								}

							} else {

								emit.err = 'Password must be between 6 and 60 characters long.';
								run.socket.emit(run.emitters.error,emit);
								callback(dataCallback);

							}							

						} else {

							emit.err = 'Usernames may contain letters, special characters and numbers.';
							run.socket.emit(run.emitters.error,emit);
							callback(dataCallback);

						}

					} else {

						emit.err = 'User name must be between 3 and 32 Characters..';
						run.socket.emit(run.emitters.error,emit);
						callback(dataCallback);

					}

				}

				if (data.type === 'login') {

					local.login(sockey,run,data.user,function(li){

						var emitter = local.emitters.error;
						if (li.ok === true) {

							emitter = local.emitters.data;

						}
						run.socket.emit(emitter,li);
						callback(dataCallback);

					});

				}

			} else {

				run.socket.emit(run.emitters.error,emit);
				callback(dataCallback);

			}

		// CONTROLLER CODE ENDS HERE

	}

};