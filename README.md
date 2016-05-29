# ![alt text](https://raw.githubusercontent.com/cgraamans/sockey/master/client/img/logo48.png "Sockey!") Sockey!

## Easy Lightweight Standalone Nodejs Socket.io MVC Framework

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

A sample client webpage is included, though, if you're looking for something a little more structured I recommend __[angular-bootey](http://github.com/cgraamans/angular-bootey)__.

### Sockey includes...

Sockey was written to be a quick standalone setup. Therefore there are a number of functionalities included...

- a clear MVC data structure
- autoload modules for global scope
- automatic database connection and disconnection as well as some simple execution functionalities to get you going
- routing tables to couple requests to controllers
- a token-based authorization system for user registration, login and token verification
- examples for everything!

### Sockey uses the following third party modules...

- [Socket.io](http://socket.io)
- [FelixGe's MYSQL](https://github.com/felixge/node-mysql)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [validator](https://github.com/chriso/validator.js)

Many thanks to those folks for their contributions to programming.

## HowTO

[Installation](#installation)

. [Requirements](#requirements)

. [Sockey Setup](#step-1-sockey-setup)

. [MySQL Setup](#step-2-mysql-setup)

. [Options Setup](#step-3-options-setup)

. [Apache Setup](#step-4-optional-apache-setup)

. [Upstart Setup](#step-5-optional-upstart-setup)

. [Test Client Setup](#step-6-optional-test-client-setup)

. [Run Your Server](#step-7-run-your-server)

[Usage](#usage)

. [Quickstart](#quickstart)

. [Sockey functionalities](#sockey-functionalities)

. . [GLOBALLY AVALIABLE](#globally-available)

. . [SOCKET-LEVEL](#socket-level)

. [Create a Route](#step-1-create-a-route)

. [Create a Controller](#step-2-create-a-controller)

. . [Sockey functionalities](#sockey-functionalities)

. . [Examples](#examples)

. . . [Including a Model](#including-a-model)

. . . [Socket emit in a controller function](#socket-emit-in-a-controller-function)

. . . [Timers and Intervals in a controller function](#timers-and-intervals-in-a-controller-function)

. [Create your Models](#step-3-optional-create-your-models)

. . [Example module template](#example-module-template)

. . [Database SELECT](#example-database-select)

. . [Database INSERT/DELETE](#example-database-insert--delete)

. . [Database UPDATE](#example-database-update)

. [(OPTIONAL) User Registration, Login and Token authorization](#step-4-optional-user-registration-login-and-token-authorization)

. . [How does it work?](#how-does-it-work)

. . [Set auth options](#set-auth-options)

. . [Registration](#registration)

. . [Login](#login)

. . [Checking a token](#checking-a-token)

## Installation

Below are the instructions for installing Sockey to a (linux) server and how to set it up. How to use Sockey is covered in the subsequent 'Usage' section.

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
```

Then include it in the options like so ([example uses async](https://github.com/caolan/async)) ... 

```javascript
modules: [

        ...

        {
          name:'async', // the module as named in node_modules
          mod:'async', // the module as you want to access it in sockey.opt.modules.obj
        },

        ...

],

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
_NOTE:_ There is an example for you in the _init/apache2_ directory you can use in a pinch. Also, restart your apache2 service after any changes!

### Step 5 (optional): Upstart Setup

If your server supports upstart, you can use the template in the _init/upstart_ directory to have the process start up automatically after every system restart.

### Step 6 (optional): Test client Setup

If you quickly want to test the client functionality, there is a sliver of a client in the client directory for you to use. Also do the following to ensure you have socket.io installed for the client:

```bash
cd <some>/<place>/sockey/client
npm install
```

Make a separate apache host pointing to the directory.

### Step 7: Run Your Server

To run your server, navigate to the server directory and run the app.js file ... like so:

```bash
cd <some>/<place>/sockey/server
nodejs app.js
```

If you have included an upstart service you can start the service instead... which is preferable, if you have the option. You can also restart and stop the service.

```bash
sudo service sockey start
```

_NOTE:_ logging needs to be set in the upstart file in /etc/init/sockey.conf (or whatever you want to call it);

## Usage

Below you will find usage guides and examples for sockey.

### Quickstart

A brief summary would be:

- Create a route
- Create a controller
- Emit something from the controller / Action stuff in the database via a model

See the included [example.js / example-keytest](https://github.com/cgraamans/sockey/tree/master/server/controllers) controllers.

Good things to watch out for when programming:

- Returning Timers via the dataCallback variable for closure

Nice to know:

- All database connections for the socket are closed on socket disconnect. No need to fuss.

Have fun!

### Sockey functionalities

Sockey uses an object/function design model, where function are extensions of objects loaded asynchronously. Here's a list of global and local objects and their included functions.

#### GLOBALLY AVALIABLE

- __sockey.opt__: Sockey options (/server/lib/options.js)
- __sockey.modules__: Globaly available modules
- __sockey.io__: initialized socket.io engine
- __sockey.db__: Database connectivity and management functionalities
- __sockey.token__: Token generation, update and checking functionalities (helper)

#### SOCKET-LEVEL

- run.db: the initialized database connection

Each individual socket initialized by a recieved event will have its own database connection made. This is where all database queries should be made. See the [Models examples below].

- run.socket: the initialized socket in the controller.

### Step 1: Create a route

First, edit your routes file.

```bash
    vim lib/routes.js
```

Then, change the example route or add a new object to the routes array.

```javascript
{
    sock:'example',
    controller:'example'
},
```

In this context sock is the incomming socket designation (string), the controller is the path to the controller's file relative to the controller directory.

_NOTE:_ If you're looking for sockey without an auth module there is the separate [sockey-core project](https://github.com/cgraamans/sockey-core)

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

#### Example module template

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

Sockey comes with its own authorization module, loaded in the form of two helpers. The auth helper is for the direct logins and registration from users while the token helper is for the generation and checking of user tokens to verify logins.

#### How does it work?

The user registers a username and password (and email if set in the options). This is sent to the socket the user is connected to, to the 'auth' route (also alterable in the options). The users password and username (and email) are checked for validity. If valid, the password is encrypted and it and the username are inserted into the user database table.

Once the user's core information has been inserted into the user table, a new 'token' is generated for the user. This token is not in any way related to the database and is guaranteed to be unique. Once the unique key has been generated it is associated with the user account (via the user_keys table).

After this moment the username / token combination are used by the user to identify themselves to each socket when a login is required for a functionality.

Logging in is similar. The user's password is encrypted and the username / encrypted password are compared to the stored password in the user_keys database table. If these are one and the same, a new token is generated and replaces the token which is set for the user in the database.

Checking the token can be done within the used socket with the __sockey.token.check() function__. This will return the user's id if logged in (or not if logged in). If the login is successful but the token inserted date is less than the time the user logs in minus the token timeout value in lib/options.js, the user is given a newly generated token.

Note: At no point except when sending passwords to login and registration are passwords ever clear-text. To minimize third party interceptions, please make sure to use SSL for Apache. 

#### Set Auth Options

Open the lib/options.js file and navigate to the auth object.

We'll run through the settings:

__socket__: Name of the socket you'll be getting automatic messages from and pushing to. This is for routing of token updates and login/registration routing.

__register_email__: Do you wish the user to have to register with username and email address or just username?

__token_timeout__: How long can the user be logged in before a new token is required from the user.

__lengths__: How short/long do the passwords and the username have to be to be valid (min/max per type)? 

#### Registration

The user sends the user information as a sub-object, accompanied by the type of authorization request:

```javascript
var pass = {type:'register',user:{}};

pass.user.name = $(this).find('input[name="name"]').val();
pass.user.email = $(this).find('input[name=email]').val();
pass.user.password = $(this).find('input[name=password]').val();

socket.emit('auth',pass);
```

The socket will return socket auth_data for any token information and auth_error if an error is detected.

#### Login

The login sends username and password as well as a true/false value for the 'Remember me' functionality (called `persistent` in user_keys).

```javascript
var pass = {type:'login',user:{}};

pass.user.name = $(this).find('input[name="name"]').val();
pass.user.password = $(this).find('input[name=password]').val();
pass.user.persistent = $(this).find('input[name=rememberme]').is(':checked');

socket.emit('auth',pass);

```

#### Checking a Token

To check a token, the username and the token needs to be passed to sockey like so...

```javascript
var pass = {

    user:{},
    lala:{bla:'blabla'},
    more_stuff:'bladiebladiebla'

};

pass.user.name = $(this).find('input[name="name"]').val();
pass.user.key = $(this).find('input[name=key]').val();

socket.emit('keytest',pass);
```

In the controller do:

```javascript
sockey.token.check(sockey,run,data.user,function(u){


    var usedSocket;
    if (u.ok === true) {

        //
        // Your Code Goes Here
        //
        // Note: u.res is returned as the user's id in this case. Use it wisely for your database queries.

        usedSocket = sock+sockey.opt.socket.data;

    } else {

        usedSocket = sock+sockey.opt.socket.error;
        emit.err = u.err;
        run.socket.emit(usedSocket,{ok:false,err:u.err,res:false});

    }
    callback(dataCallback); // Note, this callback is in the brackets because it's __within an asynchronous call__ here.

});
```

If the user is logged in, the user's id is passed back (u.res). Use this for any user-based database queries within the asynchronous call. Note that if you don't want to nest functions, the async module (available via npm) is your best friend.
