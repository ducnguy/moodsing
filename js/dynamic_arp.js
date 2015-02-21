var root = 48;
var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var pentatonic = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var major = [0, 4, 7, 12, 16, 19, 24, 28, 31];
var minor = [0, 3, 7, 12, 15, 19, 24, 27, 31];
var harMinor = [0, 2, 3, 5, 7, 8, 11, 12, 14, 15, 17, 19, 20, 23, 24];
var sus = [0, 5, 7, 12, 17, 19, 24, 29, 31];
var minSev = [0, 3, 7, 10, 12, 15, 19, 22];
var octaves = [-24, -12, 0, 12, 24, 36, 48];
var direction = 0;

var arpActive = true;

// all arp effects
var arpStep = 0;
var arp = new Tone.FMSynth();
var pingPong = new Tone.PingPongDelay('8n');
pingPong.setFeedback(0.8);
arp.connect(pingPong);
arpFilter = new Tone.Filter();
pingPong.connect(arpFilter);
arpFilter.toMaster();
arpFilter.frequency.setValue(1500);

// all transport commands

/*Tone.Transport.loop = true;
Tone.Transport.setLoopStart('0:0');
Tone.Transport.setLoopEnd('2:0');
Tone.Transport.setBpm(100);
Tone.Transport.start();
Tone.Transport.setInterval(triggerArp, '16n');
/*
/*function triggerArp(time) {
  this.scale = harMinor;
  if (arpActive) {
    var n = midiToFreq(root + this.scale[arpStep % this.scale.length]);
    arp.triggerAttack(n, time, 1);
    arp.triggerRelease(n, time + arp.toSeconds('16n'));

    arpStep++;

  }
}*/

/*SEQUENCER TEST*/

var sequence = ["4n", "4n", "8n", "8n", "4n"];


// Various conversion functions

play_rhythmToInterval = function (rhythm) {
  // todo: error checking to fulfill full 4-count
  var i = 0; // index for rhythm
  function nextNote(note) {
    this.scale = harMinor;
    Tone.Transport.setTimeout(function(time){
        var n = midiToFreq(root + this.scale[arpStep % this.scale.length]);
        arp.triggerAttack(n, time, 1);
        arp.triggerRelease(n, time + arp.toSeconds('16n'));
        nextNote(rhythm[i++]);
    }, note);
  }
  nextNote(rhythm[i]);
};

midiToFreq = function (m) {
  return 440 * Math.pow(2, (m - 69) / 12.0);
};

Tone.Transport.loop = true;
Tone.Transport.setLoopStart('0:0');
Tone.Transport.setLoopEnd('1:0');
Tone.Transport.setBpm(100);
Tone.Transport.start();
Tone.Transport.setInterval(play_rhythmToInterval(sequence), '1:0');