module.exports = {
	
	// User settings
	port: 9001, // Set your port here,

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