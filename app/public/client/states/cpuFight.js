demo = window.demo || (window.demo = {});

//mghosty for ghost

// scott for scott
player = new Character('mghosty', 10, 1000, 1900);


comp = new Ai('scott', 10, 1300, 1500);


let attempts = 0;
let hits = 0;

let hitRatio = 0;

let cpulife;

let CPUlives;

hitRatio = (hits/attempts) * 100;

manager;
emitter;
projectile;
stage = '';
lives;
music;
flipFlop;
// sound vars need for global use for player 1
airRec;
slash;
ejectBall;
ghostDodge;
sdodge;
barr;
natk1;
jumpSnd;


ghAirRec;

ghRunAtk;
ghDownKick;
ghAtk2;
foxKicks;
ghAirNeu;
ghWhip;
ghMeteor;
stKick;
sldKick;
stRunAtk;
stSpecKick;
stUpNeu;


shieldHit;

normalHit;

shadowHit;

ghostSpecialAtk;



cpuB1;
cpuB2;


let cpuHit;

//sound control for playing sounds at the right moments
bar = new soundCtrl('holdShield');

natk1C = new soundCtrl('neutralPunch1');

jumpSndC = new soundCtrl('startJump');

ghAirRecC = new soundCtrl('airRecovery');

ghRunAtkC = new soundCtrl('runAttack');

ghDownKickC = new soundCtrl('loopDwnKick');

ghAtk2C = new soundCtrl('neutralPunch2');

natk2C = new soundCtrl('neutralPunch3');

ghAtk4 = new soundCtrl('neutralPunch4');

ghUpKickC = new soundCtrl('upAir');

ghbackKickC = new soundCtrl('foxKick');

ghAirNeuC = new soundCtrl('airNeutral');

ghAirDodgeC = new soundCtrl('airDodge');

ghWhipC = new soundCtrl('neutralPunch5');

ghMeteorC = new soundCtrl('meteorSmash');

stKickC = new soundCtrl('neutralKick');

sldKickC = new soundCtrl('slideKick');


stRunAtkC = new soundCtrl('runAttack');


stSpecKickC = new soundCtrl('specialKick1');

//hit effect renderers for player 1

nullHitEffect = new hitEffectCtrl(true);

normHit = new hitEffectCtrl(false);

grghostHit = new hitEffectCtrl(false);


//FOR CPU

//sound controls for CPU
CPUbar = new soundCtrl('holdShield');

CPUnatk1C = new soundCtrl('neutralPunch1');

CPUjumpSndC = new soundCtrl('startJump');

CPUghAirRecC = new soundCtrl('airRecovery');

CPUghRunAtkC = new soundCtrl('runAttack');

CPUghDownKickC = new soundCtrl('loopDwnKick');

CPUghAtk2C = new soundCtrl('neutralPunch2');

CPUnatk2C = new soundCtrl('neutralPunch3');

CPUghAtk4 = new soundCtrl('neutralPunch4');

CPUghUpKickC = new soundCtrl('upAir');

CPUghbackKickC = new soundCtrl('foxKick');

CPUghAirNeuC = new soundCtrl('airNeutral');

CPUghAirDodgeC = new soundCtrl('airDodge');

CPUghWhipC = new soundCtrl('neutralPunch5');

CPUghMeteorC = new soundCtrl('meteorSmash');

CPUstKickC = new soundCtrl('neutralKick');

CPUsldKickC = new soundCtrl('slideKick');


CPUstRunAtkC = new soundCtrl('runAttack');


CPUstSpecKickC = new soundCtrl('specialKick1');

//hit effect renderers for CPU

CPUnullHitEffect = new hitEffectCtrl(true);

CPUnormHit = new hitEffectCtrl(false);

CPUgrghostHit = new hitEffectCtrl(false);



