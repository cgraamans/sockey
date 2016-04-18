# Sockey

## Lightweight Standalone Nodejs Socket.io MVC Framework

Sockey is a Server-side socket.io framework, specifically made to divorce server-side and client-side processing.

It is an easy-to-use solution for creating quick standalone server-side web socket applications for all your scalable web development needs. 

For those who're unsure what Socket.io is, it's a websocket service. A websocket service is the next step up from AJAX requests; using HTTP calls to keep a connection open between the user's browser and the service, allowing the application to 'push' data to the user when circumstances (on the database or when other users enact actions) change, instead of the user polling for changes from the client regularly. 

Sockey runs on Socket.io, MySQL and bcryptjs.

##### NOTICE: [The original sockey mini-framework is now available as sockey-core here](https://github.com/cgraamans/sockey-core).

### MVC
Sockey attempts to conform to the classic definition of an MVC Framework. MVC stands for Model, View, Controller. To make a well structured application you need all three of those components.

- A **model** creates a connection to the database and manages the data going to and from the database.
- A **view** traditionally denotes what the user sees; the HTML, Javascript and CSS required for the user's interactive experience. In our Server-side MVC, these don't traditionally exist because we're passing data to the client, where views will be handled separately. Instead, the 'view' here are the socket and io emits.
- A **controller** manages the flow of information between the view and the model.

Since modern day applications need to be infinitely scalable, physical separation of Views from Models and Controllers which handle data is becoming a standard requirement for projects. Enter Socket.io. Socket.io is a NODEJS websocket application which allows you to keep a connection open between the user-side application, running locally on a user's machine (or tablet or whatever), and the server managing the information coming from the database. It allows you to 'push' information to the user without them having to request data first.

Sockey is an attempt at a small-scale MVC framework to bridge the gap for programmers to quickly create small and large scale websocket applications using minimal code which works straight out of the box. 

