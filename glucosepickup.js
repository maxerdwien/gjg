var GlucosePickup = function(x, y) {
	
	this.bb = new BoundingBox(x, y, 10, 10);
	this.cells = []
	
	this.glucose_amount = 15;
	this.health_amount = 1;
	this.feed_amount = 40;
}

GlucosePickup.prototype = {
	render: function(ctx) {
		ctx.drawImage(Resource.Image.fastfood, this.bb.x - this.bb.width/2 - gx, this.bb.y - this.bb.height/2 - gy, 64, 64);
	},
}