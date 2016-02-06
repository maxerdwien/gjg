var Vampire = function(x, y) {
	
	this.bb = new BoundingBox(x, y, 30, 30);
	
	this.speed = 3;
	
	this.glucose_amount = 10;
	
	this.aggro_radius = 300;
	
	this.aggro = false;
}

Vampire.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.bb.x - gx, this.bb.y - gy, this.bb.width, this.bb.height);
		ctx.fillStyle = 'purple';
		ctx.fill();
		
		// render aggro range for playtesting
		ctx.beginPath();
		ctx.arc(this.x-gx, this.y-gy, this.aggro_radius, 0, 6.29);
		ctx.stroke();
		
		ctx.restore();
	},
	
	update: function() {

		var dist = Math.sqrt(Math.pow(this.bb.x-game.player.bb.x, 2) + Math.pow(this.bb.y-game.player.bb.y, 2));
		this.aggro = (dist < this.aggro_radius);
		if (this.aggro) {
			var delta_x = this.bb.x - game.player.bb.x;
			var delta_y = this.bb.y - game.player.bb.y;
			
			var angle = Math.atan2(delta_y, delta_x) + 3.14159;
			
			var x_vel = this.speed * Math.cos(angle);
			var y_vel = this.speed * Math.sin(angle);
			
			this.bb.x += x_vel;
			this.bb.y += y_vel;
		}

	},
}