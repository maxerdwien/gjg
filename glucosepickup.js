var GlucosePickup = function(x, y) {
	this.x = x;
	this.y = y;
	
	this.sidelength = 10;
	
	this.glucose_amount = 15;
	this.health_amount = 1;
	this.feed_amount = 40;
}

GlucosePickup.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.x-gx, this.y-gy, this.sidelength, this.sidelength);
		ctx.fillStyle = 'brown';
		ctx.fill();
		ctx.restore();
	},
}