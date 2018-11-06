let demo = window.demo || (window.demo = {});

let pSpeed = 15;
var player,
    platform,
    sprite2;

demo.state1 = function () { };
demo.state1.prototype = {
    preload: function () {
        //preloads spritesheets to be used in create
        game.load.spritesheet('tester', 'resources/art/test-scott-spritesheet.png', 165, 186, 16);
        
        game.load.spritesheet('ground', 'resources/art/platform.png', 123, 204);

    },
    create: function () {
        // Starting game physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //game.physics.arcade.gravity.y = 900;
        game.stage.backgroundColor = '#800080'
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // Generating player 1
        player = game.add.sprite(400, 100, 'tester');
        //game.physics.enable([player], Phaser.Physics.ARCADE);
        //player.anchor.setTo(0.5,0.5);
        //player.enableBody = true;


        //selects frames from the assigned spritesheet and sets them apart for its animation
        player.animations.add('idle',[0,1,2,3,4,5,6,7], 12, true);
        player.animations.add('run', [8,9,10,11,12,13,14,15], 12, true);

        //plays added animaiton
        player.animations.play('idle');

        // Creating platform
        platform = game.add.sprite(400, 450, 'ground');

        //enables gravity on player but not on platform
        game.physics.arcade.enable([player, platform]);
        player.body.collideWorldBounds = true;
        platform.enableBody = true;
        player.body.gravity.y = 1500;
        platform.body.immovable = true;

        /*
        sprite2 = game.add.sprite(300,700,'ground');
            game.physics.arcade.enable(sprite2);
            sprite2.body.allowGravity = false;
            sprite2.body.enableBody = true;
            sprite2.body.immovable = true;
        */
    },
    update: function () {
        //player and platform will collide
        game.physics.arcade.collide(player, platform);
        //plays 'run' animation on keyDown RIGHT and LEFT
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        
            player.animations.play('run', 13, true);
            //first arg in setTo flips sprite orientation to LEFT
            player.scale.setTo(-1, 1);
            player.x -= 8;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            //first arg in setTo flips sprite orientation to RIGHT
            player.scale.setTo(1, 1);
            player.animations.play('run', 13, true);
            player.x += 8;
        } else {
            //Playes 'idle' animation if no LEFT or RIGHT keys are pressed
            player.animations.stop('run');
            player.animations.play('idle', 13, true);

        }

        //changes player position onkeydown
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            player.y -= 7;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            player.y += 2;
        }


        /*
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            player.x += pSpeed;
            player.animaiton.play()
        }
        */
    }
};

// function players () {
//     let player = game.add.sprite(492,408, 'test');
//         game.physics.enable( [ player ], Phaser.Physics.ARCADE);
//         player.anchor.setTo(0.5,0.5);
//         player.body.collideWorldBounds = true;
//         player.body.gravity.y = 200;


//     let idle = player.animations.add('idle');
//         player.animations.play('idle',13 ,true);
//         console.log('animation is working');
//         console.log('state1');
// }; 