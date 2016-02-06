var InsulinPickup = function(x, y) {
	
	this.bb = new BoundingBox(x, y, 10, 10);
	
	this.insulin_amount = 10;
}

InsulinPickup.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.bb.x, this.bb.y, this.bb.width, this.bb.height);
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.restore();
	},
}