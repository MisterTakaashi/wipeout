var Ship = function(scene, position) {
  this.speed = 200;

  this.geometry = new THREE.BoxGeometry( 1000, 1000, 1000 );

	this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.position.set(position.x, position.y + this.geometry.parameters.height/2, position.z);

	scene.add(this.mesh);
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