function Ai(name, power, gravity, jumpResistance) {
    this.name = name;
    this.combo = [];
    this.getHitWith = '';
    this.isHurt = false;
    this.actions = {
        runRight: false,
        runLeft: false,
        jump: false,
        kick: false,
        punch: false,
        holdUp: false,
        evade: false,
        doSpecial: false,

    },
        this.decision = '';
    this.lives = {
        left: 3
    };
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

    this.CPUbrain = function () {


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
                    
                    sprite.animations.play('endJump');
                    this.startedJump = false;

                    this.isJumping = false;
                    this.canPlayerJump = false;


                }
                else if (!this.isGrounded && this.startedJump) {
                   
                    sprite.animations.play('loopJump');
                } else if (this.combo[0] == 'jump' && !this.isGrounded && !this.startedJump) {

                    this.startedJump = true;
                    this.isJumping = true;
                    //sprite.animations.stop('idle');
                    sprite.animations.play('startJump');
              


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
      

            } else if (this.airDownChecks.isDownAirAtk2 && !this.isGrounded) {
                sprite.animations.play('loopDwnKick');
                this.combo[0] = 'loopDwnKick';
                /* if (player.animations.currentAnim.isFinished) { */
                this.airDownChecks.isDownAirAtk2 = false;
                this.airDownChecks.isDownAirAtk3 = true;

    

            } else if (this.airDownChecks.isDownAirAtk3 && this.isGrounded && this.completedJump) {
                sprite.animations.play('endDwnKick');
                this.airDownChecks.isDownAirAtk2 = true;
                this.airDownChecks.isDownAirAtk3 = false;
                this.airDownChecks.isDownAirAtk1 = false;
                this.isAirAttack = false;
            
            }
        } else {
            return;
        }
    };


    this.jump = function (sprite, maxHeight) {


        if (!this.isAirDodging && this.decision == 'jump' && this.stats.jumpH < 30) {
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
            this.toggleSpriteMotion(sprite);

    
            if (this.airDodgeDirect === 'right') {
                sprite.animations.play('airDodge');
                game.add.tween(sprite).to({ x: '-80' }, 500, Phaser.Easing.Cubic.Out, true);
                this.doTimeout(this.toggleSpriteMotion, 500, sprite);
                //sprite.body.velocity.setTo(-125, 0);
                //game.add.tween(sprite).onComplete.add(toggleSpriteMotion, this);
                this.isAirDodging = false;
                this.airDodgeDirect = '';
          
            } else if (this.airDodgeDirect === 'left') {
                sprite.animations.play('airDodge');
                game.add.tween(sprite).to({ x: '80' }, 500, Phaser.Easing.Cubic.Out, true);
                this.doTimeout(this.toggleSpriteMotion, 500, sprite);
                //game.add.tween(sprite).onComplete.add(toggleSpriteMotion, this);
                //sprite.body.velocity.setTo(125, 0);
                this.isAirDodging = false;
                this.airDodgeDirect = '';
            
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

          

            } else if (this.isLeft) {
                sprite.animations.play('airRecovery');
                this.combo[0] = (sprite.animations.currentAnim.name);
                game.add.tween(sprite).to({ x: '-80', y: '-180' }, 400, Phaser.Easing.Cubic.Out, true);
                this.doTimeout(this.toggleSpriteMotion, 400, scott);


                this.isAirRecovering = false;

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
            



                setTimeout(function () {
                    this.stopMotion = false;
                    this.getHitWith = '';


                    this.isHurt = false;

                }, 1000);


            } else if (100 < sprite.body.speed < 200 && ['airRecovery', 'upNeutral', 'airNeutral'].includes(this.getHitWith) && !this.stallChecked) {
                this.stopMotion = true;

                this.stallChecked = true;


                setTimeout(function () {
                    this.stopMotion = false;
                    this.getHitWith = '';

                    this.isHurt = false;

                }, 1200);

            } else if (200 < sprite.body.speed < 300 && ['airRecovery', 'upNeutral', 'airNeutral'].includes(this.getHitWith) && !this.stallChecked) {
                this.stopMotion = true;
                this.stallChecked = true;
   

                setTimeout(function () {
                    this.stopMotion = false;
                    this.getHitWith = '';
               
                    this.isHurt = false;
                
                }, 1300);

            }
            else if (300 < sprite.body.speed && ['airRecovery', 'upNeutral', 'airNeutral'].includes(this.getHitWith) && !this.stallChecked) {
                this.stopMotion = true;
                
                this.stallChecked = true;


                setTimeout(function () {
                    this.stopMotion = false;
                    this.getHitWith = '';
       
                    this.isHurt = false;
   
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
                dummy = game.add.sprite(700, 400, 'tester');
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
                dummy.animations.add('knockback', [96, 97, 98, 99, 100], 10, false);

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

                dummy.animations.add('pushback1', [148], 3, false);
                dummy.animations.add('pushback2', [149], 3, false);
                dummy.animations.add('pushback3', [150], 3, false);

                dummy.animations.play('idle');
                break;
            case 'deku':


                break;
            case 'mghosty':
                dummy = game.add.sprite(400, 400, 'ghosty');
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
        } else {
            return;
        }
    };
    this.ghSpecialListener = function (sprite, enemy, sound) {

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








//contains all our booleans and stats for a character





//key listener that riggers animations and boolean changes

//sprite = name of sprite
//charObj  =
function keyListener(sprite, charObj, isCustom, kick, special, std, jump, evade) {


    game.input.keyboard.onPressCallback = function (e) {
      
        attempts++;
        switch (e) {
            //standard kick
            case kick:
                //if the player is'nt jumping or running
                //then the player will kick normally
                if (!charObj.isJumping && sprite.animations.currentAnim.name !== 'run' && charObj.name !== 'mghosty') {
                    if (sprite.animations.currentAnim.name == 'moveDodge' && [114, 115, 116, 117, 118, 119, 120].includes(sprite.animations.currentAnim.currentFrame.index)) {
                        charObj.timedBonus = true;

                    }
                    sprite.animations.play('neutralKick');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                    charObj.keyPressed = 's';
                   


                    //if he is jumping, then will set isPlayerAirAttack to true
                    //charObj will allow downAerial() to run and the initiate the DownAirKick animation
                } else if (charObj.isJumping) {
                    charObj.isAirAttack = true;
                    


                    //if the player is running either to the left or right side, and if the current animation is not already 'slidekick'
                    //then play the 'slideKick' animation
                    //would not want to play the same animation if its already playing....
                } else if ((game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) && sprite.animations.currentAnim.name != 'slideKick' && sprite.animations.currentAnim.name == 'run' && charObj.name !== 'mghosty') {

                    charObj.keyPressed = 's';
                    sprite.animations.play('slideKick');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                }

                break;

            // 'd' will be the special button. Hit charObj button attack the right time, and you might unleash a speciall attack or combo
            case special:

                //will only play if the last attack(animation) was neutralPunch3

                if (charObj.combo[0] == 'neutralPunch3' && sprite.animations.currentAnim.name != 'idle') {
                    if (sprite.animations.currentAnim.name === 'neutralPunch3' || sprite.animations.currentAnim.isFinished) {
                        charObj.keyPressed = 'd';
                        sprite.animations.play('specialKick1');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);

                       
                    } else {
                        return;
                    }
                    //forward attack OR attack while running
                } else if ((game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) && sprite.animations.currentAnim.name != 'runAttack' && sprite.animations.currentAnim.name == 'run') {
                    charObj.keyPressed = 'd';

                    sprite.animations.play('runAttack');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                } else if ((game.input.keyboard.isDown(Phaser.Keyboard.UP) && !charObj.flipFlop)) {
                    if (charObj.canAirRecover) {
                        charObj.isAirRecovering = true;
                        charObj.canAirRecover = false;
                        charObj.flipFlop = true;

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
                } else if (charObj.name == 'mghosty' && !charObj.isGrounded && !game.input.keyboard.isDown(Phaser.Keyboard.UP) && !game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                    charObj.keyPressed = 'd';
                    sprite.animations.play('foxKick');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                }


                break;

            //standard attack
            case std:
                //charObj.keyPressed = 'a';
                if (charObj.combo[0] == 'neutralPunch1' && sprite.animations.currentAnim.name != 'idle' && sprite.animations.currentAnim.name != 'jump') {
                    if (sprite.animations.currentAnim.name === 'neutralPunch1' || sprite.animations.currentAnim.isFinished) {
                        charObj.keyPressed = 'a';
                        sprite.animations.play('neutralPunch2');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);
                       
                    } else {
                        return;
                    }
                } else if (charObj.combo[0] == 'neutralPunch2' && sprite.animations.currentAnim.name != 'idle') {
                    if (sprite.animations.currentAnim.name === 'neutralPunch2' || sprite.animations.currentAnim.isFinished) {
                        charObj.keyPressed = 'a';
                        sprite.animations.play('neutralPunch3');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);
                      
                    } else {
                        return;
                    }
                } else if (charObj.combo[0] == 'neutralPunch3' && sprite.animations.currentAnim.name != 'idle') {
                    if (sprite.animations.currentAnim.name === 'neutralPunch3' || sprite.animations.currentAnim.isFinished) {
                        charObj.keyPressed = 'a';

                        sprite.animations.play('neutralPunch4');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);
                      
                    } else {
                        return;
                    }
                } else if (charObj.combo[0] == 'neutralPunch4' && sprite.animations.currentAnim.name != 'idle') {
                    if (sprite.animations.currentAnim.name === 'neutralPunch4' || sprite.animations.currentAnim.isFinished) {
                        sprite.animations.play('neutralPunch5');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);
                      
                    } else {
                        return;
                    }
                } else if (sprite.animations.currentAnim.name != 'idle' && !charObj.isGrounded && game.input.keyboard.isDown(Phaser.Keyboard.UP) && charObj.name == 'mghosty') {

                    sprite.animations.play('upAir');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
               
                }
                else if (charObj.name == 'mghosty' && !charObj.isGrounded && game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {

                    sprite.animations.play('meteorSmash');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                }


                else if (sprite.animations.currentAnim.name != 'idle' && !charObj.isGrounded && !game.input.keyboard.isDown(Phaser.Keyboard.UP)) {

                    sprite.animations.play('airNeutral');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                 
                }

                else {
                    if ((sprite.animations.currentAnim.name === 'idle' || sprite.animations.currentAnim.name === 'run') || sprite.animations.currentAnim.isFinished) {
                        charObj.keyPressed = 'a';
                        sprite.animations.play('neutralPunch1');
                        charObj.combo[0] = (sprite.animations.currentAnim.name);
                   
                    } else {
                   
                    }
                }

                break;

            case jump:
                //initizates the jumping animation by setting charObj.isJumping to true
                //stoping the 'idle anim if its currently playing
                //sets charObj.isGrounded to false since the player is not longer on the floor

                if (!charObj.onlyDoOnce && !charObj.flipFlop) {
                    charObj.isJumping = true;
                    sprite.animations.stop('idle');

                    charObj.isGrounded = false;
                    charObj.combo[0] = 'jump';
                    //charObj.keyPressed = '';
                  

                    charObj.onlyDoOnce = true;

                    charObj.flipFlop = true;

                    //player.animations.play('jump');
                } else {
                    return;
                }




                break;
            case evade:
                //initiates the 'block' anim
                //will be used to block attacks
                //possibly counter them as well, might add another mechanic for that soon
                charObj.keyPressed = 'z';
                if (game.input.keyboard.isDown(Phaser.Keyboard.D) && charObj.name !== 'mghosty') {
                    sprite.animations.stop('idle');
                    sprite.animations.play('dodge');

                } else if (!charObj.isAirDodging && charObj.isGrounded && (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT))) {
                    charObj.isDodging = true;

                    if (charObj.name == 'mghosty') {
                        ghostDodge.play();
                    } else {
                        sdodge.play();
                    }

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

            default:
                break;
        }

    }

};


function CPUListener(sprite, charObj) {

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
        

                //if he is jumping, then will set isPlayerAirAttack to true
                //charObj will allow downAerial() to run and the initiate the DownAirKick animation
            } else if (charObj.isJumping) {
                charObj.isAirAttack = true;
          


                //if the player is running either to the left or right side, and if the current animation is not already 'slidekick'
                //then play the 'slideKick' animation
                //would not want to play the same animation if its already playing....
            } else if ((charObj.actions.runRight || charObj.actions.runLeft) && sprite.animations.currentAnim.name != 'slideKick' && sprite.animations.currentAnim.name == 'run' && charObj.name !== 'mghosty') {

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

                 
                } else {
                    return;
                }
                //forward attack OR attack while running
            } else if ((charObj.actions.runRight || charObj.actions.runLeft) && sprite.animations.currentAnim.name != 'runAttack' && sprite.animations.currentAnim.name == 'run') {
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
            } else if (charObj.name == 'mghosty' && !charObj.isGrounded && !charObj.actions.holdUp && !charObj.actions.holdDown) {
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
                  
                } else {
                    return;
                }
            } else if (charObj.combo[0] == 'neutralPunch2' && sprite.animations.currentAnim.name != 'idle') {
                if (sprite.animations.currentAnim.name === 'neutralPunch2' || sprite.animations.currentAnim.isFinished) {
                    charObj.keyPressed = 'a';
                    sprite.animations.play('neutralPunch3');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                
                } else {
                    return;
                }
            } else if (charObj.combo[0] == 'neutralPunch3' && sprite.animations.currentAnim.name != 'idle') {
                if (sprite.animations.currentAnim.name === 'neutralPunch3' || sprite.animations.currentAnim.isFinished) {
                    charObj.keyPressed = 'a';

                    sprite.animations.play('neutralPunch4');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                   
                } else {
                    return;
                }
            } else if (charObj.combo[0] == 'neutralPunch4' && sprite.animations.currentAnim.name != 'idle') {
                if (sprite.animations.currentAnim.name === 'neutralPunch4' || sprite.animations.currentAnim.isFinished) {
                    sprite.animations.play('neutralPunch5');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                  
                } else {
                    return;
                }
            } else if (sprite.animations.currentAnim.name != 'idle' && !charObj.isGrounded && charObj.actions.holdUp && charObj.name == 'mghosty') {

                sprite.animations.play('upAir');
                charObj.combo[0] = (sprite.animations.currentAnim.name);
            
            }
            else if (charObj.name == 'mghosty' && !charObj.isGrounded && charObj.actions.holdDown) {

                sprite.animations.play('meteorSmash');
                charObj.combo[0] = (sprite.animations.currentAnim.name);
            }


            else if (sprite.animations.currentAnim.name != 'idle' && !charObj.isGrounded && !charObj.actions.holdUp) {

                sprite.animations.play('airNeutral');
                charObj.combo[0] = (sprite.animations.currentAnim.name);
          
            }

            else {
                if ((sprite.animations.currentAnim.name === 'idle' || sprite.animations.currentAnim.name === 'run') || sprite.animations.currentAnim.isFinished) {
                    charObj.keyPressed = 'a';
                    sprite.animations.play('neutralPunch1');
                    charObj.combo[0] = (sprite.animations.currentAnim.name);
                  
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

            } else if (!charObj.isAirDodging && charObj.isGrounded && (charObj.actions.runRight || charObj.actions.runLeft)) {
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

player,
    players = [],
    scott,
    dummy,
    ghost,
    //var containing the hitbox that we will render whwnever the plaer lanches an attack
    atkBox,
    scndBox,
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


demo.cpuFight = function () { };
demo.cpuFight.prototype = {
    preload: function () {
        //preloads spritesheets to be used in create
        game.load.spritesheet('tester', '../assets/art/scott-final.png', 142, 184, 151);
        game.load.spritesheet('tester2', '../assets/art/test-scott-2.png', 142, 184, 151);
        game.load.spritesheet('ground', '../assets/art/big-platform.png');
        game.load.spritesheet('hbox', '../assets/art/hbox.png', 25, 25);
        game.load.spritesheet('platform1', '../assets/art/platform1.png', 50, 11);
        game.load.spritesheet('battlestage1', '../assets/art/base-stage1.png', 321, 126);
        game.load.spritesheet('barrier', '../assets/art/barrier.png', 108, 94, 6);
        game.load.spritesheet('elecHit', '../assets/art/hit.png', 50, 28, 3);
        game.load.spritesheet('pred', '../assets/art/particlered.png', 4, 4);
        game.load.spritesheet('back', '../assets/art/background1.png', 500, 700, 34);
        game.load.spritesheet('bonusPtcl', '../assets/art/particleStar.png', 30, 30);

        game.load.spritesheet('ghosty', '../assets/art/MarshUmbra.png', 160, 160, 190);
        game.load.spritesheet('shBall', '../assets/art/umbraball.png', 60, 63);
        game.load.spritesheet('spectre', '../assets/art/UmbraAttack.png', 160, 160, 23);


        game.load.spritesheet('sStock', '../assets/art/umbraball.png', 60, 63);
        game.load.spritesheet('ghostStock', '../assets/art/ghostStock.png', 32, 32);
        game.load.spritesheet('scottStock', '../assets/art/sStock.png', 32, 32);

        game.load.spritesheet('shieldHit', '../assets/art/nullHit.png', 45, 45);
        game.load.spritesheet('hardHit', '../assets/art/hardHit.png', 57, 57);
        game.load.spritesheet('ballHit', '../assets/art/ghost_impact.png', 53, 58);
        game.load.spritesheet('hardHit2', '../assets/art/hardHit2.png', 57, 57);
        game.load.spritesheet('dbox', '../assets/art/2pbox.png', 25, 25);
        game.load.spritesheet('b1', '../assets/art/cpuBlock.png');
        game.load.spritesheet('b2', '../assets/art/cpuBlock2.png');

        game.load.audio('airRecov', '../assets/sfx/airRecov.wav');
        game.load.audio('criticalHit', '../assets/sfx/critical.wav');
        game.load.audio('grDodge', '../assets/sfx/grDodge.wav');
        game.load.audio('hit', '../assets/sfx/hit1.wav');
        game.load.audio('hit2', '../assets/sfx/deppSounds.wav');

        game.load.audio('die', '../assets/sfx/Deleted.wav');
        game.load.audio('enter', '../assets/sfx/enter.wav');
        game.load.audio('throwball', '../assets/sfx/energyballthrow.wav');
        game.load.audio('block', '../assets/sfx/AttackBounce.wav');
        game.load.audio('sword', '../assets/sfx/SwordSwing.wav');
        game.load.audio('gdodge', '../assets/sfx/Shield.wav');

        game.load.audio('barrier', '../assets/sfx/barrier.wav');

        game.load.audio('gnatk1', '../assets/sfx/ghAtk1.wav');

        game.load.audio('jumpa', '../assets/sfx/jump.wav');

        game.load.audio('ghRun', '../assets/sfx/ghRunAtk.wav');

        game.load.audio('ghAir', '../assets/sfx/ghAirRec.wav');

        game.load.audio('ghRunAtk', '../assets/sfx/ghRunAtk.wav');

        game.load.audio('ghDownKick', '../assets/sfx/ghDownKick.wav');

        game.load.audio('ghAtk2', '../assets/sfx/ghAtk2.wav');

        game.load.audio('foxKicks', '../assets/sfx/ghFoxKicks.wav');

        game.load.audio('ghAirNeu', '../assets/sfx/ghairKick.wav');

        game.load.audio('ghWhip', '../assets/sfx/ghWhip.wav');
        game.load.audio('ghMeteor', '../assets/sfx/meteorS.wav');
        game.load.audio('stKick', '../assets/sfx/stKick.wav');
        game.load.audio('stRunAtk', '../assets/sfx/stRunAtk.wav');
        game.load.audio('stSlideKick', '../assets/sfx/stSlideKick.wav');
        game.load.audio('stSpecKick', '../assets/sfx/stSpecialKick.wav');
        game.load.audio('stPunch', '../assets/sfx/stPunch.wav');
        game.load.audio('stUpNeu', '../assets/sfx/stUpNeu.wav');
        game.load.audio('nullHit', '../assets/sfx/AttackBounce.wav');
        game.load.audio('elecHit', '../assets/sfx/Hurt.wav');
        game.load.audio('explosion', '../assets/sfx/expl.wav');
        game.load.audio('battle1', '../assets/music/Ambush.mp3');
        game.load.audio('battle2', '../assets/music/Friendly Competition.ogg');
    },
    create: function () {
        // Starting game physics

        game.physics.startSystem(Phaser.Physics.ARCADE);

        music = game.add.audio('battle2');
        music.play();

        game.stage.backgroundColor = '#800080';
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        bfBackground = game.add.sprite(0, 0, 'back');

        bfBackground.width =1000;
        bfBackground.height =700;


        //dummy = game.add.sprite(200, 100, 'tester2');


        player.createFighter();

        comp.createFighter();
        player.addSFX();
        comp.addSFX();





        

        bfBackground.animations.add('on', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
            , 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], 30, true);


        bfBackground.animations.play('on');

        cpuB1 = game.add.sprite(50, 600, 'b1')

        cpuB2 = game.add.sprite(800, 600, 'b2');

        cpuB1.alpha = 0;

        cpuB2.alpha = 0;



        lives = game.add.group();
        CPUlives = game.add.group();

        let lifename;

        if (player.name == 'mghosty') {
            lifename = 'ghostStock';
        } else {
            lifename = 'scottStock';
        }

        for (var i = 0; i < 3; i++) {
            //  This creates a new Phaser.Sprite instance within the group
            //  It will be randomly placed within the world and use the 'baddie' image to display
            life = lives.create(45 + (i * 50), 100, lifename, i);
            life.name = 'life' + i;
        }

        let CPUlifename;

        if(comp.name == 'mghosty'){
            CPUlifename = 'ghostStock';
        } else {
            CPUlifename = 'scottStock';
        }
        
        for (var i = 0; i < 3; i++) {
            //  This creates a new Phaser.Sprite instance within the group
            //  It will be randomly placed within the world and use the 'baddie' image to display
            cpulife = CPUlives.create(800 + (i * 50), 100, CPUlifename, i);
            cpulife.name = 'life' + i;
        }






        //creates hitbox when player attacks
        //gets attack animname passed in playerCombo
        //based on what attack it is, it renders around the attack point, and disappears after 1 second

        //creates a hitbox group
        hitboxes = game.add.group();
        hitboxes.enableBody = true;

        //creates an instance of hitbox;
        atkBox = hitboxes.create(0, 0, 'hbox');


        scndBox = hitboxes.create(0, 0, 'dbox');


        projectiles = game.add.group();
        projectiles.enableBody = true;

        projectile = projectiles.create(0, 0, 'shBall');
        projectile.alpha = 0;





        shields = game.add.group();

        shields.enableBody = true;

        shield = shields.create(0, 0, 'barrier');

        shield.animations.add('on', [0, 1, 2, 3, 4, 5, 6], 25, false);

        shield.alpha = 0;
        //atkBox.body.setSize(15, 15, 0, 0);


        hitEffects = game.add.group();

        let hitEffectName;

        if (player.name == 'mghosty') {
            hitEffectName = 'hardHit'
        } else {
            hitEffectName = 'hardHit2'
        }

        elec = hitEffects.create(0, 0, hitEffectName);

        elec.animations.add('show', [0, 1, 2, 3, 4, 5], 20, false);

        elec.animations.currentAnim.killOnComplete = true;


        let cpuHitEffect;

        if (comp.name == 'mghosty') {
            cpuHitEffect = 'hardHit'
        } else {
            cpuHitEffect = 'hardHit2'
        }



        cpuHit = hitEffects.create(0, 0, cpuHitEffect);

        cpuHit.animations.add('show', [0, 1, 2, 3, 4, 5], 20, false);

        cpuHit.animations.currentAnim.killOnComplete = true;





        shadowHit = hitEffects.create(0, 0, 'ballHit');

        shadowHit.animations.add('show', [0, 1, 2, 3, 4, 5], 20, false);

        shadowHit.animations.currentAnim.killOnComplete = true;



        shieldHitS = hitEffects.create(0, 0, 'shieldHit');

        shieldHitS.animations.add('show', [0, 1, 2, 3, 4, 5], 20, false);

        shieldHitS.animations.currentAnim.killOnComplete = true;

        shieldHitS.alpha = 0;

        ghostSpecialAtk = hitEffects.create(0, 0, 'spectre');


        ghostSpecialAtk.animations.add('show', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], 90, false);

        ghostSpecialAtk.animations.currentAnim.killOnComplete = true;
        ghostSpecialAtk.enableBody = true;

        ghostSpecialAtk.alpha = 0;

        //shieldHitS.play();


        //plays added animaiton


        dummy.animations.play('idle');

      


        // Creating platform
      
        battlefield = game.add.sprite(200, 500, 'battlestage1');


        //enables gravity on player but not on platform
        game.physics.arcade.enable([scott, dummy, battlefield, atkBox, ghostSpecialAtk]);

        player.enablePhysics(scott);
        comp.enablePhysics(dummy);



        battlefield.enableBody = true;
        battlefield.scale.setTo(2, 2);
        battlefield.body.setSize(321, 126, 0, 25);


        scott.anchor.setTo(0.5, 0.5);
        dummy.anchor.setTo(0.5, 0.5);
        shield.anchor.setTo(0.5, 0.5);

        dummy.body.gravity.y = 2100;


        dummy.body.drag.x = 400;
        dummy.body.drag.y = 0;





        dummy.body.setSize(60, 120, 20, 60);



        battlefield.body.immovable = true;


    },
    update: function () {
        //work around for repeating 'airRecovers'
        game.physics.arcade.collide(scott, battlefield, function () {
            player.resetFilp();
        });

        game.physics.arcade.collide(dummy, battlefield, function () {
            comp.resetFilp();
        });

        //dummy will collide with the stage
        game.physics.arcade.collide(dummy, [/* platform, platform1, platform2, platform3, */ battlefield]);
        //dummy will be damaged by the projectile
        game.physics.arcade.overlap(dummy, projectile, function () {
            runBulletCollide(player, comp, dummy, projectile);
        });

        //hitbox on dummy, runs hit();

        //dummy will be hit when player hits him
        game.physics.arcade.overlap(dummy, atkBox, function () {
            hits++;
            hit(player, scott, comp, dummy);
            //elec hiteffect will play on dummy when hit
            normHit.run(normalHit, elec, atkBox, dummy, scott, player);


        });
        //if ghost,dummy will be hit when player'specialKick1 hits him
        game.physics.arcade.overlap(dummy, ghostSpecialAtk, function () {

            hit(player, scott, comp, dummy);
            grghostHit.run(normalHit, elec, dummy, dummy, scott, player);
        });

        game.physics.arcade.overlap(dummy, [cpuB1, cpuB2], function () {

            escape();
        });


        //sound, sprite, atkBox, charObj

        //testing for dummy hiting player
        game.physics.arcade.overlap(scott, scndBox, function () {
            hit(comp, dummy, player, scott);
            CPUnormHit.run(normalHit, cpuHit, scndBox, scott, dummy, comp);

        });



        //EVERYTHING WE NEED TO HAVE SCOTT ACTIVE***************************
        //game.debug.body(scott);
        updateGrounded(scott, player);

        keyListener(scott, player, true, 's', 'd', 'a', 'x', 'z');
        player.setupRelations();
        player.runIdleControl(scott);
        player.jump(scott, 15);
        player.glideDownJump(scott);
        player.jumpAnimLoop(scott);
        player.downAerialMotion(scott, 'ghost');
        player.downAerial(scott);
        player.moveAttackBox(atkBox, scott);
        player.moveRunAttack(scott, 'runAttack', 10);
        player.moveRunAttack(scott, 'slideKick', 12);
        player.moveDodge(scott);
        player.airDodged(scott);
        player.resetAirDodge(scott);
        player.showShield(shield, scott);
        player.upRecovery(scott);
        player.ghostLand(scott);
        player.ghSpecialListener(scott, dummy);

        shootBullet(player, scott, atkBox, projectile, -900, 0);



        hurt(scott, dummy, player, comp);

        hurt(dummy, scott, comp, player);



        resizeToSprite(shield, scott, 0, 0);

        //trajectoryBounce(dummy, comp);


        getLoser(player, scott, lives );

        getLoser(comp, dummy, CPUlives );

        player.enableSoundControls();

        /*************************TESTING DUMMY (2PLAYER )*********** */
        comp.runIdleControl(dummy);
        attackSense(comp, dummy, player, scott);
        moveSense(comp, dummy, player, scott);
        //fallingSense(comp, dummy, cpuB1,cpuB2);
        CPUupdateGrounded(dummy, comp);
        CPUListener(dummy, comp);
        comp.enableSoundControls();
        comp.jump(dummy, 15);
        comp.glideDownJump(dummy, 1000, comp.stats.gravity);
        comp.jumpAnimLoop(dummy);
        comp.downAerialMotion(dummy, 'med');
        comp.downAerial(dummy);
        comp.moveAttackBox(scndBox, dummy)
        comp.moveRunAttack(dummy, 'runAttack', 10);
        comp.moveRunAttack(dummy, 'slideKick', 12);
        //comp.airDodged(dummy);
   
        
        //comp.resetAirDodge(dummy);
        comp.moveDodge(dummy);
        //comp.upRecovery(dummy);
        
        //END***************************************

        //**************** H E L P E R    F U N C T I O N S*******************//



        function updateGrounded(sprite, charObj) {
            if (sprite.body.touching.down) {
                charObj.isGrounded = true;
                charObj.stats.jumpH = 0;
                charObj.resetFilp();

            } else {
                charObj.isGrounded = false;
            }


        }

        function CPUupdateGrounded(sprite, charObj) {
            if (sprite.body.touching.down) {
                charObj.isGrounded = true;
                charObj.stats.jumpH = 0;
                charObj.resetFilp();

            } else {
                charObj.isGrounded = false;
            }


        }
        //********************************************HIT LOGIC*********************************************************** */

        //the following code is extemely crude and is only used for testing purposes

        //this entire file will be refactored soon.


        //make tthis dymanic
        function hit(charObj, sprite, inCharObj, inSprite) {

            if (game.physics.arcade.overlap(dummy, ghostSpecialAtk) || sprite.animations.currentAnim.name != 'idle' && (['foxKick', 'upAir', 'meteorSmash', 'neutralKick', 'neutralPunch1', 'neutralPunch2',

                'neutralPunch3', 'neutralPunch4', 'specialKick1', 'runAttack', 'slideKick', 'loopDwnKick', 'upNeutral', 'airRecovery', 'airNeutral'].includes(sprite.animations.currentAnim.name))) {

                charObj.hitbox.isOverlapping = true;
                charObj.hitbox.isAtkBoxActive = true;

                alertIsHurt(sprite, inSprite, inCharObj);


            } else {

                charObj.hitbox.isOverlapping = false;
                charObj.hitbox.isAtkBoxActive = false;

            }

        }
        //sprite = opponent sprite
        //charobj for the sprite that got hit with an attack
        function alertIsHurt(sprite, injSprite, charObj) {
            if (!charObj.stallChecked) {
                charObj.getHitWith = sprite.animations.currentAnim.name;
                charObj.isHurt = true;
                charObj.stallChecked = true;
                //comp.velocityStallControl(injSprite); 
                charObj.resetGetHit(charObj);
            } else {
                return;
            }
        }



    }


};


