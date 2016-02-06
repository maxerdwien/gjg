var InsulinPickup = function(x, y) {
	
	this.bb = new BoundingBox(x, y, 64, 64);
	
	this.insulin_amount = 10;
}

InsulinPickup.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.drawImage(Resource.Image.insulin, this.bb.x - this.bb.width/2 - gx, this.bb.y - this.bb.height/2 - gy, 64, 64);
		ctx.restore();
	},
}