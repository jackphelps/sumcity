var container;
var camera;
var scene;
var renderer;
var people = [];
var building_locations = [];
var tweens = [];
var controls;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.OrthographicCamera( window.innerWidth / - 1.5, window.innerWidth / 1.5, window.innerHeight / 1.1, window.innerHeight / - 1.5, - 1000, 100000 );
	camera.position.x = 200;
	camera.position.y = 100;
	camera.position.z = 200;

	scene = new THREE.Scene();

	// ====== Grid ================

	var size = 550, step = 50;
	//plane (thin cube looks better than actual plane when rotating around)
	var geometry = new THREE.CubeGeometry(size*2,1,size*2);
	var material = new THREE.MeshLambertMaterial({color:0x666666});
	var plane = new THREE.Mesh(geometry,material);
	plane.position.x = 0;
	plane.position.y = 0;
	plane.position.z = 0;
	scene.add(plane);

	//gridlines
	var geometry = new THREE.Geometry();

	for ( var i = - size; i <= size; i += step ) {

		geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

		geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

	}

	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );

	var line = new THREE.Line( geometry, material );
	line.type = THREE.LinePieces;
	scene.add( line );

	// ====== Buildings ================

	var geometry = new THREE.CubeGeometry(35,50,35);
	var material =	new THREE.MeshLambertMaterial( { color: 0x66ccff, transparent: true, opacity: 0.9} );

	for ( var i = 0; i < 250; i++ ) {

		var cube = new THREE.Mesh( geometry, material);

		cube.scale.y = Math.floor( Math.random() * 5 + 1 );

		var loc = random_loc(building_locations);

		cube.position.x = loc.x;
		cube.position.y = (cube.scale.y * 50) / 2;
		cube.position.z = loc.z;
		
		building_locations.push(loc);
		scene.add(cube);
	}

	// ====== People ================

	for (var i = 0; i < 300; i++) {

		people.push(new_person(geometry,material));

	}
	for (var i = 0; i<people.length; i++) {
		scene.add(people[i]);
	}

	// ====== People's Tweens ================

	for (var i = 0; i < people.length; i++) {
		tweens.push(new_tween(i));
		
	}

	// ====== Clouds ================

	var cloudsize = 75;
	var geometry = new THREE.CubeGeometry(cloudsize,cloudsize,cloudsize);
	var material =	new THREE.MeshLambertMaterial( { color: 0xccccff, transparent:true, opacity:0.7} );

		var cloud = new THREE.Object3D();
		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = 0;
		cube.position.y = 0;
		cube.position.z = 0;
		cloud.add(cube);

		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = 0;
		cube.position.y = 10;
		cube.position.z = 75;
		cloud.add(cube);

		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = -75;
		cube.position.y = -10;
		cube.position.z = 75;
		cloud.add(cube);

		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = 75;
		cube.position.y = -10;
		cube.position.z = 0;
		cloud.add(cube);

		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = 0;
		cube.position.y = -10;
		cube.position.z = -75;
		cloud.add(cube);

		cloud.position.x = Math.abs(random_coordinate());
		cloud.position.y = 300;
		cloud.position.z = Math.abs(random_coordinate());
		scene.add(cloud);

		var cloud2 = new THREE.Object3D();
		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = 0;
		cube.position.y = 0;
		cube.position.z = 0;
		cloud2.add(cube);

		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = -75;
		cube.position.y = 10;
		cube.position.z = -75;
		cloud2.add(cube);

		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = -75;
		cube.position.y = 0;
		cube.position.z = 0;
		cloud2.add(cube);

		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = -75;
		cube.position.y = -10;
		cube.position.z = 75;
		cloud2.add(cube);

		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = 75;
		cube.position.y = -10;
		cube.position.z = 0;
		cloud2.add(cube);

		var cube = new THREE.Mesh( geometry, material);
		cube.position.x = 0;
		cube.position.y = -10;
		cube.position.z = -75;
		cloud2.add(cube);

		cloud2.position.x = -Math.abs(random_coordinate());
		cloud2.position.y = 300;
		cloud2.position.z = -Math.abs(random_coordinate());
		scene.add(cloud2);


	// ====== Lights ================

	var ambientLight = new THREE.AmbientLight( 0x13 );
	scene.add( ambientLight );
	

	//We project one light at each side and alternate their brightness 
	//to create contrast between the sides without going TOO bright or TOO dark

	var directionalLight = new THREE.DirectionalLight( 0xbbbbbb );
	directionalLight.position.x = 0.3;
	directionalLight.position.y = 0;
	directionalLight.position.z = 0;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight( 0x333333 );
	directionalLight.position.x = -0.3;
	directionalLight.position.y = 0;
	directionalLight.position.z = 0;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.x = 0;
	directionalLight.position.y = 0.7;
	directionalLight.position.z = 0.3;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight( 0x999999 );
	directionalLight.position.x = 0;
	directionalLight.position.y = 0;
	directionalLight.position.z = -0.3;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize( window.innerWidth, window.innerHeight );

	camera.lookAt( scene.position );

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	container.appendChild( renderer.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );


}

function random_loc(occupied_coordinates) {
	var gotloc = false;
	while (gotloc == false) {
		var loc = make_loc();
		gotloc = check_loc_is_unique(loc,occupied_coordinates);
	}
	return loc;
}

function make_loc() {
	return {x: Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 25, z: Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 25};
}

function check_loc_is_unique(xz,ar) {
	//returns true if unique, false if not
	var unique = true;
	if (ar.length > 0) {
		for (var i = 0; i < ar.length; i++) {
			if (xz.x == ar[i].x && xz.z == ar[i].z) {
				unique = false;
				break;
			}
		}
	}
	return unique;
}

function new_person() {
		var dim = 13;
		var geometry = new THREE.CubeGeometry(dim,dim,dim);
		var material = new THREE.MeshLambertMaterial( {color: 0xff00bb, transparent: true, opacity: 0.6} );
		var person = new THREE.Mesh( geometry, material);
		person.position = random_person_position();
		person.speed = 0.05;
		return person;
} 

function random_coordinate() {
	//we generate a spot on the grid
	return Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 50;
}

function random_person_position() {
	var pos = {};
	pos.x = random_coordinate();
	pos.y = 8;
	pos.z = random_coordinate();
	return pos;
}

function next_person_position(pos) {
	//we want to move them in rows and files, not diagonals, so we'll only modify either the x or the z axis
	if (Math.round(Math.random()) == 0) {
		return {x:random_coordinate(), y: pos.y, z: pos.z};
	} else {
		return {x: pos.x, y: pos.y, z: random_coordinate()};
	}
}

function new_tween(i) {
	var tween_to = next_person_position(people[i].position);
	people[i].dist_to_tween = people[i].position.x + people[i].position.z - tween_to.x - tween_to.z; //set a constant speed
	var tween = new TWEEN.Tween(people[i].position)
					.to(tween_to, Math.abs(Math.round(people[i].dist_to_tween / people[i].speed)))
					.onComplete(function(){
						new_tween(i);
					});
	tween.start();
	return tween;
}

function onWindowResize() {

	camera.left = window.innerWidth / - 2;
	camera.right = window.innerWidth / 2;
	camera.top = window.innerHeight / 2;
	camera.bottom = window.innerHeight / - 2;

	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

	requestAnimationFrame( animate );

	//movestuff();

	TWEEN.update();

	render();

}

function render() {

	var timer = Date.now() * 0.0001;

	renderer.render( scene, camera );
	controls.update();

}