//********************GLOBAL FUNCTIONS************* */


// sprite = sprite that is attacking
// injSprite = sprite that is hurt
// charObj = char obj for the sprite that is attacking
// hurtCharObj = char obj for the sprite that is hurt

function hurt(sprite, injSprite, charObj, hurtCharObj) {
    if (charObj.hitbox.isOverlapping && charObj.hitbox.isAtkBoxActive) {
        hurtCharObj.stats.damage += 0.93;

        injSprite.animations.play('knockback');

        hurtCharObj.pushbackControl(injSprite);
        hitParticle(charObj, hurtCharObj);
        getLaunchAmount(sprite, injSprite, charObj, hurtCharObj);
        charObj.hitbox.isOverlapping = false;
        charObj.hitbox.isAtkBoxActive = false;
        //sprite.body.velocity = 0;
    } else {
        return;
    }

}

function renderEffect(effectSprite, contactSprite, charObj, amount) {


    let tweena = game.add.tween(effectSprite);
    let sound = game.add.audio('explosion');

    effectSprite.alpha = 1;
    effectSprite.scale.setTo(2, 2);
    effectSprite.revive();

    if (charObj.isShotLeft) {
      
        effectSprite.x = contactSprite.x;
        effectSprite.y = contactSprite.y - 50;


    } else {
       
        effectSprite.x = contactSprite.x;
        effectSprite.y = contactSprite.y - 50;


    }



    tweena.to({ x: amount }, 500, Phaser.Easing.Out, true);
    effectSprite.animations.play('show');

    sound.play();
    tweena.start();

}

