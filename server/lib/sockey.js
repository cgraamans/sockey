module.exports = {

	// Initialize the component
	init: function() {

		var that = this;

		// Set up the variables
		this.opt = require('../lib/options'),
		this.modules = {},
		this.helpers = {};

		// Start your socket.io service
		this.io = require('socket.io')(this.opt.port);

		// Global NodeJS Modules
		this.opt.modules.forEach(function(load) {

			this.modules[load.name] = require(load.mod);

		});

		// Global Sockey Helpers
		this.opt.helpers.forEach(function(helper){

			if (!(helper in that)) {
				// console.log(helper);
				that[helper] = require('../helpers/sockey.'+helper);
				// console.log(that[helper]);

			} else {

				console.error("Helper '"+helper+"' was already loaded.");
			
			}

		});

	},

	// io.emit wrapper
	emit: function(sock,msg){

		this.io.emit(sock + this.opt.returns.data,msg);

	},

	// io.error wrapper
	error: function(sock,msg) {

		this.io.emit(sock + this.opt.returns.error,msg);

	},

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

