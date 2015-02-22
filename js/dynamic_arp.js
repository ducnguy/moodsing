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

var test = [3, 1, 2, 5, 7, 4, 3];
test = test.toVector();
test = test.sma(3);
console.log(test);
console.log(test.delta().distribution('relative'));

var lv1_scale = [0, 4, 7, 12, 16, 19, 24, 28, 31]; // major
var lv4_scale = [0, 2, 3, 5, 7, 8, 11, 12, 14, 15, 17, 19, 20, 23, 24]; // harm minor
var lv3_scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36]; // penta
var lv2_scale = [0, 3, 7, 12, 15, 19, 24, 27, 31]; //minor
var semitones = ["C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"];

function genSequence(lv) {
  var sequence = new Array();
  var scaleName = "lv" + lv + "_scale";
  var index = 0;
  for (var i = 0; i < 16; i++) {
    index = Math.floor(Math.random()*5);
    //console.log(eval(scaleName)[index]);
    sequence.push(
      [ (i + "*16n").toString(),
        [ semitones[ eval(scaleName)[index] ] ]
      ]
    );
  }
  var rhythmSeq = []
  for (var i = 0; i<16; i++){
    include = Math.floor(Math.random()*4)-1
    if (include==1) {
      rhythmSeq.push(sequence[i])
    }
  }



  console.log(scaleName);
  console.log(rhythmSeq.length);
  return rhythmSeq;
}

var seq;

var reverb = new Tone.Freeverb();
reverb.toMaster()
reverb.setWet(0.2);

var kit = new Tone.MultiSampler({
  //"drums": "../sounds/dancebeat.mp3"
  "kick" : "../sounds/kick.mp3",
  "snare" : "../sounds/snare.mp3",
  "hh" : "../sounds/hh.mp3",
}, function(){
  Tone.Transport.start();
});
kit.setVolume(-8);
kit.toMaster();


var arp = new Tone.PolySynth(1, Tone.FMSynth)
arp.toMaster();
arp.connect(reverb);

/*var lv1 = new Tone.PolySynth(1, Tone.FMSynth)
lv1.toMaster();
var lv2 = new Tone.PolySynth(1, Tone.FMSynth)
lv2.toMaster();
var lv3 = new Tone.PolySynth(1, Tone.FMSynth)
lv3.toMaster();*/

//create events for all of the notes

//route the note channels
Tone.Note.route("bass", function(time, note, duration){
  bass.triggerAttackRelease(note, duration, time);
});

var DEF_VOLUME = -40;

Tone.Note.route("arp", function(time, value){
  var velocity = Math.random() * 0.5 + 0.4;
  for (var i = 0; i < value.length; i++) {
    arp.triggerAttackRelease(value[i], "32n", time, velocity);
    arp.setVolume(-5);
  }
});

/*Tone.Note.route("lv1", function(time, value){
  var velocity = Math.random() * 0.5 + 0.4;
  for (var i = 0; i < value.length; i++) {
    lv1.triggerAttackRelease(value[i], "16n", time, velocity);
    //lv1.setVolume(DEF_VOLUME);
  }
});

Tone.Note.route("lv2", function(time, value){
  var velocity = Math.random() * 0.5 + 0.4;
  for (var i = 0; i < value.length; i++) {
    lv2.triggerAttackRelease(value[i], "16n", time, velocity);
    //lv2.setVolume(DEF_VOLUME);
  }
});

Tone.Note.route("lv3", function(time, value){
  var velocity = Math.random() * 0.5 + 0.4;
  for (var i = 0; i < value.length; i++) {
    lv3.triggerAttackRelease(value[i], "16n", time, velocity);
    //lv3.setVolume(DEF_VOLUME);
  }
});*/

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
query.descending("createdAt");
var smaLimit = 1;
query.limit(smaLimit)
function latestMod(modulateParm) {
  query.find({
    success: function(obj) {
      var valence_ary = new Array(), excitement_ary = new Array();
      /*obj.forEach(function(el) {
        valence_ary.push(el.get("valence"));
        excitement_ary.push(el.get("excitement"));
      });*/
/*      console.log(excitement_ary);
      valence_ary = valence_ary.toVector();
      excitement_ary = excitement_ary.toVector();
      valence_ary = valence_ary.sma(smaLimit);
      excitement_ary = excitement_ary.sma(smaLimit);
      console.log(excitement_ary);
      console.log(excitement_ary.delta());

      var valence = valence_ary[0];
      var excitement = excitement_ary[0];*/
      var valence = obj[0].get("valence");
      var excitement = obj[0].get("excitement");
      modulateParm({"valence": valence, "excitement": excitement});
    }
  });
}

var MIN_HEARING = -15;
var MAX_HEARING = -2;

// set volume threshholds
/*var minTH_1 = 0;
var minTH_2 = 4;
var minTH_3 = 8;*/
var minTH_1 = 0;
var minTH_2 = 0.2;
var minTH_3 = 0.5;
var minTH_4 = 0.7;


// Poll for Emotiv changes
Tone.Transport.setInterval(function() {
  latestMod(function(val) {
    console.log("excitement:" + val.excitement + " valence: " + val.valence);

    // Volume modulated by valence
    if (val.excitement > minTH_1 && val.excitement < minTH_2) {
      //lv1.setVolume(-12);
      seq = genSequence(1);
    }
    else if (val.excitement > minTH_2 && val.excitement < minTH_3) {
      //lv2.setVolume(-12)
      seq = genSequence(2);
    }
    else if (val.excitement > minTH_3 && val.excitement < minTH_4) {
      //lv3.setVolume(-12);
      seq = genSequence(3);
    }
    else if (val.excitement > minTH_4)
      seq = genSequence(4);

    var Score = {
      "kick" : ["0", "0:2:2", "0:3:1"],
      //use any Tone.Time representation or expression
      "snare" : ["4n*1", "4n*3"],
      "hh" : ["0*8n", "1*8n", "2*8n", "3*8n", "4*8n", "5*8n", "6*8n", "7*8n"],
      //"drums": ["0"],
      //if the array is composed of other arrays time is the first value
      //the rest of the values are given to the callback in order
      
      "arp": seq

      // below are hardcoded sequences (original arp)
    /*  "lv1" : [["0:0:0", ["C3"]], ["0:0:3", ["C3"]], ["0:1:2", ["C3"]],
      ["0:2:0", ["C3"]], ["0:2:3", ["C3"]], ["0:3:2", ["C3"]]],
      "lv2" : [["0:0:1", ["E3"]], ["0:1:0", ["E3"]], ["0:1:3", ["E3"]],
      ["0:2:1", ["E3"]], ["0:3:0", ["E3"]], ["0:3:3", ["E3"]]],
      "lv3" : [["0:0:2", ["G3"]], ["0:1:1", ["G3"]], ["0:2:0", ["G3"]],
      ["0:2:2", ["G3"]], ["0:3:1", ["G3"]], ["1:0:0", ["G3"]]]*/
    };

    Tone.Note.parseScore(Score);


    // Cutoff modulated by excitement
    // TODO: use cutoff instead of volume
    var excitement = -20 + ((val.excitement - 0.5) * 35);
    kit.setVolume(-40);
    Tone.Transport.setBpm(60 + val.valence * 40);
    console.log("adjusted excitement: " + excitement );
    console.log("\n");
  })
}, "1:0");


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

