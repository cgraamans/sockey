module.exports = {
	
	// Database
	db: {

		connect: function(options) {

			var mysql = require('mysql');
			return mysql.createConnection(options);			

		},

		exec: function(sql_str,val,$state,callback){

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
			

			if (typeof $state.db !== 'undefined') {

				if ($state.db !== false) {

					$state.db.query(simple, function(error,rslt) {

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

