demo = window.demo || (window.demo = {});

let bgm;
let bg;

demo.online = function () { };
demo.online.prototype = {
    preload: function () {
        game.load.image('sky', '../assets/art/onlineBG3.png');
        game.load.spritesheet('rain1', '../assets/art/redb1.png', 15, 15);
        game.load.spritesheet('rain2', '../assets/art/redg1.png', 15, 15);
        game.load.spritesheet('rain3', '../assets/art/redp1.png', 15, 15);
        game.load.spritesheet('rain4', '../assets/art/redpk1.png', 15, 15);


        game.load.audio('bgm', '../assets/music/Intermission.ogg');
    },
    create: function () {

        bgm = game.add.audio('bgm');

       
        
        bgm.play();

        bgm.loopFull();

        
        bg = game.add.image(0, 0, 'sky');

        bg.width = 1000;
        bg.height = 800;

        var emitter = game.add.emitter(game.world.centerX, 0, 400);

        emitter.width = game.world.width;

        emitter.makeParticles('rain1');

        emitter.minParticleScale = 0.1;
        emitter.maxParticleScale = 0.5;

        emitter.setYSpeed(300, 500);
        emitter.setXSpeed(-5, 5);

        emitter.minRotation = 0;
        emitter.maxRotation = 0;

        emitter.start(false, 1600, 5, 0);

        var emitter2 = game.add.emitter(game.world.centerX, 0, 400);

        emitter2.width = game.world.width;

        emitter2.makeParticles('rain2');

        emitter2.minParticleScale = 0.1;
        emitter2.maxParticleScale = 0.5;

        emitter2.setYSpeed(300, 500);
        emitter2.setXSpeed(-5, 5);

        emitter2.minRotation = 0;
        emitter2.maxRotation = 0;

        emitter2.start(false, 1600, 5, 0);

        var emitter3= game.add.emitter(game.world.centerX, 0, 400);

        emitter3.width = game.world.width;

        emitter3.makeParticles('rain3');

        emitter3.minParticleScale = 0.1;
        emitter3.maxParticleScale = 0.5;

        emitter3.setYSpeed(300, 500);
        emitter3.setXSpeed(-5, 5);

        emitter3.minRotation = 0;
        emitter3.maxRotation = 0;

        emitter3.start(false, 1600, 5, 0);
        

        var emitter4= game.add.emitter(game.world.centerX, 0, 400);

        emitter4.width = game.world.width;

        emitter4.makeParticles('rain4');

        emitter4.minParticleScale = 0.1;
        emitter4.maxParticleScale = 0.5;

        emitter4.setYSpeed(300, 500);
        emitter4.setXSpeed(-5, 5);

        emitter4.minRotation = 0;
        emitter4.maxRotation = 0;

        emitter4.start(false, 1600, 5, 0);
    },
    update: function () {

    }

}