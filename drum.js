console.log("PARSESEQ")

/*
https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
 */

var parseSeq = {};

(function() {
    var step = 1;
    var tempo = 120;
    var tempoMs = bpmToMilliseconds(tempo);

    let tempoBox;


    function playStep(stepBox) {
        const soundKeys = stepBox.value;

        if (soundKeys == '') {
            return;
        }

        soundKeys.split('').forEach(function (soundKey) {
            playSound(soundKey);
        });
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

    function playSound(soundKey) {
        const audio = document.querySelector(`audio[data-key="${soundKey}"]`);

        if (!audio) return;

        audio.currentTime = 0;

        audio.play();
    }

    function executeNext() {
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

        setTimeout(executeNext, tempoMs)
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
        } else {
            // If not a number, change it back to old tempo
            tempoBox.value = tempo;
        }
    }

    function init() {
        tempoBox = document.getElementById("tempo");

        tempoBox.value = tempo;
        tempoBox.onchange = tempoChangeEvent;

        executeNext();
    }

    parseSeq.init = init;
})();