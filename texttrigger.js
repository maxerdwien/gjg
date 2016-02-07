var TextTrigger = function(x, y, sprite, scene, size, heal) {
	this.bb = new BoundingBox(x, y, size, size);
	
	this.sprite = sprite;
	
	this.trigger_scene = scene;
	
	this.triggered = false;
	
	this.heal = heal;
}

TextTrigger.prototype = {
	render: function(ctx) {
		ctx.drawImage(this.sprite, this.bb.x-gx, this.bb.y-gy, this.bb.width, this.bb.height);
	}
}