var Vampire = function(x, y) {
	
	this.bb = new BoundingBox(x, y, 64, 64);
	
	this.speed = 3;
	
	this.glucose_amount = 10;
	
	this.aggro_radius = 300;
	
	this.aggro = false;
	
	this.current_pose = 0;
	
	this.flap_timer_max = 100;
	this.flap_timer = 0;
}

Vampire.prototype = {
	render: function(ctx) {
		ctx.save();
		var pose = this.current_pose;
		if (this.aggro) {
			pose += 5;
		}
		ctx.drawImage(Resource.Image.vampire, pose*32, 0, 32, 32, this.bb.x - gx - this.bb.width/2, this.bb.y - gy - this.bb.height/2, 64, 64);
		
		// render aggro range for playtesting
		ctx.beginPath();
		ctx.arc(this.bb.x-gx, this.bb.y-gy, this.aggro_radius, 0, 6.29);
		ctx.stroke();
		
		ctx.restore();
	},
	
	update: function(et) {
		// sprite swap
		this.flap_timer += et;
		if (this.flap_timer > this.flap_timer_max) {
			this.flap_timer -= this.flap_timer_max;
			this.current_pose = (this.current_pose+1) % 4;
		}

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