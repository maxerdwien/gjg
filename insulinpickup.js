var InsulinPickup = function(x, y) {
	
	this.bb = new BoundingBox(x, y, 64, 64);
	this.cells = []
	
	this.insulin_amount = 10;
}

InsulinPickup.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.drawImage(Resource.Image.insulin_diag, this.bb.x - gx, this.bb.y - gy, 64, 64);
		ctx.restore();
	},
}