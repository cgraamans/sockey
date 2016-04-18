module.exports = {

	generate: function() {
		
		var bcrypt = require('bcryptjs');
		return bcrypt.hashSync(((Math.random()/Date.now()).toString()),bcrypt.genSaltSync(10)).substring(7,39);

	},

	check: function(sockey,run,user,callback) {

		var that = this;

		var rtn = {
			ok:false,
			err:false,
			res:false,
		};

		if (typeof user === 'object') {

			if ((typeof user.key !== 'undefined') && (typeof user.name !== 'undefined')) {

				var keycheck = {
					sql:"SELECT u.id, uk.persistent, uk.insdate FROM users as u INNER JOIN user_keys uk ON uk.user_id = u.id WHERE u.name = ? AND uk.tokey = ?",
					values:[user.name,user.key],
					timeout:4000,
				};

				run.db.query(keycheck, function (error, results) {

					if (error === null) {

						if (results.length > 0) {

							if (results[0].insdate < (Math.round(Date.now()/1000) - sockey.opt.auth.token_timeout)) {

								if (parseInt(results[0].persistent) < 1) {

									rtn.err = 'Logged out.';									
									callback(rtn);

								} else {

									user.id = results[0].id;
									that.update(sockey,run,user,function(ree) {

										if (ree.ok === true) {

											rtn.ok = true;
											rtn.res = results[0].id;

											run.socket.emit(sockey.opt.auth.socket+sockey.opt.socket.data,{
												ok:true,
												res:ree.res,
												err:false,
											});

										} else {

											rtn.err = ree.err;

										}
										callback(rtn);

									});

								}

							} else {

								rtn.ok = true;
								rtn.res = results[0].id;
								callback(rtn);

							}
						
						} else {

							rtn.err = 'User not found.';
							callback(rtn);

						}
					
					} else {

						rtn.err = 'Bad key.';
						callback(rtn);
					
					}

				});

			} else {

				rtn.err = 'Bad key input.';
				callback(rtn);

			}

		} else {

			rtn.err = 'Bad user/key input.';
			callback(rtn);
		
		}

	},

	update: function(sockey,run,user,callback) {

		var that = this;

		var rtn = {
			ok:false,
			err:false,
			res:false,
		};

		var persistence = 0;


		var token = that.generate();
		var set = { 
			tokey:token,
			insdate:(Math.floor(Date.now() / 1000)),
		};

		if (typeof user.persistent !== 'undefined') {

			if (user.persistent === true) {

				set.persistent = 1;
			
			} else {

				set.persistent = 0;

			}

		}

		run.db.query('UPDATE user_keys SET ? WHERE ?',[set,{user_id: user.id,}],function(err,result) {

			if (err) {

				rtn.err = 'Update Key Error.';
			
			} else {

				rtn.ok = true;
				rtn.res = {name:user.name,token:token};

			}
			callback(rtn);

		});

	},

};

