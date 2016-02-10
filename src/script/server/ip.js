var os = require('os');
module.exports = function () {
	var res = { ip :[] };
	var ifaces = os.networkInterfaces();
	Object.keys(ifaces).forEach(function (ifname) {
		var alias = 0;

		ifaces[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
				return;
			}

			if (alias >= 1) {
				res[ifname + ':' + alias] = iface.address;
			} else {
				res[ifname] = iface.address;
			}
			res.ip.push(iface.address);
		    ++alias;
		});
	});

	return res;
};
module.exports.$inject = [];