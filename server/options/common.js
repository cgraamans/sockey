module.exports = {

	// Autoload nodejs modules for global access
	modules: [

			{
				name:'async', // the module as named in node_modules
				mod:'async', // the module as you want to access it in sockey.modules
			},
	
	],

	tick:300

}