To get Sockey to work _you will need a client application and a server application_. The client application can be served to the user in the form of an app (Web-browser page, iOS or Android or Windows-Phone). The server application can run on any linux-box utilizing apache2 (or other webservers - though I wouldn't know how - yet) and nodejs.

A sample client webpage is included.

### Sockey includes...

Sockey was written to be a quick standalone setup. Therefore there are a number of functionalities included...

- a clear MVC data structure
- autoload modules for global scope
- automatic database connection and disconnection as well as some simple execution functionalities to get you going
- routing tables to couple requests to controllers
- a token-based authorization system for user registration, login and token verification
- examples for everything!



## HOWTO

[HOWTO](#HOWTO)

[Requirements](#Requirements)

[Sockey Setup](#Sockey Setup)

[MySQL Setup](#MySQL Setup)

[Options Setup](#Options Setup)

[Apache Setup](#Apache Setup)

[Upstart Setup](#Upstart Setup)

[Test Client](#Test Client)

[Usage](#Usage)

[Routing](#Routing)

[Controllers](#Controllers)

[Objects and their functions](#Objects and their functions)

[GLOBAL](#GLOBAL)

[SOCKET-LEVEL](#SOCKET-LEVEL)

[Examples](#Examples)

[Including a model](#Including a model)

[Socket emit in a controller function](#Socket emit in a controller function)

[Timers and intervals in a controller function](#Timers and intervals in a controller function)

[Models]()


### Requirements

Your requirements to install sockey...
  - Knowing what Javascript, NodeJS and Socket.io are.
  - Some kind of Apache Webserver you have root access to.
  - A MYSQL database, ready to use.
  - NodeJS / NPM:

```bash
    sudo apt-get nodejs npm
```

### Step 1: Sockey Setup
    
Install Sockey from Github.

```bash
    mkdir <some>/<place>/sockey
    cd <some>/<place>/sockey
    git clone https://github.com/cgraamans/sockey.git  
```

### Step 2: MySQL Setup

Import the MySQL setup from __server/init/mysql__ into your MySQL database like so:

```bash
    mysql -uroot -p yourdatabasename < server/init/mysql/sockeydb.sql
```
Make a user to go along with that as well.

### Step 3: Options Setup

To get the application running, you will need to set up your options:

```bash
    cd <some>/<place>/sockey/server
    npm install
    vim lib/options.js
```
Run through the following checklist to make sure you've gotten everything covered.

##### 1. Set up your desired port. Sockey runs on an internal port, which you can either route through your firewall or route through an Apache service on port 80.
##### 2. Set up your to-be-autoloaded modules (async comes to mind...)

First, get the npm module you want to make available globally...

```bash
    npm install --save async

Then include it in the options like so... 

```javascript
    modules: {
        autoload:[
            {
              name:'async', // the module as named in node_modules
              mod:'async', // the module as you want to access it in sockey.opt.modules.obj
            },
        ], // Add nodejs modules which need to be loaded into the sockey object. This makes the module available globally.
        obj:{}
    },
```

The module will be automatically loaded and available in the sockey.opt.modules.obj object in any controller (See Usage for more info)

##### 3. Modify the database settings to include your database credentials (database username, password, name and host).

##### 4. Set up the error and ok-result return suffixes in the __socket__ object.

##### 5. (OPTIONAL) Run through the settings of the auth module to make sure you don't miss out on anything you want to alter.

Save and continue...

### Step 4 (optional): Apache Setup

You will have to create an internal proxy to link the apache webhost to Sockey. __Sockey runs on an internal port, which you chose in the above options.__ 

- Firstly, make sure you've got the following modules installed in your apache service.

```bash
    sudo a2enmod rewrite
    sudo a2enmod proxy_http
    sudo a2enmod proxy_wstunnel
    sudo service apache2 restart
```
- Paste the following into your relevant apache VirtualHost directive. Change the port numbers (highlighted below) to the port you chose installing Sockey.

```bash
    RewriteEngine On
    RewriteCond %{REQUEST_URI}  ^/socket.io            [NC]
    RewriteCond %{QUERY_STRING} transport=websocket    [NC]
    RewriteRule /(.*)           ws://localhost:8081/$1 [P,L]

    ProxyPass        /socket.io http://localhost:8081/socket.io
    ProxyPassReverse /socket.io http://localhost:8081/socket.io
```
_NOTE:_ There is an example for you in the _init/apache2_ directory you can use in a pinch.

### Step 5 (optional): Upstart Setup

If your server supports upstart, you can use the template in the _init/upstart_ directory to have the process start up automatically after every system restart.

### Step 6 (optional): Test client Setup

If you quickly want to test the client functionality, there is a sliver of a client in the client directory for you to use. Also do the following to ensure you have socket.io installed for the client:

```bash
cd <some>/<place>/sockey/client
npm install
```

Make a separate apache host pointing to the directory.

## Usage

### Step 1: Create a route

First, edit your routes file. Then, change the example route or add a new object to the routes array.

    vim lib/routes.js

```javascript
{
    sock:'example',
    controller:'example'
},
```

_NOTE:_ Do not remove the auth designation if you intend to use the authorization module. If you're looking for sockey without an auth module there is the separate [sockey-core project]()

### Step 2: Create a controller

```bash
vim controllers/test.js
```

Add the following code to your test.js controller file:

```javascript
exports = module.exports = function(sockey,run,sock,callback) {

    return function(data) {
        var dataCallback = {timers:[],intervals:[]};

        // CONTROLLER CODE

            //
            // YOUR CODE GOES HERE...
            //

        // CONTROLLER CODE ENDS HERE

        callback(dataCallback);

    }

};
```

_NOTE:_ The data callback is to kill off any timer or interval processes you want to start in the controller. Allowing these to keep running after client disconnection will create an incredible memory leak. Make sure you always add a timer or an interval to the dataCallback object (see below).

#### Objects and their functions

Sockey uses an object/function design model, where function are extensions of objects loaded asynchronously. Here's a list of global and local objects and their included functions.

##### GLOBAL

- sockey.opt: Import from lib/options.js
- sockey.opt.modules.obj: Auto-loaded modules
- sockey.io: initialized socket.io engine
- sockey.db: Database connectivity and management functionalities
- sockey.token: Token generation and checking functionalities
- sockey.modules: Globally loaded modules

##### SOCKET-LEVEL

- run.db: the initialized database connection
- run.socket: the initialized socket in the controller.

#### Examples

Below are some code examples for best practice within the framework.

##### Including a model

In your controller you can initialize the model thusly:

```javascript
var testmodel = require('../models/test-model');
```

##### Socket emit in a controller function

```javascript
run.socket.emit(sock+sockey.opt.socket.data,{
    "message":"Recieved Example Request",
    "request-socket":sock,
});
```

##### Timers and intervals in a controller function

```javascript
// INTERVALS: This is how you do Intervals
var interval = setInterval(function(){

    run.socket.broadcast.emit(sock+opt.socket.data,{
        "message":"Global Timed Emit To Everyone But User Every 5 seconds"
    });

},5000);
dataCallback.intervals.push(interval);

// TIMEOUTS: This is how you do Timeouts
var timeout = setTimeout(function(){

    sockey.io.emit(sock+opt.socket.data,{"message":"Global Emit To Everyone After 10 seconds"});

},10000);
dataCallback.timers.push(timeout);
```

For more information on how sockets work and how to use them, see the [socket.io documentation](http://socket.io/).

### Step 3 (optional): Create your models

Below are some examples for creating database connections. [See felixge's brilliant MySQL module](https://github.com/felixge/node-mysql)'s readme for more info. To use these properly, create models for your functions. Include them thusly...

Models are always objects in Sockey. Create your model like so:

```bash
vim models/test-model.js
```
Then add the following to the test-model.js model file:

```javascript
module.exports = {};
```

Fill the object with your required models (functions and variables for database connection and interaction). To optimally take advantage of the sockey framework pass the sockey and the run variables in the function

```javascript
function(sockey,run,data,callback) {}
```

Example template for a module:

```javascript
module.exports = {
    
    login: function(sockey,run,user,callback) {

        var rtn = {
            ok:false,
            err:false,
            res:false,
        };

        run.db.query('SELECT... WHERE a = ? AND b = ? AND c = ?',[a,b,c],function(err,result){
        
            if (err) {
                rtn.err = err;
            } else {

                rtn.ok = true;
                rtn.res = result;
            }
            callback(rtn);

        });

    },

};
```

In your controller you can initialize the model thusly:

```javascript
var testmodel = require('../models/test-model');
```

Note that these are asynchronous and need to be used within an aysnc call if you wish to use them in sequence or in parallel.

##### Example database SELECT

```javascript
run.db.query('SELECT... WHERE a = ? AND b = ? AND c = ?',[a,b,c],function(err,result){
    
});
```

##### Example database INSERT / DELETE


##### Example database UPDATE

```javascript
var set = { 
  insdate:(Math.floor(Date.now() / 1000)),
};
run.db.query('UPDATE table SET ? WHERE ?',[set,{user_id: user.id,}],function(err,result) {
  if (err) {
    
    ...
  
  } else {
    
    ...

  }

});
```

### Step 4 (optional): User Registration, Login and Token authorization.

