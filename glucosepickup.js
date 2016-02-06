var GlucosePickup = function(x, y) {
	this.x = x;
	this.y = y;
	
	this.sidelength = 10;
	
	this.glucose_amount = 15;
	this.health_amount = 1;
}

GlucosePickup.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.sidelength, this.sidelength);
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.restore();
	},
}