let demo = window.demo || (window.demo = {});

let pSpeed = 15;

let player,
    dummy,
    //var containing the hitbox that we will render whwnever the plaer lanches an attack
    atkBox,
    //var that will contain the most recent anim name of an attack
    playerCombo = [],
    // null
    pDirection = '',
    //null
    currentKey = '',
    //var that will contain the key just pressed
    pKeyPressed,
    //var that if true, player is facing Left
    pLeft = false,
    //var that will contain the stages platform
    platform,
    platform1,
    platform2,
    platform3,
    battlefield,
    //checks to see if player is currently touching a platform
    isGrounded = false,

    dummyGrounded = false,
    //checks to see if player is currenlty jumping
    isPlayerJumping = false,
    //checks to see if the player is currently attacking from the air
    isPlayerAirAttack = false,
    timer = 1,
    isAtkBoxActive = false,



    //set of var that serves are 'gates' to which down air attack anim should be playing
    isDownAirAtk1 = false,
    isDownAirAtk2 = false,
    isDownAirAtk3 = false,




    //indicates if plaer can jump again
    canJumpAgain = true,

    //null
    playerJump = 15,
    //null
    jumpTimer,
    //
    canPlayerJump = true,

    //checks to see if player finished jumping 
    completedJump = true,
    //checks to see if player started jumping
    startedJump = false,

    atkBoxCanHurt = false,


    //meant for hitboxes, position relative to the sprite its a hitbox for
    relativePosX = 0,
    relativePosY = 0,
    isOverlapping = false,
    //null
    reseter,
    //null
    hasJumped = false,

    arrowKey,
    //null
    canCheckJump = true,





    /********************** HEALTH AND DAMAGE MULTIPLIER VARS********************* */



    //THE KNOCKBACK MECHANIC VARS
    // p denotes 'player' and d denotes 'dummy'
    pDamage = 0;
dDamage = 0;
pHP = 100,
    dHP = 100;

pLuck = 20;
dLuck = 20;

random = Math.floor(Math.random() * pLuck);


pStrength = 10;
dStrength = 10;

pWeight = 10;

pEvadesLeft = 5;


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
    'd': Phaser.KeyCode.D,
    'x': Phaser.KeyCode.X
};

