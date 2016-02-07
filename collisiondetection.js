// Collision Detection Stuff
var BoundingBox = function(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.lastx = 0;
	this.lasty = 0;
	this.width = width;
	this.height = height;
}

BoundingBox.prototype =
{
	min: function()
	{
		return { x:this.x, y:this.y};
	},
	max: function()
	{
		return { x:(this.x + this.width), y:(this.y + this.height)};
	},
	touching: function(bb)
	{
		if(this.x < bb.x + bb.width && this.y < bb.y + bb.height && this.x + this.width > bb.x && this.y + this.height > bb.y) return true;
		return false;
	},
	
	pointdistance: function(pt)
	{
		return dist = Math.sqrt(Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2));
	},
	
	wallcollide: function (object)
	{
		var centerx = this.x + this.width/2;
		var centery = this.y + this.height/2;
		var run1 = object.bb.x + object.bb.width - object.bb.x;
		var rise1 = object.bb.y + object.bb.height - object.bb.y;
		var atzero1 = object.bb.y - ((rise1/run1) * object.bb.x);
		var diagy1 = (rise1/run1) * centerx + atzero1;
		var atzero2 = (object.bb.y + object.bb.height) - ((-run1/rise1) * object.bb.x);
		var diagy2 = (-run1/rise1) * centerx + atzero2;
		
		if(centery > diagy1 && centery > diagy2) this.y = object.bb.y + object.bb.height;
		else if(centery >= diagy1 && centery <= diagy2) this.x = object.bb.x - this.width;
		else if(centery < diagy1 && centery < diagy2) this.y = object.bb.y - this.height;
		else if(centery < diagy1 && centery > diagy2) this.x = object.bb.x + object.bb.width;
		return;
	},
}

var LLCell = function(data, next, list)
{
	this.data = data;
	this.next = next;
	this.list = list;
}

var LList = function()
{
	this.count = 0;
	this.first = new LLCell(0, 0, this);
}

LList.prototype = {

	add: function(data)
	{
		stepper = this.first;
		while(stepper.next != 0)
		{
			if(stepper.data === data)
			{
				return false;
			}
			stepper = stepper.next;
		}
		stepper.next = new LLCell(data, 0, this);
		this.count++;
	},
	
	remove: function(data)
	{
		stepper = this.first;
		while(stepper.next != 0)
		{
			if(stepper.next.data === data)
			{
				stepper.next = stepper.next.next;
				this.count--;
				return true;
			}
			if(stepper.next != 0) stepper = stepper.next;
		}
		return false;
	},
	
	detectCollision: function(object)
	{
		var stepper = this.first.next;
		while(stepper != 0)
		{
			if(stepper != object)
			{
				if(object.bb.touching(stepper.data.bb)) return stepper.data;
				stepper = stepper.next;
			}
		}
		return null;
	}
}

var CollisionGrid = function(width, height, granularity)
{
	this.width = Math.ceil(width/granularity);
	this.height = Math.ceil(height/granularity);
	this.granularity = granularity;
	this.cells = [];
	
	for(i = 0; i < this.width; i++)
	{
		this.cells[i] = [];
		for(var j = 0; j < this.height; j++)
		{
			this.cells[i][j] = new LList();
		}
	}
}

CollisionGrid.prototype = {

	add: function(object)
	{
		var min = object.bb.min();
		var max = object.bb.max();
		for(var i = Math.floor(min.x/this.width); i <= Math.floor(max.x/this.width); i++)
		{
			for(var j = Math.floor(min.y/this.height); j <= Math.floor(max.y/this.height); j++)
			{
				this.cells[i][j].add(object);
				object.cells.push(this.cells[i][j]);
			}
		}
	},
	
	remove: function(object)
	{
		while(object.cells.length > 0)
		{
			var cell = object.cells.pop();
			cell.remove(object);
		}
	},
	
	move: function(object)
	{
		this.remove(object);
		this.add(object);
	},
	
	checkIfClose: function()
	{
		for(i = 0; i < this.cells.length; i++)
		{
			if(this.cells[i].count >= 2)
			{
				this.cells[i].detectCollision();
			}
		}
	},
	
	render: function(context)
	{
		for(i = 0; i < this.cells.length; i++)
		{
			if(this.cells[i].count > 0)
			{
				var y = i / this.width;
				var x = i % this.width;
				context.rect(x * this.width, y * this.height, this.width, this.height);
				context.fillStyle = "rgba(255,0,0,.1)";
				context.fill();
			}
		}
	}
}
