module.exports = {
	
	// User settings
	port: 8081, // Set your port here,
	socket: {
		error:'_error',
		data:'_data',
	},

	// Database settings
	db:{
		host:'localhost',
		user:'sockeyuser',
		password:'sockeypassword',
		database:'sockeydb'		
	},

	// Authorization settings
	auth: {

		enabled: true,
		register_email: true,

	},
	
	// Server settings
	ctrls: './controllers/',
	modules: {}, // Note: to save memory, include your modules via app.js and assign them to opt.modules.<modulename>

};