demo.state1 = function () { };
demo.state1.prototype = {
    preload: function () {
        //preloads spritesheets to be used in create
        game.load.spritesheet('tester', 'resources/art/2xscott.png', 142, 136, 114);
        game.load.spritesheet('tester2', 'resources/art/test-scott-2.png', 213, 204, 114);
        game.load.spritesheet('ground', 'resources/art/big-platform.png');
        game.load.spritesheet('hbox', 'resources/art/hbox.png', 25, 25);
        game.load.spritesheet('platform1', 'resources/art/platform1.png', 50, 11);
        game.load.spritesheet('battlestage1', 'resources/art/base-stage1.png', 321, 126);



    },
    create: function () {
        // Starting game physics

        game.physics.startSystem(Phaser.Physics.ARCADE);

        //game.physics.arcade.gravity.y = 900;
        game.stage.backgroundColor = '#800080'
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // Generating player 1
        player = game.add.sprite(400, 100, 'tester');
        dummy = game.add.sprite(100, 100, 'tester2');



        //selects frames from the assigned spritesheet and sets them apart for its animation
        player.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
        player.animations.add('run', [8, 9, 10, 11, 12, 13, 14, 15], 12, false);
        //player.animations.add('jump', [16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 12, false);
        player.animations.add('startJump', [17, 18, 19, 20, 21, 22, 23, 24], 18, false);
        player.animations.add('loopJump', [24, 25], 12, true);
        player.animations.add('endJump', [27], 12, false);
        //neutralpunch2 would follow nuetralpunch1 after it finishes running, like a combo
        //would require input, let's say that hitting 'a' for example, would trigger neutralPunch1, if pressed again at the right...
        //..moment, would trigger neutralPunch2, and so forth 
        player.animations.add('neutralPunch1', [28, 29, 30, 31], 11, false);
        player.animations.add('neutralPunch2', [32, 33, 34, 35], 11, false);
        player.animations.add('neutralPunch3', [36, 37, 38], 11, false);

        player.animations.add('neutralPunch4', [39, 40], 11, false);
        player.animations.add('neutralPunch5', [41, 42, 43, 44], 11, false);
        player.animations.add('neutralKick', [45, 46, 47, 48, 49, 50, 51], 14, false);

        player.animations.add('specialKick1', [63, 64, 65, 66, 67, 68, 69], 14, false);

        player.animations.add('runAttack', [70, 71, 72, 73, 74, 75, 76, 77, 78], 16, false);
        player.animations.add('block', [79, 80, 81, 82, 83, 84, 85], 14, false);
        player.animations.add('lowKick', [86, 87, 88, 89, 90, 91], 14, false);
        player.animations.add('dodge', [92, 93, 94, 95], 14, false);
        player.animations.add('knockback', [96, 97, 98, 99, 100], 14, false);

        player.animations.add('startDwnKick', [100, 101, 102], 12, false);
        player.animations.add('loopDwnKick', [103, 104, 105], 12, true);
        player.animations.add('endDwnKick', [106], 12, false);

        player.animations.add('slideKick', [107, 108, 109, 110, 111, 112, 113], 16, false);



        dummy.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
        dummy.animations.add('run', [8, 9, 10, 11, 12, 13, 14, 15], 12, false);
        //player.animations.add('jump', [16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 12, false);
        dummy.animations.add('startJump', [17, 18, 19, 20, 21, 22, 23, 24], 18, false);
        dummy.animations.add('loopJump', [24, 25], 12, true);
        dummy.animations.add('endJump', [27], 12, false);
        //neutralpunch2 would follow nuetralpunch1 after it finishes running, like a combo
        //would require input, let's say that hitting 'a' for example, would trigger neutralPunch1, if pressed again at the right...
        //..moment, would trigger neutralPunch2, and so forth 
        dummy.animations.add('neutralPunch1', [28, 29, 30, 31], 11, false);
        dummy.animations.add('neutralPunch2', [32, 33, 34, 35], 11, false);
        dummy.animations.add('neutralPunch3', [36, 37, 38], 11, false);

        dummy.animations.add('neutralPunch4', [39, 40], 11, false);
        dummy.animations.add('neutralPunch5', [41, 42, 43, 44], 11, false);
        dummy.animations.add('neutralKick', [45, 46, 47, 48, 49, 50, 51], 12, false);

        dummy.animations.add('specialKick1', [63, 64, 65, 66, 67, 68, 69], 14, false);

        dummy.animations.add('runAttack', [70, 71, 72, 73, 74, 75, 76, 77, 78], 16, false);
        dummy.animations.add('block', [79, 80, 81, 82, 83, 84, 85], 14, false);
        dummy.animations.add('lowKick', [86, 87, 88, 89, 90, 91], 14, false);
        dummy.animations.add('dodge', [92, 93, 94, 95], 14, false);
        dummy.animations.add('knockback', [96, 97, 98, 99, 100], 14, false);

        dummy.animations.add('startDwnKick', [100, 101, 102], 12, false);
        dummy.animations.add('loopDwnKick', [103, 104, 105], 12, true);
        dummy.animations.add('endDwnKick', [106], 12, false);

        dummy.animations.add('slideKick', [107, 108, 109, 110, 111, 112, 113], 16, false);




        //creates hitbox when player attacks
        //gets attack animname passed in playerCombo
        //based on what attack it is, it renders around the attack point, and disappears after 1 second

        //creates a hitbox group
        hitboxes = game.add.group();
        hitboxes.enableBody = true;

        //creates an instance of hitbox;
        atkBox = hitboxes.create(0, 0, 'hbox');
        //sets the size of the hitbox, without any offset
        //atkBox.body.setSize(15, 15, 0, 0);

        //plays added animaiton
        player.animations.play('idle');

        dummy.animations.play('idle');

        //opens up info on current anim
        console.log(player.animations.currentAnim);
        //gets name for current anim
        console.log(player.animations.currentAnim.name);
        //returns if current anim is finished
        console.log(player.animations.currentAnim.isFinished);


        // Creating platform
        platform = game.add.sprite(400, 500, 'platform1');
       platform2 = game.add.sprite(500, 300, 'platform1');
        platform3 = game.add.sprite(800, 500, 'platform1');
        battlefield = game.add.sprite(200, 500, 'battlestage1');


        //enables gravity on player but not on platform
        game.physics.arcade.enable([player, dummy, platform, platform2, platform3,battlefield, atkBox]);
        //player.body.collideWorldBounds = true;
        //dummy.body.collideWorldBounds = true;

        platform.enableBody = true;
        platform2.enableBody = true;
        platform3.enableBody = true;
        battlefield.enableBody = true;
        battlefield.scale.setTo(2,2);
        battlefield.body.setSize(321,126,0,25);

        player.body.gravity.y = 1900;
        
        dummy.body.gravity.y = 2100;
        //dummy.body.gravity.set(0, 180);

        dummy.body.drag.x = 400;
        dummy.body.drag.y = 0;


        //testing player collsinion box resize

        player.body.setSize(60, 120, 20, 15);
        dummy.body.setSize(104, 176, 30, 30);



        platform.body.immovable = true;
        platform2.body.immovable = true;
        platform3.body.immovable = true;
        battlefield.body.immovable = true;

        console.log(atkBox);
        console.log(player);
        console.log(game.input.keyboard._onKeyPress(Phaser.Keyboard.RIGHT));

    },
    update: function () {

        //player and platform will collide

        game.physics.arcade.collide(player, [platform, platform1, platform2,platform3, battlefield], signalGrounded);
        game.physics.arcade.collide(dummy, [platform, platform1, platform2, platform3, battlefield]);
        game.physics.arcade.overlap(atkBox, dummy, hit);

        game.debug.body(player);
        game.debug.body(dummy);
        //runs function on key press



        moveRunAttack(player, 'runAttack', 10);
        moveRunAttack(player, 'slideKick', 12);










        //returns name of key pressed (does not include arrow keys)
        game.input.keyboard.onPressCallback = function (e) {
            console.log("key pressed", e);

            currentKey = e;
            setInterval(function () {
                currentKey = '';
            }, 100)


            //Will play animation until its finished
            switch (e) {
                //standard kick
                case 's':
                    //if the player is'nt jumping or running
                    //then the player will kick normally
                    if (!isPlayerJumping && player.animations.currentAnim.name !== 'run') {
                        player.animations.play('neutralKick');
                        playerCombo[0] = (player.animations.currentAnim.name);
                        pKeyPressed = 's';
                        console.log(playerCombo);
                        console.log(pKeyPressed);


                        //if he is jumping, then will set isPlayerAirAttack to true
                        //this will allow downAerial() to run and the initiate the DownAirKick animation
                    } else if (isPlayerJumping) {
                        isPlayerAirAttack = true;
                        console.log(isPlayerAirAttack);


                        //if the player is running either to the left or right side, and if the current animation is not already 'slidekick'
                        //then play the 'slideKick' animation
                        //would not want to play the same animation if its already playing....
                    } else if ((game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) && player.animations.currentAnim.name != 'slideKick' && player.animations.currentAnim.name == 'run') {
                        pKeyPressed = 's';
                        player.animations.play('slideKick');
                        playerCombo[0] = (player.animations.currentAnim.name);
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
                        //forward attack OR attack while running
                    } else if ((game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) && player.animations.currentAnim.name != 'runAttack' && player.animations.currentAnim.name == 'run') {
                        pKeyPressed = 'd';

                        player.animations.play('runAttack');
                        playerCombo[0] = (player.animations.currentAnim.name);
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
                    //initizates the jumping animation by setting isPlayerJumping to true
                    //stoping the 'idle anim if its currently playing
                    //sets isGrounded to false since the player is not longer on the floor
                    isPlayerJumping = true;
                    player.animations.stop('idle');

                    isGrounded = false;
                    playerCombo[0] = 'jump';
                    //player.animations.play('jump');



                    break;
                case 'z':
                    //initiates the 'block' anim
                    //will be used to block attacks
                    //possibly counter them as well, might add another mechanic for that soon
                    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                        player.animations.stop('idle');
                        player.animations.play('dodge');

                    } else {
                        player.animations.stop('idle');
                        player.animations.play('block');

                    }

                    break;
                default:
                    break;
            }

        }


        game.input.keyboard.onUpCallback = function (e) {
            // These can be checked against Phaser.Keyboard.UP, for example.
            console.log(e);
        };

        game.input.keyboard.onUpCallback = function (e) {
            if (e.keyCode == Phaser.Keyboard.X) {
                canJumpAgain = true;
            }
        };






        movePlayerAttackBox(atkBox);

        jump(player, 5);
        runJumpIdle();
        jumpAnimLoop(player);
        glideDownJump(player, 1200, 800);

        hurt(dummy);






        //**************** H E L P E R    F U N C T I O N S*******************//

        //will only run if the player collides with a platform
        function signalGrounded() {
            isGrounded = true;
        }



        //manipulates sprite gravity when jumping and falling
        //how far should the character jump and fast should he fall?
        function glideDownJump(sprite, fallingGravity, postGravity) {
            if (!isGrounded || playerCombo[0] === 'jump') {
                sprite.body.gravity.y = fallingGravity;
            } else {
                sprite.body.gravity.y = postGravity;
            }



        }

        //initiates the jump animation
        //there are 3 anims.
        //1 for starting to jump, another to loop while in mid-air, and another that plays when landing

        function jumpAnimLoop(sprite) {

            if (completedJump) {

                if (!isPlayerAirAttack && canPlayerJump) {
                    if ((isGrounded && startedJump) || (isGrounded && startedJump && playerCombo[0] == 'jump')) {
                        console.log('ending jump');
                        sprite.animations.play('endJump');
                        startedJump = false;

                        isPlayerJumping = false;
                        canPlayerJump = false;
                        setTimeout(function () {

                            canPlayerJump = true;
                        }, 400);

                    }
                    else if (playerCombo[0] == 'jump' && !isGrounded && startedJump) {
                        console.log('looping');
                        sprite.animations.play('loopJump');
                    } else if (playerCombo[0] == 'jump' && !isGrounded && !startedJump) {
                        startedJump = true;
                        isPlayerJumping = true;
                        sprite.animations.stop('idle');
                        sprite.animations.play('startJump');
                        console.log('current');


                        //completedJump = false;
                    } else {
                        return false;
                    }
                } else {
                    return;
                }
            }

        }

        downAerial();
        dwnArialMotion(player, 'high');

        //param 1 = sprite name , param 2 = level of speed for the movement
        //For param 2 you can pass 'low' , 'med' , 'high' , 'ultra'
        function dwnArialMotion(sprite, intensity) {
            if (intensity.toLowerCase() == 'low') {
                if (sprite.animations.currentAnim.name == 'loopDwnKick') {
                    if (pLeft) {
                        sprite.x -= 7;
                    } else {
                        sprite.x += 7;
                    }

                    sprite.y -= 7;
                } else {
                    return;
                }
            } else if (intensity.toLowerCase() == 'med') {
                if (sprite.animations.currentAnim.name == 'loopDwnKick') {
                    if (pLeft) {
                        sprite.x -= 9;
                    } else {
                        sprite.x += 9;
                    }
                    sprite.y -= 7;
                } else {
                    return;
                }
            } else if (intensity.toLowerCase() == 'high') {
                if (sprite.animations.currentAnim.name == 'loopDwnKick') {
                    if (pLeft) {
                        sprite.x -= 11;
                    } else {
                        sprite.x += 11;
                    }
                    sprite.y -= 8;
                } else {
                    return;
                }
            } else if (intensity.toLowerCase() == 'ultra') {
                if (sprite.animations.currentAnim.name == 'loopDwnKick') {
                    if (pLeft) {
                        sprite.x -= 14;
                    } else {
                        sprite.x += 14;
                    }

                    sprite.y -= 14;
                } else {
                    return;
                }
            }

        }

        //inits the down areial attack. For now this will show the sprite kicking downwards until he hits the platform

        function downAerial() {
            if (isPlayerAirAttack) {
                if (!isDownAirAtk1) {
                    isDownAirAtk1 = true;
                    player.animations.play('startDwnKick');
                    /* if (player.animations.currentAnim.isFinished) { */

                    isDownAirAtk2 = true;
                    console.log('a')

                } else if (isDownAirAtk2 && !isGrounded) {
                    player.animations.play('loopDwnKick');
                    playerCombo[0] = 'loopDwnKick';
                    /* if (player.animations.currentAnim.isFinished) { */
                    isDownAirAtk2 = false;
                    isDownAirAtk3 = true;

                    console.log('b')

                } else if (isDownAirAtk3 && isGrounded && completedJump) {
                    player.animations.play('endDwnKick');
                    isDownAirAtk2 = true;
                    isDownAirAtk3 = false;
                    isDownAirAtk1 = false;
                    isPlayerAirAttack = false;
                    console.log('c')
                }
            } else {
                return;
            }


        }

        //starts our jump motion
        function jump(sprite, maxHeight) {

            let height = 0;

            do {
                height++;
                sprite.y -= height

            } while (game.input.keyboard.isDown(Phaser.Keyboard.X) && height < maxHeight);
        }

        //mainly used for forward attacks
        function moveForward(sprite, max) {
            let distance = 0;

            while (game.input.keyboard.isDown(Phaser.Keyboard.D) && distance < max) {
                distance++;
                sprite.x += 1;
            }
        }



        //runs script to decide when the character should be playing its running, idle, or jumping anims
        function runJumpIdle() {
            //if current animation is finished, the idle animation will play, playerCombos will be rest as well as pKeyPressed

            //HANDLES IDLE ANIM
            if (player.animations.currentAnim.isFinished) {
                if (game.input.keyboard.isDown(Phaser.Keyboard.X) || !completedJump || player.animations.currentAnim.name == ('jump' || 'startjump' || 'loopJump' || 'endJump')) {
                    player.animations.stop('idle');
                    //playerCombo = [];

                    pKeyPressed = '';
                } else if (completedJump || (!game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && player.animations.currentAnim.name == 'run' || !game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && player.animations.currentAnim.name == 'run')) {

                    player.animations.play('idle');
                    playerCombo = [];
                    console.log('asas');
                    pKeyPressed = '';
                }
                //HANDLES RUN ANIM
            } else if ((player.animations.currentAnim.name == 'idle' || player.animations.currentAnim.name == 'run' || player.animations.currentAnim.name == 'jump' || isGrounded) && player.animations.currentAnim.name != ('neutralKick' || 'neutralPunch1' || 'neutralPunch2' || 'neutralPunch3' || 'neutralPunch4') || (!player.animations.currentAnim.isFinished)) {
                if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && (!pKeyPressed && player.animations.currentAnim.name !== 'runAttack')) {
                    player.scale.setTo(1, 1);
                    pLeft = false;

                    player.x += 8;
                    if (player.animations.currentAnim.name != ('jump' || 'startjump' || 'loopJump' || 'endJump') && (!game.input.keyboard.isDown(Phaser.Keyboard.X) && isGrounded !== false || startedJump == false)) {
                        player.animations.play('run');
                    }
                } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && (!pKeyPressed && player.animations.currentAnim.name !== 'runAttack')) {
                    player.scale.setTo(-1, 1);
                    pLeft = true;
                    if (player.animations.currentAnim.name != ('jump' || 'startjump' || 'loopJump' || 'endJump') && (!game.input.keyboard.isDown(Phaser.Keyboard.X) && isGrounded !== false || startedJump == false)) {
                        player.animations.play('run');
                    }

                    player.x -= 8;

                } else if ((!game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) || (!game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) || pKeyPressed || game.input.keyboard.isDown(Phaser.Keyboard.A) || game.input.keyboard.isDown(keys.d) || game.input.keyboard.isDown(keys.w) || game.input.keyboard.isDown(keys.x) || startedJump) {
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
            atkBox.angle = 0;

            //sets the position of the hitbox
            atkBox.position = {
                x: posX,
                y: posY,
                type: 25
            }


            switch (playerCombo[0]) {
                case 'neutralPunch1':
                    if (pLeft) {
                        relativePosX = -110;
                        relativePosY = 55;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);

                    } else {
                        relativePosX = 80;
                        relativePosY = 55;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                case 'neutralPunch2':
                    if (pLeft) {
                        relativePosX = -110;
                        relativePosY = 55;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        relativePosX = 80;
                        relativePosY = 55;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                case 'neutralPunch3':
                    if (pLeft) {
                        relativePosX = -110;
                        relativePosY = 55;
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
                        relativePosX = -95;
                        relativePosY = 65;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        relativePosX = 65;
                        relativePosY = 65;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                case 'neutralKick':
                    if (pLeft) {
                        relativePosX = -110;
                        relativePosY = 70;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        relativePosX = 80;
                        relativePosY = 70;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }


                    break;
                case 'specialKick1':
                    if (pLeft) {
                        relativePosX = -100;
                        relativePosY = 60;
                        atkBox.height = 30;
                        atkBox.width = 75;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        //atkBox.angle = 45;
                        relativePosX = 30;
                        relativePosY = 60;
                        atkBox.height = 30;
                        atkBox.width = 75;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                case 'runAttack':
                    if (pLeft) {
                        relativePosX = -110;
                        relativePosY = 40;
                        atkBox.height = 40;
                        atkBox.width = 55;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        //atkBox.angle = 45;
                        relativePosX = 60;
                        relativePosY = 40;
                        atkBox.height = 40;
                        atkBox.width = 55;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                case 'loopDwnKick':
                    if (pLeft) {
                        atkBox.angle = -25;
                        relativePosX = -150;
                        relativePosY = 80;
                        atkBox.height = 25;
                        atkBox.width = 50;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        atkBox.angle = 25;
                        relativePosX = 120;
                        relativePosY = 80;
                        atkBox.height = 25;
                        atkBox.width = 50;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                case 'slideKick':
                    if (pLeft) {
                        relativePosX = -130;
                        relativePosY = 110;
                        atkBox.height = 15;
                        atkBox.width = 60;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    } else {
                        //atkBox.angle = 45;
                        relativePosX = 80;
                        relativePosY = 110;
                        atkBox.height = 15;
                        atkBox.width = 60;
                        atkBox.alpha = 0.6;
                        resetHitBox(atkBox);
                    }

                    break;
                default:
                    break;
            }
        }

        //reset the size, angle, and visibility of the hitbox after .5 sec



        //plays an animations when either the right or left arrows are held down
        function moveRunAttack(sprite, animName, speed) {
            if (sprite.animations.currentAnim.name == animName && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                sprite.x += speed;

            } else if (sprite.animations.currentAnim.name == animName && game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                sprite.x -= speed;
            }
        }

        //collision type denotes what collsiion are we focusing on with the sprite that gets hit?
        //is it a bounding box or another sprite? (sprite simialr to hbox.png)




        //********************************************HIT LOGIC********************* */

        //the following code is extemely crude and is only used for testing purposes

        //this entire file will be refactored soon.



        function hit() {
            if (player.animations.currentAnim.name != 'idle' && (['neutralKick', 'neutralPunch1', 'neutralPunch2',

                'neutralPunch3', 'neutralPunch4', 'specialKick1', 'runAttack', 'slideKick', 'loopDwnKick'].includes(player.animations.currentAnim.name))) {
                isOverlapping = true;
                isAtkBoxActive = true;
            } else {
                isOverlapping = false;
                isAtkBoxActive = false;
            }

        }
        groundDummy(dummy);
        function groundDummy(sprite) {
            if (sprite.body.velocity.y == 0) {
                dummyGrounded = true;
            } else {
                dummyGround = false;
            }

        }

        //slowDownXVel (dummy);
        function slowDownXVel(sprite) {
            if (sprite.body.velocity.y == 0 && dummyGrounded) {
                sprite.body.velocity.setTo(0);
            }




        }



        //resets the hitbox's attributes
        function resetHitBox(hitbox) {

            setTimeout(function () {
                hitbox.width = 25;
                hitbox.height = 25;
                hitbox.alpha = 0;
                hitbox.angle = 0;
                atkBoxCanHurt = false;

            }, 100);


        }



    }
};


function getLaunchAmount(hitbox, attacker, injured, currentDamage) {
    let Xvector;
    let Yvector;
    console.log(attacker.animations.currentAnim.name);
    if (isOverlapping && isAtkBoxActive) {
        if (attacker.animations.currentAnim.name == 'slideKick') {
            Xvector = 15 + currentDamage;
            Yvector = -500 - currentDamage;
        } else if ((['neutralPunch1', 'neutralPunch2', 'neutralPunch3'].includes(attacker.animations.currentAnim.name))) {
            if (pLeft) {
                Xvector = -1 - currentDamage;

            } else {
                Xvector = 1 + currentDamage;

            }

        } else if (attacker.animations.currentAnim.name == 'neutralPunch4') {
            if (pLeft) {
                Xvector = -25 - currentDamage;
                Yvector = -100 - currentDamage;

            } else {
                Xvector = 25 + currentDamage;
                Yvector = -100 - currentDamage;

            }
        } else if (attacker.animations.currentAnim.name == 'specialKick1') {
            if (pLeft) {
                Xvector = -35 - currentDamage;
                Yvector = -120 - currentDamage;

            } else {
                Xvector = 35 + currentDamage;
                Yvector = -120 - currentDamage;

            }
        } else if (attacker.animations.currentAnim.name == 'neutralKick') {
            if (pLeft) {
                Xvector = -90 - currentDamage;
                

            } else {
                Xvector = 90 + currentDamage;
               

            }
        }else if (attacker.animations.currentAnim.name == 'runAttack') {
            if (pLeft) {
                Xvector = -300 - currentDamage;
                Yvector = -200 - currentDamage;

                

            } else {
                Xvector = 300 + currentDamage;
                Yvector = -200 - currentDamage;
               

            }
        }else if (attacker.animations.currentAnim.name == 'loopDwnKick') {
            if (pLeft) {
                Xvector = -300 - currentDamage;
                Yvector = 280 + currentDamage;

                

            } else {
                Xvector = 300 + currentDamage;
                Yvector = 280 + currentDamage;
               

            }
        }

    }

    launchSprite(null, injured, true, Xvector, Yvector);

}
//hitbox = name of attacker's hitbox
//injured = the name of the sprite that recived the hit
//isSpec = if there ther is a specified velocity from an attack anim
//if so, then add those coords to x and y (these amounts are acutally passed with getLaunchAmount)

function launchSprite(hitbox, injured, isSpec, x, y) {
    if (isSpec) {
        injured.body.velocity.setTo(x, y);
    } else {
        Xvector = ((hitbox.x - injured.x) * (3));
        Yvector = ((hitbox.y - injured.y) * (3));

        injured.body.velocity.setTo(Xvector, Yvector);
    }


}


function hurt(sprite, pushback, length, collisionType, hboxName) {
    if (isOverlapping && isAtkBoxActive) {
        dDamage += 0.93;
        console.log(dDamage);
        sprite.animations.play('knockback');
        getLaunchAmount(null, player, dummy, dDamage);
        isOverlapping = false;
        isAtkBoxActive = false;
        //sprite.body.velocity = 0;
    }

}