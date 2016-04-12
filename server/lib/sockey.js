module.exports = {
	
	// Database
	db: {

		connect: function(options) {

			var mysql = require('mysql');
			if (typeof mysql !== 'undefined') {
				this.connection = mysql.createConnection(options);			
			}

		},

		disconnect: function() {

			if (typeof(this.connection) !== 'undefined') {
				this.connection.end();	
			}
		
		},

		get: function(sql_str,val,callback){

			var rtn = {
				ok:false,
				res:false,
				err:false,
			};

			var simple = {sql:sql_str};
			simple.timeout = 40000;

			if (typeof this.connection !== 'undefined') {

				if (this.connection !== false) {

					this.connection.query(simple, function(error,rslt){

						if (err) {
							rtn.err = error;
						} else {
							rtn.res = rslt;
							rtn.ok = true;
						}
						callback(rtn);

					});

				} else {

					rtn.err = 'Bad connection';
					callback(rtn);

				}

			} else {

				rtn.err = 'No connection';
				callback(rtn);

			}

		},

		ins: function(){},

		upd: function(){},

		del: function(){},

	},

	// Broadcast
	bc: {

		emit: function(){}

	},

};

