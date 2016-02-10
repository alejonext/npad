module.exports = function (socket, win){
	socket.on('reload', function (data) {
		if(data){
			win.location.reload();
		}
	});
	return {
		restrict: "A",
		link: function(scope, element){
			var ctx = element[0].getContext('2d');
			var color = '#000000';
			function draw(data){
				ctx.beginPath();
				// line from
				ctx.moveTo(data.lX, data.lY);
				// to
				ctx.lineTo(data.cX, data.cY);
				// color
				ctx.strokeStyle = data.color;
				// draw it
				ctx.stroke();
			}

			socket.on('drawing', draw);
			socket.on('color', function (c) {
				color = c;
			});
			// variable that decides if something should be drawn on mousemove
			var drawing = false;

			// the last coordinates before the current move
			var lastX;
			var lastY;

			// canvas reset
			function reset(){
				element[0].width = element[0].width; 
			}

			element.bind('mousedown', function(event){
				if(event.offsetX!==undefined){
					lastX = event.offsetX;
					lastY = event.offsetY;
				} else { // Firefox compatibility
					lastX = event.layerX - event.currentTarget.offsetLeft;
					lastY = event.layerY - event.currentTarget.offsetTop;
				}

				// begins new line
				

				drawing = true;
			});
			element.bind('mousemove', function(event){
				if(drawing){
					// get current mouse position
					if(event.offsetX!==undefined){
						currentX = event.offsetX;
						currentY = event.offsetY;
					} else {
						currentX = event.layerX - event.currentTarget.offsetLeft;
						currentY = event.layerY - event.currentTarget.offsetTop;
					}
					var data = {
						lX : lastX,
						lY : lastY,
						cX : currentX,
						cY : currentY ,
						color : color
					};

					socket.emit('draw', data);
					draw(data);
					// set current coordinates to last one
					lastX = currentX;
					lastY = currentY;
				}

			});
			element.bind('mouseup', function(event){
				// stop drawing
				drawing = false;
			});
			
		}
	};
}

module.exports.$inject = [ 'socket', '$window'];