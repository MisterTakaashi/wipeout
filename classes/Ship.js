var Ship = function(scene, position) {
  this.speed = 200;

  this.geometry = new THREE.BoxGeometry( 1000, 1000, 1000 );

	this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.position.set(position.x, position.y + this.geometry.parameters.height/2, position.z);

	scene.add(this.mesh);

  this.isInCollision = false;

  var material = new THREE.LineBasicMaterial({
  	color: 0x0000ff
  });

  var geometry = new THREE.Geometry();
  for (var vertexIndex = 0; vertexIndex < this.mesh.geometry.vertices.length; vertexIndex++)
	{
    var localVertex = this.mesh.geometry.vertices[vertexIndex].clone();
    var globalVertex = localVertex.applyMatrix4( this.mesh.matrix );
		var directionVector = globalVertex.sub( this.mesh.position );

    geometry.vertices.push(
      globalVertex.clone()
    );
  }

  var line = new THREE.Line( geometry, material );
  scene.add( line );

  console.log(line.position);
  console.log(this.mesh.position);
  line.position.set(this.mesh.position.x * 2, this.mesh.position.y * 2, this.mesh.position.z * 2);
  console.log(line.position);

  // Comment fait pour aliner le vaisseau à la bonne hauteur:
  // Mettre un raycaster sous le vaisseau d'une hauteur conséquente (Debug avec un cube)
  // Tester sur toutes les boucles la collision avec ce raycaster et utiliser point (Vector3) de l'objet collisionné pour aligner la hauteur du vaisseau
}

Ship.prototype.setControls = function() {
  var keys = { LEFT: "q", UP: "z", RIGHT: "d", BOTTOM: "s" };

  this.controls = {
    left: false,
    up: false,
    right: false,
    bottom: false
  }

  var that = this;

  // Alignement pour la piste
  this.mesh.rotateY(Math.PI);

  window.addEventListener('keydown', function(event){
    switch (event.key) {
			case keys.UP:
        that.controls.up = true;
				break;
			case keys.BOTTOM:
        that.controls.bottom = true;
				break;
			case keys.LEFT:
        that.controls.left = true;
				break;
			case keys.RIGHT:
        that.controls.right = true;
				break;
		}
  }, false);

  window.addEventListener('keyup', function(event){
    switch (event.key) {
			case keys.UP:
        that.controls.up = false;
				break;
			case keys.BOTTOM:
        that.controls.bottom = false;
				break;
			case keys.LEFT:
        that.controls.left = false;
				break;
			case keys.RIGHT:
        that.controls.right = false;
				break;
		}
  }, false);
};

Ship.prototype.move = function() {
  this.collisions();

  if (this.controls.up) {
    this.mesh.translateZ(this.speed);
  }
  if (this.controls.bottom) {
    this.mesh.translateZ(-this.speed);
  }
  if (this.controls.left) {
    this.mesh.rotateY(Math.PI / 100);
  }
  if (this.controls.right) {
    this.mesh.rotateY(-Math.PI / 100);
  }
}

Ship.prototype.collisions = function() {
  var collisions;
  var i;
  var distance = 100;
  var obstacles = Wipeout.track.mesh;

  this.isInCollision = false;

  this.floorCaster = new THREE.Raycaster(this.mesh.position.clone(), new THREE.Vector3(0, -1, 0).normalize());

  // console.log(this.floorCaster);

  var floorResult = this.floorCaster.intersectObject(obstacles);
  if ( floorResult.length > 0 ){
    for (var i = 0; i < floorResult[0].object.material.materials.length; i++) {
      floorResult[0].object.material.materials[i].color.set( 0xff00ff );
    }
    this.isInCollision = true;
  }

  // var originPoint = this.mesh.position.clone();
  // for (var vertexIndex = 0; vertexIndex < this.mesh.geometry.vertices.length; vertexIndex++)
	// {
	// 	var localVertex = this.mesh.geometry.vertices[vertexIndex].clone();
	// 	var globalVertex = localVertex.applyMatrix4( this.mesh.matrix );
	// 	var directionVector = globalVertex.sub( this.mesh.position );
  //
  //   // console.log(localVertex);
  //   // console.log(globalVertex);
  //   // console.log(directionVector);
  //
	// 	var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
	// 	var collisionResults = ray.intersectObject( obstacles );
	// 	if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
  //     this.isInCollision = true;
  //     for (var i = 0; i < collisionResults[0].object.material.materials.length; i++) {
  //       collisionResults[0].object.material.materials[i].color.set( 0xff0000 );
  //     }
  //
  //     // console.log(collisionResults[0]);
  //
  //     this.controls.up = false;
  //   }
	// }

  if (!this.isInCollision){
    for (var i = 0; i < Wipeout.track.mesh.material.materials.length; i++) {
      Wipeout.track.mesh.material.materials[i].color.set( 0xffffff );
    }
  }
}
