var Vampire = function(x, y) {
	
	this.bb = new BoundingBox(x, y, 30, 30);
	
	this.speed = 3;
}

Vampire.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.bb.x, this.bb.y, this.bb.width, this.bb.height);
		ctx.fillStyle = 'purple';
		ctx.fill();
		
		ctx.restore();
	},
	
	update: function() {
		var delta_x = this.bb.x - game.player.bb.x;
		var delta_y = this.bb.y - game.player.bb.y;
		
		var angle = Math.atan2(delta_y, delta_x) + 3.14159;
		
		var x_vel = this.speed * Math.cos(angle);
		var y_vel = this.speed * Math.sin(angle);
		
		this.bb.x += x_vel;
		this.bb.y += y_vel;
	},
}