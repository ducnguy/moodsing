//AUDIOOBJECT
DMN_Audio = function(listener) {
    THREE.Audio.call(this,listener);
};

DMN_Audio.loaded_count = 0;
DMN_Audio.allSounds = [];
DMN_Audio.playAllSounds = function() {
    for (var i = 0; i < DMN_Audio.allSounds.length; i++){
        console.log(DMN_Audio.allSounds)
        DMN_Audio.allSounds[i].play()
    }
}

DMN_Audio.prototype = Object.create(THREE.Audio.prototype)

DMN_Audio.prototype.load = function ( file ) {//override load() wait for all files before playing
    var scope = this;
    var request = new XMLHttpRequest();
    request.open( 'GET', file, true );
    request.responseType = 'arraybuffer';
    request.onload = function ( e ) {

        scope.context.decodeAudioData( this.response, function ( buffer ) {
            scope.source.buffer = buffer;
            scope.source.connect( scope.panner );
            DMN_Audio.loaded_count++;
            DMN_Audio.allSounds.push(scope)
            if (DMN_Audio.loaded_count>=3) {
                DMN_Audio.playAllSounds();
            }
        } );

    };
    request.send();
    return this;
};

DMN_Audio.prototype.play = function ( file ) {
    var scope = this;
    scope.source.start( 0 );
};
