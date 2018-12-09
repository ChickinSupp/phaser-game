let demo = window.demo || (window.demo = {});
let manager;
let emitter;
let dude = new Character('scott', 10, 1900);
let comp = new Character('dummy', 10, 1500);

//contains all our booleans and stats for a character
function Character(name, power, gravity) {
    this.name = name;
    this.combo = [];
    this.stats = {
        damage: 0,
        power: power,
        evades: 5,
        gravity: gravity,
        jumpH: 0,

    };
    this.isLeft = false;
    this.keyPressed = '';
    this.isGrounded = false;
    this.isJumping = false;
    this.isAirAttack = false;
    this.isAirDodging = false;
    this.isDodging = false;
    this.canAirDodge = true;
    this.airDownChecks = {
        downAirAtk1: false,
        downAirAtk2: false,
        downAirAtk3: false,
    };
    this.canPlayerJump = true;
    this.completedJump = true;
    this.startedJump = false;
    this.onlyDoOnce = false;
    this.canPlayerJump = true;
    this.airDodgeDirect = '';
    this.shield = {
        shieldHp: 100,
        shieldActive: false,
        shieldX: 0,
        shieldY: 0,
    };
    this.hitbox = {
        X: 0,
        Y: 0,
        isOverlapping: false,
        isAtkBoxActive: false,
    };
    this.canAirRecover = true;
    this.isAirRecovering = false;
    this.isInvincible = false;
    this.timedBonusAnim;
    this.timedBonus = false;
    this.stopMotion = false;
    this.glideDownJump = function (sprite, fallingGravity, postGravity) {
        if (!this.isGrounded || this.combo[0] === 'jump') {
            sprite.body.gravity.y = fallingGravity;
        } else {
            sprite.body.gravity.y = postGravity;
        }


    };
    this.jumpAnimLoop = function (sprite) {
        if (this.completedJump) {

            if (!this.isAirAttack && !this.isAirDodging && this.canPlayerJump && sprite.animations.currentAnim.name !== 'airDodge' && sprite.animations.currentAnim.name !== 'airRecovery' && sprite.animations.currentAnim.name !== 'airNeutral') {
                if ((this.isGrounded && this.startedJump) || (this.isGrounded && this.startedJump && this.combo[0] == 'jump')) {
                    console.log('ending jump');
                    sprite.animations.play('endJump');
                    this.startedJump = false;

                    this.isJumping = false;
                    this.canPlayerJump = false;
                    /*                       setTimeout(function () {

                                              canPlayerJump = true;
                                          }, 400); */

                }
                else if (!this.isGrounded && this.startedJump) {
                    console.log('looping');
                    sprite.animations.play('loopJump');
                } else if (this.combo[0] == 'jump' && !this.isGrounded && !this.startedJump) {
                    this.startedJump = true;
                    this.isJumping = true;
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
    };
    this.downAerialMotion = function (sprite, intensity) {
        if (intensity.toLowerCase() == 'low') {
            if (sprite.animations.currentAnim.name == 'loopDwnKick') {
                if (this.isLeft) {
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
                if (this.isLeft) {
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
                if (this.isLeft) {
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
                if (this.isLeft) {
                    sprite.x -= 14;
                } else {
                    sprite.x += 14;
                }

                sprite.y -= 14;
            } else {
                return;
            }
        }
    };
    this.downAerial = function (sprite) {
        if (this.isAirAttack) {
            if (!this.airDownChecks.isDownAirAtk1) {
                this.airDownChecks.isDownAirAtk1 = true;
                sprite.animations.play('startDwnKick');
                /* if (player.animations.currentAnim.isFinished) { */

                this.airDownChecks.isDownAirAtk2 = true;
                console.log('a')

            } else if (this.airDownChecks.isDownAirAtk2 && !this.isGrounded) {
                sprite.animations.play('loopDwnKick');
                this.combo[0] = 'loopDwnKick';
                /* if (player.animations.currentAnim.isFinished) { */
                this.airDownChecks.isDownAirAtk2 = false;
                this.airDownChecks.isDownAirAtk3 = true;

                console.log('b')

            } else if (this.airDownChecks.isDownAirAtk3 && this.isGrounded && this.completedJump) {
                sprite.animations.play('endDwnKick');
                this.airDownChecks.isDownAirAtk2 = true;
                this.airDownChecks.isDownAirAtk3 = false;
                this.airDownChecks.isDownAirAtk1 = false;
                this.isAirAttack = false;
                console.log('c')
            }
        } else {
            return;
        }
    };


    this.jump = function (sprite, maxHeight) {

        if (!this.isAirDodging && game.input.keyboard.isDown(Phaser.Keyboard.X) && this.stats.jumpH < 30) {
            this.stats.jumpH++;
            sprite.y -= 15;
        } else {
            return;
        }
    };
    this.runIdleControl = function (sprite) {
        if (!this.stopMotion) {
            if (sprite.animations.currentAnim.isFinished) {
                if (this.isDodging && (['startJump', 'loopJump', 'dodge', 'block', 'moveDodge'].includes(sprite.animations.currentAnim.name))) {
                    sprite.animations.stop('idle');
                    //spriteCombo = [];
                    console.log('dddaaaaaad');
                    this.keyPressed = '';
                } else if ((!this.isDodging || !this.isAirDodging) && !game.input.keyboard.isDown(Phaser.Keyboard.Z) && !game.input.keyboard.isDown(Phaser.Keyboard.X) && this.completedJump || (!game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && sprite.animations.currentAnim.name == 'run' || !game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && sprite.animations.currentAnim.name == 'run')) {
                    this.onlyDoOnce = false;
                    this.canPlayerJump = true;
                    sprite.animations.play('idle');
                    this.combo = [];
                    this.canAirRecover = true;
                    console.log('asas');
                    this.keyPressed = '';
                    this.timedBonusAnim = '';
                }
                //HANDLES RUN ANIM  isspriteAirDodging
            } else if (((!this.shield.shieldActive || !this.isAirDodging) && sprite.animations.currentAnim.name == 'idle' || sprite.animations.currentAnim.name == 'run' || sprite.animations.currentAnim.name == 'jump' || this.isGrounded) && !['neutralKick', 'neutralPunch1', 'neutralPunch2', 'neutralPunch3', 'neutralPunch4'].includes(sprite.animations.currentAnim.name) || (!sprite.animations.currentAnim.isFinished)) {
                if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && ((!['s', 'a'].includes(this.keyPressed)) && sprite.animations.currentAnim.name !== 'runAttack' && (!this.isAirDodging && !this.shield.shieldActive))) {
                    sprite.scale.setTo(1, 1);
                    this.isLeft = false;

                    if (sprite.animations.currentAnim.name == 'airNeutral') {
                        sprite.x += 13;
                    } else {
                        sprite.x += 8;
                    }

                    console.log('sssa');


                    if ((!['jump', 'startJump', 'loopJump', 'endJump', 'dodge', 'block', 'moveDodge', 'loopDwnKick', 'airDodge'].includes(sprite.animations.currentAnim.name)) && (!game.input.keyboard.isDown(Phaser.Keyboard.X) && this.isGrounded !== false || this.startedJump == false)) {
                        sprite.animations.play('run');
                    }
                } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && ((!['s', 'a'].includes(this.keyPressed)) && sprite.animations.currentAnim.name !== 'runAttack' && (!this.isAirDodging && !this.shield.shieldActive))) {
                    sprite.scale.setTo(-1, 1);
                    this.isLeft = true;


                    if (sprite.animations.currentAnim.name == 'airNeutral') {
                        sprite.x -= 13;
                    } else {
                        sprite.x -= 8;
                    }
                    console.log(' running left');

                    if ((!['jump', 'startJump', 'loopJump', 'endJump', 'dodge', 'block', 'moveDodge', 'loopDwnKick', 'airDodge'].includes(sprite.animations.currentAnim.name)) && (!game.input.keyboard.isDown(Phaser.Keyboard.X) && this.isGrounded !== false || this.startedJump == false)) {
                        sprite.animations.play('run');
                    }

                } else if ((!game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) || (!game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) || this.keyPressed || game.input.keyboard.isDown(Phaser.Keyboard.Z) || game.input.keyboard.isDown(Phaser.Keyboard.A) || game.input.keyboard.isDown(keys.d) || game.input.keyboard.isDown(keys.w) || game.input.keyboard.isDown(keys.x) || this.startedJump) {
                    sprite.animations.stop('run');


                }
            }



        } else {
            return;
        }
    };
    this.moveAttackBox = function (atkBox, sprite, charObj) {
        let posX = sprite.x + this.hitbox.X;
        let posY = sprite.y + this.hitbox.Y;
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


        switch (this.combo[0]) {
            case 'neutralPunch1':
                if (this.isLeft) {
                    this.hitbox.X = -110;
                    this.hitbox.Y = 104;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);

                } else {
                    this.hitbox.X = 80;
                    this.hitbox.Y = 104;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'neutralPunch2':
                if (this.isLeft) {
                    this.hitbox.X = -110;
                    this.hitbox.Y = 104;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    this.hitbox.X = 80;
                    this.hitbox.Y = 104;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'neutralPunch3':
                if (this.isLeft) {
                    this.hitbox.X = -110;
                    this.hitbox.Y = 104;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'neutralPunch4':
                if (this.isLeft) {
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;

            case 'neutralPunch5':
                if (this.isLeft) {
                    this.hitbox.X = -95;
                    this.hitbox.Y = 114;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    this.hitbox.X = 65;
                    this.hitbox.Y = 114;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'neutralKick':
                if (this.isLeft) {
                    this.hitbox.X = -110;
                    this.hitbox.Y = 119;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    this.hitbox.X = 85;
                    this.hitbox.Y = 119;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }


                break;
            case 'specialKick1':
                if (this.isLeft) {
                    this.hitbox.X = -100;
                    this.hitbox.Y = 109;
                    atkBox.height = 30;
                    atkBox.width = 75;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    //atkBox.angle = 45;
                    this.hitbox.X = 30;
                    this.hitbox.Y = 109;
                    atkBox.height = 30;
                    atkBox.width = 75;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'runAttack':
                if (this.isLeft) {
                    this.hitbox.X = -110;
                    this.hitbox.Y = 89;
                    atkBox.height = 40;
                    atkBox.width = 55;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    //atkBox.angle = 45;
                    this.hitbox.X = 60;
                    this.hitbox.Y = 89;
                    atkBox.height = 40;
                    atkBox.width = 55;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'loopDwnKick':
                if (this.isLeft) {
                    atkBox.angle = -25;
                    this.hitbox.X = -150;
                    this.hitbox.Y = 129;
                    atkBox.height = 25;
                    atkBox.width = 50;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    atkBox.angle = 25;
                    this.hitbox.X = 120;
                    this.hitbox.Y = 129;
                    atkBox.height = 25;
                    atkBox.width = 50;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'slideKick':
                if (this.isLeft) {
                    this.hitbox.X = -130;
                    this.hitbox.Y = 159;
                    atkBox.height = 15;
                    atkBox.width = 60;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    //atkBox.angle = 45;
                    this.hitbox.X = 80;
                    this.hitbox.Y = 159;
                    atkBox.height = 15;
                    atkBox.width = 60;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'upNeutral':
                if (this.isLeft) {
                    atkBox.angle = -75;
                    this.hitbox.X = -110;
                    this.hitbox.Y = 120;

                    atkBox.height = 50;
                    atkBox.width = 80;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    //atkBox.angle = 45;
                    atkBox.angle = 75;
                    this.hitbox.X = 90;
                    this.hitbox.Y = 50;
                    atkBox.height = 50;
                    atkBox.width = 80;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'airNeutral':
                //for scott, its a spike
                if (this.isLeft) {
                    this.hitbox.X = -120;
                    this.hitbox.Y = 140;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);

                } else {
                    this.hitbox.X = 90;
                    this.hitbox.Y = 140;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'airRecovery':
                if (this.isLeft) {
                    atkBox.angle = -75;
                    this.hitbox.X = -120;
                    this.hitbox.Y = 120;

                    atkBox.height = 60;
                    atkBox.width = 120;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    //atkBox.angle = 45;
                    atkBox.angle = 75;
                    this.hitbox.X = 90;
                    this.hitbox.Y = 10;
                    atkBox.height = 60;
                    atkBox.width = 120;
                    atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            default:
                break;
        }

    };
    this.moveRunAttack = function (sprite, animName, speed) {
        if (sprite.animations.currentAnim.name == animName && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            sprite.x += speed;

        } else if (sprite.animations.currentAnim.name == animName && game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            sprite.x -= speed;
        }
    };
    this.moveDodge = function (sprite) {
        if (!game.input.keyboard.isDown(Phaser.Keyboard.X) && !this.isAirDodging && this.isDodging && !this.shield.shieldActive) {
            
            sprite.animations.play('moveDodge');
            this.timedBonusAnim = (sprite.animations.currentAnim.name);

            if (this.isLeft) {
                sprite.body.velocity.setTo(-340, 0);
            } else {
                sprite.body.velocity.setTo(340, 0);
            }

        }

        this.isDodging = false;
    };
    this.airDodged = function (sprite) {
        if (this.isAirDodging && sprite.animations.currentAnim.name !== 'airDodge') {
            this.toggleSpriteMotion(scott);

            console.log('ssss');
            if (this.airDodgeDirect === 'right') {
                sprite.animations.play('airDodge');
                game.add.tween(sprite).to({ x: '-80' }, 500, Phaser.Easing.Cubic.Out, true);
                this.doTimeout(this.toggleSpriteMotion, 500, scott);
                //sprite.body.velocity.setTo(-125, 0);
                //game.add.tween(sprite).onComplete.add(toggleSpriteMotion, this);
                this.isAirDodging = false;
                this.airDodgeDirect = '';
                console.log('asasassssss');
            } else if (this.airDodgeDirect === 'left') {
                sprite.animations.play('airDodge');
                game.add.tween(sprite).to({ x: '80' }, 500, Phaser.Easing.Cubic.Out, true);
                this.doTimeout(this.toggleSpriteMotion, 500, scott);
                //game.add.tween(sprite).onComplete.add(toggleSpriteMotion, this);
                //sprite.body.velocity.setTo(125, 0);
                this.isAirDodging = false;
                this.airDodgeDirect = '';
                console.log('asdsdsdsaaadffff');
            } else {
                return;
            }

        }
    };
    this.upRecovery = function (sprite) {
        if (this.isAirRecovering && sprite.animations.currentAnim.name !== 'airRecovery') {

            //change param to sprite
            this.toggleSpriteMotion(scott);
            if (!this.isLeft) {
                sprite.animations.play('airRecovery');
                this.combo[0] = (sprite.animations.currentAnim.name);
                game.add.tween(sprite).to({ x: '80', y: '-180' }, 400, Phaser.Easing.Cubic.Out, true);
                this.doTimeout(this.toggleSpriteMotion, 400, scott);


                this.isAirRecovering = false;

                console.log('finished air recover');

            } else if (this.isLeft) {
                sprite.animations.play('airRecovery');
                this.combo[0] = (sprite.animations.currentAnim.name);
                game.add.tween(sprite).to({ x: '-80', y: '-180' }, 400, Phaser.Easing.Cubic.Out, true);
                this.doTimeout(this.toggleSpriteMotion, 400, scott);


                this.isAirRecovering = false;

                console.log('finished air recover');
            } else {
                return;
            }
        }
    };
    this.resetAirDodge = function (sprite) {
        if (this.isGrounded && sprite.animations.currentAnim.name !== 'airDodge') {
            this.canAirDodge = true;
        }
        if (sprite.animations.currentAnim.name == 'airDodge' && sprite.animations.currentAnim.loopCount >= 1) {
            sprite.animations.stop('airDodge');
        }
    };
    this.toggleSpriteMotion = function (sprite) {

        sprite.body.gravity.y > 0 ? sprite.body.gravity.y = 0 : sprite.body.gravity.y = this.stats.gravity;
        sprite.body.moves ? sprite.body.moves = false : sprite.body.moves = true;
        this.stopMotion ? this.stopMotion = true : this.stopMotion = false;

    };
    this.doTimeout = function (func, time, param1) {

        setTimeout(function () {
            func(param1);
            console.log('yeeee');
        }, time);

    };
    //shield = sprite name for shield
    //sprite = sprite name of user
    this.showShield = function (shield, sprite) {
        let posX = sprite.x + this.shield.shieldX;
        let posY = sprite.y + this.shield.shieldY;
        shield.x = posX;
        shield.y = posY;

        shield.position = {
            x: posX,
            y: posY,
            type: 25
        }

        // if the the shield is active and the Z key is held down
        if (this.isGrounded && this.shield.shieldActive && game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
            //play the shield animation
            sprite.animations.play('holdShield');
            shield.animations.play('on');


            if (this.isLeft) {
                this.shield.shieldX = -110;
                this.shield.shieldY = 0;
            } else {
                this.shield.shieldX = -20;
                this.shield.shieldY = 0;
            }

            if (this.shield.shieldActive && this.shield.shieldHP > 76) {
                //set the alpha to 1
                shield.alpha = 1;
            } else if (this.shield.shieldActive && 50 <= this.shield.shieldHP <= 75) {
                //set alpha to 0.7 if shieldHP is between 50 and 75
                //the idea here is the the shield will appear 'weaker' or 'more tranasparent', the less HP it has
                shield.alpha = 0.7;
            } else if (this.shield.shieldActive && 25 <= this.shield.shieldHP <= 50) {
                shield.alpha = 0.5;
            } else if (this.shield.shieldActive && 0 < this.shield.shieldHP < 24) {
                shield.alpha = 0.3;
            } else if (this.shield.shieldActive && this.shield.shieldHP <= 0) {
                shield.alpha = 0;
                shieldActive = false;
                shield.destroy();
            }


        } else {
            shield.animations.stop('on');
            shield.alpha = 0;
            this.shield.shieldActive = false;
            return;
        }

    };
    this.resetHitbox = function (hitbox) {
        setTimeout(function () {
            hitbox.width = 25;
            hitbox.height = 25;
            hitbox.alpha = 0;
            hitbox.angle = 0;
            atkBoxCanHurt = false;

        }, 100);
    }
}

//key listener that riggers animations and boolean changes
//sprite = name of sprite
//charObj  =
function keyListener(sprite, charObj, s) {
    game.input.keyboard.onPressCallback = function (e) {
        console.log("key pressed", e);
        switch (e) {
            //standard kick
            case s:
                //if the player is'nt jumping or running
                //then the player will kick normally
                if (!charObj.isJumping && sprite.animations.currentAnim.name !== 'run') {
                    if(sprite.animations.currentAnim.name == 'moveDodge' && [114,115,116, 117,118,119,120].includes(sprite.animations.currentAnim.currentFrame.index)){
                        charObj.timedBonus = true;

                    }
                    sprite.animations.play('neutralKick');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                    charObj.keyPressed = 's';
                    console.log(charObj.combo);
                    console.log(charObj.keyPressed);


                    //if he is jumping, then will set isPlayerAirAttack to true
                    //charObj will allow downAerial() to run and the initiate the DownAirKick animation
                } else if (charObj.isJumping) {
                    charObj.isAirAttack = true;
                    console.log(charObj.isAirAttack);


                    //if the player is running either to the left or right side, and if the current animation is not already 'slidekick'
                    //then play the 'slideKick' animation
                    //would not want to play the same animation if its already playing....
                } else if ((game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) && sprite.animations.currentAnim.name != 'slideKick' && sprite.animations.currentAnim.name == 'run') {
<<<<<<< HEAD:public/client/states/state1.js
                    
=======
>>>>>>> 5e6cbc78f35d9b53f97026b52324daa237ae1b14:app/public/client/states/state1.js
                    charObj.keyPressed = 's';
                    sprite.animations.play('slideKick');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                }

                break;

            // 'd' will be the special button. Hit charObj button attack the right time, and you might unleash a speciall attack or combo
            case 'd':

                //will only play if the last attack(animation) was neutralPunch3

                if (charObj.combo[0] == 'neutralPunch3' && sprite.animations.currentAnim.name != 'idle') {
                    if (sprite.animations.currentAnim.name === 'neutralPunch3' || sprite.animations.currentAnim.isFinished) {
                        charObj.keyPressed = 'd';
                        sprite.animations.play('specialKick1');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);

                        console.log(charObj.combo);
                    } else {
                        return;
                    }
                    //forward attack OR attack while running
                } else if ((game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) && sprite.animations.currentAnim.name != 'runAttack' && sprite.animations.currentAnim.name == 'run') {
                    charObj.keyPressed = 'd';

                    sprite.animations.play('runAttack');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                } else if ((game.input.keyboard.isDown(Phaser.Keyboard.UP))) {
                    if (charObj.canAirRecover) {
                        charObj.isAirRecovering = true;
                        charObj.canAirRecover = false;
                    } else {
                        return;
                    }


                } else if (charObj.combo[0] == 'neutralPunch5' && sprite.animations.currentAnim.name !== 'idle') {
                    charObj.keyPressed = 'd';
                    sprite.animations.play('upNeutral');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                }

                break;
            //standard attack
            case 'a':
                //charObj.keyPressed = 'a';
                if (charObj.combo[0] == 'neutralPunch1' && sprite.animations.currentAnim.name != 'idle' && sprite.animations.currentAnim.name != 'jump') {
                    if (sprite.animations.currentAnim.name === 'neutralPunch1' || sprite.animations.currentAnim.isFinished) {
                        charObj.keyPressed = 'a';
                        sprite.animations.play('neutralPunch2');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);
                        console.log(charObj.combo);
                    } else {
                        return;
                    }
                } else if (charObj.combo[0] == 'neutralPunch2' && sprite.animations.currentAnim.name != 'idle') {
                    if (sprite.animations.currentAnim.name === 'neutralPunch2' || sprite.animations.currentAnim.isFinished) {
                        charObj.keyPressed = 'a';
                        sprite.animations.play('neutralPunch3');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);
                        console.log(charObj.combo);
                    } else {
                        return;
                    }
                } else if (charObj.combo[0] == 'neutralPunch3' && sprite.animations.currentAnim.name != 'idle') {
                    if (sprite.animations.currentAnim.name === 'neutralPunch3' || sprite.animations.currentAnim.isFinished) {
                        charObj.keyPressed = 'a';

                        sprite.animations.play('neutralPunch4');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);
                        console.log(charObj.combo);
                    } else {
                        return;
                    }
                } else if (charObj.combo[0] == 'neutralPunch4' && sprite.animations.currentAnim.name != 'idle') {
                    if (sprite.animations.currentAnim.name === 'neutralPunch4' || sprite.animations.currentAnim.isFinished) {
                        sprite.animations.play('neutralPunch5');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);
                        console.log(charObj.combo);
                    } else {
                        return;
                    }
                } else if (sprite.animations.currentAnim.name != 'idle' && !charObj.isGrounded) {

                    sprite.animations.play('airNeutral');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                    console.log(charObj.combo);
                }


                else {
                    if ((sprite.animations.currentAnim.name === 'idle' || sprite.animations.currentAnim.name === 'run') || sprite.animations.currentAnim.isFinished) {
                        charObj.keyPressed = 'a';
                        sprite.animations.play('neutralPunch1');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);
                        console.log(charObj.combo);
                    } else {
                        console.log('not ready');
                    }
                }

                break;

            case 'x':
                //initizates the jumping animation by setting charObj.isJumping to true
                //stoping the 'idle anim if its currently playing
                //sets charObj.isGrounded to false since the player is not longer on the floor

                if (!charObj.onlyDoOnce) {
                    charObj.isJumping = true;
                    sprite.animations.stop('idle');

                    charObj.isGrounded = false;
                    charObj.combo[0] = 'jump';
                    //charObj.keyPressed = '';
                    console.log("ddddd");
                    charObj.onlyDoOnce = true;
                    //player.animations.play('jump');
                } else {
                    return;
                }




                break;
            case 'z':
                //initiates the 'block' anim
                //will be used to block attacks
                //possibly counter them as well, might add another mechanic for that soon
                charObj.keyPressed = 'z';
                if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                    sprite.animations.stop('idle');
                    sprite.animations.play('dodge');

                } else if (!charObj.isAirDodging && charObj.isGrounded && (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT))) {
                    charObj.isDodging = true;


                } else if (charObj.canAirDodge && !charObj.isGrounded && (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT))) {

                    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                        charObj.isAirDodging = true;
                        charObj.airDodgeDirect = 'right';
                        charObj.canAirDodge = false;
                    } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                        charObj.isAirDodging = true;
                        charObj.airDodgeDirect = 'left';
                        charObj.canAirDodge = false;

                    }


                } else if (charObj.isGrounded) {
                    charObj.shield.shieldActive = true;

                }

                break;

            //TESTING ENEMY ATTACKS
            case 't':
                dummyCombo[0] = 'hit';
                dummy.animations.play('neutralPunch1');
                setTimeout(function () {
                    dummyCombo = [];
                }, 100);


                break;
            default:
                break;
        }

    }

};


let player,
    players = [],
    scott,
    dummy,
    //var containing the hitbox that we will render whwnever the plaer lanches an attack
    atkBox,
    //var that will contain the most recent anim name of an attack

    //var that will contain the stages platform
    platform,
    platform1,
    platform2,
    platform3,
    battlefield,
    //checks to see if player is currently touching a platform
    //isGrounded = false,
    dummyGrounded = false;
//checks to see if player is currenlty jumping
//meant for hitboxes, position relative to the sprite its a hitbox for

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
<<<<<<< HEAD:public/client/states/state1.js
        game.load.spritesheet('tester', 'client/assets/art/scott-final.png', 142, 184, 148);
        game.load.spritesheet('tester2', 'client/assets/art/test-scott-2.png', 142, 136, 114);
        game.load.spritesheet('ground', 'client/assets/art/big-platform.png');
        game.load.spritesheet('hbox', 'client/assets/art/hbox.png', 25, 25);
        game.load.spritesheet('platform1', 'client/assets/art/platform1.png', 50, 11);
        game.load.spritesheet('battlestage1', 'client/assets/art/base-stage1.png', 321, 126);
        game.load.spritesheet('barrier', 'client/assets/art/barrier.png', 108, 94, 6);
        game.load.spritesheet('elecHit', 'client/assets/art/hit.png', 88, 54, 3);
        game.load.spritesheet('pred', 'client/assets/art/particlered.png', 4, 4);
        game.load.spritesheet('back', 'client/assets/art/background1.png', 500, 700, 34);
        game.load.spritesheet('bonusPtcl', 'client/assets/art/particleStar.png', 30, 30);
=======
        game.load.spritesheet('tester', '../assets/art/2xscott.png', 142, 136, 128);
        game.load.spritesheet('tester2', '../assets/art/test-scott-2.png', 142, 136, 114);
        game.load.spritesheet('ground', '../assets/art/big-platform.png');
        game.load.spritesheet('hbox', '../assets/art/hbox.png', 25, 25);
        game.load.spritesheet('platform1', '../assets/art/platform1.png', 50, 11);
        game.load.spritesheet('battlestage1', '../assets/art/base-stage1.png', 321, 126);
        game.load.spritesheet('barrier', '../assets/art/barrier.png', 108, 94, 6);
        game.load.spritesheet('elecHit', '../assets/art/hit.png', 88, 54, 3);
        game.load.spritesheet('pred', '../assets/art/particlered.png', 4, 4);
        game.load.spritesheet('back', '../assets/art/background1.png', 500, 700, 34);
>>>>>>> 5e6cbc78f35d9b53f97026b52324daa237ae1b14:app/public/client/states/state1.js
    },
    create: function () {
        // Starting game physics

        game.physics.startSystem(Phaser.Physics.ARCADE);

        //game.physics.arcade.gravity.y = 900;
        game.stage.backgroundColor = '#800080'
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        bfBackground = game.add.sprite(0, 0, 'back');

        //
        scott = game.add.sprite(400, 100, 'tester');
        dummy = game.add.sprite(200, 100, 'tester2');


        resizeToSprite(bfBackground, game);

        bfBackground.animations.add('on', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
            , 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], 30, true);


        bfBackground.animations.play('on');

        //selects frames from the assigned spritesheet and sets them apart for its animation
        scott.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
        scott.animations.add('run', [8, 9, 10, 11, 12, 13, 14, 15], 14, false);
        //player.animations.add('jump', [16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 12, false);
        scott.animations.add('startJump', [17, 18, 19, 20, 21, 22, 23, 24], 18, false);
        scott.animations.add('loopJump', [24, 25], 12, true);
        scott.animations.add('endJump', [27], 12, false);
        //neutralpunch2 would follow nuetralpunch1 after it finishes running, like a combo
        //would require input, let's say that hitting 'a' for example, would trigger neutralPunch1, if pressed again at the right...
        //..moment, would trigger neutralPunch2, and so forth
        scott.animations.add('neutralPunch1', [28, 29, 30, 31], 11, false);
        scott.animations.add('neutralPunch2', [32, 33, 34, 35], 11, false);
        scott.animations.add('neutralPunch3', [36, 37, 38], 11, false);

        scott.animations.add('neutralPunch4', [39, 40], 11, false);
        scott.animations.add('neutralPunch5', [41, 42, 43, 44], 11, false);
        scott.animations.add('neutralKick', [45, 46, 47, 48, 49, 50, 51], 14, false);

        scott.animations.add('specialKick1', [63, 64, 65, 66, 67, 68, 69], 14, false);

        scott.animations.add('runAttack', [70, 71, 72, 73, 74, 75, 76, 77, 78], 16, false);
        scott.animations.add('block', [79, 80, 81, 82, 83, 84, 85], 14, false);
        scott.animations.add('lowKick', [86, 87, 88, 89, 90, 91], 14, false);
        scott.animations.add('dodge', [92, 93, 94, 95], 14, false);
        scott.animations.add('knockback', [96, 97, 98, 99, 100], 14, false);

        scott.animations.add('startDwnKick', [100, 101, 102], 12, false);
        scott.animations.add('loopDwnKick', [103, 104, 105], 12, true);
        scott.animations.add('endDwnKick', [106], 12, false);

        scott.animations.add('slideKick', [107, 108, 109, 110, 111, 112, 113], 16, false);


        scott.animations.add('moveDodge', [114, 115, 116, 117, 118, 119, 120], 20, false);

        scott.animations.add('holdShield', [121, 122, 123, 124], 15, false);

        scott.animations.add('airDodge', [125, 126, 127], 14, true);

        scott.animations.add('airRecovery', [136, 137, 138, 139, 140, 141, 142], 14, false);

        scott.animations.add('upNeutral', [128, 129, 130, 131, 132, 133, 134, 135], 18, false);

        scott.animations.add('airNeutral', [142, 143, 144, 145, 146, 147], 18, false);


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

        //dummyBox = hitboxes.create(0, 0, 'hbox');



        shields = game.add.group();

        shields.enableBody = true;

        shield = shields.create(0, 0, 'barrier');

        shield.animations.add('on', [0, 1, 2, 3, 4, 5, 6], 25, false);

        shield.alpha = 0;
        //atkBox.body.setSize(15, 15, 0, 0);


        hitEffects = game.add.group();

        elec = hitEffects.create(0, 0, 'hit');

        elec.animations.add('show', [0, 1, 2], 3, false);

        elec.alpha = 0;


        //plays added animaiton
        scott.animations.play('idle');

        dummy.animations.play('idle');

        //opens up info on current anim
        console.log(scott.animations.currentAnim);
        //gets name for current anim
        console.log(scott.animations.currentAnim.name);
        //returns if current anim is finished
        console.log(scott.animations.currentAnim.isFinished);


        // Creating platform
        platform = game.add.sprite(400, 200, 'platform1');
        platform2 = game.add.sprite(500, 300, 'platform1');
        platform3 = game.add.sprite(800, 200, 'platform1');
        battlefield = game.add.sprite(200, 500, 'battlestage1');


        //enables gravity on player but not on platform
        game.physics.arcade.enable([scott, dummy, platform, platform2, platform3, battlefield, atkBox]);
        //player.body.collideWorldBounds = true;
        //dummy.body.collideWorldBounds = true;

        platform.enableBody = true;
        platform2.enableBody = true;
        platform3.enableBody = true;
        battlefield.enableBody = true;
        battlefield.scale.setTo(2, 2);
        battlefield.body.setSize(321, 126, 0, 25);

        scott.body.gravity.y = 1400;

        dummy.body.gravity.y = 2100;
        //dummy.body.gravity.set(0, 180);

        scott.body.drag.x = 500;
        //scott.body.drag.y = 500;
        dummy.body.drag.x = 400;
        dummy.body.drag.y = 0;


        //testing player collsinion box resize

        scott.body.setSize(60, 120, 20, 69);
        dummy.body.setSize(60, 120, 20, 20);




        platform.body.immovable = true;
        platform2.body.immovable = true;
        platform3.body.immovable = true;
        battlefield.body.immovable = true;

        console.log(atkBox);
        console.log(scott);
        console.log(dude.isGrounded);

    },
    update: function () {

        game.physics.arcade.collide(scott, battlefield, null);
        game.physics.arcade.collide(dummy, [platform, platform1, platform2, platform3, battlefield]);

        //hitbox on dummy, runs hit();
        game.physics.arcade.overlap(dummy, atkBox, hit);



        //EVERYTHING WE NEED TO HAVE SCOTT ACTIVE***************************
        game.debug.body(scott);
        updateGrounded(scott, dude);
        keyListener(scott, dude, 's');
        dude.runIdleControl(scott);
        dude.jump(scott, 15);
        dude.glideDownJump(scott, 1000, dude.stats.gravity);
        dude.jumpAnimLoop(scott);
        dude.downAerialMotion(scott, 'low');
        dude.downAerial(scott);


        dude.moveAttackBox(atkBox, scott);
        dude.moveRunAttack(scott, 'runAttack', 10);
        dude.moveRunAttack(scott, 'slideKick', 12);
        dude.moveDodge(scott);
        dude.airDodged(scott);
        dude.resetAirDodge(scott);
        dude.showShield(shield, scott);
        dude.upRecovery(scott);

        //(sprite, injSprite, charObj, hurtCharObj)
        hurt(scott, dummy, dude, comp);

        resizeToSprite(shield, scott);

        //END***************************************

        //**************** H E L P E R    F U N C T I O N S*******************//



        function updateGrounded(sprite, charObj) {
            if (sprite.body.touching.down) {
                charObj.isGrounded = true;
                charObj.stats.jumpH = 0;
            } else {
                charObj.isGrounded = false;
            }


        }
        //********************************************HIT LOGIC*********************************************************** */

        //the following code is extemely crude and is only used for testing purposes

        //this entire file will be refactored soon.



        function hit(sprit, obj) {
            let charObj = dude;
            let sprite = scott;

            if (sprite.animations.currentAnim.name != 'idle' && (['neutralKick', 'neutralPunch1', 'neutralPunch2',

                'neutralPunch3', 'neutralPunch4', 'specialKick1', 'runAttack', 'slideKick', 'loopDwnKick', 'upNeutral', 'airRecovery', 'airNeutral'].includes(sprite.animations.currentAnim.name))) {
                charObj.hitbox.isOverlapping = true;
                charObj.hitbox.isAtkBoxActive = true;
            } else {
                charObj.hitbox.isOverlapping = false;
                charObj.hitbox.isAtkBoxActive = false;
            }




        }

    }
};







