'use strict';

module.exports = {

	// Create Pool
	createPool: function(options) {

		return new Promise((resolve,reject)=> {

			try {

				var mysql = require('mysql');
				var pool = mysql.createPool(options);

				resolve(pool);

			} catch(e) {

				reject(e);
			
			}

		});

	},

	// Connect to Pool
	connect: function(pool) {

		return new Promise((resolve,reject)=> {

			pool.getConnection(function(err, connection) {

				if (err) {

					reject(err);

				} else {

					resolve(connection);

				}

			});

		});

	},

	checkBan:function(connection,address) {
		
		return new Promise((resolve,reject)=> {

			connection.query('SELECT id, reason, host, dt FROM user_bans WHERE active = 1 AND ((? LIKE CONCAT("%",host,"%")) OR (? LIKE CONCAT(host,"%")) OR (? LIKE CONCAT("%",host)))',[address,address,address],function(err,res) {

				if(err) {
				
					reject(err);
				
				} else {
				
					if (res.length > 0) {
						
						resolve(res);

					} else {
						
						resolve();
					
					}
				
				}

			});

		});

	},

};

