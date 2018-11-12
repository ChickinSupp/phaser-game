let demo = window.demo || (window.demo = {});

let pSpeed = 15;

let player,
    atkBox,
    playerCombo = [],
    pKeyPressed,
    platform,
    playerJump = 15,
    relativePosX = 0,
    relativePosY = 0,
    reseter,
    hasJumped = false,
    arrowKey,
    canCheckJump = true;

window.addEventListener("keydown", function (event) {
    if (event.code == 'ArrowUp') {


        console.log(event.code);
    }

});

const keys = {
    'up': Phaser.KeyCode.UP,
    'down': Phaser.KeyCode.DOWN,
    'left': Phaser.KeyCode.LEFT,
    'right': Phaser.KeyCode.RIGHT,
    'a': Phaser.KeyCode.A,
    's': Phaser.KeyCode.S,
    'w': Phaser.KeyCode.W,
    'd': Phaser.KeyCode.D
};

demo.state1 = function () { };
demo.state1.prototype = {
    preload: function () {
        //preloads spritesheets to be used in create
        game.load.spritesheet('tester', 'resources/art/test-scott.png', 213, 204, 78);
        game.load.spritesheet('ground', 'resources/art/platform.png', 123, 204);
        game.load.spritesheet('hbox', 'resources/art/hbox.png', 40, 40);


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
        player.animations.add('run', [8, 9, 10, 11, 12, 13, 14, 15], 12, false);
        player.animations.add('jump', [16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 12, false);
        //neutralpunch2 would follow nuetralpunch1 after it finishes running, like a combo
        //would require input, let's say that hitting 'a' for example, would trigger neutralPunch1, if pressed again at the right...
        //..moment, would trigger neutralPunch2, and so forth 
        player.animations.add('neutralPunch1', [28, 29, 30, 31], 11, false);
        player.animations.add('neutralPunch2', [32, 33, 34, 35], 11, false);
        player.animations.add('neutralPunch3', [36, 37, 38], 11, false);

        player.animations.add('neutralPunch4', [39, 40], 11, false);
        player.animations.add('neutralPunch5', [41, 42, 43, 44], 11, false);
        player.animations.add('neutralKick', [45, 46, 47, 48, 49, 50, 51], 12, false);

        player.animations.add('specialKick1', [63, 64, 65, 66, 67, 68, 69], 14, false);

        player.animations.add('runAttack', [70, 71, 72, 73, 74, 75, 76, 77, 78], 14, false);



        //creates hitbox when player attacks
        //gets attack animname passed in playerCombo
        //based on what attack it is, it renders around the attack point, and disappears after 1 second

        //creates a hitbox group
        hitboxes = game.add.group();
        hitboxes.enableBody = true;

        //creates an instance of hitbox;
        atkBox = hitboxes.create(0, 0, 'hbox');
        //sets the size of the hitbox, without any offset
        atkBox.body.setSize(40, 40, 0, 0);

        //plays added animaiton
        player.animations.play('idle');

        //opens up info on current anim
        console.log(player.animations.currentAnim);
        //gets name for current anim
        console.log(player.animations.currentAnim.name);
        //returns if current anim is finished
        console.log(player.animations.currentAnim.isFinished);


        // Creating platform
        platform = game.add.sprite(400, 450, 'ground');

        //enables gravity on player but not on platform
        game.physics.arcade.enable([player, platform, atkBox]);
        player.body.collideWorldBounds = true;
        platform.enableBody = true;
        player.body.gravity.y = 1900;
        platform.body.immovable = true;

        console.log(atkBox);
        console.log(player);
        console.log(game.input.keyboard._onKeyPress(Phaser.Keyboard.RIGHT));

    },
    update: function () {

        //player and platform will collide

        game.physics.arcade.collide(player, platform);
/*         if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            player.x +=2;
            player.animations.play('run');
            
        }else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && pKeyPressed){
            return;
        } */
        //runs function on key press

        runJumpIdle();

        game.input.keyboard.onPressCallback = function (e) {
            console.log("key pressed", e);


            //Will play animation until its finished
            switch (e) {
                //standard kick
                case 's':
                    player.animations.play('neutralKick');
                    playerCombo[0] = (player.animations.currentAnim.name);
                    pKeyPressed = 's';
                    console.log(playerCombo);
                    console.log(pKeyPressed);
                    break;

                // 'd' will be the special button. Hit this button attack the right time, and you might unleash a speciall attack or combo
                case 'd':

                    //will only play if the last attack(animation) was neutralPunch3


                    if (playerCombo[0] == 'neutralPunch3' && player.animations.currentAnim.name != 'idle') {
                        if (player.animations.currentAnim.name === 'neutralPunch3' || player.animations.currentAnim.isFinished) {
                            pKeyPressed = 'd';
                            player.animations.play('specialKick1');
                            playerCombo[0] = (player.animations.currentAnim.name);

                            console.log(playerCombo);
                        } else {
                            return;
                        }

                    }


                    break;
                //standard attack
                case 'a':
                
                    if (playerCombo[0] == 'neutralPunch1' && player.animations.currentAnim.name != 'idle') {
                        if (player.animations.currentAnim.name === 'neutralPunch1' || player.animations.currentAnim.isFinished) {

                            player.animations.play('neutralPunch2');
                            playerCombo[0] = (player.animations.currentAnim.name);
                            console.log(playerCombo);
                        } else {
                            return;
                        }
                    } else if (playerCombo[0] == 'neutralPunch2' && player.animations.currentAnim.name != 'idle') {
                        if (player.animations.currentAnim.name === 'neutralPunch2' || player.animations.currentAnim.isFinished) {

                            player.animations.play('neutralPunch3');
                            playerCombo[0] = (player.animations.currentAnim.name);
                            console.log(playerCombo);
                        } else {
                            return;
                        }
                    } else if (playerCombo[0] == 'neutralPunch3' && player.animations.currentAnim.name != 'idle') {
                        if (player.animations.currentAnim.name === 'neutralPunch3' || player.animations.currentAnim.isFinished) {

                            player.animations.play('neutralPunch4');
                            playerCombo[0] = (player.animations.currentAnim.name);
                            console.log(playerCombo);
                        } else {
                            return;
                        }
                    } else if (playerCombo[0] == 'neutralPunch4' && player.animations.currentAnim.name != 'idle') {
                        if (player.animations.currentAnim.name === 'neutralPunch4' || player.animations.currentAnim.isFinished) {
                            player.animations.play('neutralPunch5');
                            playerCombo[0] = (player.animations.currentAnim.name);
                            console.log(playerCombo);
                        } else {
                            return;
                        }
                    } else {
                        if ((player.animations.currentAnim.name === 'idle' || player.animations.currentAnim.name === 'run' ) || player.animations.currentAnim.isFinished) {
                            pKeyPressed = 'a';
                            player.animations.play('neutralPunch1');
                            playerCombo[0] = (player.animations.currentAnim.name);
                            console.log(playerCombo);
                        } else {
                            console.log('not ready');
                        }
                    }

                    break;

                    case 'ArrowRight':
                    console.log('left');
                    break;

                default:
                    break;
            }

        }
        game.input.keyboard.onUpCallback = function (e) {
            // These can be checked against Phaser.Keyboard.UP, for example.
            console.log(e);
        };




        
        movePlayerAttackBox(atkBox);

        //runs script to decide when the character should be playing its running, idle, or jumping anims
        function runJumpIdle (){
            //if current animation is finished, the idle animation will play, playerCombos will be rest as well as pKeyPressed
            if (player.animations.currentAnim.isFinished) {
                player.animations.play('idle');
                playerCombo = [];
                if(player.animations.currentAnim != 'neutralKick' || playerCombo === []){
                    pKeyPressed = '';
                }
               
    
            }else if(player.animations.currentAnim == 'idle' && player.animations.currentAnim != ('neutralKick' || 'neutralPunch1' || 'neutralPunch2' || 'neutralPunch3' || 'neutralPunch4'  ) || (!player.animations.currentAnim.isFinished)  ){
                if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && !pKeyPressed ){
                    player.animations.play('run');
                    player.x += 3;
                }else if(!game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || pKeyPressed || game.input.keyboard.isDown(Phaser.Keyboard.A) || game.input.keyboard.isDown(keys.d) || game.input.keyboard.isDown(keys.w) ){
                    player.animations.stop('run');
                }
            }


        }

        
        //renders hitbox temporarily while attacking (debugging)
        function movePlayerAttackBox(atkBox) {
            let posX = player.x + relativePosX;
            let posY = player.y + relativePosY;
            atkBox.x = posX;
            atkBox.y = posY;
            atkBox.alpha = 0;
          
            //sets the position of the hitbox
            atkBox.position = {
                x: posX,
                y: posY,
                type: 25
            }


            switch (playerCombo[0]) {
                case 'neutralPunch1':
                    relativePosX = 150;
                    relativePosY = 90;
                    atkBox.alpha = 0.6;
                    resetHitBox (atkBox);
                    break;
                case 'neutralPunch2':
                    relativePosX = 150;
                    relativePosY = 90;
                    atkBox.alpha = 0.6;
                    resetHitBox (atkBox);
                    break;
                case 'neutralPunch3':
                    atkBox.alpha = 0.6;
                    resetHitBox (atkBox);
                    break;
                case 'neutralPunch4':
                    atkBox.alpha = 0.6;
                    resetHitBox (atkBox);
                    break;

                case 'neutralPunch5':
                    relativePosX = 100;
                    relativePosY = 120;
                    atkBox.alpha = 0.6;
                    resetHitBox (atkBox);
                    break;
                case 'neutralKick':
                    relativePosX = 140;
                    relativePosY = 120;
                    atkBox.alpha = 0.6;
                    resetHitBox (atkBox);

                    break;
                case 'specialKick1':
                    //atkBox.angle = 45;
                    relativePosX = 30;
                    relativePosY = 90;
                    atkBox.width = 150;
                    atkBox.alpha = 0.6;
                    resetHitBox (atkBox);
                    break;
                default:
                    break;
            }
        }

        //reset the size, angle, and visibility of the hitbox after .5 sec

        function resetHitBox (hitbox){
            
            setTimeout(function(){
                hitbox.width = 40;
                hitbox.height = 40;
                hitbox.alpha = 0;
                hitbox.angle = 0;

            },500);


        }



    }
};
