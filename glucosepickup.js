var GlucosePickup = function(x, y) {
	
	this.bb = new BoundingBox(x, y, 10, 10);
	
	this.glucose_amount = 15;
	this.health_amount = 1;
}

GlucosePickup.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.bb.x, this.bb.y, this.bb.width, this.bb.height);
		ctx.fillStyle = 'brown';
		ctx.fill();
		ctx.restore();
	},
}