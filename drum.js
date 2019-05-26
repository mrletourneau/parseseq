console.log("PARSESEQ")

var parseSeq = {};

(function() {
    let sampleList = {
        1: "berlin-chord-1.wav",
        2: "berlin-chord-2.wav",
        3: "berlin-chord-3.wav",
        'k': "909bd.wav",
        'c': "909cp.wav",
        'o': "909hho.wav",
        'h': "909hh.wav",
        'd': "bass-d.wav"
    };
    let sampleSet = {};
    let step = 1;
    let tempo = 120;
    let tempoMs = bpmToMilliseconds(tempo);
    let tempoBox;
    let ticker;

    const audioContext = new AudioContext();

    // fetch the audio file and decode the data
    async function getFile(audioContext, filepath) {
        const response = await fetch(filepath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }


    async function loadSamples() {
        Object.keys(sampleList).forEach(async (key) => {
            let filePath = "snd/" + sampleList[key];
            const sample = await getFile(audioContext, filePath);

            sampleSet[key] = sample;
        });
    }


    // Stolen from https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
    function AdjustingInterval(workFunc, interval, errorFunc) {
        var that = this;
        var expected, timeout;
        this.interval = interval;

        this.start = function() {
            expected = Date.now() + this.interval;
            timeout = setTimeout(step, this.interval);
        }

        this.stop = function() {
            clearTimeout(timeout);
        }

        function step() {
            var drift = Date.now() - expected;
            if (drift > that.interval) {
                // You could have some default stuff here too...
                if (errorFunc) errorFunc();
            }
            workFunc();
            expected += that.interval;
            timeout = setTimeout(step, Math.max(0, that.interval-drift));
        }
    }

    function playStep(stepBox) {
        const soundKeys = stepBox.value;

        if (soundKeys == '') {
            return;
        }

        soundKeys.split('').forEach(function (soundKey) {
            playSound(sampleSet[soundKey]);
        });
    }

    function playSound(audioBuffer) {
        const sampleSource = audioContext.createBufferSource();
        sampleSource.buffer = audioBuffer;
        sampleSource.playbackRate.setValueAtTime(1, audioContext.currentTime);
        sampleSource.connect(audioContext.destination)
        sampleSource.start();
        return sampleSource;
    }



    function executeNextStep() {
        const stepBox = document.getElementById(step + "-a");
        const lastStep = document.getElementsByClassName('current-step');

        if (lastStep[0]) {
            lastStep[0].classList.remove('current-step');
        }

        stepBox.classList.add('current-step');

        playStep(stepBox);

        if (step == 16) {
            step = 1;
        } else {
            step++;
        }
    }

    function parseStep(soundKeys) {
        var currentToken = soundKeys[0];

        soundKeys = soundKeys.splice(1);

        if (isSoundToken(currentToken)) {
            playSound(currentToken);
        } else if (currentToken === "+") {
            raiseVolume(soundKeys);
        } else if (currentToken === "-") {
            lowerVolume(soundKeys);
        } else if (currentToken === "~") {
            ratchet(soundKeys);
        } else if (currentToken === "(") {
            startGroup(soundKeys);
        }
    }

    function raiseVolume(soundKeys) {
        var currentToken = soundKeys[0];

        soundKeys = soundKeys.splice(1);

        if (isSoundToken(currentToken)) {
            playSound()
        }
    }

    function bpmToMilliseconds(bpm) {
        return 60000 / bpm / 4;
    }

    function isUpperCase(character) {
        return character.toLowerCase() !== character && character.toUpperCase() === character;
    }

    function tempoChangeEvent(e) {
        const newBpm = parseInt(e.target.value);

        if (!isNaN(newBpm)) {
            tempo = newBpm;
            tempoMs = bpmToMilliseconds(tempo);
            ticker.interval = tempoMs;

        } else {
            // If not a number, change it back to old tempo
            tempoBox.value = tempo;
        }
    }

    function buildTempoBox(){
        tempoBox = document.getElementById("tempo");
        tempoBox.value = tempo;
        tempoBox.onchange = tempoChangeEvent;
    }

    function buildStartButton(){
        const startButton = document.getElementById("start");
        startButton.dataset.state = 'stopped';
        startButton.onclick = () => {
            const state = startButton.dataset.state;
            if (state === 'stopped')
            {
                ticker.start();
                startButton.value = 'stop';
                startButton.dataset.state = 'started';
                audioContext.resume();
            }
            else if (state === 'started')
            {
                ticker.stop();
                startButton.value = 'start';
                startButton.dataset.state = 'stopped';
            }
        };
    }

    function init() {
        buildTempoBox();
        buildStartButton();

        console.log( loadSamples() );

        ticker = new AdjustingInterval(executeNextStep, tempoMs);
        //ticker.start();
    }


    parseSeq.init = init;
    parseSeq.test = function(){ return true; };

    // if (exports != undefined)
    //     exports.test = parseSeq.test;
})();