'use strict';

var container,
    camera,
    scene,
    renderer,
    controls,
    projector,
    selected          = {},
    people            = [],
    buildingLocations = [],
    tweens            = [],
    i;

var squareSize  = 50,
    gridSquares = 20,
    gridSize    = squareSize * gridSquares,
    planeHeight = squareSize;

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  //ortho camera appears to not be fully compatible with orbitcontrols (zoom doesn't work), so we're using a perspective camera with a super shallow field of view
  //camera = new THREE.OrthographicCamera( window.innerWidth / - 1.5, window.innerWidth / 1.5, window.innerHeight / 1.2, window.innerHeight / - 1.5, - 1000, 100000 );
  camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 200000 );
  camera.position.x = 4000;
  camera.position.y = 3000;
  camera.position.z = 4000;

  scene = new THREE.Scene();

  // ====== Grid ================

  //plane
  var planeGeometry = new THREE.CubeGeometry(gridSize+13,planeHeight,gridSize+13);
  var planeMaterial = new THREE.MeshLambertMaterial({color:0x666666});
  var plane = new THREE.Mesh(planeGeometry,planeMaterial);
  plane.position.x = 0;
  plane.position.y = planeHeight / 2 * -1;
  plane.position.z = 0;
  scene.add(plane);

  //gridlines

  var gridOn = true;

  if (gridOn === true) {

    var lineGeometry = new THREE.Geometry();

    for ( i = - gridSize/2; i <= gridSize/2; i += squareSize ) {

      lineGeometry.vertices.push( new THREE.Vector3( - gridSize/2, 2, i ) );
      lineGeometry.vertices.push( new THREE.Vector3(   gridSize/2, 2, i ) );

      lineGeometry.vertices.push( new THREE.Vector3( i, 2, - gridSize/2 ) );
      lineGeometry.vertices.push( new THREE.Vector3( i, 2,   gridSize/2 ) );

    }

    var lineMaterial = new THREE.LineBasicMaterial( { color: 0x555555, opacity: 0.2 } );

    var line = new THREE.Line( lineGeometry, lineMaterial );
    line.type = THREE.LinePieces;
    scene.add( line );

  }

  // ====== Buildings ================

  var streetdim = Math.round(squareSize * 0.3);
  var buildingdim = squareSize - streetdim;

  var buildingGeometry = new THREE.CubeGeometry(buildingdim,squareSize,buildingdim);
  var buildingMaterial =  new THREE.MeshLambertMaterial( { color: 0x66ccff, transparent: true, opacity: 0.9} );

  for ( i = 0; i < 250; i++ ) {

    var cube = new THREE.Mesh( buildingGeometry, buildingMaterial);

    cube.scale.y = Math.floor( Math.random() * 5 + 1 );

    var loc = randomLoc(buildingLocations);

    cube.position.x = loc.x;
    cube.position.y = (cube.scale.y * squareSize) / 2;
    cube.position.z = loc.z;
    
    buildingLocations.push(loc);
    scene.add(cube);
  }

  // ====== put in some parks =====

  

  // ====== People ================

  for (i = 0; i < 300; i++) {

    people.push(newPerson());

  }
  for (i = 0; i < people.length; i++) {
    scene.add(people[i]);
  }

  // ====== People's Tweens ================

  for (i = 0; i < people.length; i++) {
    tweens.push(newTween(i));
    
  }

  // ====== Clouds ================

  var clouds = [];

  //let's make two of 'em for starters, not so procedural but whatever
  clouds.push(newCloud(
    [
      [0,0,0],
      [0,10,75],
      [-75,-10,75],
      [75,-10,0],
      [0,-10,-75]
    ]
  ));
  clouds.push(newCloud(
    [
      [0,0,0],
      [-75,10,-75],
      [-75,0,0],
      [-75,-10,75],
      [75,-10,0],
      [0,-10,-75]
    ]
  ));

  //set their location in the city and put 'em in the scene
  for (i = 0; i < clouds.length; i++) {

    //rando position
    clouds[i].position.x = randomCoordinate();
    clouds[i].position.y = 300;
    clouds[i].position.z = randomCoordinate();
    scene.add(clouds[i]);
  }

  // ====== Lights ================

  var ambientLight = new THREE.AmbientLight( 0x13 );
  scene.add( ambientLight );
  var lights = [];
  

  //We project one light at each side and alternate their brightness 
  //to create contrast between the sides without going TOO bright or TOO dark

  lights.push(new THREE.DirectionalLight( 0xbbbbbb ));
  lights[lights.length-1].position.x = 0.3;
  lights[lights.length-1].position.y = 0;
  lights[lights.length-1].position.z = 0;
  lights[lights.length-1].position.normalize();

  lights.push(new THREE.DirectionalLight( 0x444444 ));
  lights[lights.length-1].position.x = -0.3;
  lights[lights.length-1].position.y = 0;
  lights[lights.length-1].position.z = 0;
  lights[lights.length-1].position.normalize();

  lights.push(new THREE.DirectionalLight( 0xffffff ));
  lights[lights.length-1].position.x = 0;
  lights[lights.length-1].position.y = 0.7;
  lights[lights.length-1].position.z = 0.3;
  lights[lights.length-1].position.normalize();

  lights.push(new THREE.DirectionalLight( 0x999999 ));
  lights[lights.length-1].position.x = 0;
  lights[lights.length-1].position.y = 0;
  lights[lights.length-1].position.z = -0.3;
  lights[lights.length-1].position.normalize();

  for (i = 0; i < lights.length; i++) {
    scene.add( lights[i] );
  }

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );

  camera.lookAt( scene.position );

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  container.appendChild( renderer.domElement );

  // add click listener

  document.addEventListener( 'mousedown', objectClicked, false );
  projector = new THREE.Projector();

  window.addEventListener( 'resize', onWindowResize, false );

}

