
function drawcity() {
	var elem = document.getElementById('draw');
	var params = {fullscreen:true, autostart:true};
	var two = new Two(params).appendTo(elem);
	var mapsize = {x:5,y:5};
	var building_proportion = 0.2
	if (mapsize.x / two.width > mapsize.y / two.height) {
		var buildingsize = two.width / mapsize.x * building_proportion;
	} else {
		var buildingsize = two.height / mapsize.y * building_proportion;
	}

	function make_map(mapsize, buildingsize) {
		var places = [];
		for (var i=1;i<=mapsize.x;i++) {
			for (var j=1;j<=mapsize.y;j++) {
				var place = {x: i, y: j}
				places += place;
			}
		}
	}

	function xy_translate(xy) {

	}

	function draw_map(map) {
		for (place in map) {
			coords = 
			var rect = two.makeRectangle(coords.x - buildingsize / 2,100,buildingsize,buildingsize);
			rect.fill = 'rgb(0, 200, 255)';
			rect.opacity = 0.35;
			rect.noStroke();
		}
	}


	var map = map();
	draw_map(map);

	var circle = two.makeCircle(72,100,50);
	var rect = two.makeRectangle(213,100,100,100);
	circle.fill = '#FF8000';
	circle.stroke = 'orangered'; // Accepts all valid css color
	circle.linewidth = 5;

	rect.fill = 'rgb(0, 200, 255)';
	rect.opacity = 0.75;
	rect.noStroke();

	two.update();
}