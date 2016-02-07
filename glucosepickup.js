var GlucosePickup = function(x, y) {
	
	this.bb = new BoundingBox(x, y, 64, 64);
	this.cells = [];
	
	this.glucose_amount = 15;
	this.health_amount = 1;
	this.feed_amount = 40;
}

GlucosePickup.prototype = {
	render: function(ctx) {
		ctx.drawImage(Resource.Image.fastfood, this.bb.x - gx, this.bb.y - gy, 64, 64);
	},
}