// Collision Detection Stuff
var BoundingBox = function(x, y, width, height)
{
	this.x = x;
	this.y = y;
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
	}
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
		while(stepper != 0)
		{
			if(stepper.data === data)
			{
				return false;
			}
			stepper = stepper.next;
		}
		this.first.next = new LLCell(data, this.first.next, this);
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
	this.width = Math.floor(WIDTH/granularity);
	this.height = Math.ceil(HEIGHT/granularity);
	this.granularity = granularity;
	this.cells = [];
	
	for(i = 0; i < this.width; i++)
	{
		this.cells[i] = [];
		for(j = 0; j < this.height; j++)
		{
			this.cells[i][j] = new LList();
		}
	}
}

CollisionGrid.prototype = {

	add: function(asteroid)
	{
		asteroid.arrx = Math.floor(asteroid.x / this.width);
		asteroid.arry = Math.floor(asteroid.y / this.height);
		var arrPos = (asteroid.arry * this.width) + asteroid.arrx;
		this.cells[arrPos].add(asteroid);
	},
	
	remove: function(asteroid, x, y)
	{
		var arrPos = (y * this.width) + x;
		this.cells[arrPos].remove(asteroid);
	},
	
	move: function(asteroid)
	{
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
				context.fillStyle = "rgba(255,0,0,.01)";
				context.fill();
			}
		}
	}
}
