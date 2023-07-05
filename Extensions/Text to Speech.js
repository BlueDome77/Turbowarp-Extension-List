(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        if(window.speechSynthesis && (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)){return {status: 2, msg: "It works!"};}else{return {status: 0, msg: "You need a newer browser. Try Google Chrome"};};
    };
    var msg = new SpeechSynthesisUtterance();
    var recResult = "";
    var presets = {robot: {pitch: 0.5,voice: 3},whisper: {pitch: 0.5,voice: 1,volume:0.5},mouse: {voice: 1,pitch: 2,volume:0.5},highbot: {voice: 0.5,voice: 1,rate:2},fast: {rate:3},slow: {rate:0.5},deep: {rate:0.8,pitch:0.1},high: {rate:1.2,pitch:2,voice:1}};
    ext.speak = function (text,callback){msg.text = text;speechSynthesis.speak(msg);msg.onend = function(e) {callback()};};
    ext.setThing = function (thing, value){if(thing === "voice"){msg.voice = (speechSynthesis.getVoices()[value-1]) || (speechSynthesis.getVoices()[0])}else if(thing === "lang"){msg[thing] = value;rec.lang = value}else{msg[thing] = value}};
    ext.getThing = function (thing){return msg[thing]};
    ext.getVoice = function (voice, thing){return (speechSynthesis.getVoices()[voice - 1][thing]) || 'That voice doesnt exist'};
    ext.voiceLength = function (){return speechSynthesis.getVoices().length};
    ext.start = function (){var rec = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();rec.start();recResult = "";rec.onresult = function (ev){recResult = ev.results[0][0].transcript}};
    ext.result = function (){return recResult};
    ext.preset = function (p){var preset = presets[p];if(preset.pitch){msg.pitch = preset.pitch};if(preset.rate){msg.rate = preset.rate};if(preset.volume){msg.volume = preset.volume};if(preset.voice){msg.voice = speechSynthesis.getVoices()[preset.voice - 1]};}
    ext.clear = function (){msg.lang='en-US';msg.voice=speechSynthesis.getVoices()[0];msg.volume=1;msg.pitch=1;msg.rate=1;}
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['w', 'speak %s', 'speak','Hello world!'],
            [' ','set %m.speechThing to %s','setThing','lang','en-US'],
            ['r','get %m.speechThingB','getThing','lang'],
            ['r','voice %n %m.voiceThing','getVoice','1','name'],
            ['r','total voices','voiceLength'],
            [' ','set voice preset to %m.preset','preset','robot'],
            [' ','clear effects','clear'],
            ['-'],
            [' ', 'start recognition', 'start'],
            ['r', 'result', 'result']
        ],
      menus: {speechThing: ["lang","volume","pitch","voice","rate"],voiceThing: ["name","lang"],speechThingB: ["lang","volume","pitch","rate"],preset: ["robot","whisper","mouse","highbot","fast","slow","deep","high"]},
      url: "https://github.com/kyleplo/scratch-extensions/wiki/Advanced-Text-to-Speech"
    };

    // Register the extension
    ScratchExtensions.register('Advanced Text to Speech', descriptor, ext);
})({});
