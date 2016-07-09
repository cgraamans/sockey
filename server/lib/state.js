module.exports = {

	emitters: {
		data:"",
		error:""
	},

	emit: function(msg) {

		return this.socket.emit(this.socketName + this.emitters.data,msg);

	},

	broadcast: function(msg) {

		return this.socket.broadcast.emit(this.socketName + this.emitters.data,msg);

	},

	error: function(msg) {

		return this.socket.emit(this.socketName + this.emitters.error,msg);

	}

};