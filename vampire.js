var Vampire = function(x, y) {
	this.x = x;
	this.y = y;
	
	this.sidelength = 30;
	
	this.speed = 3;
	
	this.glucose_amount = 10;
	
	this.aggro_radius = 300;
	
	this.aggro = false;
}

Vampire.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.x-this.sidelength/2-gx, this.y-this.sidelength/2-gy, this.sidelength, this.sidelength);
		ctx.fillStyle = 'purple';
		ctx.fill();
		
		// render aggro range for playtesting
		ctx.beginPath();
		ctx.arc(this.x-gx, this.y-gy, this.aggro_radius, 0, 6.29);
		ctx.stroke();
		
		ctx.restore();
	},
	
	update: function() {
		var dist = Math.sqrt(Math.pow(this.x-game.player.x, 2) + Math.pow(this.y-game.player.y, 2));
		this.aggro = (dist < this.aggro_radius);
		if (this.aggro) {
			var delta_x = this.x - game.player.x;
			var delta_y = this.y - game.player.y;
			
			var angle = Math.atan2(delta_y, delta_x) + 3.14159;
			
			var x_vel = this.speed * Math.cos(angle);
			var y_vel = this.speed * Math.sin(angle);
			
			this.x += x_vel;
			this.y += y_vel;
		}
	},
}