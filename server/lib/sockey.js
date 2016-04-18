module.exports = {
	
	// Database
	db: {

		connect: function(options) {

			var mysql = require('mysql');
			return mysql.createConnection(options);			

		},

		exec: function(sql_str,val,run,callback){

			var rtn = {
				ok:false,
				res:false,
				err:false,
			};

			var simple = {sql:sql_str};
			simple.timeout = 40000;

			if (val.isArray === true) {

				simple.values = val;

			} else {

				simple.values = [val];

			}
			

			if (typeof run.db !== 'undefined') {

				if (run.db !== false) {

					run.db.query(simple, function(error,rslt) {

						if (error) {
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

	},

};

