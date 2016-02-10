module.exports = function (farme) {
	return farme({
			ioSocket: require('socket.io-client').connect()
		});
}

module.exports.$inject = ['socketFactory'];