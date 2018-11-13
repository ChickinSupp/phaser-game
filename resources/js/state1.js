let demo = window.demo || (window.demo = {});

let pSpeed = 15;

let player,
    atkBox,
    playerCombo = [],
    pKeyPressed,
    pLeft = false,
    platform,
    isGrounded = false,
    canJumpAgain = true,
    playerJump = 15,
    relativePosX = 0,
    relativePosY = 0,
    reseter,
    hasJumped = false,
    arrowKey,
    canCheckJump = true;

/* window.addEventListener("keydown", function (event) {


}); */

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

        game.physics.arcade.collide(player, platform, signalGrounded);
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
                    if (player.animations.currentAnim.name != 'jump') {
                        player.animations.play('neutralKick');
                        playerCombo[0] = (player.animations.currentAnim.name);
                        pKeyPressed = 's';
                        console.log(playerCombo);
                        console.log(pKeyPressed);
                    }

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

                    if (playerCombo[0] == 'neutralPunch1' && player.animations.currentAnim.name != 'idle' && player.animations.currentAnim.name != 'jump') {
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
                        if ((player.animations.currentAnim.name === 'idle' || player.animations.currentAnim.name === 'run') || player.animations.currentAnim.isFinished) {
                            pKeyPressed = 'a';
                            player.animations.play('neutralPunch1');
                            playerCombo[0] = (player.animations.currentAnim.name);
                            console.log(playerCombo);
                        } else {
                            console.log('not ready');
                        }
                    }

                    break;
                case 'x':
                
                    player.animations.stop('idle');
                    isGrounded = false;
                    player.animations.play('jump');
                    

                    break;

                default:
                    break;
            }

        }
        game.input.keyboard.onUpCallback = function (e) {
            // These can be checked against Phaser.Keyboard.UP, for example.
            console.log(e);
        };

        game.input.keyboard.onUpCallback = function( e ){            
            if(e.keyCode == Phaser.Keyboard.X){                
                    canJumpAgain = true;
                }          
              }     ;
            
        





        movePlayerAttackBox(atkBox);

        jump(player, 5);




        //**************** H E L P E R    F U N C T I O N S*******************//

        function signalGrounded() {
           
                isGrounded = true;

            
           
                player.animations.stop('jump');

            
            
        }
        function jump(sprite, maxHeight) {
            
            
                let height = 0;
            
                do {
                    height++;
                    sprite.y -= height
                } while (game.input.keyboard.isDown(Phaser.Keyboard.X) && height < maxHeight);
            


        }

        /* && !player.animations._anims.jump.isFinished */

        //runs script to decide when the character should be playing its running, idle, or jumping anims
        function runJumpIdle() {
            //if current animation is finished, the idle animation will play, playerCombos will be rest as well as pKeyPressed

          
            if (player.animations.currentAnim.isFinished ) {
                if(game.input.keyboard.isDown(Phaser.Keyboard.X) ){
                    player.animations.stop('idle');
                    playerCombo = [];
                    
                    pKeyPressed = ''; 
                }else{
                    player.animations.play('idle');
                    playerCombo = [];
                    
                    pKeyPressed = ''; 
                }

                

                //insert OR 'run'
            } else if ((player.animations.currentAnim == 'idle' || player.animations.currentAnim == 'run' || player.animations.currentAnim == 'jump' || isGrounded) && player.animations.currentAnim != ('neutralKick' || 'neutralPunch1' || 'neutralPunch2' || 'neutralPunch3' || 'neutralPunch4') || (!player.animations.currentAnim.isFinished)) {
                if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && !pKeyPressed) {
                    player.scale.setTo(1, 1);
                    pLeft = false;

                    player.x += 8;
                    if (player.animations.currentAnim != 'jump' && !game.input.keyboard.isDown(Phaser.Keyboard.X) && isGrounded == true) {
                        player.animations.play('run');
                    }
                } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !pKeyPressed) {
                    player.scale.setTo(-1, 1);
                    pLeft = true;
                    if (player.animations.currentAnim != 'jump' && !game.input.keyboard.isDown(Phaser.Keyboard.X)  && isGrounded == true) {
                        player.animations.play('run');
                    }

                    player.x -= 8;

                } else if ((!game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) || (!game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) || pKeyPressed || game.input.keyboard.isDown(Phaser.Keyboard.A) || game.input.keyboard.isDown(keys.d) || game.input.keyboard.isDown(keys.w)) {
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
                    if (pLeft) {
                        relativePosX = -180;
                        relativePosY = 90;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        relativePosX = 150;
                        relativePosY = 90;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                case 'neutralPunch2':
                    if (pLeft) {
                        relativePosX = -180;
                        relativePosY = 90;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        relativePosX = 150;
                        relativePosY = 90;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                case 'neutralPunch3':
                    if (pLeft) {
                        relativePosX = -180;
                        relativePosY = 90;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                case 'neutralPunch4':
                    if (pLeft) {
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;

                case 'neutralPunch5':
                    if (pLeft) {
                        relativePosX = -150;
                        relativePosY = 110;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        relativePosX = 100;
                        relativePosY = 110;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                case 'neutralKick':
                    if (pLeft) {
                        relativePosX = -180;
                        relativePosY = 115;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        relativePosX = 140;
                        relativePosY = 120;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }


                    break;
                case 'specialKick1':
                    if (pLeft) {
                        relativePosX = -170;
                        relativePosY = 90;
                        atkBox.height = 45;
                        atkBox.width = 150;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        //atkBox.angle = 45;
                        relativePosX = 30;
                        relativePosY = 90;
                        atkBox.height = 45;
                        atkBox.width = 150;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                default:
                    break;
            }
        }

        //reset the size, angle, and visibility of the hitbox after .5 sec

        function resetHitBox(hitbox) {

            setTimeout(function () {
                hitbox.width = 40;
                hitbox.height = 40;
                hitbox.alpha = 0;
                hitbox.angle = 0;

            }, 500);


        }



    }
};
