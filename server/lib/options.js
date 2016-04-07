exports.init = {
	
	// User settings
	port: 8081, // Set your port here,
	socket: {
		error:'_error',
		data:'_data',
	},
	
	// Server settings
	ctrls: './controllers/',
	modules: {}, // Note: to save memory, include your modules via app.js and assign them to opt.modules.<modulename>

};

