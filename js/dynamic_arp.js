/*var root = 48;
var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var pentatonic = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var major = [0, 4, 7, 12, 16, 19, 24, 28, 31];
var minor = [0, 3, 7, 12, 15, 19, 24, 27, 31];
var harMinor = [0, 2, 3, 5, 7, 8, 11, 12, 14, 15, 17, 19, 20, 23, 24];
var sus = [0, 5, 7, 12, 17, 19, 24, 29, 31];
var minSev = [0, 3, 7, 10, 12, 15, 19, 22];
var octaves = [-24, -12, 0, 12, 24, 36, 48];
var direction = 0;*/

/*
var bass = new Tone.MonoSynth();
bass.setPreset("Bassy");
bass.setVolume(-10);
bass.toMaster();*/

var kit = new Tone.MultiSampler({
  //"drums": "../sounds/dancebeat.mp3"
  "kick" : "../sounds/kick.mp3",
  "snare" : "../sounds/snare.mp3",
  "hh" : "../sounds/hh.mp3",
}, function(){
  //after the sounds are loaded, add the transport controls
/*  $("#Loading").remove();
  startButton.enable();*/
  Tone.Transport.start();
});
kit.setVolume(-8);
kit.toMaster();

var Score = {
  "kick" : ["0", "0:2:2", "0:3:1"],
  //use any Tone.Time representation or expression
  "snare" : ["4n*1", "4n*3"],
  "hh" : ["0*8n", "1*8n", "2*8n", "3*8n", "4*8n", "5*8n", "6*8n", "7*8n"],
  //"drums": ["0"],
  //if the array is composed of other arrays time is the first value
  //the rest of the values are given to the callback in order
  //"bass" : [["0:0", "C2", "2n"], ["0:3:2", "C3", "8n"]],
  "keys" : [["0:0:0", ["C3"]], ["0:0:3", ["C3"]], ["0:1:2", ["C3"]],
  ["0:2:0", ["C3"]], ["0:2:3", ["C3"]], ["0:3:2", ["C3"]]],
  "midIntensity" : [["0:0:1", ["E3"]], ["0:1:0", ["E3"]], ["0:1:3", ["E3"]],
  ["0:2:1", ["E3"]], ["0:3:0", ["E3"]], ["0:3:3", ["E3"]]],
  "hiIntensity" : [["0:0:2", ["G3"]], ["0:1:1", ["G3"]], ["0:2:0", ["G3"]],
  ["0:2:2", ["G3"]], ["0:3:1", ["G3"]], ["1:0:0", ["G3"]]]
};


var keys = new Tone.PolySynth(1, Tone.FMSynth)
keys.toMaster();
var midIntensity = new Tone.PolySynth(1, Tone.FMSynth)
midIntensity.toMaster();
var hiIntensity = new Tone.PolySynth(1, Tone.FMSynth)
hiIntensity.toMaster();

//create events for all of the notes
Tone.Note.parseScore(Score);

//route the note channels
Tone.Note.route("bass", function(time, note, duration){
  bass.triggerAttackRelease(note, duration, time);
});

var DEF_VOLUME = -40;

Tone.Note.route("keys", function(time, value){
  var velocity = Math.random() * 0.5 + 0.4;
  for (var i = 0; i < value.length; i++) {
    keys.triggerAttackRelease(value[i], "16n", time, velocity);
    //keys.setVolume(DEF_VOLUME);
  }
});

Tone.Note.route("midIntensity", function(time, value){
  var velocity = Math.random() * 0.5 + 0.4;
  for (var i = 0; i < value.length; i++) {
    midIntensity.triggerAttackRelease(value[i], "16n", time, velocity);
    //midIntensity.setVolume(DEF_VOLUME);
  }
});

Tone.Note.route("hiIntensity", function(time, value){
  var velocity = Math.random() * 0.5 + 0.4;
  for (var i = 0; i < value.length; i++) {
    hiIntensity.triggerAttackRelease(value[i], "16n", time, velocity);
    //hiIntensity.setVolume(DEF_VOLUME);
  }
});

/*Tone.Note.route("drums", function(time){
  kit.triggerAttack("drums", time);
});
*/
Tone.Note.route("kick", function(time){
  kit.triggerAttack("kick", time);
});
Tone.Note.route("snare", function(time){
  kit.triggerAttack("snare", time);
});
Tone.Note.route("hh", function(time){
  kit.triggerAttack("hh", time);
});

/*
//setup the transport looping
*/
Tone.Transport.setLoopStart(0);
Tone.Transport.setLoopEnd("1:0");
Tone.Transport.loop = true;
Tone.Transport.setBpm(120);


Parse.initialize("sItbGUy6bQbGS1dqE9J7hlCKI8YmYfRSz3hxkqH9", "5HVZFYNDsw2boymo2Fq2lFFE4olD6yM3BnSJ5XQq");

var EmotivModulations = Parse.Object.extend("moodMetrics");
var query =  new Parse.Query(EmotivModulations);
query.descending("createdAt")
query.limit(1)
function latestMod(modulateParm) {
  query.find({
    success: function(obj) {
      var valence = obj[0].get("valence");
      var excitement = obj[0].get("excitement");
      modulateParm({"valence": valence, "excitement": excitement});
    }
  });
}
//var modulationQuery = new Parse.Query(EmotivModulations);

var MIN_HEARING = -15;
var MAX_HEARING = -2;

// set volume threshholds
/*var low_minTH = 0;
var mid_minTH = 4;
var hi_minTH = 8;*/
var low_minTH = 0.2;
var mid_minTH = 0.3;
var hi_minTH = 0.6;


// Poll for Emotiv changes
Tone.Transport.setInterval(function() {
  latestMod(function(val) {
    console.log("excitement:" + val.excitement + " valence: " + val.valence);

    // Volume modulated by valence
    if (val.valence > low_minTH) {
      console.log("valence > LOW")
      keys.setVolume(-12);
    }
    if (val.valence > mid_minTH) {
      console.log("valence > MID")
      midIntensity.setVolume(-12)
    };
    if (val.valence > hi_minTH) {
      console.log("valence > HI")
      hiIntensity.setVolume(-12);
    }


    // Cutoff modulated by excitement
    // TODO: use cutoff instead of volume
    var excitement = -20 + ((val.excitement - 0.5) * 35);
    //kit.setVolume(excitement);
    Tone.Transport.setBpm(10 + val.valence * 120);
    console.log("adjusted excitement: " + excitement );
    console.log("\n");
  })
}, "1:0");

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

var stopped = false;
$('#startAudio').click(function() {
  if (stopped) {
    Tone.Transport.start();
    stopped = false;
  }
  else {
    Tone.Transport.stop();
    stopped = true;
  }
});

