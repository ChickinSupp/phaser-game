let player;


let dummy = new Ai('mghosty', 10, 800, 800);


function Ai(name, power, gravity, jumpResistance, isCPU) {
    this.name = name;
    this.combo = [];
    this.getHitWith = '';
    this.isHurt = false;
    this.actions = {
        runRight = false,
        runLeft = false,
        jump = false,
        kick = false,
        punch = false,
        holdUp = false,
        evade = false,
        doSpecial = false,

    },
    this.decision = '';
    this.lives = {
        left: 3
    }
    this.stats = {
        damage: 0,
        lives: 3,
        power: power,
        evades: 5,
        gravity: gravity,
        jumpR: jumpResistance,
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
    this.isBulletFired = false;
    this.isShotLeft = false;
    this.timedBonusAnim;
    this.timedBonus = false;
    this.velocityStall = false;
    this.stallChecked = false;
    this.stopMotion = false;

    this.CPUbrain = function (){
    

    }

    this.setupRelations = function () {
        switch (this.name) {
            case 'ghostStock':
                this.relatives.stockname = 'ghostStock';
                break;
            case 'sStock':
                this.relatives.stockname = 'sStock';
            default:
                break;
        }
    };

    this.glideDownJump = function (sprite, fallingGravity, postGravity) {
        if (!this.isGrounded || this.combo[0] === 'jump') {
            sprite.body.gravity.y = this.stats.gravity;
        } else {
            sprite.body.gravity.y = this.stats.jumpR;
        }


    };
    this.jumpAnimLoop = function (sprite) {
        if (this.completedJump) {


            if (!this.isAirAttack && !this.isAirDodging && this.canPlayerJump && !(['airDodge', 'airRecovery', 'airNeutral', 'upAir', 'foxKick', 'meteorSmash'].includes(sprite.animations.currentAnim.name))) {
                if ((this.isGrounded && this.startedJump) || (this.isGrounded && this.startedJump && this.combo[0] == 'jump')) {
                    console.log('ending jump');
                    sprite.animations.play('endJump');
                    this.startedJump = false;

                    this.isJumping = false;
                    this.canPlayerJump = false;


                }
                else if (!this.isGrounded && this.startedJump) {
                    console.log('looping');
                    sprite.animations.play('loopJump');
                } else if (this.combo[0] == 'jump' && !this.isGrounded && !this.startedJump) {

                    this.startedJump = true;
                    this.isJumping = true;
                    //sprite.animations.stop('idle');
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
        } else if (intensity.toLowerCase() == 'ghost') {
            if (sprite.animations.currentAnim.name == 'loopDwnKick') {
                if (this.isLeft) {
                    sprite.x -= 7;
                } else {
                    sprite.x += 7;
                }

                //sprite.y += 5;
                sprite.body.velocity.y = 300;
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


        if (!this.isAirDodging && this.actions.jump && this.stats.jumpH < 30) {
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
                } else if ((!this.isDodging || !this.isAirDodging) && !this.actions.evade && !this.actions.jump && this.completedJump || (!this.actions.runRight && sprite.animations.currentAnim.name == 'run' || !this.actions.runLeft && sprite.animations.currentAnim.name == 'run')) {
                    this.onlyDoOnce = false;
                    this.canPlayerJump = true;
    
                    if (!this.isGrounded && !(['knockback', 'pushback1', 'pushback2', 'pushback3'].includes(sprite.animations.currentAnim.name))) {
                        sprite.animations.play('notloopJump');
                    } else if (this.isGrounded) {
                        //sprite.animations.stop('notloopJump');
                        if (['notloopjump', 'loopJump'].includes(sprite.animations.currentAnim.name)/* && sprite.animations.currentAnim.name == 'notloopjump' */ && sprite.animations.currentAnim.isFinished) {
    
    
                            sprite.animations.play('endJump');
                        }
    
                        sprite.animations.play('idle');
                    }
    
                    this.combo = [];
                    this.canAirRecover = true;
                    console.log('restared');
                    this.keyPressed = '';
                    this.timedBonusAnim = '';
                    this.stallChecked = false;
                }
                //HANDLES RUN ANIM  isspriteAirDodging
            } else if (((!this.shield.shieldActive || !this.isAirDodging) && sprite.animations.currentAnim.name == 'idle' || sprite.animations.currentAnim.name == 'run' || sprite.animations.currentAnim.name == 'jump' || this.isGrounded) && !['neutralKick', 'neutralPunch1', 'neutralPunch2', 'neutralPunch3', 'neutralPunch4'].includes(sprite.animations.currentAnim.name) || (!sprite.animations.currentAnim.isFinished)) {
                if (this.actions.runRight && ((!['s', 'a'].includes(this.keyPressed)) && sprite.animations.currentAnim.name !== 'runAttack' && (!this.isAirDodging && !this.shield.shieldActive))) {
                    if (sprite.animations.currentAnim.name !== 'knockback') {
                        //testing for ghost's foxKick
    
    
    
                        sprite.scale.setTo(1, 1);
                        this.isLeft = false;
    
    
    
    
                        if (sprite.animations.currentAnim.name == 'airNeutral') {
                            sprite.x += 13;
                            //sprite.body.velocity.x = 200;
                        } else {
                            sprite.x += 8;
                            //sprite.body.velocity.x = 400;
                        }
    
                        //console.log('sssa');
                        if ((!['jump', 'startJump', 'loopJump', 'endJump', 'dodge', 'block', 'moveDodge', 'loopDwnKick', 'airDodge'].includes(sprite.animations.currentAnim.name)) && (!game.input.keyboard.isDown(Phaser.Keyboard.X) && this.isGrounded !== false && this.startedJump == false)) {
                            sprite.animations.play('run');
                        }
                    } else {
                        return;
                    }
    
    
    
    
                } else if (this.actions.runLeft && ((!['s', 'a'].includes(this.keyPressed)) && sprite.animations.currentAnim.name !== 'runAttack' && (!this.isAirDodging && !this.shield.shieldActive))) {
                    if (sprite.animations.currentAnim.name !== 'knockback') {
    
                        sprite.scale.setTo(-1, 1);
                        this.isLeft = true;
    
    
                        if (sprite.animations.currentAnim.name == 'airNeutral') {
                            sprite.x -= 13;
                            //sprite.body.velocity.x = -200;
                        } else {
                            sprite.x -= 8;
                            //sprite.body.velocity.x = -400;
                        }
                        //console.log(' running left');
    
                        if ((!['jump', 'startJump', 'loopJump', 'endJump', 'dodge', 'block', 'moveDodge', 'loopDwnKick', 'airDodge'].includes(sprite.animations.currentAnim.name)) && (!game.input.keyboard.isDown(Phaser.Keyboard.X) && this.isGrounded !== false && this.startedJump == false)) {
                            sprite.animations.play('run');
                        }
    
    
                    } else {
                        return;
                    }
    
    
    
                } else if ((!this.actions.runRight) || (!this.actions.runRight) || this.keyPressed || this.actions.evade || this.actions.punch || this.actions.special || game.input.keyboard.isDown(keys.w) || this.actions.special || this.startedJump) {
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

                if (this.name == "mghosty") {
                    if (this.isLeft) {
                        this.hitbox.X = -60;
                        this.hitbox.Y = 25;
                        atkBox.height = 45;
                        atkBox.width = 45;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        this.hitbox.X = 30;
                        this.hitbox.Y = 25;
                        atkBox.height = 45;
                        atkBox.width = 45;
                        // atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                } else {
                    if (this.isLeft) {
                        this.hitbox.X = -50;
                        this.hitbox.Y = 20;
                        // atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        this.hitbox.X = 20;
                        this.hitbox.Y = 20;
                        // atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }
                }


                break;
            case 'neutralPunch2':


                if (this.name == "mghosty") {
                    if (this.isLeft) {
                        this.hitbox.X = -60;
                        this.hitbox.Y = 25;
                        //atkBox.height = 45;
                        //atkBox.width = 45;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        this.hitbox.X = 30;
                        this.hitbox.Y = 25;
                        //atkBox.height = 45;
                        // atkBox.width = 45;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }
                } else {
                    if (this.isLeft) {
                        //this.hitbox.X = -110;
                        //this.hitbox.Y = 104;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    } else {
                        // this.hitbox.X = 80;
                        //this.hitbox.Y = 104;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }
                }

                break;
            case 'neutralPunch3':

                if (this.name == "mghosty") {
                    if (this.isLeft) {
                        this.hitbox.X = -60;
                        this.hitbox.Y = 25;
                        atkBox.height = 45;
                        atkBox.width = 45;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        this.hitbox.X = 30;
                        this.hitbox.Y = 25;
                        atkBox.height = 45;
                        atkBox.width = 45;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                } else {
                    if (this.isLeft) {
                        //this.hitbox.X = -110;
                        // this.hitbox.Y = 104;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    } else {
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                }

                break;
            case 'neutralPunch4':

                if (this.isLeft) {
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    ///atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;

            case 'neutralPunch5':

                if (this.name == "mghosty") {
                    if (this.isLeft) {
                        this.hitbox.X = -70;
                        this.hitbox.Y = 20;
                        atkBox.height = 30;
                        atkBox.width = 30;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        this.hitbox.X = 30;
                        this.hitbox.Y = 20;
                        atkBox.height = 30;
                        atkBox.width = 30;
                        ///atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                } else {
                    if (this.isLeft) {
                        this.hitbox.X = -20;
                        this.hitbox.Y = 20;
                        // atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    } else {
                        this.hitbox.X = 20;
                        this.hitbox.Y = 20;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }
                }
                break;
            case 'neutralKick':
                if (this.isLeft) {
                    this.hitbox.X = -40;
                    this.hitbox.Y = 30;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    this.hitbox.X = 25;
                    this.hitbox.Y = 30;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }


                break;
            case 'specialKick1':


                if (this.name == "mghosty") {
                    if (this.isLeft) {
                        //atkBox.angle = 45;
                        this.hitbox.X = -70;
                        this.hitbox.Y = 20;
                        atkBox.height = 60;
                        atkBox.width = 60;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        //atkBox.angle = 45;

                        this.hitbox.X = -70;
                        this.hitbox.Y = 20;
                        atkBox.height = 60;
                        atkBox.width = 60;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);



                    }

                } else {
                    if (this.isLeft) {
                        this.hitbox.X = -40;
                        this.hitbox.Y = 10;
                        atkBox.height = 30;
                        atkBox.width = 75;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    } else {
                        //atkBox.angle = 45;
                        this.hitbox.X = -25;
                        this.hitbox.Y = 10;
                        atkBox.height = 30;
                        atkBox.width = 75;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                }
                break;
            case 'runAttack':
                if (this.name == "mghosty") {
                    if (this.isLeft) {
                        //atkBox.angle = 45;
                        this.hitbox.X = -70;
                        this.hitbox.Y = 0;
                        atkBox.height = 60;
                        atkBox.width = 60;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        //atkBox.angle = 45;

                        this.hitbox.X = 0;
                        this.hitbox.Y = 0;
                        atkBox.height = 60;
                        atkBox.width = 60;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);



                    }

                } else {
                    if (this.isLeft) {
                        this.hitbox.X = -40;
                        this.hitbox.Y = 0;
                        atkBox.height = 40;
                        atkBox.width = 55;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    } else {
                        //atkBox.angle = 45;
                        this.hitbox.X = 10;
                        this.hitbox.Y = 0;
                        atkBox.height = 40;
                        atkBox.width = 55;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                }

                break;
            case 'loopDwnKick':

                if (this.name == "mghosty") {
                    if (this.isLeft) {
                        atkBox.angle = -40;
                        this.hitbox.X = -34;
                        this.hitbox.Y = 67;
                        atkBox.height = 25;
                        atkBox.width = 50;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        atkBox.angle = 25;
                        this.hitbox.X = 4;
                        this.hitbox.Y = 40;
                        atkBox.height = 25;
                        atkBox.width = 50;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }
                } else {
                    if (this.isLeft) {
                        atkBox.angle = -25;
                        this.hitbox.X = -70;
                        this.hitbox.Y = 65;
                        atkBox.height = 25;
                        atkBox.width = 50;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    } else {
                        atkBox.angle = 25;
                        this.hitbox.X = 30;
                        this.hitbox.Y = 50;
                        atkBox.height = 25;
                        atkBox.width = 50;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                }
                break;
            case 'slideKick':
                if (this.isLeft) {
                    this.hitbox.X = -60;
                    this.hitbox.Y = 80;
                    atkBox.height = 15;
                    atkBox.width = 60;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                } else {
                    //atkBox.angle = 45;
                    this.hitbox.X = 40;
                    this.hitbox.Y = 80;
                    atkBox.height = 15;
                    atkBox.width = 60;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'upNeutral':
                if (this.name == "mghosty") {
                    if (this.isLeft) {
                        atkBox.angle = -45;
                        this.hitbox.X = -90;
                        this.hitbox.Y = 10;
                        atkBox.height = 60;
                        atkBox.width = 150;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        atkBox.angle = 35;
                        this.hitbox.X = -40;
                        this.hitbox.Y = -85;
                        atkBox.height = 60;
                        atkBox.width = 150;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                } else {
                    if (this.isLeft) {
                        atkBox.angle = -75;
                        this.hitbox.X = -40;
                        this.hitbox.Y = 30;

                        atkBox.height = 50;
                        atkBox.width = 90;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    } else {
                        //atkBox.angle = 45;
                        atkBox.angle = 75;
                        this.hitbox.X = 30;
                        this.hitbox.Y = -60;
                        atkBox.height = 50;
                        atkBox.width = 90;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }
                }
                break;
            case 'airNeutral':
                //for scott, its a spike

                if (this.name == "mghosty") {
                    if (this.isLeft) {


                        this.hitbox.X = -50;
                        this.hitbox.Y = 40;
                        atkBox.height = 15;
                        atkBox.width = 50;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {

                        this.hitbox.X = 0;
                        this.hitbox.Y = 40;
                        atkBox.height = 15;
                        atkBox.width = 50;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                } else {
                    if (this.isLeft) {
                        this.hitbox.X = -45;
                        this.hitbox.Y = 50;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        this.hitbox.X = 23;
                        this.hitbox.Y = 50;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }
                }

                break;
            case 'airRecovery':
                if (this.name == "mghosty") {
                    if (this.isLeft) {

                        atkBox.angle = -95;
                        this.hitbox.X = -50;
                        this.hitbox.Y = 40;
                        atkBox.height = 30;
                        atkBox.width = 65;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);

                    } else {
                        atkBox.angle = -50;
                        this.hitbox.X = 0;
                        this.hitbox.Y = 40;
                        atkBox.height = 30;
                        atkBox.width = 65;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                } else {
                    if (this.isLeft) {
                        atkBox.angle = -75;
                        this.hitbox.X = -50;
                        this.hitbox.Y = 30;

                        atkBox.height = 60;
                        atkBox.width = 120;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    } else {
                        //atkBox.angle = 45;
                        atkBox.angle = 75;
                        this.hitbox.X = 27;
                        this.hitbox.Y = -90;
                        atkBox.height = 60;
                        atkBox.width = 120;
                        //atkBox.alpha = 0.6;
                        this.resetHitbox(atkBox);
                    }

                }

                break;
            case 'meteorSmash':
                if (this.isLeft) {
                    this.hitbox.X = -40;
                    this.hitbox.Y = 30;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);

                } else {
                    this.hitbox.X = 20;
                    this.hitbox.Y = 30;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'upAir':
                if (this.isLeft) {
                    this.hitbox.X = 0;
                    this.hitbox.Y = -80;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);

                } else {
                    this.hitbox.X = -25;
                    this.hitbox.Y = -80;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'foxKick':
                if (this.isLeft) {
                    this.hitbox.X = 45;
                    this.hitbox.Y = 25;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);

                } else {
                    this.hitbox.X = -65;
                    this.hitbox.Y = 30;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            case 'haduken':
                if (this.isLeft) {
                    this.hitbox.X = -55;
                    this.hitbox.Y = 10;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);

                } else {
                    this.hitbox.X = 40;
                    this.hitbox.Y = 10;
                    //atkBox.alpha = 0.6;
                    this.resetHitbox(atkBox);
                }

                break;
            default:
                break;
        }

    };
    this.moveRunAttack = function (sprite, animName, speed) {
        if (sprite.animations.currentAnim.name == animName && this.actions.runRight) {
            sprite.x += speed;

        } else if (sprite.animations.currentAnim.name == animName && this.actions.runLeft) {
            sprite.x -= speed;
        }
    };
    this.moveDodge = function (sprite) {
        if (!this.actions && !this.isAirDodging && this.isDodging && !this.shield.shieldActive) {

            sprite.animations.play('moveDodge');
            this.timedBonusAnim = (sprite.animations.currentAnim.name);

            if (this.isLeft) {
                sprite.body.velocity.setTo(-420, 0);
            } else {
                sprite.body.velocity.setTo(420, 0);
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
        if (this.isGrounded && this.shield.shieldActive && this.actions.evade) {
            //play the shield animation
            sprite.animations.play('holdShield');
            shield.animations.play('on');


            if (this.isLeft) {
                this.shield.shieldX = -10;
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
    //this object's assigned sprite
    this.velocityStallControl = function (sprite) {
        if (this.isHurt) {
            if (-1 < sprite.body.speed < 100 && ['airRecovery', 'upNeutral', 'airNeutral'].includes(this.getHitWith) && !this.stallChecked) {
                this.stopMotion = true;
                //this.stallChecked = true;
                console.log('got hit with', this.getHitWith);



                setTimeout(function () {
                    this.stopMotion = false;
                    this.getHitWith = '';

                    console.log('stop motion?', this.stopMotion);
                    this.isHurt = false;
                    console.log('hurt sprite can now move again');
                }, 1000);


            } else if (100 < sprite.body.speed < 200 && ['airRecovery', 'upNeutral', 'airNeutral'].includes(this.getHitWith) && !this.stallChecked) {
                this.stopMotion = true;
                console.log('got hit with', this.getHitWith);
                this.stallChecked = true;


                setTimeout(function () {
                    this.stopMotion = false;
                    this.getHitWith = '';
                    console.log('stop motion?', this.stopMotion);
                    this.isHurt = false;
                    console.log('hurt sprite can now move again');
                }, 1200);

            } else if (200 < sprite.body.speed < 300 && ['airRecovery', 'upNeutral', 'airNeutral'].includes(this.getHitWith) && !this.stallChecked) {
                this.stopMotion = true;
                this.stallChecked = true;
                console.log('got hit with', this.getHitWith);


                setTimeout(function () {
                    this.stopMotion = false;
                    this.getHitWith = '';
                    console.log('stop motion?', this.stopMotion);
                    this.isHurt = false;
                    console.log('hurt sprite can now move again');
                }, 1300);

            }
            else if (300 < sprite.body.speed && ['airRecovery', 'upNeutral', 'airNeutral'].includes(this.getHitWith) && !this.stallChecked) {
                this.stopMotion = true;
                console.log('got hit with', this.getHitWith);
                this.stallChecked = true;


                setTimeout(function () {
                    this.stopMotion = false;
                    this.getHitWith = '';
                    console.log('stop motion?', this.stopMotion);
                    this.isHurt = false;
                    console.log('hurt sprite can now move again');
                }, 1800);

            } else {
                return;
            }
        } else {
            return;
        }

    };
    this.resetGetHit = function (charObj) {
        setTimeout(function () {
            charObj.getHitWith = '';
            console.log('this works');
        }, 1000);
    }
    this.pushbackControl = function (sprite) {
        if (['upNeutral', 'airRecovery', 'airNeutral'].includes(this.getHitWith)) {

            if (50 <= this.stats.damage <= 98) {

                if (this.name == 'mghosty' && !this.isGrounded) {
                    sprite.animations.play('airKnockback');
                } else {
                    sprite.animations.play('knockback');
                    sprite.animations.play('pushback1');
                    sprite.animations.play('pushback2');
                }


            } else if (99 <= this.stats.damage <= 199) {
                if (this.name == 'mghosty' && !this.isGrounded) {
                    sprite.animations.play('airKnockback');
                } else {
                    sprite.animations.play('pushback1');
                    sprite.animations.play('pushback2');
                    sprite.animations.play('pushback3');
                }

            } else if (200 <= this.stats.damage <= 299) {
                if (this.name == 'mghosty' && !this.isGrounded) {
                    sprite.animations.play('airKnockback');
                } else {
                    sprite.animations.play('pushback1');
                    sprite.animations.play('pushback2');
                }
            } else if (this.stats.damage > 300) {
                if (this.name == 'mghosty' && !this.isGrounded) {
                    sprite.animations.play('airKnockback');
                } else {
                    sprite.animations.play('pushback1');
                    sprite.animations.play('pushback2');
                }

            } else {
                if (this.name == 'mghosty' && !this.isGrounded) {
                    sprite.animations.play('airKnockback');
                } else {
                    sprite.animations.play('knockback');
                }
            }
        } else {
            sprite.animations.play('knockback');
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
    };
    this.loadStock = function () {
        switch (this.name) {
            case 'scott':
                game.load.spritesheet('sStk', '../assets/art/sStock.png', 32, 32);
                break;
            case 'mghosty':
                game.load.spritesheet('gStk', '../assets/art/ghostStock.png', 32, 32);
                break;
            default:
                break;
        }


    };
    this.invincibilityCtrl = function (sprite) {
        if (sprite.animations.currentAnim.name == 'airDodge') {
            this.isInvincible = true;
        } else {
            this.isInvincible = false;
        }
    }
    this.addSFX = function () {

        if (this.name == 'mghosty') {
            slash = game.add.audio('sword');


            ejectBall = game.add.audio('throwball');

            ghostDodge = game.add.audio('gdodge');

            barr = game.add.audio('barrier');


            natk1 = game.add.audio('gnatk1');

            jumpSnd = game.add.audio('jumpa');

            ghAirRec = game.add.audio('ghAir');

            ghRunAtk = game.add.audio('ghRunAtk');

            ghDownKick = game.add.audio('ghDownKick');

            ghAtk2 = game.add.audio('ghAtk2');

            foxKicks = game.add.audio('foxKicks');

            ghAirNeu = game.add.audio('ghAirNeu');

            ghWhip = game.add.audio('ghWhip');

            ghMeteor = game.add.audio('ghMeteor');

            shieldHit = game.add.audio('nullHit');

            normalHit = game.add.audio('elecHit');


        } else {
            slash = game.add.audio('sword');


            ejectBall = game.add.audio('throwball');

            ghostDodge = game.add.audio('grDodge');

            sdodge = game.add.audio('grDodge');


            barr = game.add.audio('barrier');


            natk1 = game.add.audio('stPunch');

            jumpSnd = game.add.audio('jumpa');

            ghAirRec = game.add.audio('airRecov');

            ghRunAtk = game.add.audio('stRunAtk');

            ghDownKick = game.add.audio('ghDownKick');

            ghAtk2 = game.add.audio('ghAtk2');

            foxKicks = game.add.audio('foxKicks');

            ghAirNeu = game.add.audio('ghAirNeu');

            ghWhip = game.add.audio('stPunch');

            ghMeteor = game.add.audio('ghMeteor');

            stKick = game.add.audio('stKick');

            sldKick = game.add.audio('stSlideKick');

            stRunAtk = game.add.audio('stRunAtk');

            stSpecKick = game.add.audio('stSpecKick');

            stUpNeu = game.add.audio('stUpNeu');

            shieldHit = game.add.audio('nullHit');

            normalHit = game.add.audio('elecHit');


        }

    }
    // theres a copy of this function on the demo.create object. delte when complete
    this.createFighter = function () {
        let name = this.name;
        console.log(name);
        switch (name) {
            case 'scott':
                dummy = game.add.sprite(400, 100, 'tester');
                dummy.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
                dummy.animations.add('run', [8, 9, 10, 11, 12, 13, 14, 15], 14, false);

                dummy.animations.add('startJump', [17, 18, 19, 20, 21, 22, 23, 24], 18, false);
                dummy.animations.add('loopJump', [24, 25], 12, true);
                dummy.animations.add('notloopJump', [24, 25], 12, false);
                dummy.animations.add('endJump', [27], 12, false);

                dummy.animations.add('neutralPunch1', [28, 29, 30, 31], 11, false);
                dummy.animations.add('neutralPunch2', [32, 33, 34, 35], 11, false);
                dummy.animations.add('neutralPunch3', [36, 37, 38], 11, false);

                dummy.animations.add('neutralPunch4', [39, 40], 11, false);
                dummy.animations.add('neutralPunch5', [41, 42, 43, 44], 11, false);
                dummy.animations.add('neutralKick', [45, 46, 47, 48, 49, 50, 51], 14, false);

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


                dummy.animations.add('moveDodge', [114, 115, 116, 117, 118, 119, 120], 20, false);

                dummy.animations.add('holdShield', [121, 122, 123, 124], 15, false);

                dummy.animations.add('airDodge', [125, 126, 127], 14, true);

                dummy.animations.add('airRecovery', [136, 137, 138, 139, 140, 141, 142], 14, false);

                dummy.animations.add('upNeutral', [128, 129, 130, 131, 132, 133, 134, 135], 18, false);

                dummy.animations.add('airNeutral', [142, 143, 144, 145, 146, 147], 18, false);

                dummy.animations.add('pushback1', [148], 10, false);
                dummy.animations.add('pushback2', [149], 10, false);
                dummy.animations.add('pushback3', [150], 10, false);

                dummy.animations.play('idle');
                break;
            case 'deku':


                break;
            case 'mghosty':
            dummy = game.add.sprite(400, 100, 'ghosty');
            dummy.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8], 12, true);
            dummy.animations.add('run', [9, 10, 11, 12, 13], 14, false);
                //player.animations.add('jump', [16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 12, false);
                dummy.animations.add('startJump', [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48], 20, false);
                dummy.animations.add('loopJump', [49, 50, 51, 52, 53, 54], 15, true);
                dummy.animations.add('notloopJump', [49, 50, 51, 52, 53, 54], 12, false);
                dummy.animations.add('endJump', [164, 165, 166, 167, 168, 169, 170, 171, 39, 38, 37, 36, 35, 34, 33, 32], 60, false);
                //neutralpunch2 would follow nuetralpunch1 after it finishes running, like a combo
                //would require input, let's say that hitting 'a' for example, would trigger neutralPunch1, if pressed again at the right...
                //..moment, would trigger neutralPunch2, and so forth
                dummy.animations.add('neutralPunch1', [14, 15, 16, 17, 18, 19, 20, 21], 15, false);
                dummy.animations.add('neutralPunch2', [22, 23, 24, 25, 26, 27, 28, 29, 30], 25, false);
                dummy.animations.add('neutralPunch3', [14, 15, 16, 17, 18, 19, 20, 21], 15, false);

                dummy.animations.add('neutralPunch4', [22, 23, 24, 25, 26, 27, 28, 29, 30], 25, false);
                dummy.animations.add('neutralPunch5', [123, 124, 125, 126, 127, 128, 129, 130, 131, 132], 25, false);
                //scott.animations.add('neutralKick', [45, 46, 47, 48, 49, 50, 51], 14, false);

                dummy.animations.add('specialKick1', [32, 33, 34, 35, 36, 37, 38, 39, 189, 39, 38, 37, 36, 35, 34, 33, 32], 14, false);

                dummy.animations.add('runAttack', [139, 140, 141, 142, 143, 144, 145, 146], 16, false);
                //scott.animations.add('block', [79, 80, 81, 82, 83, 84, 85], 14, false);
                //scott.animations.add('lowKick', [86, 87, 88, 89, 90, 91], 14, false);
                //scott.animations.add('dodge', [92, 93, 94, 95], 14, false);
                dummy.animations.add('knockback', [156, 157, 158, 159], 14, false);

                dummy.animations.add('startDwnKick', [84], 12, false);
                dummy.animations.add('loopDwnKick', [85, 86, 87], 12, true);
                //warning, ghost has to transform back to his old self, this anim may be absolete
                dummy.animations.add('endDwnKick', [88, 90], 12, false);

                //scott.animations.add('slideKick', [107, 108, 109, 110, 111, 112, 113], 16, false);

                //testing to see if we can run anims like this
                //may not to splite this anim to two  and call them sequentially
                dummy.animations.add('moveDodge', [32, 33, 34, 35, 36, 37, 38, 39, 38, 37, 36, 35, 34, 33, 32], 20, false);

                dummy.animations.add('holdShield', [172, 173, 174, 175, 176, 177, 178, 179], 15, false);

                dummy.animations.add('airDodge', [116, 117, 118, 119, 120], 14, true);

                dummy.animations.add('airRecovery', [76, 77, 78, 79, 80, 81, 82], 14, false);

                dummy.animations.add('upNeutral', [148, 149, 150, 151, 152, 153, 154], 18, false);

                dummy.animations.add('airNeutral', [55, 56, 57, 58, 59, 60, 61, 62, 63, 64], 25, false);

                dummy.animations.add('pushback1', [148], 10, false);
                dummy.animations.add('pushback2', [149], 10, false);
                dummy.animations.add('pushback3', [150], 10, false);



                //UNIQUE TO GHOST


                dummy.animations.add('airKnockback', [160, 161, 162, 163], 13, false);
                dummy.animations.add('meteorSmash', [93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103], 27, false);
                dummy.animations.add('upAir', [105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115], 20, false);
                dummy.animations.add('foxKick', [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74], 15, false);
                dummy.animations.add('haduken', [182, 183, 184, 185, 186, 187, 188], 15, false);

                dummy.animations.play('idle');
                break;

            default:
                break;
        };
        this.enablePhysics = function (sprite) {
            if (this.name == 'scott') {
                sprite.body.setSize(60, 120, 20, 69);
            } else if (this.name == 'mghosty') {
                sprite.body.setSize(60, 120, 20, 47);
            }
            sprite.body.drag.x = 500;

        };
        this.resetFilp = function () {
            this.flipFlop = false;
        };
        this.enableSoundControls = function () {
            CPUbar.run(barr, dummy).listen(dummy);
            CPUjumpSndC.run(jumpSnd, dummy).listen(dummy);

            CPUnatk1C.run(natk1, dummy).listen(dummy);

            CPUghAirRecC.run(ghAirRec, dummy).listen(dummy);

            CPUghRunAtkC.run(ghRunAtk, dummy).listen(dummy);

            CPUghDownKickC.run(ghDownKick, dummy).listen(dummy);

            CPUghAtk2C.run(ghAtk2, dummy).listen(dummy);

            CPUnatk2C.run(natk1, dummy).listen(dummy);

            CPUghUpKickC.run(foxKicks, dummy).listen(dummy);

            CPUghbackKickC.run(ghAirNeu, dummy).listen(dummy);

            CPUghAirNeuC.run(ghAirNeu, dummy).listen(dummy);

            CPUghWhipC.run(ghWhip, dummy).listen(dummy);

            CPUghMeteorC.run(ghMeteor, dummy).listen(dummy);

            CPUstKickC.run(stKick, dummy).listen(dummy);

            CPUsldKickC.run(sldKick, dummy).listen(dummy);

            if (this.name == 'scott') {
                CPUstRunAtkC.run(stRunAtk, dummy).listen(dummy);

                CPUstSpecKickC.run(stSpecKick, dummy).listen(dummy);
            }



            //hbFxKickCtrl.run(scott, atkBox).listen(scott, atkBox);
        }

    };
    this.ghostLand = function (sprite) {
        if (this.name == 'mghosty' && this.isGrounded && ['notloopJump'].includes(sprite.animations.currentAnim.name)) {
            sprite.animations.play('endJump');
        }else{
            return;
        }
    };
    this.ghSpecialListener = function(sprite, enemy, sound) {

        let done = false;
        if (this.name == 'mghosty' && sprite.animations.currentFrame.index == 189) {
    
            ghostSpecialAtk.x = enemy.x;
            ghostSpecialAtk.y = sprite.y - 65;
            ghostSpecialAtk.alpha = 1;
    
            ghostSpecialAtk.revive();
    
            
            game.add.tween(ghostSpecialAtk).to({ alpha: 0 }, 800, "Linear", true);
    
            ghostSpecialAtk.animations.play('show');
    
    
        } else {
            return;
        }
    
    };
    
}




//key listener that riggers animations and boolean changes

//sprite = name of sprite
//charObj  =



/* this.actions = {
    runRight = false,
    runLeft = false,
    jump = false,
    kick = false,
    punch = false,
    holdUp = false,
    evade = false,
    doSpecial = false,

}, */



function CPUListener(sprite, charObj) {

        //console.log("key pressed", e);
        switch (charObj.decision) {
            //standard kick
            case 'kick':
                //if the player is'nt jumping or running
                //then the player will kick normally
                if (!charObj.isJumping && sprite.animations.currentAnim.name !== 'run' && charObj.name !== 'mghosty') {
                    if (sprite.animations.currentAnim.name == 'moveDodge' && [114, 115, 116, 117, 118, 119, 120].includes(sprite.animations.currentAnim.currentFrame.index)) {
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
                } else if (( charObj.actions.runRight || charObj.actions.runLeft) && sprite.animations.currentAnim.name != 'slideKick' && sprite.animations.currentAnim.name == 'run' && charObj.name !== 'mghosty') {

                    charObj.keyPressed = 's';
                    sprite.animations.play('slideKick');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                }

                break;

            // 'd' will be the special button. Hit charObj button attack the right time, and you might unleash a speciall attack or combo
            case 'special':

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
                } else if ((charObj.actions.runRight|| charObj.actions.runLeft) && sprite.animations.currentAnim.name != 'runAttack' && sprite.animations.currentAnim.name == 'run') {
                    charObj.keyPressed = 'd';

                    sprite.animations.play('runAttack');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                } else if ((charObj.actions.holdUp && !flipFlop)) {
                    if (charObj.canAirRecover) {
                        charObj.isAirRecovering = true;
                        charObj.canAirRecover = false;
                        flipFlop = true;

                    } else {
                        return;
                    }


                } else if (charObj.combo[0] == 'neutralPunch5' && sprite.animations.currentAnim.name !== 'idle') {
                    charObj.keyPressed = 'd';

                    if (charObj.name == 'mghosty') {
                        slash.play();
                    } else {
                        stUpNeu.play();
                    }
                    sprite.animations.play('upNeutral');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);

                    /* charObj.combo[0] = (sprite.animations.currentAnim.name); */
                } else if (charObj.name == 'mghosty' && charObj.isGrounded) {
                    if (charObj.isLeft) {
                        charObj.isShotLeft = true;
                    } else {
                        charObj.isShotLeft = false;
                    }
                    charObj.keyPressed = 'd';
                    charObj.isBulletFired = true;

                    sprite.animations.play('haduken');
                    ejectBall.play();
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                } else if (charObj.name == 'mghosty' && !charObj.isGrounded && !charObj.actions.holdUp && !charObj.actions.holdDown ) {
                    charObj.keyPressed = 'd';
                    sprite.animations.play('foxKick');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                }


                break;

            //standard attack
            case 'punch':
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
                } else if (sprite.animations.currentAnim.name != 'idle' && !charObj.isGrounded && charObj.actions.holdUp  && charObj.name == 'mghosty') {

                    sprite.animations.play('upAir');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                    console.log(charObj.combo);
                }
                else if (charObj.name == 'mghosty' && !charObj.isGrounded && charObj.actions.holdDown)  {

                    sprite.animations.play('meteorSmash');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                }


                else if (sprite.animations.currentAnim.name != 'idle' && !charObj.isGrounded && !charObj.actions.holdUp ) {

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

            case 'jump':
                //initizates the jumping animation by setting charObj.isJumping to true
                //stoping the 'idle anim if its currently playing
                //sets charObj.isGrounded to false since the player is not longer on the floor

                if (!charObj.onlyDoOnce && !flipFlop) {
                    charObj.isJumping = true;
                    sprite.animations.stop('idle');

                    charObj.isGrounded = false;
                    charObj.combo[0] = 'jump';
                    //charObj.keyPressed = '';
                    console.log("ddddd");

                    charObj.onlyDoOnce = true;

                    flipFlop = true;

                    //player.animations.play('jump');
                } else {
                    return;
                }




                break;
            case 'evade':
                //initiates the 'block' anim
                //will be used to block attacks
                //possibly counter them as well, might add another mechanic for that soon
                charObj.keyPressed = 'z';
                if (charObj.actions.doSpecial && charObj.name !== 'mghosty') {
                    sprite.animations.stop('idle');
                    sprite.animations.play('dodge');

                } else if (!charObj.isAirDodging && charObj.isGrounded && (charObj.actions.runRight  || charObj.actions.runLeft )) {
                    charObj.isDodging = true;

                    if (charObj.name == 'mghosty') {
                        ghostDodge.play();
                    } else {
                        sdodge.play();
                    }

                } else if (charObj.canAirDodge && !charObj.isGrounded && (charObj.actions.runRight || charObj.actions.runLeft)) {

                    if (charObj.actions.runRight) {
                        charObj.isAirDodging = true;
                        charObj.airDodgeDirect = 'right';
                        charObj.canAirDodge = false;

                    } else if (charObj.actions.runLeft) {
                        charObj.isAirDodging = true;
                        charObj.airDodgeDirect = 'left';
                        charObj.canAirDodge = false;

                    }




                } else if (charObj.isGrounded) {

                    //bar.reset().listen(sprite).run(barr);
                    //console.log(bar);
                    charObj.shield.shieldActive = true;






                }

                break;

            //TESTING ENEMY ATTACKS
            /*             case 't':
                            dummyCombo[0] = 'hit';
                            dummy.animations.play('neutralPunch1');
                            setTimeout(function () {
                                dummyCombo = [];
                            }, 100);
            
            
                            break; */
            default:
                break;
        }

    

};

//checks distance between CPU and block sprite on the stage that represent pits

// charObj = OBJ of the AI
//sprite = sprite of CPU
// blockSprite1 && blockSprite2 = block sprite in stage representing empty space
function fallingSense(charObj, sprite, blockSprite1, blockSprite2){
    let distB1 = getDistance(sprite.x, sprite.y, blockSprite1.x, blockSprite1.y );
    let distB2 = getDistance(sprite.x, sprite.y, blockSprite2.x, blockSprite2.y );
    if(distB1 < 300){
        if(charObj.isGrounded){
            charObj.actions.runRight = true;
            charObj.actions.evade = true;
            resetSense([runRight, evade]);


            
        }else{
            charObj.actions.holdUp = true;
            charObj.actions.doSpecial = true;
            charObj.actions.runRight = true;

            resetSense([holdUp, doSpecial, runRight ]);



            /* setTimeout(function(action){
                CPU.actions[action] = false;
            }, 300);
 */

        }

    }else if (distB2 < 300){
        if(charObj.isGrounded){
            charObj.actions.runLeft = true;
            charObj.actions.evade = true;

            resetSense([runLeft,evade]);
            
        }else{
            charObj.actions.holdUp = true;
            charObj.actions.doSpecial = true;
            charObj.actions.runLeft = true;

            resetSense([holdUp,doSpecial, runLeft ]);


        }
    
    }else{
        return;
    }


}





/* function directionSense(){

}

function attackSense(){

}


function evadeSense(){

} */



// CPU will be the only name of the Ai obj instance


function getDistance (x1, y1, x2, y2) {

    var dx = x1 - x2;
    var dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);

}


function resetSense(arr){
    let senses = arr;

    for(i = 0 ; i < senses.length; i++){

        setTimeout(function(){
            CPU.actions[senses[i]] = false;
        }, 1000);

    }
}








updateGrounded(scott, CPU);

CPUListener(sprite, charObj);
CPU.setupRelations();
CPU.runIdleControl(scott);
CPU.jump(scott, 15);
CPU.glideDownJump(scott);
CPU.jumpAnimLoop(scott);
CPU.downAerialMotion(scott, 'ghost');
CPU.downAerial(scott);


CPU.moveAttackBox(atkBox, scott);
CPU.moveRunAttack(scott, 'runAttack', 10);
CPU.moveRunAttack(scott, 'slideKick', 12);
CPU.moveDodge(scott);
CPU.airDodged(scott);
CPU.resetAirDodge(scott);
CPU.showShield(shield, scott);
CPU.upRecovery(scott);
