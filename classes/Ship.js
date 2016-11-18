var Ship = function(scene, position) {
  this.speed = 200;

  this.geometry = new THREE.BoxGeometry( 1000, 1000, 1000 );

	this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.position.set(position.x, position.y + this.geometry.parameters.height/2, position.z);

	scene.add(this.mesh);

  this.caster = new THREE.Raycaster();
  this.isInCollision = false;
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

  var originPoint = this.mesh.position.clone();
  for (var vertexIndex = 0; vertexIndex < this.mesh.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = this.mesh.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( this.mesh.matrix );
		var directionVector = globalVertex.sub( this.mesh.position );

		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObject( obstacles );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
      console.log("Ok !");
      this.isInCollision = true;
      for (var i = 0; i < collisionResults[0].object.material.materials.length; i++) {
        collisionResults[0].object.material.materials[i].color.set( 0xff0000 );
      }
    }
	}

  if (!this.isInCollision){
    for (var i = 0; i < Wipeout.track.mesh.material.materials.length; i++) {
      Wipeout.track.mesh.material.materials[i].color.set( 0xffffff );
    }
  }
}
