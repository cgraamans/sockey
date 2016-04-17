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

		socket:'auth',
		register_email: true,
		token_timeout:86400,
		lengths: {
			password: {
				min:5,
				max:60,
			},
			username: {
				min:3,
				max:32,
			},
		},

	},
	
	// Server settings
	ctrls: './controllers/',
	modules: {}, // Note: to save memory, include your modules via app.js and assign them to opt.modules.<modulename>

};

