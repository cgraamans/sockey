module.exports = {

	login: function(db,user,callback) {

		var rtn = {
			ok:false,
			err:false,
			res:false,
		};

		if (typeof user === 'object') {

			if ((typeof user.key !== 'undefined') && (typeof user.name !== 'undefined')) {

				// lala

			} else {

				rtn.err = 'Bad user input.';
				callback(rtn);

			}

		} else {

			rtn.err = 'Bad user/password input.';
			callback(rtn);
		
		}

	},

	register: function(db,user,callback) {

		var rtn = {
			ok:false,
			err:false,
			res:false,
		};

		db.get("SELECT id FROM users WHERE `name` = ?",user.name,function(a){

			if (a.ok === true) {
				
				if (a.res.length > 0) {

					rtn.err = 'User name already in use.';
					callback(rtn);

				} else {

					var bcrypt = require('bcryptjs');

					var ins = {
						name: user.name,
						date_register:Math.floor(Date.now() / 1000)
					};

					ins.password = bcrypt.hashSync(user.password,bcrypt.genSaltSync(10));

					if (typeof user.email !== 'undefined') {

						ins.email = user.email;

					}

					db.get("INSERT INTO users SET ?",ins,function(b){

						if (b.ok === true) {

							console.log('inserted!');
							rtn.ok = true;

						} else {

							rtn.err = 'Error inserting user.';

						}
						callback(rtn);


					});

				}
				
			} else {

				rtn.err = 'Username query failed.';
				callback(rtn);

			}
			

		});



	},

	tokey: function(db,user,callback) {

		var rtn = {
			ok:false,
			err:false,
			res:false,
		};

		if (typeof user === 'object') {

			if ((typeof user.key !== 'undefined') && (typeof user.name !== 'undefined')) {

				var keycheck = {
					sql:"",
					values:[user.name,user.key],
					timeout:4000,
				};

				db.connection.query(keycheck, function (error, results) {

					if (error === null) {

						if (results.length > 0) {

							rtn.res = results[0].id;
							rtn.ok = true;
						
						} else {

							rtn.err = 'User not found.';

						}
					
					} else {

						rtn.err = 'Bad key.';
					
					}
					callback(rtn);

				});

			} else {

				rtn.err = 'Bad key input.';
				callback(rtn);

			}

		} else {

			rtn.err = 'Bad user/key input.';
			callback(rtn);
		
		}

	}

};