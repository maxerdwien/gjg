var GlucosePickup = function(x, y) {
	
	this.bb = new BoundingBox(x, y, 10, 10);
	
	this.glucose_amount = 15;
	this.health_amount = 1;
	this.feed_amount = 40;
}

GlucosePickup.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.bb.x - gx, this.bb.y - gy, this.bb.width, this.bb.height);
		ctx.fillStyle = 'brown';
		ctx.fill();
		ctx.restore();
	},
}