function runBulletCollide(charObj, injCharObj, injSprite, bulletSprite) {
    injCharObj.stats.damage += 40;

    if (charObj.isShotLeft) {


        Xvector = -120 - injCharObj.stats.damage;
        Yvector = -40 - injCharObj.stats.damage;

        injSprite.animations.play('knockback')
        injSprite.body.velocity.setTo(Xvector, Yvector);
        renderEffect(shadowHit, bulletSprite, charObj, -100);

        bulletSprite.destroy();



        //charObj.isShotLeft = false;
        charObj.isBulletFired = false;
        projectile = projectiles.create(0, 0, 'shBall');
        projectile.alpha = 0;
       


    } else {
        Xvector = 120 + injCharObj.stats.damage;
        Yvector = -40 - injCharObj.stats.damage;
     
        injSprite.animations.play('knockback')
        injSprite.body.velocity.setTo(Xvector, Yvector);
        renderEffect(shadowHit, bulletSprite, charObj, 100);
        bulletSprite.destroy();
        //charObj.isShotLeft = false;
        charObj.isBulletFired = false;
        projectile = projectiles.create(0, 0, 'shBall');
        projectile.alpha = 0;

    }



}

function shootBullet(charObj, sprite, atkBox, bulletSprite, velX, velY) {
    let x;
    let y = velY;


    if (charObj.isBulletFired && sprite.animations.currentAnim.name == 'haduken' && sprite.animations.currentFrame.index == 185) {
        charObj.isLeft ? x = velX : x = velX * -1;
        bulletSprite.position = {
            x: atkBox.x,
            y: atkBox.y,
            type: 25
        }
        bulletSprite.alpha = 0.5;

        bulletSprite.body.velocity.setTo(x, y);

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
        } else if (attacker.animations.currentAnim.name == 'specialKick1' && charObj.name !== 'mghosty') {
            if (charObj.isLeft) {

                Xvector = -50 - injCharObj.stats.damage;
                Yvector = -140 - injCharObj.stats.damage;

            } else {
                Xvector = 50 + injCharObj.stats.damage;
                Yvector = -140 - injCharObj.stats.damage;

            }
        } else if (attacker.animations.currentAnim.name == 'neutralKick') {
            let bonus = 0;

            if (charObj.timedBonus) {
          
                bonus = 200;
            }
            if (charObj.isLeft) {

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
        else if (attacker.animations.currentAnim.name == 'airNeutral' && charObj.name !== 'mghosty') {



            if (charObj.isLeft) {
                Xvector = -250 - injCharObj.stats.damage;
                Yvector = 550 + injCharObj.stats.damage;



            } else {
                Xvector = 250 + injCharObj.stats.damage;
                Yvector = 550 + injCharObj.stats.damage;


            }
        }
        else if (attacker.animations.currentAnim.name == 'airNeutral' && charObj.name == 'mghosty') {



            if (charObj.isLeft) {
                Xvector = -200 - injCharObj.stats.damage;
                Yvector = 30 + injCharObj.stats.damage;



            } else {
                Xvector = 200 + injCharObj.stats.damage;
                Yvector = 30 + injCharObj.stats.damage;


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
        else if (attacker.animations.currentAnim.name == 'meteorSmash') {
            if (charObj.isLeft) {
                Xvector = -1 - injCharObj.stats.damage;
                Yvector = 500 + injCharObj.stats.damage;



            } else {
                Xvector = 1 + injCharObj.stats.damage;
                Yvector = 500 - injCharObj.stats.damage;


            }
        }
        else if (attacker.animations.currentAnim.name == 'upAir') {
            if (charObj.isLeft) {
                //Xvector = -1 - injCharObj.stats.damage;
                Yvector = -340 - injCharObj.stats.damage;



            } else {
                //Xvector = 1 + injCharObj.stats.damage;
                Yvector = -340 - injCharObj.stats.damage;


            }
        }
        else if (attacker.animations.currentAnim.name == 'foxKick') {
            if (charObj.isLeft) {
                Xvector = 511 + injCharObj.stats.damage;
                Yvector = -25 - injCharObj.stats.damage;



            } else {
                Xvector = -511 - injCharObj.stats.damage;
                Yvector = -25 - injCharObj.stats.damage;


            }
        } else if (attacker.animations.currentAnim.name == 'specialKick1' && charObj.name == 'mghosty') {
            if (charObj.isLeft) {

                Yvector = -700 - injCharObj.stats.damage;



            } else {

                Yvector = -700 - injCharObj.stats.damage;


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




function resizeToSprite(sprite, example, wOffset, hOffset) {
    if ((sprite.width < example.width) &&
        (sprite.height < example.height)) {
        sprite.width = (example.width + wOffset);
        sprite.height = (example.height + hOffset);

    } else {
        return;
    }
}


function hitParticle(charObj, hurtcharObj) {

    let amt = hurtcharObj.stats.damage;
    if (charObj.timedBonus) {
        let bonusEmit;
        bonusEmit = game.add.emitter(atkBox.x, atkBox.y, 50);
        bonusEmit.makeParticles('bonusPtcl', [0], 90);
        //emitter.minParticleSpeed = (1);
        bonusEmit.setYSpeed(-10, 40);
        bonusEmit.setXSpeed(-10, 80);
        bonusEmit.minParticleScale = 0.3;
        bonusEmit.maxParticleScale = 1;
        bonusEmit.start(false, 600, null, 0.5);
    } else {
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


/* function trajectoryBounce(injSprite, injcharObj) {
    if (60 < injcharObj.stats.damage < 100) {
        injSprite.body.bounce.set(0.3);
    } else if (100 < injcharObj.stats.damage < 300) {
        injSprite.body.bounce.set(10);
    }
    else {
        return;
    }
}
 */





once = false;

function getLoser(charObj, sprite, lifegroup) {
    if (sprite.world.y > 2000 || sprite.world.y < -200 || sprite.world.x < -300 || sprite.world.x > 1500) {
        if (!once) {
            //alert(`${charObj.name} has lost a life`);
            once = true;
        }
        //alert(`${charObj.name} has lost a life`);
        sprite.x = 500;
        sprite.y = 100;
        removeStock(charObj, lifegroup);
        resetStats(charObj);
        setTimeout(function () {
            once = false;
        }, 1000)
    }
}



function soundCtrl(anim) {

    this.animName = anim;
    this.hasPlayed = false;

    this.canReset = false;
    this.run = function (sound, sprite) {
        if (!this.hasPlayed && this.animName == sprite.animations.currentAnim.name) {
            sound.play();
            this.hasPlayed = true;
        }
        return this;
    };
    this.listen = function (sprite) {
        if (this.animName !== sprite.animations.currentAnim.name) {

            this.reset();
        }
        return this;
    };
    this.reset = function () {


        this.hasPlayed = false;

        this.canReset = false;

        return this;
    };

}





function hitEffectCtrl(isForShield) {
    this.forShield = isForShield;
    this.hasPlayed = false;
    this.canReset = false;
    this.hitterAnim = '';
    //sound = sound that should be play
    //sprite = sprite of hit effect
    //atkBox = attack box sprite
    //charObj = char obj
    this.run = function (sound, sprite, atkBox, charObj, attacker, atkCharObj) {

        if (this.forShield) {

            if (charObj.shield.shieldActive && !this.hasPlayed) {
                sprite.revive(100);
                sprite.x = atkBox.x;
                sprite.y = atkBox.y;
                sound.play();

                sprite.alpha = 1
                sprite.animations.play('show');
                this.hitterAnim = attacker.animations.currentAnim.name;

                this.hasPlayed = true;
            }

        } else {

            if (!this.hasPlayed && atkCharObj.hitbox.isAtkBoxActive) {
                sprite.revive(100);
                sprite.x = atkBox.x;
                sprite.y = atkBox.y;
                sound.play();

                sprite.alpha = 1
                sprite.animations.play('show');
                this.hitterAnim = attacker.animations.currentAnim.name;
                this.hasPlayed = true;
            }

        }
        if (sprite.animations.currentAnim.isFinished || !sprite.animations.currentAnim.isPlaying && this.hasPlayed && attacker.animations.currentAnim.name !== this.hitterAnim) {
            this.checkReset(sprite/* , attacker, atkCharObj */);
        }
    }
    this.checkReset = function (sprite, attacker, atkCharObj) {

        sprite.alpha = 0;
        this.hitterAnim = false;
        this.hasPlayed = false;
        return this;
    };



}



function removeStock(charObj, groupname) {


    if (charObj.lives.left > 0) {

        let num = charObj.lives.left - 1;
        if (groupname.children[num].name == `life${num}`) {
            groupname.children[num].visible = false;
            charObj.lives.left--;
        } else {
            return;
        }



    } else {
        //alert(`${charObj.name} has lost the battle!`);
        game.sound.stopAll();
        game.state.start('online');
    }


}




function resetStats(charObj) {
    charObj.stats.damage = 0;
}


function getDistance(x1, y1, x2, y2) {

    var dx = x1 - x2;
    var dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);

}

function getNeg(x1, x2) {
    let dx = x1 - x2;

    return dx;
}
let atkdist;

let dist;

function attackSense(CPUobj, sprite, enemyObj, enemy) {

    let cpuX = sprite.x;
    let cpuY = sprite.y;

    atkdist = getDistance(cpuX, cpuY, enemy.x, enemy.y);


    if (enemyObj.isGrounded) {

        if (3 < atkdist < 5) {
            if (CPUobj.actions.holdUp == true) {
                CPUobj.actions.holdUp = false;
            }
            CPUobj.decision = 'punch';
            if(CPUobj.combo[0] == 'neutralPunch5'){
                CPUobj.decision = 'special';
                CPUobj.decision = 'jump';
            }

        } else if (atkdist < 3 && enemyObj.isGrounded) {
            CPUobj.decision = 'punch';
        }
    } else if (!enemyObj.isGrounded) {
        if ((20 < atkdist < 200)) {
            if (CPUobj.decision == 'kick') {
                CPUobj.decision = '';
            }

            CPUobj.actions.runRight = false;
            CPUobj.actions.runLeft = false;

            CPUobj.actions.holdUp = true;
            CPUobj.decision = 'special';
        }

    } else if (!CPUobj.isGrounded && atkdist > 20 && enemyObj.isGrounded) {
        CPUobj.decision = 'jump';
        CPUobj.decision = 'kick';


    }


}

function escape() {
    if (game.physics.arcade.overlap(dummy, cpuB1)) {
        comp.actions.runRight = true;
        comp.actions.holdUp = true;
        comp.decision = 'special';
    } else if (game.physics.arcade.overlap(dummy, cpuB2)) {
        comp.actions.runLeft = true;
        comp.actions.holdUp = true;
        comp.decision = 'special';
    }
}

function moveSense(CPUobj, sprite, enemyObj, enemy) {
    let cpuX = sprite.x;
    let cpuY = sprite.y;
    let distB1 = getDistance(sprite.x, sprite.y, cpuB1.x, cpuB1.y);
    let distB2 = getDistance(sprite.x, sprite.y, cpuB2.x, cpuB2.y);

    dist = getDistance(cpuX, cpuY, enemy.x, enemy.y);

    direct = getNeg(scott.x, dummy.x);



    if (!(distB1 < 130) && !(distB2 < 130)) {
        if (dist > 20) {

            if (direct < 0 && enemyObj.isGrounded) {
                CPUobj.actions.runRight = false;
                CPUobj.actions.runLeft = true;
                CPUobj.decision = 'special';
            } else if (direct > 0) {
                CPUobj.actions.runLeft = false;
                CPUobj.actions.runRight = true;
                CPUobj.decision = 'special';
            }


        }

        else if (dist < 20 && !enemyObj.isGrounded) {
            CPUobj.actions.runRight = false;
            CPUobj.actions.runLeft = false;
            /* if (CPUobj.decision == 'special') {
                CPUobj.decision = '';
            } */

        }

        else {
            return;
        }


    } else if (distB1 < 130 && CPUobj.isGrounded) {

        CPUobj.decision = '';
        CPUobj.actions.runRight = true;
    } else if (distB2 < 130 && CPUobj.isGrounded) {
        CPUobj.decision = '';
        CPUobj.actions.runLeft = true;
    } else if (distB1 < 130 && !CPUobj.isGrounded) {
        CPUobj.actions.runRight = true;
        comp.actions.holdUp = true;
        comp.decision = 'special';
    } else if (distB2 < 130 && !CPUobj.isGrounded) {
        CPUobj.actions.runLeft = true;
        comp.actions.holdUp = true;
        comp.decision = 'special';
    }
}




function fallingSense(charObj, sprite, blockSprite1, blockSprite2) {
    let distB1 = getDistance(sprite.x, sprite.y, blockSprite1.x, blockSprite1.y);
    let distB2 = getDistance(sprite.x, sprite.y, blockSprite2.x, blockSprite2.y);


    if (distB2 < 450) {
        if (charObj.isGrounded) {
            charObj.actions.runLeft = true;
            charObj.actions.evade = true;

        } else {
            charObj.actions.holdUp = true;
            charObj.actions.doSpecial = true;
            charObj.actions.runLeft = true;


        }

    } else {
        charObj.actions.runLeft = false;
        charObj.actions.doSpecial = false;
        charObj.actions.evade = false
        charObj.actions.holdUp = false;


    }

    if (distB1 < 450) {
        if (charObj.isGrounded) {
            charObj.actions.runRight = true;
            charObj.actions.evade = true;

        } else {
            charObj.actions.holdUp = true;
            charObj.actions.doSpecial = true;
            charObj.actions.runRight = true;



        }

    } else {
        charObj.actions.doSpecial = false;
        charObj.actions.runLeft = false;
        charObj.actions.evade = false

        return;
    }

}

function resetSense(arr) {
    let senses = arr;

    for (i = 0; i < senses.length; i++) {

        setTimeout(function () {
            comp.actions[senses[i]] = false;
        }, 300);

    }
}