//********************GLOBAL FUNCTIONS************* */


// sprite = sprite that is attacking
// injSprite = sprite that is hurt
// charObj = char obj for the sprite that is attacking
// hurtCharObj = char obj for the sprite that is hurt

function hurt(sprite, injSprite, charObj, hurtCharObj, pushback, length, collisionType, hboxName) {
    if (charObj.hitbox.isOverlapping && charObj.hitbox.isAtkBoxActive) {
        hurtCharObj.stats.damage += 0.93;
        console.log(hurtCharObj.stats.damage);
        injSprite.animations.play('knockback');
        hitParticle(charObj, hurtCharObj);
        getLaunchAmount(sprite, injSprite, charObj, hurtCharObj);
        charObj.hitbox.isOverlapping = false;
        charObj.hitbox.isAtkBoxActive = false;
        //sprite.body.velocity = 0;
    } else {
        return;
    }

}




//attacker = sprite that is attacking
//injured  = sprite that is getting hit
//charObj = Character obj for the sprite that is attacking
//injCharObj = Character obj for the sprite that is getting hit
function getLaunchAmount(attacker, injured, charObj, injCharObj) {
    let Xvector;
    let Yvector;
    console.log(attacker.animations.currentAnim.name);
    if (charObj.hitbox.isOverlapping && charObj.hitbox.isAtkBoxActive) {
        if (attacker.animations.currentAnim.name == 'slideKick') {
            if (charObj.isLeft) {
                Xvector = -24 - injCharObj.stats.damage;
                Yvector = -500 - injCharObj.stats.damage;

            } else {
                Xvector = 24 + injCharObj.stats.damage;
                Yvector = -500 - injCharObj.stats.damage;
            }

        } else if ((['neutralPunch1', 'neutralPunch2', 'neutralPunch3'].includes(attacker.animations.currentAnim.name))) {
            if (charObj.isLeft) {
                Xvector = -1 - injCharObj.stats.damage;

            } else {
                Xvector = 1 + injCharObj.stats.damage;

            }

        } else if (attacker.animations.currentAnim.name == 'neutralPunch4') {
            if (charObj.isLeft) {
                Xvector = -25 - injCharObj.stats.damage;
                Yvector = -100 - injCharObj.stats.damage;

            } else {
                Xvector = 25 + injCharObj.stats.damage;
                Yvector = -100 - injCharObj.stats.damage;

            }
        } else if (attacker.animations.currentAnim.name == 'specialKick1') {
            if (charObj.isLeft) {

                Xvector = -50 - injCharObj.stats.damage;
                Yvector = -140 - injCharObj.stats.damage;

            } else {
                Xvector = 50 + injCharObj.stats.damage;
                Yvector = -140 - injCharObj.stats.damage;

            }
        } else if (attacker.animations.currentAnim.name == 'neutralKick') {
            let bonus = 0;
            
            if(charObj.timedBonus){
                console.log('time bonus',charObj.timedBonus);
                bonus = 200;
            }
            if (charObj.isLeft) {
                console.log(bonus);
                Xvector = (-90 - bonus) - injCharObj.stats.damage;
                charObj.timedBonus = false;


            } else {
                Xvector = (90 + bonus) + injCharObj.stats.damage;
                charObj.timedBonus = false;


            }
        } else if (attacker.animations.currentAnim.name == 'runAttack') {
            if (charObj.isLeft) {
                Xvector = -300 - injCharObj.stats.damage;
                Yvector = -200 - injCharObj.stats.damage;



            } else {
                Xvector = 300 + injCharObj.stats.damage;
                Yvector = -200 - injCharObj.stats.damage;


            }
        } else if (attacker.animations.currentAnim.name == 'loopDwnKick') {
            if (charObj.isLeft) {
                Xvector = -300 - injCharObj.stats.damage;
                Yvector = 280 + injCharObj.stats.damage;



            } else {
                Xvector = 300 + injCharObj.stats.damage;
                Yvector = 280 + injCharObj.stats.damage;


            }
        } else if (attacker.animations.currentAnim.name == 'upNeutral') {
            if (charObj.isLeft) {
                Xvector = -100 - injCharObj.stats.damage;
                Yvector = -680 - injCharObj.stats.damage;



            } else {
                Xvector = 100 + injCharObj.stats.damage;
                Yvector = -680 - injCharObj.stats.damage;


            }
        }
        else if (attacker.animations.currentAnim.name == 'airNeutral') {
            if (charObj.isLeft) {
                Xvector = -250 - injCharObj.stats.damage;
                Yvector = 550 + injCharObj.stats.damage;



            } else {
                Xvector = 250 + injCharObj.stats.damage;
                Yvector = 550 + injCharObj.stats.damage;


            }
        }
     else if (attacker.animations.currentAnim.name == 'airRecovery') {
        if (charObj.isLeft) {
            Xvector = -115 - injCharObj.stats.damage;
            Yvector = -400 - injCharObj.stats.damage;



        } else {
            Xvector = 115 + injCharObj.stats.damage;
            Yvector = -400 - injCharObj.stats.damage;


        }
    }
        

    }

    launchSprite(null, injured, true, Xvector, Yvector);

}



