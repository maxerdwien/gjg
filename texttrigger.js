var TextTrigger = function(x, y, sprite, scene) {
	this.bb = new BoundingBox(x, y, 64, 64);
	
	this.trigger_scene = scene;
	
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