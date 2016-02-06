var Bullet = function(x, y, x_vel, y_vel) {
	this.bb = new BoundingBox(x, y, 16, 16);
	
	this.x_vel = x_vel;
	this.y_vel = y_vel;
}

Bullet.prototype = {
	update: function(et) {
		this.bb.x += this.x_vel;
		this.bb.y += this.y_vel;
	},
	
	render: function(ctx) {
		ctx.beginPath();
		ctx.arc(this.bb.x-this.bb.width/2-gx, this.bb.y-this.bb.height/2-gy, 8, 0, 6.29);
		ctx.fillStyle = 'red';
		ctx.fill();
	},
}