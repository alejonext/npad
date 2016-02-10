function write (socket, win) {
	this.socket = socket;
	this.contents = '';
	var that = this;
	this.socket.on('now:write', function (data) {
		that.contents = data;
	});
	this.socket.on('reload', function (data) {
		if(data){
			win.location.reload();
		}
	});
}

write.prototype.getKey = function() {
	this.socket.emit('write', this.contents);
};

write.$inject = [ 'socket', '$window' ];

module.exports = write;