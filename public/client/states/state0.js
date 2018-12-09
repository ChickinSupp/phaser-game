let demo = window.demo || (window.demo = {});

// function creating background image
function startMenu() {
    startMenu = game.add.image(0, 0, 'menu');
    startMenu.width = 1000;
    startMenu.height = 800;
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
    start.font= 'PipeDream';
    start.fontWeight = 'bold';
    start.fontSize = 40;
    start.fill = '#ffffff';
};

function multiPlayer() {
    let multiPlayer = game.add.text(350,360, 'ONLINE');
    multiPlayer.font= 'PipeDream';
    multiPlayer.fontWeight = 'bold';
    multiPlayer.fontSize = 40;
    multiPlayer.fill = '#ffffff';

};

function rankings() {
    let rankings = game.add.text(320,420, 'RANKINGS');
    rankings.font= 'PipeDream';
    rankings.fontWeight = 'bold';
    rankings.fontSize = 40;
    rankings.fill = '#ffffff';
};

demo.state0 = function () {};
demo.state0.prototype = {
    preload: function () {
        game.load.image('menu', 'client/assets/art/start-state-background.png');
        game.load.spritesheet('particles', 'client/assets/art/startParticle.png');
    },
   
    create: function () {
        startMenu();
        pixelSmash();
        particleEmitter();
        startGame();
        multiPlayer();
        rankings();

    },
    
    update: function () {
        multiPlayer();
    }
};

