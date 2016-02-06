var InsulinPickup = function(x, y) {
	this.x = x;
	this.y = y;
	
	this.sidelength = 10;
	
	this.insulin_amount = 10;
}

InsulinPickup.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.sidelength, this.sidelength);
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.restore();
	},
}