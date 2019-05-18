console.log("DRUM")

/*
https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript

//load sounds
sounds[a] = blah1.wav
sounds[b] = blah2.wav

start()

    step = 1

    executeNext()
        steps.last.css(white)
        steps[step].css(blue)

        playStep(steps[step])

        if start = true
        step += 1
        timeout(stepInterval, executeNext)

playStep(step)
    value = step.value
    for k in value:
        if sounds[k]
            sounds[k].play()

init()
    // need to implement stop
    buttonSelector.click(start)
 */

function playStep(stepBox) {
    const soundKeys = stepBox.value;

    if (soundKeys == '') {
        return;
    }

    soundKeys.split('').forEach(function(soundKey){
        // if sounds[k]
        //     sounds[k].play()
        playSound(soundKey);
    });
}

function parseStep(soundKeys)
{
    var currentToken = soundKeys[0];
    soundKeys = soundKeys.splice(1);

    if (isSoundToken(currentToken))
    {
        playSound(currentToken);
    }
    else if(currentToken === "+")
    {
        raiseVolume(soundKeys);
    }
    else if (currentToken === "-")
    {
        lowerVolume(soundKeys);
    }
    else if (currentToken === "~")
    {
        ratchet(soundKeys);
    }
    else if (currentToken === "(")
    {
        startGroup(soundKeys);
    }
}

function raiseVolume(soundKeys)
{
    var currentToken = soundKeys[0];
    soundKeys = soundKeys.splice(1);

    if (isSoundToken(currentToken))
    {
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
    //console.log(step + "-a");

    const stepBox = document.getElementById(step + "-a");
    const lastStep = document.getElementsByClassName('current-step');
    if (lastStep[0]){
        lastStep[0].classList.remove('current-step');
    }
    stepBox.classList.add('current-step');
    playStep(stepBox);

    if (step == 16)
    {
        step = 1;
    }
    else
    {
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

function tempoChangeEvent(e){
    const newBpm = parseInt(e.target.value);
    console.log(newBpm)
    if (!isNaN(newBpm))
    {
        tempo = newBpm;
        tempoMs = bpmToMilliseconds(tempo);
    }
    else
    {
        // If not a number, change it back to old tempo
        document.getElementById("tempo").value = tempo;
    }
}


var step = 1;
var tempo = 120;
var tempoMs = bpmToMilliseconds(tempo);

function init(){
    document.getElementById("tempo").value = tempo;
    document.getElementById("tempo").onchange = tempoChangeEvent;

    executeNext();
}
