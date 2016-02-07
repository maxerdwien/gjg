var Needle = function(x, y, x_vel, y_vel) {
	this.bb = new BoundingBox(x, y, 64, 64);
	
	this.x_vel = x_vel;
	this.y_vel = y_vel;
}

Needle.prototype = {
	update: function(et) {
		this.bb.x += this.x_vel;
		this.bb.y += this.y_vel;
	},
	
	render: function(ctx) {
		ctx.save();
		if (this.x_vel == 0) {
			if (this.y_vel < 0) {
				ctx.drawImage(Resource.Image.insulin_straight, this.bb.x-gx, this.bb.y-gy, this.bb.width, this.bb.height);
			}
			else {
				ctx.translate(this.bb.x + this.bb.width/2 - gx, this.bb.y + this.bb.height/2 - gy);
				ctx.rotate(Math.PI);
				ctx.drawImage(Resource.Image.insulin_straight, -this.bb.width/2, -this.bb.height/2, this.bb.width, this.bb.height);
			}
		}
		else if (this.x_vel < 0) {
			if (this.y_vel == 0) {
				ctx.translate(this.bb.x + this.bb.width/2 - gx, this.bb.y + this.bb.height/2 - gy);
				ctx.rotate(Math.PI*3/2);
				ctx.drawImage(Resource.Image.insulin_straight, -this.bb.width/2, -this.bb.height/2, this.bb.width, this.bb.height);
			}
			else if (this.y_vel < 0) {
				ctx.translate(this.bb.x + this.bb.width/2 - gx, this.bb.y + this.bb.height/2 - gy);
				ctx.rotate(Math.PI/2);
				ctx.drawImage(Resource.Image.insulin_diag, -this.bb.width/2, -this.bb.height/2, this.bb.width, this.bb.height);
			}
			else {
				ctx.drawImage(Resource.Image.insulin_diag, this.bb.x-gx, this.bb.y-gy, this.bb.width, this.bb.height);
			}
		}
		else {
			if (this.y_vel == 0) {
				ctx.translate(this.bb.x + this.bb.width/2 - gx, this.bb.y + this.bb.height/2 - gy);
				ctx.rotate(Math.PI/2);
				ctx.drawImage(Resource.Image.insulin_straight, -this.bb.width/2, -this.bb.height/2, this.bb.width, this.bb.height);
			}
			else if (this.y_vel < 0) {
				ctx.translate(this.bb.x + this.bb.width/2 - gx, this.bb.y + this.bb.height/2 - gy);
				ctx.rotate(Math.PI);
				ctx.drawImage(Resource.Image.insulin_diag, -this.bb.width/2, -this.bb.height/2, this.bb.width, this.bb.height);
			}
			else {
				ctx.translate(this.bb.x + this.bb.width/2 - gx, this.bb.y + this.bb.height/2 - gy);
				ctx.rotate(Math.PI*3/2);
				ctx.drawImage(Resource.Image.insulin_diag, -this.bb.width/2, -this.bb.height/2, this.bb.width, this.bb.height);
			}
		}
			
		ctx.restore();
	}
}