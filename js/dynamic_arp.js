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

/*SEQUENCER TEST*/

var sequence = ["4n", "16n", "16n", "16n", "16n", "8n", "8n", "4n"];


// Various conversion functions
/*
play_rhythmToInterval = function (rhythm) {
  // todo: error checking to fulfill full 4-count
  var i = 0; // index for rhythm
  function nextNote(note) {
    this.scale = major;
    console.log(note);
    Tone.Transport.setTimeout(function(time){
        var n = midiToFreq(root + this.scale[arpStep % this.scale.length]);
        console.log("freq: " + n)
        arp.triggerAttack(n, time, 1);
        arp.triggerRelease(n, time + arp.toSeconds('16n'));
        if (i < rhythm.length)
          nextNote(rhythm[i++]);
        arpStep++;
    }, note);
  }
  nextNote(rhythm[i]);
};

midiToFreq = function (m) {
  return 440 * Math.pow(2, (m - 69) / 12.0);
};*/
/*
Tone.Transport.loop = true;
Tone.Transport.setLoopStart('0:0');
Tone.Transport.setLoopEnd('1:0');
Tone.Transport.setBpm(100);
play_rhythmToInterval(sequence);
Tone.Transport.start();
Tone.Transport.setInterval(function() {
  play_rhythmToInterval(sequence);
}, '1:0');
*/





/* global Tone, GUI*/

var bass = new Tone.MonoSynth();
bass.setPreset("Bassy");
bass.setVolume(-10);
bass.toMaster();

/*var arp = Tone.FMSynth;
//arp.toMaster();
var pingPong = new Tone.PingPongDelay('32n');
pingPong.setFeedback(0.6);
arp.connect(pingPong);
arpFilter = new Tone.Filter();
pingPong.connect(arpFilter);
//arpFilter.toMaster();
arpFilter.frequency.setValue(1500);
*/
//var keys = new Tone.PolySynth(3, Tone.MonoSynth, Tone.MonoSynth.prototype.preset.Pianoetta);
var keys = new Tone.PolySynth(3, Tone.FMSynth)
keys.setVolume(-30);
keys.toMaster();

var kit = new Tone.MultiSampler({
  "drums": "../sounds/dancebeat.mp3"
  /*"kick" : "./audio/505/kick.mp3",
  "snare" : "./audio/505/snare.mp3",
  "hh" : "./audio/505/hh.mp3",*/
}, function(){
  //after the sounds are loaded, add the transport controls
/*  $("#Loading").remove();
  startButton.enable();*/
});
kit.setVolume(-10);
kit.toMaster();

var Score = {
  /*"kick" : ["0", "0:2:2", "0:3:1"],
  //use any Tone.Time representation or expression
  "snare" : ["4n*1", "4n*3"],
  "hh" : ["0*8n", "1*8n", "2*8n", "3*8n", "4*8n", "5*8n", "6*8n", "7*8n"],*/
  "drums": ["0"],
  //if the array is composed of other arrays time is the first value
  //the rest of the values are given to the callback in order
  //"bass" : [["0:0", "C2", "2n"], ["0:3:2", "C3", "8n"]],
  "keys" : [["0:0:2", ["E4", "G4", "A4"]], ["0:0:3", ["E4", "G4", "A4"]], ["0:1:3", ["E4", "G4", "A4"]]],
};

//create events for all of the notes
Tone.Note.parseScore(Score);

//route the note channels
Tone.Note.route("bass", function(time, note, duration){
  bass.triggerAttackRelease(note, duration, time);
});

Tone.Note.route("keys", function(time, value){
  var velocity = Math.random() * 0.5 + 0.4;
  for (var i = 0; i < value.length; i++) {
    keys.triggerAttackRelease(value[i], "16n", time, velocity);
    //arp.toMaster();
    var pingPong = new Tone.PingPongDelay('32n');
    pingPong.setFeedback(0.6);
    keys.connect(pingPong);
    arpFilter = new Tone.Filter();
    pingPong.connect(arpFilter);
    arpFilter.toMaster();
    arpFilter.frequency.setValue(1500);
  }
});
Tone.Note.route("drums", function(time){
  kit.triggerAttack("drums", time);
});
/*Tone.Note.route("kick", function(time){
  kit.triggerAttack("kick", time);
});
Tone.Note.route("snare", function(time){
  kit.triggerAttack("snare", time);
});
Tone.Note.route("hh", function(time){
  kit.triggerAttack("hh", time);
});*/
/*
//setup the transport looping
*/
Tone.Transport.setLoopStart(0);
Tone.Transport.setLoopEnd("1:0");
Tone.Transport.loop = true;
Tone.Transport.setBpm(120);
Tone.Transport.start()



/*// GUI //

var content = $("#Content");
new GUI.TopBar(Tone);

//the transport controls
var startButton = new GUI.Checkbox(content, function(down){
  if (down){
    Tone.Transport.start();
  } else {
    Tone.Transport.stop();
  }
}, "start", "stop");
startButton.disable();*/
