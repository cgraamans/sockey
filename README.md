# Sockey
Sockey is a Server-side socket.io MVC Framework

## MVC
Sockey attempts to conform to the classic definition of an MVC Framework. MVC stands for Model, View, Controller. To make a well structured application you need all three of those components.

- A view traditionally denotes what the user sees; the HTML, Javascript and CSS required for the user's interactive experience
- A model creates a connection to the database and manages the data going to and from the database.
- A controller manages the flow of information between the view and the model.

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
    RewriteRule /(.*)           ws://localhost:_8081_/$1 [P,L]

    ProxyPass        /socket.io http://localhost:_8081_/socket.io
    ProxyPassReverse /socket.io http://localhost:_8081_/socket.io

_Note:_ There is an example for you in the _init/apache2_ directory you can use in a pinch.

### Step 3 (optional): Upstart Setup

If your server supports upstart, you can use the template in the _init/upstart_ directory to have the process start up automatically after every system restart.

### Step 4 (optional): Test client Setup

If you quickly want to test the client functionality, there is a template in the _init/apache2_ directory for you to use for setting up the test client. Also do the following to ensure you have socket.io installed:

    cd <some>/<place>/sockey/client
    npm install

## Usage

.. TBD ..