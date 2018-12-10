let demo = window.demo || (window.demo = {});
var character;


// function creating background image
function startMenu() {
    startMenu = game.add.image(0, 0, 'menu-background');
    startMenu.width = 12000;
    startMenu.height = 1000;
};

// creating particles for background
function particleEmitter() {
    var emitter = game.add.emitter(game.world.centerX, 0, 400);

	emitter.width = game.world.width;
	emitter.makeParticles('particles');
	emitter.minParticleScale = 0.1;
	emitter.maxParticleScale = 0.5;
	emitter.setYSpeed(300, 500);
	emitter.setXSpeed(-5, 5);
	emitter.minRotation = 0;
	emitter.maxRotation = 0;
	emitter.start(false, 1600, 5, 0);
};

// creating the Pixel smash logo with reflection
function pixelSmash() {
    var text = null;
    var textReflect = null;
    text = game.add.text(450,100, " PIXEL SMASH ");
    //  Centers the text
    text.anchor.set(0.5);
    text.align = 'center';
    //  Our font + size
    text.font = 'PipeDream';
    text.fontWeight = 'bold';
    text.fontSize = 120;
    text.fill = '#ffffff';
    textReflect = game.add.text(450,100 + 100, " PIXEL SMASH ");
    //  Centers the text
    textReflect.anchor.set(0.5);
    textReflect.align = 'center';
    textReflect.scale.y = -1;
    //  Our font + size
    textReflect.font = 'PipeDream';
    textReflect.fontWeight = 'bold';
    textReflect.fontSize = 120;
    
    var grd = textReflect.context.createLinearGradient(1, 1, 1, text.canvas.height);
    //  Add in 2 color stops
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(1, 'rgba(255,255,255,0.08)');
    textReflect.fill = grd;
};

function startGame() {
    let start = game.add.text(300,300, 'START GAME');
    var button1;
    // creating on click button for text
    button1 = game.add.button(250, 300, 'button1', null, this, 2, 1, 0);
    button1.alpha = 0;
    button1.width = 320;
    button1.height = 50;
    button1.onInputOver.add(over, this);
    button1.onInputOut.add(out, this);
    button1.onInputUp.add(up, this);

    start.font= 'PipeDream';
    start.fontWeight = 'bold';
    start.fontSize = 40;
    start.fill = '#ffffff';
};

function multiPlayer() {
    let multiPlayer = game.add.text(350,360, 'ONLINE');
    var button2;
    multiPlayer.font= 'PipeDream';
    multiPlayer.fontWeight = 'bold';
    multiPlayer.fontSize = 40;
    multiPlayer.fill = '#ffffff';

    // creating on click button for text
    button2 = game.add.button(280,360, 'button2', null, this, 2, 1, 0);
    button2.alpha = 0;
    button2.width = 250;
    button2.height = 40;
    button2.onInputOver.add(over, this);
    button2.onInputOut.add(out, this);
    button2.onInputUp.add(up, this)

};

function rankings() {
    let rankings = game.add.text(320,420, 'RANKINGS');
    var button3;
    // creating on click button for text
    rankings.font= 'PipeDream';
    rankings.fontWeight = 'bold';
    rankings.fontSize = 40;
    rankings.fill = '#ffffff';

    button3 = game.add.button(290,420, 'button3', null, this, 2, 1, 0);
    button3.alpha = 0;
    button3.width = 250;
    button3.height = 40;
    button3.onInputOver.add(over, this);
    button3.onInputOut.add(out, this);
    button3.onInputUp.add(up, this)

};

demo.state0 = function () {};
demo.state0.prototype = {
    preload: function () {
        game.load.image('menu-background', 'client/assets/art/start-state-background.png');
        game.load.spritesheet('particles', 'client/assets/art/startParticle.png');
        game.load.image('button1', 'client/assets/art/startGame.png');
        game.load.image('button2', 'client/assets/art/online.png');
        game.load.image('button3', 'client/assets/art/rankings.png');
    },
   
    create: function () {
        startMenu();
        pixelSmash();
        particleEmitter();
        startGame();
        multiPlayer();
        rankings();

},
    update: function () {}
};

function actionOnClick () {
    background.visible =! background.visible;
}

function up() {
    console.log('button up', arguments);
}

function over() {
    console.log('button over');
}

function out() {
    console.log('button out');
}