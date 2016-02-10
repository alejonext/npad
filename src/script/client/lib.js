
require('angular-meditor');
require('angular-socket-io');

angular.module('pizarra',[
	'ng',
	'angular-meditor',
	'btford.socket-io'
])
.factory('socket', require('./socket.js'))
.controller('write', require('./write.js'))
.directive('drawing', require('./draw.js'));