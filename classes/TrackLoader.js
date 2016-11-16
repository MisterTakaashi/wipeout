"use strict"

var TrackLoader = function(path, loadTEXFile){
  var that = this;
	this.loadBinaries({
		textures: path+'/SCENE.CMP',
		objects: path+'/SCENE.PRM'
	}, function(files) { that.createScene(files); });

	this.loadBinaries({
		textures: path+'/SKY.CMP',
		objects: path+'/SKY.PRM'
	}, function(files) { that.createScene(files, {scale:48}); });


	var trackFiles = {
		textures: path+'/LIBRARY.CMP',
		textureIndex: path+'/LIBRARY.TTF',
		vertices: path+'/TRACK.TRV',
		faces: path+'/TRACK.TRF',
		sections: path+'/TRACK.TRS'
	};

	if( loadTEXFile ) {
		trackFiles.trackTexture = path+'/TRACK.TEX';
	}

	this.loadBinaries(trackFiles, function(files) { that.createTrack(files); });
}
