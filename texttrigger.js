var TextTrigger = function(x, y, sprite, state) {
	this.bb = new BoundingBox(x, y, 64, 64);
	
	this.trigger_state = state;
	
	this.triggered = false;
}

TextTrigger.prototype = {
	render: function(ctx) {
		ctx.beginPath();
		ctx.rect(this.bb.x-gx, this.bb.y-gy, 64, 64);
		ctx.fillStyle = 'black';
		ctx.fill();
	}
}