//hitbox = name of attacker's hitbox
//injured = the name of the sprite that recived the hit
//isSpec = boolean, if there ther is a specified velocity from an attack anim
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

//sprite = sprite name of the one getting hurt
//charObj = Character Object of the attacker
//hurtcharObj = Characte Object of the hurt sprite




function resizeToSprite(sprite, example, addOrsub, which, amount) {
    if ((sprite.width < example.width) &&
        (sprite.height < example.height)) {
        sprite.width = example.width;
        sprite.height = example.height;

    } else {
        return;
    }
}


function hitParticle(charObj, hurtcharObj) {

    let amt = hurtcharObj.stats.damage;
    if(charObj.timedBonus){
        let bonusEmit;
        bonusEmit = game.add.emitter(atkBox.x, atkBox.y, 50);
        bonusEmit.makeParticles('bonusPtcl', [0], 90);
        //emitter.minParticleSpeed = (1);
        bonusEmit.setYSpeed(-10, 40);
        bonusEmit.setXSpeed(-10, 80);
        bonusEmit.minParticleScale = 0.3;
        bonusEmit.maxParticleScale = 1;
        bonusEmit.start(false, 600, null, 0.5);
    }else{
        emitter = game.add.emitter(atkBox.x, atkBox.y, 25 + amt);
        //emitter.width = game.world.width;
        emitter.makeParticles('pred', [0], 25);
        //emitter.minParticleSpeed = (1);
        emitter.setYSpeed(-10, 40);
        emitter.setXSpeed(-10, 80);
        emitter.minParticleScale = 0.7;
        emitter.maxParticleScale = 1;
        emitter.start(false, 400, null, 0.2);
    }

    
    

}

function destroyEmitter() {

    emitter.destroy();

}