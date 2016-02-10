var _ = require('underscore');
var express = require('express');
var path = require('path');
var fs = require('fs');
var write = '<h1>Mi historia compatida</h1><p>Y el texto!</p>';
var colors = [ '000000', 
'000033', 
'000066', 
'000099', 
'0000CC', 
'0000FF', 
'0000FF', 
'003300', 
'003333', 
'003366', 
'003399', 
'0033CC', 
'0033FF', 
'006600', 
'006633', 
'006666', 
'006699', 
'0066CC', 
'0066FF', 
'009900', 
'009933', 
'009966', 
'009999', 
'0099CC', 
'0099FF', 
'00CC00', 
'00CC33', 
'00CC66', 
'00CC99', 
'00FF00', 
'00FFFF', 
'808080', 
'FF0000', 
'FFFF00' ];

function admin (face) {
	this.IP = [];
	this.run = false;
	this.app = express();
	this.PORT = 8080;
	this.IP = face.ip;

	this.app.use('/public', express.static( './public' ));
	this.serv = require('http').Server(this.app);
	this.io = require('socket.io')(this.serv);
	this.io.on('connection', function(socket) {
		socket.on('write', function (data) {
			write = data;
			socket.broadcast.emit('now:write', write);
		});
		socket.on('draw', function (data) {
			socket.broadcast.emit('drawing', data);
		});

		if(write.length > 2){
			socket.emit('now:write', write);
			socket.emit('color', '#' + _.sample(colors));
		}
	}); 

	var that = this;
	that.app.use('/', function (req, res) {
		res.set('Content-Type', 'text/html');
		res.send(that.datas);
	});
}

admin.prototype.toggleServer = function() {
	if(!this.selectOr){
		this.selectOp('text');
	}

	if(!this.run){
		this.run = !this.run;
		this.serv.listen(this.PORT);
	} else {
		this.io.emit('reload', true);
	}
};

admin.prototype.selectOp = function (data) {
	this.selectOr = data;
	var urs = path.join( './' + data + '.html' );
	this.datas = fs.readFileSync(urs);
};

admin.$inject = [ 'IP' ];

angular.module('pizarra',[])
.service('IP', require('./public/ip.js'))
.controller('admin', admin)