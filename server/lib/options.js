module.exports = {
	
	// User settings
	port: 8081, // Set your port here,
	socket: { // These are default emitter return suffixes. Error and Data are added to the emitter. 
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

		socket:'auth', // name of the socket you'll be getting automatic messages from
		register_email: true, // register users names and emails or just names
		token_timeout:86400, // how long is a user allowed to be logged in before a new token has to be requested
		lengths: {
			password: {
				min:5,
				max:60,
			},
			username: {
				min:3,
				max:32,
			},
		}, // lengths of passwords

	},
	
	// Server settings
	ctrls: './controllers/',
	modules: {
		autoload:[
			// {
			// 	name:'bcryptjs',
			// 	mod:'bcryptjs',
			// },
		], // Add nodejs modules which need to be loaded into the sockey object. This makes the module available globally.
		obj:{}
	},

};

