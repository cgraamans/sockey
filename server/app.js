'use strict';

// Initialize Application In global variable.
global._s = {

	db:require('./lib/db'),
	opt:{
		db:require('./options/db'),
		socket:require('./options/socket'),
		common:require('./options/common')
	},
	io:false,
	helpers:{},
	modules:{},
	crypto:{
		jwt:require('jwt-simple'),
		SHA256:require('crypto-js/sha256'),
	},
	tock:0,

};

// NOTE:
// on load of solar system, calculate number of ticks since start of system and then position on the 360 degrees

// Global NodeJS Modules
console.log('Executing App');
try {

	global._s.io = require('socket.io')(global._s.opt.socket.port);

	global._s.opt.common.modules.forEach(function(load) {

		global._s.modules[load.name] = require(load.mod);

	});

	global._s.db.createPool(global._s.opt.db.settings)
		.then(function(pool){

			console.log('- MYSQL Pool Created');
			global._s.db.pool = pool;

		})
		.catch(function(err){

			console.log('Mysql Err');
			console.log(err);
			throw(err);

		});

	setInterval(function(){

		if(global._s.tock%100 === 0) {

			console.log(global._s.tock);

		}

		global._s.tock++;

		// console.log(sockey.tock);

		// conventions
		// one tick = 24h in-game

		// broadcast tick results
		// - tick time
		// - nested node position corrections
	    // - NPC actions
		// - individual user tick results

		// to calculate positon corrections
		// - every 36 degrees (+opt.tick time) user sends correction request
		// - next tick gives correct position

	},global._s.opt.common.tick);
	console.log('- Tick Started');

	global._s.io.on('connection', function(socket) {

		var $state = {
				ready:false,
				timers:[],
				intervals:[],
			},
			usr = {
				ok:false,
				ban:false
			};

		console.log(' - New User');
		console.log(socket.id);

		$state.ip =	socket.conn.remoteAddress;
		if (socket.handshake.address.length > 3) {

			$state.ip = socket.handshake.address;

		}
		if (socket.request.client._peername.address.length > 3) {

			$state.ip = socket.request.client._peername.address;

		}
		if(socket.handshake.headers['x-forwarded-for'].length > 3) {

			$state.ip = socket.handshake.headers['x-forwarded-for'];
		
		}

		let salt = socket.id + (new Date()).getTime() + socket.conn.remoteAddress + socket.handshake.address + socket.request.client._peername.address + socket.handshake.headers['x-forwarded-for'];
		$state.id = usr.id = global._s.crypto.SHA256(salt).toString();

		socket.on('disconnect',function(){

			(global._s.intervals || []).forEach(function(iv){

				clearInterval(iv);

			});

			(global._s.timers || []).forEach(function(iv){

				clearTimeout(iv);

			});

		});

	});

} catch(e) {

	console.log(e);
	process.exit(1);

}
