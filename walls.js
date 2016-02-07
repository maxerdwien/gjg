//walls
var Wall = function(x, y, grid) {
	
	this.bb = new BoundingBox(x, y, 128, 128);
	this.cells = [];
	this.cGrid = grid;
	
}
