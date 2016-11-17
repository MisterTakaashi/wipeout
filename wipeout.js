"use strict"
var Wipeout = function(containerId, width, height){
	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	this.renderer.setSize( width, height );
	this.renderer.setClearColor( 0x000000 );
	this.container = document.getElementById( containerId );
	this.container.appendChild( this.renderer.domElement );
	this.width = width;
	this.height = height;

	window.addEventListener('resize', this.resize.bind(this), true);
	this.clear();
	this.animate();
};

Wipeout.prototype.clear = function() {
	this.scene = new THREE.Scene();
	this.sprites = [];

	this.trackLoader = new TrackLoader(this.scene, this.sprites);

	// Add Camera and controls for orbit
	this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 64, 2048576 );
	this.camera.position.set( 0, 10000, 50000 );
	this.camera.rotation.order = 'YZX';

	this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
	this.controls.damping = 0.2;
	this.controls.zoomSpeed = 2;

	this.sceneMaterial = {};
	this.trackMaterial = null;
	this.weaponTileMaterial = null;

	this.startTime = Date.now();
	this.ticks = 0;
};

Wipeout.prototype.loadRace = function(path, hasTEXFile) {
	var that = this;
	viewer.trackLoader.loadTrack(path, hasTEXFile, function(files) { that.placePilots(); });
}

Wipeout.prototype.placePilots = function() {
	var finishLine = this.trackLoader.finishLine;

	var geometry = new THREE.BoxGeometry( 1000, 1000, 1000 );
	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	var cube = new THREE.Mesh( geometry, material );
	console.log(finishLine);
	cube.position.set(finishLine.x, finishLine.y, finishLine.z);
	console.log(cube.position);
	this.scene.add( cube );
}

Wipeout.prototype.resize = function() {
	this.width = window.innerWidth;
	this.height = window.innerHeight;

	this.camera.aspect = this.width / this.height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize( window.innerWidth, window.innerHeight );
}

Wipeout.prototype.animate = function() {
	requestAnimationFrame( this.animate.bind(this) );
	var time = Date.now();

	// Update weapon tile color
	if(this.weaponTileMaterial) {
		this.updateWeaponMaterial(time);
	}

	// Default Orbit camera
	this.controls.update();
	this.rotateSpritesToCamera(this.camera);
	this.renderer.render( this.scene, this.camera );
};

Wipeout.prototype.rotateSpritesToCamera = function(camera) {
	for( var i = 0; i < this.sprites.length; i++ ) {
		this.sprites[i].rotation.y = camera.rotation.y;
	}
};

Wipeout.prototype.updateWeaponMaterial = function(time) {
	// Purple -> blue -> cyan -> yellow -> amber (never 100% red or green)
	var colors = [0x800080, 0x0000ff, 0x00ffff, 0xffff00, 0xff8000];
	var t = time / 1050;
	var index = Math.floor(t);
	var alpha = t - index;

	var colorA = new THREE.Color(colors[index%colors.length]);
	var colorB = new THREE.Color(colors[(index+1)%colors.length]);
	this.weaponTileMaterial.color = colorA.lerp(colorB, alpha).multiplyScalar(1.5);
};

// Only two tracks usefull for dev
Wipeout.Tracks = {};
Wipeout.Tracks.Wipeout = [
	{path: "WIPEOUT/TRACK02", name: "Altima VII - Venom"},
	{path: "WIPEOUT/TRACK03", name: "Altima VII - Rapier"},
	// {path: "WIPEOUT/TRACK04", name: "Karbonis V - Venom"},
	// {path: "WIPEOUT/TRACK05", name: "Karbonis V - Rapier"},
	// {path: "WIPEOUT/TRACK01", name: "Terramax - Venom"},
	// {path: "WIPEOUT/TRACK06", name: "Terramax - Rapier"},
	// {path: "WIPEOUT/TRACK12", name: "Korodera - Venom"},
	// {path: "WIPEOUT/TRACK07", name: "Korodera - Rapier"},
	// {path: "WIPEOUT/TRACK08", name: "Arridos IV - Venom"},
	// {path: "WIPEOUT/TRACK11", name: "Arridos IV - Rapier"},
	// {path: "WIPEOUT/TRACK09", name: "Silverstream - Venom"},
	// {path: "WIPEOUT/TRACK13", name: "Silverstream - Rapier"},
	// {path: "WIPEOUT/TRACK10", name: "Firestar - Venom"},
	// {path: "WIPEOUT/TRACK14", name: "Firestar - Rapier"}
];

Wipeout.Tracks.Wipeout2097 = [
	// {path: "WIPEOUT2/TRACK01", name: "Talon's Reach", hasTEXFile: true},
	// {path: "WIPEOUT2/TRACK08", name: "Sagarmatha", hasTEXFile: true},
	// {path: "WIPEOUT2/TRACK13", name: "Valparaiso", hasTEXFile: true},
	// {path: "WIPEOUT2/TRACK20", name: "Phenitia Park", hasTEXFile: true},
	// {path: "WIPEOUT2/TRACK02", name: "Gare d'Europa", hasTEXFile: true},
	// {path: "WIPEOUT2/TRACK17", name: "Odessa Keys", hasTEXFile: true},
	// {path: "WIPEOUT2/TRACK06", name: "Vostok Island", hasTEXFile: true},
	// {path: "WIPEOUT2/TRACK07", name: "Spilskinanke", hasTEXFile: true},
	// {path: "WIPEOUT2/TRACK04", name: "Unfinished Track"},
];