function randomLoc(occupiedCoordinates) {
  var loc;
  var gotloc = false;
  while (gotloc === false) {
    loc = makeLoc();
    gotloc = checkLocIsUnique(loc,occupiedCoordinates);
  }
  return loc;
}

function makeLoc() {
  return {x: Math.floor( ( Math.random() * gridSize - gridSize/2 ) / squareSize ) * squareSize + squareSize/2, z: Math.floor( ( Math.random() * gridSize - gridSize/2 ) / squareSize ) * squareSize + squareSize/2};
}

function checkLocIsUnique(xz,ar) {
  //returns true if unique, false if not
  var unique = true;
  if (ar.length > 0) {
    for (i = 0; i < ar.length; i++) {
      if (xz.x === ar[i].x && xz.z === ar[i].z) {
        unique = false;
        break;
      }
    }
  }
  return unique;
}

function newPerson() {
  var dim = 13;
  var personGeometry = new THREE.CubeGeometry(dim,dim,dim);
  var personMaterial = new THREE.MeshLambertMaterial( {color: 0xff00bb, transparent: true, opacity: 0.7} );
  var person = new THREE.Mesh( personGeometry, personMaterial);
  person.position = randomPersonPosition();
  person.speed = 0.05;
  return person;
}

function randomCoordinate() {
  //a random spot that falls right on the gridlines
  var coord = Math.round(Math.random() * gridSquares - (gridSquares / 2)) * squareSize;
  return coord;
}

function randomPersonPosition() {
  var pos = {};
  pos.x = randomCoordinate();
  pos.y = 8;
  pos.z = randomCoordinate();
  return pos;
}

function nextPersonPosition(pos) {
  //we want to move them in rows and files, not diagonals, so we'll only modify either the x or the z axis
  if (Math.round(Math.random()) === 0) {
    return {x:randomCoordinate(), y: pos.y, z: pos.z};
  } else {
    return {x: pos.x, y: pos.y, z: randomCoordinate()};
  }
}

function newCloud(positionArray) {
  var cloudCubeSize = 75;
  var cloudGeometry = new THREE.CubeGeometry(cloudCubeSize,cloudCubeSize,cloudCubeSize);
  var cloudMaterial = new THREE.MeshLambertMaterial( { color: 0xccccff, transparent:true, opacity:0.7} );
  //add a bunch of child cubes at the specified
  var cloud = new THREE.Object3D();
  for (i = 0; i < positionArray.length; i++) {
    cloud.add( new THREE.Mesh(cloudGeometry, cloudMaterial) );
    cloud.children[cloud.children.length-1].position.x = positionArray[i][0];
    cloud.children[cloud.children.length-1].position.y = positionArray[i][1];
    cloud.children[cloud.children.length-1].position.z = positionArray[i][2];
  }
  return cloud;
}

function newTween(i) {
  var tweenTo = nextPersonPosition(people[i].position);
  people[i].distToTween = people[i].position.x + people[i].position.z - tweenTo.x - tweenTo.z; //set a constant speed
  var tween = new TWEEN.Tween(people[i].position)
            .to(tweenTo, Math.abs(Math.round(people[i].distToTween / people[i].speed)))
            .onComplete(function(){
              newTween(i);
            });
  tween.start();
  return tween;
}

function objectClicked(event) {

  event.preventDefault();

  //here we're transforming the 2d mouse click into the 3d space, then drawing a ray from the camera at it and seeing if the ray hits anything
  var vector = new THREE.Vector3(
    (event.clientX / window.innerWidth) * 2 - 1,
    (event.clientY / window.innerHeight) * -2 + 1,
    0.5
  ); //nobody in the world appears to understand the z index value of the viewport, including the guy who wrote it: http://stackoverflow.com/questions/11036106/three-js-projector-and-ray-objects
  projector.unprojectVector(vector, camera);
  var ray = new THREE.Raycaster( camera.position, vector.sub(camera.position).normalize() );
  var intersects = ray.intersectObjects(people);
  // if it hits, log it and highlight the first object
  if (intersects.length > 0) {
    if (selected.target && selected.lastColor) {
      console.log(selected.lastColor);
      selected.target.material.color.setHex(selected.lastColor);
    }

    console.log(intersects[0].object.material.color);
    selected.target = intersects[0].object;
    selected.lastColor = intersects[0].object.material.color.getHex();
    intersects[0].object.material.color.setHex(0xffcc33);
  }

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

  requestAnimationFrame(animate);

  TWEEN.update();

  render();

}

function render() {

  //var timer = Date.now() * 0.0001;

  renderer.render( scene, camera );
  controls.update();

}

init();
animate();
