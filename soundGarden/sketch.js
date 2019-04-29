// https://youtu.be/lUoP1Gv5N9M 

var flowers = [];
var synth, reverb, chorus, gain, player;
var serial;
var portName = "/dev/cu.usbmodem14101"

function setup() {
    
    serial = new p5.SerialPort();
    serial.list();
    serial.open(portName);
    serial.on('list', gotList);

    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);

    Tone.Master.mute = true;
    setTimeout(function() { Tone.Master.mute = false; }, 2000);

    let numGroups = 0;
    if (windowWidth < 750 || windowHeight < 500) {
        numGroups = 1;
    } else if (windowWidth < 1500 || windowHeight < 1000) {
        numGroups = 2;
    } else {
        numGroups = 3;
    }

    for (var i = 0; i < numGroups; i++) {
        flowers.push(new Flower(createVector(random(100, windowWidth - 200), random(100, windowHeight - 200)), .3, p5.Vector.random2D(), 2, 20, 5, 40, 30, '#192E5B', '#72A2C0'));
        flowers.push(new Flower(createVector(random(100, windowWidth - 200), random(100, windowHeight - 200)), .3, p5.Vector.random2D(), 2, 20, 5, 40, 30, '#1D65A6', '#F2A104'));
        flowers.push(new Flower(createVector(random(100, windowWidth - 200), random(100, windowHeight - 200)), .8, p5.Vector.random2D(), 1.5, 20, 10, 15, 30, '#00743F', 'gray'));
        flowers.push(new Flower(createVector(random(100, windowWidth - 200), random(100, windowHeight - 200)), .8, p5.Vector.random2D(), 1.5, 20, 10, 15, 30, '#72A2C0', '#192E5B'));
        flowers.push(new Flower(createVector(random(100, windowWidth - 200), random(100, windowHeight - 200)), .4, p5.Vector.random2D(), 1, 10, 8, 30, 70, '#F2A104', '#00743F'));
        flowers.push(new Flower(createVector(random(100, windowWidth - 200), random(100, windowHeight - 200)), .4, p5.Vector.random2D(), 1, 10, 8, 30, 70, 'gray', '#1D65A6'));

    }

    synth = new Tone.Synth({
        "oscillator": {
            "type": "sine"
        },
        "envelope": {
            "attack": 0.001,
            "decay": 0.1,
            "sustain": 0.1,
            "release": 1.2
        }
    });

    polySynth = new Tone.PolySynth(6, Tone.Synth);
    polySynth.set({
        "oscillator": {
            "type": "sine"
        },
        "envelope": {
            "attack": 0.001,
            "decay": 0.1,
            "sustain": 0.1,
            "release": 1.2
        }
    });

    reverb = new Tone.Freeverb({
        "roomSize": 0.7,
        "dampening": 4300,
        "wet": 0.5
    });

    chorus = new Tone.Chorus({
        "frequency": 4,
        "delayTime": 16,
        "type": "triangle",
        "depth": 1,
        "feedback": 0.1,
        "spread": 80,
        "wet": 0.5
    });

    gain = new Tone.Gain();

    polySynth.connect(chorus);
    chorus.connect(reverb);
    reverb.connect(gain);
    gain.toMaster();

    player = new Tone.Player("water.wav").toMaster();
    player.autostart = true;
    player.loop = true;
}

function gotList(list) {
    console.log("List of Serial Ports:");

    for (var i = 0; i < list.length; i++) {
        console.log(i + " " + list[i]);
    }
}

function playFlowerSound(flower) {
    if (flower.centerColor == '#192E5B') {
        polySynth.triggerAttackRelease(["E4"], "8n");
    }
    else if (flower.centerColor == '#1D65A6') {
        polySynth.triggerAttackRelease(["D4"], "8n");
    }
    else if (flower.centerColor == '#00743F') {
        polySynth.triggerAttackRelease(["B4"], "8n");
    }
    else if (flower.centerColor == '#72A2C0') {
        polySynth.triggerAttackRelease(["A4"], "8n");
    }
    else if (flower.centerColor == '#F2A104') {
        polySynth.triggerAttackRelease(["G4"], "8n");
    }
    else if (flower.centerColor == 'gray') {
        polySynth.triggerAttackRelease(["E3"], "8n");
    }
}

function draw() {
    background("#d4ebf2");
    
    for (var i = 0; i < flowers.length; i++) {
        flowers[i].draw();

        for (var j = i + 1; j < flowers.length; j++) {
            if (flowers[i].checkCollision(flowers[j]) == true) {
                playFlowerSound(flowers[i]);
                playFlowerSound(flowers[j]);

                let flower1 = color(flowers[i].petalColor).toString();
                flower1 = flower1.substring(5, flower1.length - 1);
                flower1 = flower1.split(',');

                let flower2 = color(flowers[j].petalColor).toString();
                flower2 = flower2.substring(5, flower2.length - 1);
                flower2 = flower2.split(',');

                let red = (parseInt(flower1[0]) + parseInt(flower2[0])) / 2;
                serial.write(red);
                let green = (parseInt(flower1[1]) + parseInt(flower2[1])) / 2;
                serial.write(green);
                let blue = (parseInt(flower1[2]) + parseInt(flower2[2])) / 2;
                serial.write(blue);
                let output = red + "," + green + "," + blue;
            }
        }
    }
}