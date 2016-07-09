module.exports = {
	
	// User settings
	port: 8081, // Set your port here,

	// Autoload nodejs modules for global access
	modules: [

			// {
			// 	name:'async', // the module as named in node_modules
			// 	mod:'async', // the module as you want to access it in sockey.modules
			// },
	
	],

	helpers: ['token'],
	
	// Database settings
	db:{
		host:'localhost',
		user:'sockeyuser',
		password:'sockeypassword',
		database:'sockeydb'		
	},

	// Socket return suffixes
	returns: { 
		error:'_error',
		data:'_data',
	}, // These are default emitter return suffixes. Error and Data are added to the emitter to send to the client, depending on the result of the processing of the client's query. 

	// Authorization settings
	auth: {

		socket:'auth', // name of the socket you'll be getting automatic messages from and pushing to. This is for token updates.
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

};

