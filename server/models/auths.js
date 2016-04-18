module.exports = {

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

	register: function(sockey,run,user,callback) {

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