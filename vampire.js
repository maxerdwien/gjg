var Vampire = function(x, y) {
	this.x = x;
	this.y = y;
	
	this.sidelength = 30;
	
	this.speed = 3;
}

Vampire.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.sidelength, this.sidelength);
		ctx.fillStyle = 'purple';
		ctx.fill();
		
		ctx.restore();
	},
	
	update: function() {
		var delta_x = this.x - game.player.x;
		var delta_y = this.y - game.player.y;
		
		var angle = Math.atan2(delta_y, delta_x) + 3.14159;
		
		var x_vel = this.speed * Math.cos(angle);
		var y_vel = this.speed * Math.sin(angle);
		
		this.x += x_vel;
		this.y += y_vel;
	},
}