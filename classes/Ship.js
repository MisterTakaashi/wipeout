var Ship = function(scene, position) {
  this.speed = 200;

  this.geometry = new THREE.BoxGeometry( 1000, 1000, 1000 );

	this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

  var that = this;

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath( 'models/' );
	mtlLoader.load( 'Feisar_Ship.mtl', function( materials ) {
    materials.preload();
	  var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
    console.log(materials);
		objLoader.setPath( 'models/' );
		objLoader.load( 'Feisar_Ship.obj', function ( object ) {
      that.mesh = null;
      that.mesh = object.children[0]
      that.mesh.position.set(position.x, position.y + that.geometry.parameters.height/2, position.z);
      console.log(that.mesh);
      that.mesh.scale.set(3, 3, 4);
			scene.add( that.mesh );

      boxColliderGeometry = new THREE.BoxGeometry( 250, 50, 300 );
      boxColliderMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
      boxColliderMesh = new THREE.Mesh( boxColliderGeometry, boxColliderMaterial );
      boxColliderMesh.position.y = 28;
      boxColliderMesh.material.visible = false;
      that.mesh.add(boxColliderMesh);

      that.colliderBox = that.mesh.children[0];

      that.setControls();

      // var material = new THREE.LineBasicMaterial({
      // 	color: 0x0000ff
      // });
      //
      // var geometry = new THREE.Geometry();
      // for (var vertexIndex = 0; vertexIndex < that.colliderBox.geometry.vertices.length; vertexIndex++)
    	// {
      //   var localVertex = that.colliderBox.geometry.vertices[vertexIndex].clone();
      //   var globalVertex = localVertex.applyMatrix4( that.colliderBox.matrix );
    	// 	var directionVector = globalVertex.sub( that.colliderBox.position );
      //
      //   geometry.vertices.push(
      //     globalVertex.clone()
      //   );
      // }
      //
      // var line = new THREE.Line( geometry, material );
      // scene.add( line );
      //
      // line.position.set(that.mesh.position.x, that.mesh.position.y - 130, that.mesh.position.z);
      // line.scale.set(3, 3, 3);
		});
	});

	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.position.set(position.x, position.y + this.geometry.parameters.height/2, position.z);

	// scene.add(this.mesh);

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

  this.controls.enabled = true;
};

Ship.prototype.move = function() {
  this.collisions();

  if (!this.controls || !this.controls.enabled){
    return;
  }

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
    this.mesh.position.y = this.mesh.position.y - (floorResult[0].distance - 500) - 300;

    if (this.lastFaceIndex == undefined || this.lastFaceIndex != floorResult[0].faceIndex){
      // console.log(floorResult[0]);
      this.lastFaceIndex = floorResult[0].faceIndex;
    }
  }

  var originPoint = this.mesh.position.clone();
  // Model positon is 200px under parent position
  originPoint.y -= 200;

  if (this.colliderBox == undefined){
    return;
  }

  for (var vertexIndex = 0; vertexIndex < this.colliderBox.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = this.colliderBox.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( this.colliderBox.matrix );
		var directionVector = globalVertex.sub( this.colliderBox.position );

    // console.log(localVertex);
    // console.log(globalVertex);
    // console.log(directionVector);

		var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
		var collisionResults = ray.intersectObject(obstacles);
		if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() && collisionResults[0].face.isTrack != true){
      this.isInCollision = true;
      console.log(collisionResults[0]);
      for (var i = 0; i < collisionResults[0].object.material.materials.length; i++) {
        collisionResults[0].object.material.materials[i].color.set( 0xff0000 );
      }

      // console.log(collisionResults[0]);

      this.controls.up = false;
    }
	}

  if (!this.isInCollision){
    for (var i = 0; i < Wipeout.track.mesh.material.materials.length; i++) {
      Wipeout.track.mesh.material.materials[i].color.set( 0xffffff );
    }
  }
}
