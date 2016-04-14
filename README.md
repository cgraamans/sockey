# Sockey
Sockey is a Server-side socket.io framework

It is an easy-to-use solution for creating quick standalone server-side web socket applications for all your scalable web development needs. 

For those who're unsure what Socket.io is, it's a websocket service. A websocket service is the next step up from AJAX requests; using HTTP calls to keep a connection open between the user's browser and the service, allowing the application to 'push' data to the user when circumstances (on the database or when other users enact actions) change, instead of the user polling for changes from the client regularly. 

Socket.io can be used for web applications, andrioid and iOS application development, allowing you to push data to a user's app.

## NOTICE: [The original sockey mini-framework is now available as sockey-core here](https://github.com/cgraamans/sockey-core).

## MVC
Sockey attempts to conform to the classic definition of an MVC Framework. MVC stands for Model, View, Controller. To make a well structured application you need all three of those components.

- A **model** creates a connection to the database and manages the data going to and from the database.
- A **view** traditionally denotes what the user sees; the HTML, Javascript and CSS required for the user's interactive experience. In our Server-side MVC, these don't traditionally exist because we're passing data to the client, where views will be handled separately. Instead, the 'view' here are the socket and io emits.
- A **controller** manages the flow of information between the view and the model.

Since modern day applications need to be infinitely scalable, physical separation of Views from Models and Controllers which handle data is becoming a standard requirement for projects. Enter Socket.io. Socket.io is a NODEJS websocket application which allows you to keep a connection open between the user-side application, running locally on a user's machine (or tablet or whatever), and the server managing the information coming from the database. It allows you to 'push' information to the user without them having to request data first.

Sockey is an attempt at a small-scale MVC framework to bridge the gap for programmers to quickly create small and large scale websocket applications using minimal code which works straight out of the box. 

To get Sockey to work _you will need a client application and a server application_. The client application can be served to the user in the form of an app (Web-browser page, iOS or Android or Windows-Phone). The server application can run on any linux-box utilizing apache2 (or other webservers - though I wouldn't know how - yet) and nodejs.

A sample client webpage is included.

## Installation

### Requirements

Your requirements to install sockey...
  - Knowing what Javascript, NodeJS and Socket.io are.
  - Some kind of Apache Webserver you have root access to.
  - NodeJS / NPM:

    sudo apt-get nodejs npm

### Step 1: Sockey Setup
    
Install Sockey from Github.

    mkdir <some>/<place>/sockey
    cd <some>/<place>/sockey
    git clone https://github.com/cgraamans/sockey.git  


Choose your port: Sockey runs on an internal port, unless you decide to reroute it (see step 2).
    
    cd <some>/<place>/sockey/server
    npm install
    vim lib/options.js

### Step 2: Apache Setup

You will have to create an internal proxy to link the apache webhost to Sockey.

    sudo a2enmod rewrite
    sudo a2enmod proxy_http
    sudo a2enmod proxy_wstunnel
    sudo service apache2 restart

Paste the following into your relevant apache VirtualHost directive. Change the port numbers (highlighted below) to the port you chose installing Sockey.

    RewriteEngine On
    RewriteCond %{REQUEST_URI}  ^/socket.io            [NC]
    RewriteCond %{QUERY_STRING} transport=websocket    [NC]
    RewriteRule /(.*)           ws://localhost:8081/$1 [P,L]

    ProxyPass        /socket.io http://localhost:8081/socket.io
    ProxyPassReverse /socket.io http://localhost:8081/socket.io

_Note:_ There is an example for you in the _init/apache2_ directory you can use in a pinch.

### Step 3 (optional): Upstart Setup

If your server supports upstart, you can use the template in the _init/upstart_ directory to have the process start up automatically after every system restart.

### Step 4 (optional): Test client Setup

If you quickly want to test the client functionality, there is a sliver of a client in the client directory for you to use. Also do the following to ensure you have socket.io installed for the client:

    cd <some>/<place>/sockey/client
    npm install

## Usage

### Step 1: Create a route

First, edit your routes file.

    vim lib/routes.js

Then, change the example route or add a new object to the routes array.

### Step 2: Create a controller

    touch controllers/test.js
    vim controllers/test.js

Add the following code to your test.js controller file:

```javascript
exports = module.exports = function(io,socket,opt,sock,callback) {

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

#### Example socket emit in a controller function:

```javascript
socket.emit(sock+opt.socket.data,{
    "message":"Recieved Example Request",
    "request-socket":sock,
});
```

#### Example for timers and intervals in a controller function:

```javascript
// INTERVALS: This is how you do Intervals
var interval = setInterval(function(){

    socket.broadcast.emit(sock+opt.socket.data,{
        "message":"Global Timed Emit To Everyone But User Every 5 seconds"
    });

},5000);
dataCallback.intervals.push(interval);

// TIMEOUTS: This is how you do Timeouts
var timeout = setTimeout(function(){

    io.emit(sock+opt.socket.data,{"message":"Global Emit To Everyone After 10 seconds"});

},10000);
dataCallback.timers.push(timeout);
```

For more information on how sockets work and how to use them, see the [socket.io documentation](http://socket.io/).

### Step 3 (optional): Create your models

Models are always objects in Sockey. Create your model like so:

    touch models/test-model.js
    vim models/test-model.js

Then add the following to the test-model.js model file:

```javascript
exports = {};
```

Fill the object with your required models (functions and variables for database connection and interaction).

In your controller you can initialize the model thusly:

```javascript
var testmodel = require('../models/test-model');
```

### Step 4 (optional): Adding globally required libraries

...TBD... 