let demo = window.demo || (window.demo = {});

let pSpeed = 15;

let player,
    platform,
    hasJumped = false,
    canCheckJump = true;

const keys = {
    'up': Phaser.KeyCode.UP,
    'down': Phaser.KeyCode.DOWN,
    'left': Phaser.KeyCode.LEFT,
    'right': Phaser.KeyCode.RIGHT,
    'a': Phaser.KeyCode.A,
    's': Phaser.KeyCode.S
};

demo.state1 = function () { };
demo.state1.prototype = {
    preload: function () {
        //preloads spritesheets to be used in create
        game.load.spritesheet('tester', 'resources/art/test-scott-run-attack-combo.png', 213, 204, 63);
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



        //selects frames from the assigned spritesheet and sets them apart for its animation
        player.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
        player.animations.add('run', [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
        player.animations.add('jump', [16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 12, false);
        //neutralpunch2 would follow nuetralpunch1 after it finishes running, like a combo
        //would require input, let's say that hitting 'a' for example, would trigger neutralPunch1, if pressed again at the right...
        //..moment, would trigger neutralPunch2, and so forth 
        player.animations.add('neutralPunch1', [28, 29, 30, 31], 12, false);
        player.animations.add('neutralPunch2', [32, 33, 34, 35], 12, false);
        player.animations.add('neutralPunch3', [36, 37, 38], 12, false);
        player.animations.add('neutralPunch3', [36, 37, 38], 12, false);
        player.animations.add('neutralPunch4', [39, 40], 12, false);
        player.animations.add('neutralPunch5', [41, 42, 43, 44], 12, false);
        player.animations.add('neutralKick', [45, 46, 47, 48, 49, 50, 51], 12, false);

        //plays added animaiton
        player.animations.play('idle');

        // Creating platform
        platform = game.add.sprite(400, 450, 'ground');

        //enables gravity on player but not on platform
        game.physics.arcade.enable([player, platform]);
        player.body.collideWorldBounds = true;
        platform.enableBody = true;
        player.body.gravity.y = 1900;
        platform.body.immovable = true;

    },
    update: function () {
        //player and platform will collide
        game.physics.arcade.collide(player, platform);

        //when the left arrow key is held down
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            player.animations.play('run');
            //first arg in setTo flips sprite orientation to LEFT
            player.scale.setTo(-1, 1);

            player.x -= 8;

            if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                //player.animations.stop('run');
                player.animations.play('jump');
                player.y -= 14;

            }
        }

        //when the right arrow key is held down
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            //first arg in setTo flips sprite orientation to RIGHT
            player.scale.setTo(1, 1);
            player.animations.play('run', 13, true);
            player.x += 8;

            //If RIGHT arrow is currently being pressed and UP just got pressed...
            //Needs work,'jump' animation is not playing...

            /*
            if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                if (!hasJumped) {
                    console.log(hasJumped);
                    player.animations.play('jump');
                    player.y -= 14;

                    hasJumped = true;
                }

                
            }*/

            //when the up arrow key is held down
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {

            if (!hasJumped) {
                player.animations.play('jump');
                player.y -= 14;

                if (canCheckJump) {
                    canCheckJump = false;
                    setTimeout(function () {
                        hasJumped = true;
                    }, 350);
                    setTimeout(function () {
                        checkJump();
                    }, 500);

                } else {
                    return false;
                }


            } else {
                return false;
            }
            //player.animations.play('jump');
            //player.y -= 14;

        } else if (game.input.keyboard.isDown(keys.a)) {
            player.animations.play('neutralPunch1');


        } else {
            //Playes 'idle' animation if no LEFT or RIGHT keys are pressed
            //player.animations.stop('run');
            player.animations.play('idle', 13, true);

        }

        render();

        function checkJump() {
            if (hasJumped) {
                hasJumped = false;
            } else {
                return;
            }

        }
        function render() {

            // Display
            //game.debug.spriteBounds(player);
            game.debug.body(player);
            //game.debug.body(sprite2);

        }

    }
};
