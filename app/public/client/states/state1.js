// State 1 character selection
demo = window.demo || (window.demo = {});
//let socket = io();
let isScottClicked = false;
let dumbCounter = 0;

function characterMenu() {
    characterMenu = game.add.image(0, 0, 'background');
    characterMenu.width = 1200;
    characterMenu.height = 1000;
}

function selectCharacterText() {
    var text = null;
    var textReflect = null;
    text = game.add.text(500,100, "SELECT CHARACTER");
    //  Centers the text
    text.anchor.set(0.5);
    text.align = 'center';
    //  Our font + size
    text.font = 'PipeDream';
    text.fontWeight = 'bold';
    text.fontSize = 80;
    text.fill = '#ffffff';
    textReflect = game.add.text(500,100 + 100, "SELECT CHARACTER");
    //  Centers the text
    textReflect.anchor.set(0.5);
    textReflect.align = 'center';
    textReflect.scale.y = -1;
    //  Our font + size
    textReflect.font = 'PipeDream';
    textReflect.fontWeight = 'bold';
    textReflect.fontSize = 80;

    var grd = textReflect.context.createLinearGradient(1, 1, 1, text.canvas.height);
    //  Add in 2 color stops
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(1, 'rgba(255,255,255,0.08)');
    textReflect.fill = grd;
}

function scottPilgrim() {
    let scott;
    scott = game.add.button(400,420, 'tester', null, this, 2, 1, 0);
    scott.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
    scott.x = 100;
    scott.animations.play('idle');

    scott.onInputOver.add(over, this);
    scott.onInputOut.add(out, this);
    scott.onInputUp.add(scottClicked, this);
};

function ghosty() {
    let ghost;
    ghost = game.add.button(400, 440, 'ghosty');
    ghost.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8], 12, true);
    ghost.animations.play('idle');

    ghost.onInputOver.add(over, this);
    ghost.onInputOut.add(out, this);
    ghost.onInputUp.add(ghostClicked, this)
}

demo.state1 = function () {};
demo.state1.prototype = {
    preload: function () {
        game.load.image('background', '../assets/art/start-state-background.png');
        game.load.spritesheet('tester', '../assets/art/scott-final.png', 142, 184, 151);
        game.load.spritesheet('ghosty', '../assets/art/MarshUmbra.png', 160, 160, 190);
        game.load.audio('charMusic', '../assets/music/Ready.ogg');
    },
    create: function () {
        characterMenu = game.add.image(0, 0, 'background');
        characterMenu.width = 1200;
        characterMenu.height = 1000;
        selectCharacterText();
        scottPilgrim();
        ghosty();

        playMusic();
    },
    update: function () { }
}

function up (character, bol) {
    console.log('button up', character);
    socket.emit('my-player', { name: character, bol: bol });
}

//Scott has been selected;
function scottClicked () {
    isScottClicked = true;
    console.log("Character is scott");
    up('scott', isScottClicked);
}

//Ghost has been selected;
function ghostClicked () {
    isScottClicked = false;
    console.log("Character is ghost");
    up('mghosty',isScottClicked);
}

function over() {
    console.log('button over');
}

function out() {
    console.log('button out');
}

function playMusic() {
    let charMusic = game.add.audio('charMusic');

    charMusic.play();
    charMusic.loopFull();
}

socket.on('we-gucci', function () {
    game.state.start('game');
});