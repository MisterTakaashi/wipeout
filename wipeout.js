"use strict"
var Wipeout = function(containerId, width, height){
	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	this.renderer.setSize( width, height );
	this.renderer.setClearColor( 0x000000 );
	this.container = document.getElementById( containerId );
	this.container.appendChild( this.renderer.domElement );
	Wipeout.width = width;
	Wipeout.height = height;

	window.addEventListener('resize', this.resize.bind(this), true);
	this.clear();
	this.animate();
};

Wipeout.prototype.clear = function() {
	this.scene = new THREE.Scene();
	this.sprites = [];

	var light = new THREE.AmbientLight( 0xffffff ); // soft white light
	this.scene.add( light );

	this.trackLoader = new TrackLoader(this.scene, this.sprites);

	// Add Camera and controls for orbit
	Wipeout.camera = new THREE.PerspectiveCamera( 45, Wipeout.width / Wipeout.height, 64, 2048576 );
	// Wipeout.camera.position.set( 0, 10000, 50000 );
	// Wipeout.camera.rotation.order = 'YZX';

	// Wipeout.orbitControls = new THREE.OrbitControls( Wipeout.camera, this.renderer.domElement );
	// Wipeout.orbitControls.damping = 0.2;
	// Wipeout.orbitControls.zoomSpeed = 2;

	this.sceneMaterial = {};
	this.trackMaterial = null;
	this.weaponTileMaterial = null;

	this.startTime = Date.now();
	this.ticks = 0;

	window.scene = this.scene;
	window.THREE = THREE;
};

Wipeout.prototype.loadRace = function(path, hasTEXFile) {
	var that = this;
	viewer.trackLoader.loadTrack(path, hasTEXFile, function(files) { that.placePilots(); });
}

Wipeout.prototype.placePilots = function() {
	var finishLine = this.trackLoader.finishLine;

	this.playerShip = new Ship(this.scene, finishLine);
	// this.playerShip.setControls();

	// Wipeout.camera.position.x = this.playerShip.mesh.position.x;
	// Wipeout.camera.position.y = this.playerShip.mesh.position.y + 1200;
	// Wipeout.camera.position.z = this.playerShip.mesh.position.z + 4000;
}

Wipeout.prototype.resize = function() {
	Wipeout.width = window.innerWidth;
	Wipeout.height = window.innerHeight;

	Wipeout.camera.aspect = Wipeout.width / Wipeout.height;
	Wipeout.camera.updateProjectionMatrix();

	this.renderer.setSize( window.innerWidth, window.innerHeight );
}

Wipeout.prototype.animate = function() {
	requestAnimationFrame( this.animate.bind(this) );
	var time = Date.now();

	// Update weapon tile color
	if(this.weaponTileMaterial) {
		this.updateWeaponMaterial(time);
	}

	if (this.playerShip){
		this.playerShip.move();
	}
	this.rotateSpritesToCamera(Wipeout.camera);
	this.renderer.render( this.scene, Wipeout.camera );
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
