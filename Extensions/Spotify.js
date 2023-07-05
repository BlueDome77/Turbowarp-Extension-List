(function(ext) {

    if (typeof Tone !== 'undefined') {
        console.log('Tone library is already loaded');
        getTokenAndStart();
    } else {
        $.getScript('https://ericrosenbaum.github.io/spotify-extension/Tone.min.js', getTokenAndStart);
    }

    function getTokenAndStart() {
        getAccessToken().then((token) => {
            startExtension(token);
        });
    }

    function getAccessToken() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'https://u61j2fb017.execute-api.us-east-1.amazonaws.com/prod/get-spotify-token',
                success: function (response) { 
                    var token = {};                   
                    token.expirationTime = currentTimeSec() + 3600;
                    token.value = response.token;
                    resolve(token);
                },
                error: function (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    }

    function refreshAccessTokenIfNeeded(token) {
        return new Promise((resolve, reject) => {
            if (currentTimeSec() > token.expirationTime) {
                getAccessToken().then((newToken) => {
                    token = newToken;
                    console.log('token expired, got a new one')
                    resolve(token);
                });
            } else {
                resolve(token);
            }
        });
    }

    function currentTimeSec() {
        return new Date().getTime() / 1000;
    }

    function startExtension(token) { 

        var spotifyToken = token;

        // load multiple tracks at once, to make mashups, by loading multiple copies of the extension
        // this works by adding a number to the end of the extension name
        var extName = 'Spotify';
        var extNum = '';
        // if the extension has been loaded once, we'll append a number
        if (window.ScratchExtensions.getStatus(extName).status == 2) {
        	// check for additional numbered copies, starting at 2
	        for (var i=2; i<=8; i++) {
	        	// if this number has not been loaded, use it
	            if (window.ScratchExtensions.getStatus(extName + i).status != 2) {
	                extNum = i;
	                break;
	            }
	        }
	    }
        extName += extNum;

        // player for playing entire track
        var player = new Tone.Player().toMaster();

        // beat players for playing individual beat at a time
        var beatPlayers = [];
        var releaseDur = 0.01;
        for (var i=0; i<4; i++) {
            var beatPlayer = new Tone.Player();
            var ampEnv = new Tone.AmplitudeEnvelope({
                "attack": 0.01,
                "decay": 0,
                "sustain": 1.0,
                "release": releaseDur
            }).toMaster();
            beatPlayer.connect(ampEnv);
            beatPlayer.ampEnv = ampEnv;
            beatPlayers.push(beatPlayer);
        }
        currentBeatPlayerIndex = 0;

        // gain node
        var gain = new Tone.Gain();
        Tone.Master.chain(gain);

        var audioContext = Tone.context;

        var trackTimingData;
        var currentBeatNum = 0;
        var beatFlag = false;
        var barFlag = false;
        var beatTimeouts = [];
        var barTimeouts = [];
        var trackTimeout;

        var trackStartTime;

        var currentTrackDuration = 0;
        var trackTempo = 0;
        var currentArtistName = 'none';
        var currentTrackName = 'none';
        var currentAlbumName = 'none';
        var numBeats = 0;

        var prevQuery = '';

        // Cleanup function when the extension is unloaded
        ext._shutdown = function() {};

        // Status reporting code
        // Use this to report missing hardware, plugin or unsupported browser
        ext._getStatus = function() {
            if (typeof AudioContext !== "undefined") {
                return {status: 2, msg: 'Ready'};
            } else {
                return {status: 1, msg: 'Browser not supported'};
            }
        };

        ext.searchAndPlayAndWait = function(query, callback) {
            refreshAccessTokenIfNeeded(spotifyToken).then(function(token) {
                spotifyToken = token
                requestSearch(query).then(
                    function() {
                        playTrack();
                        trackTimeout = window.setTimeout(function() {
                            callback();
                        }, (currentTrackDuration) * 1000);
                    },
                    function() {
                        callback();
                    } 
                );
            });
        };

        ext.searchAndPlay = function(query, callback) {
            refreshAccessTokenIfNeeded(spotifyToken).then(function(token) {
                spotifyToken = token
                requestSearch(query).then(
                    function() {
                        playTrack();
                        callback();
                    },
                    function() {
                        callback();
                    }   
                );
            });
        };

        function requestSearch(query) {

            return new Promise(function (resolve, reject) {

                if (player) {
                    player.stop();
                    clearTimeouts();
                }

                if (query == '') {
                    resolve();
                    return;
                }

                currentBeatNum = 0;

                // if we are making the exact same query again, abort
                // keeping the same metadata, no need to reload
                if (query == prevQuery) {
                    resolve();
                    return;
                }

                $.ajax({
                    url: 'https://api.spotify.com/v1/search',
                    headers: {
                        'Authorization': 'Bearer ' + spotifyToken.value
                    },
                    data: {
                        q: query,
                        type: 'track'
                    },
                    success: function (response) {

                        prevQuery = query;

                        var trackObjects = response['tracks']['items'];

                        // fail if there are no tracks
                        if (!trackObjects || trackObjects.length === 0) {
                            resetTrackData();
                            reject();
                            return;
                        }

                        // find the first result without explicit lyrics
                        var notExplicit = false;
                        for (var i=0; i<trackObjects.length; i++) {
                            if (!trackObjects[i].explicit) {
                                trackObjects = trackObjects.slice(i);
                                notExplicit = true;
                                break;
                            }
                        }

                        // fail if there were none without explicit lyrics
                        if (!notExplicit) {
                            resetTrackData();
                            console.log('no results without explicit lyrics');
                            reject();
                            return;
                        }

                        keepTryingToGetTimingData(trackObjects, resolve, reject);

                    },
                    error: function(error) {
                        // if the error is a 401 (unauthorized), the token probably has expired,
                        // so request a new one. 
                        if (error.status == 401) {
                            getAccessToken().then((token) => {
                                spotifyToken = token;
                                reject();
                            });
                        }
                    }
                });
            });
        };

        function keepTryingToGetTimingData(trackObjects, resolve, reject) {
            getTrackTimingData(trackObjects[0].preview_url).then(
            	function() {
                    // store track name, artist, album
                    currentArtistName = trackObjects[0].artists[0].name;
                    currentTrackName = trackObjects[0].name;
                    currentAlbumName = trackObjects[0].album.name;
            		resolve();
            	},
            	function() {
            		console.log('no timing data for ' + trackObjects[0].name +', trying next track');
            		if (trackObjects.length > 1) {
            			trackObjects = trackObjects.slice(1);
            			keepTryingToGetTimingData(trackObjects, resolve, reject);
            		} else {
            			console.log('no more results');
                        resetTrackData();
            			reject();
            		}
            	}
            );
        }

        function playTrack() {
            if (!player.buffer || !player.buffer.loaded || !trackTimingData) {
                return;
            }
            player.start(Tone.now(), 0, currentTrackDuration); 
            trackStartTime = Tone.now();
            setupTimeouts();
        }

        function setupTimeouts() {
            // events on each beat
            beatTimeouts = [];
            for (var i=0; i<numBeats; i++) {
                var t = window.setTimeout(function(i) {
                    beatFlag = true;
                    currentBeatNum = i;
                }, (trackTimingData.beats[i] - 0.1) * 1000, i);
                beatTimeouts.push(t);
            }

            // events on each bar
            barTimeouts = [];
            for (var i=0; i<trackTimingData.downbeats.length; i++) {
                if (trackTimingData.downbeats[i] < trackTimingData.beats[numBeats-1]) {
                    var t = window.setTimeout(function() {
                        barFlag = true;
                    }, (trackTimingData.downbeats[i] - 0.1) * 1000);
                    barTimeouts.push(t);
                }
            }
        }

        function resetTrackData() {
            player = new Tone.Player().toMaster();
            currentArtistName = 'none';
            currentTrackName = 'none';
            currentAlbumName = 'none';
            trackTempo = 0;
        }              

        // code adapted from spotify
        function getTrackTimingData(url) {

            return new Promise(function (resolve, reject) {

                if (!url) {
                    reject();
                    return;
                }

	            function findString(buffer, string) {
	              for (var i = 0; i < buffer.length - string.length; i++) {
	                var match = true;
	                for (var j = 0; j < string.length; j++) {
	                  var c = String.fromCharCode(buffer[i + j]);
	                  if (c !== string[j]) {
	                    match = false;
	                    break;
	                  }
	                }
	                if (match) {
	                  return i;
	                }
	              }
	              return -1;
	            }

	            function getSection(buffer, start, which) {
	              var sectionCount = 0;
	              for (var i = start; i < buffer.length; i++) {
	                if (buffer[i] == 0) {
	                  sectionCount++;
	                }
	                if (sectionCount >= which) {
	                  break;
	                }
	              }
	              i++;
	              var content = '';
	              while (i < buffer.length) {
	                if (buffer[i] == 0) {
	                  break;
	                }
	                var c = String.fromCharCode(buffer[i]);
	                content += c;
	                i++;
	              }
	              var js = '';
	              try {
	                js = eval('(' + content + ')');
	              } catch (e) {
	                js = '';
	              }
	              return js;
	            }

	            function makeRequest(url, resolve, reject) {

                    if (!url) {
                        reject();
                        return;
                    }

	                var request = new XMLHttpRequest();
	                request.open('GET', url, true);
	                request.responseType = 'arraybuffer';
	                request.onload = function() {
	                    var buffer = new Uint8Array(this.response); // this.response == uInt8Array.buffer
	                    var idx = findString(buffer, 'GEOB');

	                    trackTimingData = getSection(buffer, idx + 1, 8);

	                    if (!trackTimingData) {
	                        reject();
	                        return;
	                    }

	                    // estimate the tempo using the average time interval between beats
	                    var sum =0;
	                    for (var i=0; i<trackTimingData.beats.length-1; i++) {
	                        sum += trackTimingData.beats[i+1] - trackTimingData.beats[i];
	                    }
	                    var beatLength = sum / (trackTimingData.beats.length - 1);
	                    trackTempo = 60 / beatLength;

	                    // use the loop duration to set the number of beats
	                    for (var i=0; i<trackTimingData.beats.length; i++) {
	                        if (trackTimingData.loop_duration < trackTimingData.beats[i]) {
	                            numBeats = i;
	                            break;
	                        }
	                    }

	                    // decode the audio
	                    audioContext.decodeAudioData(request.response, function(buffer) {
	                        player.buffer.set(buffer);
	                        currentTrackDuration = trackTimingData.loop_duration;
	                        for (var i=0; i<beatPlayers.length; i++) {
	                            beatPlayers[i].buffer.set(buffer);
	                        }
	                        resolve();   
	                    }); 
	                }
	                request.send();
	            }

	            makeRequest(url, resolve, reject);

	        });
        }

        ext.trackData = function(dataType) {
            switch (dataType) {
                case 'track':
                    return currentTrackName;
                case 'artist':
                    return currentArtistName;
                case 'album':
                    return currentAlbumName;
                case 'full':
                    return currentTrackName + ' by ' + currentArtistName + ' from ' + currentAlbumName;
                default:
                    return '';                    
            }
        };

        ext.artistName = function() {
            return currentArtistName;
        };

        ext.albumName = function() {
            return currentAlbumName;
        };

        ext.trackTempo = function() {
            return trackTempo;
        };

        ext.playNextBeat = function() {
            setCurrentBeatNum(currentBeatNum + 1);
            playCurrentBeat();    
        };

        ext.playBeat = function(num) {
            num -= 1; // one-indexing
            setCurrentBeatNum(num);
            playCurrentBeat();
        };

        ext.playBeatAndWait = function(num, callback) {
            num -= 1; // one-indexing
            setCurrentBeatNum(num);
            playCurrentBeat(callback);
        };

        function setCurrentBeatNum(num) {
            num = Math.round(num);
            currentBeatNum = num % numBeats;
            if (currentBeatNum < 0) {
                currentBeatNum += numBeats;
            }
        }

        function playCurrentBeat(callback) {
            // if the track is playing, stop it
            if (player) {
                player.stop();
                clearTimeouts();
            }

            var startTime = trackTimingData.beats[currentBeatNum];
            var duration;
            if ((currentBeatNum + 1) < numBeats) {
                var endTime = trackTimingData.beats[currentBeatNum+1];
                duration = endTime - startTime;
            } else {
                duration = currentTrackDuration - startTime;
            }

            beatPlayers[currentBeatPlayerIndex].ampEnv.triggerRelease();
            beatPlayers[currentBeatPlayerIndex].stop(releaseDur);
            currentBeatPlayerIndex++;
            currentBeatPlayerIndex %= beatPlayers.length;
            beatPlayers[currentBeatPlayerIndex].ampEnv.triggerAttackRelease(duration-releaseDur);
            beatPlayers[currentBeatPlayerIndex].start('+0', startTime, duration);

            beatFlag = true;  
            if (callback) {
                window.setTimeout(function() {
                    callback();
                }, (duration - (1/30)) * 1000);
            } 
        }

        ext.currentBeat = function() {
            return currentBeatNum + 1; // one-indexing
        };

        ext.stopMusic = function() {
            player.stop();
            clearTimeouts();
        };

        ext._stop = function() {
            ext.stopMusic();
        };

        function clearTimeouts() {
            clearTimeout(trackTimeout);
            for (var i=0; i<beatTimeouts.length; i++) {
                clearTimeout(beatTimeouts[i]);
            }
            for (var i=0; i<barTimeouts.length; i++) {
                clearTimeout(barTimeouts[i]);
            }
        }

        ext.everyBeat = function() {
            if (beatFlag) {
                window.setTimeout(function() {
                    beatFlag = false;
                }, 60);
                return true;
            }
            return false;
        };

        ext.everyBar = function() {
            if (barFlag) {
                window.setTimeout(function() {
                    barFlag = false;
                }, 60);
                return true;
            }
            return false;
        };

        // if you've loaded multiple copies of the extension, include extension number on each block
        num = extNum;

	    // Block and block menu descriptions
        var descriptor = {
            blocks: [
              ['w', '♫'+num+' play music like %s', 'searchAndPlay', 'tacos'],
              ['w', '♫'+num+' play music like %s until done', 'searchAndPlayAndWait', 'lauryn hill'],
              ['r', '♫'+num+' %m.trackData name', 'trackData', 'full'],
              [' ', '♫'+num+' play next beat', 'playNextBeat'],
              [' ', '♫'+num+' play beat %n', 'playBeat', 4],
              ['w', '♫'+num+' play beat %n until done', 'playBeatAndWait', 4],
              ['r', '♫'+num+' current beat', 'currentBeat'],
              ['h', '♫'+num+' every beat', 'everyBeat'],
              ['h', '♫'+num+' every 4 beats', 'everyBar'],
              [' ', '♫'+num+' stop the music', 'stopMusic']
            ],
            menus: {
                trackData: ['track', 'artist', 'album', 'full']
            },
            url: 'https://ericrosenbaum.github.io/spotify-extension/'
        };

        // Register the extension
        ScratchExtensions.register(extName, descriptor, ext);
    }

})({});
