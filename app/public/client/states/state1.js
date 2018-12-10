demo = window.demo || (window.demo = {});

//mghosty for ghost
let dude, comp;
// scott for scott

//Get player
const getPlayer  = (player1, player2) => {
    if (player1 === 'dude') {
        dude = new Character('mghosty', 10, 1300, 1500);
    } else if(player1 === 'comp') {
        comp = new Character('dummy', 10, 120);
    }

    if (player2 === 'dude') {
        dude = new Character('mghosty', 10, 1300, 1500);
    } else if(player2 === 'comp') {
        comp = new Character('dummy', 10, 120);
    }
};

let manager;
let emitter;
let projectile;
let stage = '';
let lives;
let music;
let flipFlop;

let airRec;




let slash;
let ejectBall;
let ghostDodge;



let sdodge;

let barr;

let natk1;

let jumpSnd;

let natk1C;

let jumpSndC;


let ghAirRecC;
let ghAirRec;


let ghRunAtkC;
let ghRunAtk;

let ghDownKick;
let ghDownKickC;


let ghAtk2;
let ghAtk2C;

let natk2C;

let ghAtk4;

let foxKicks;
let ghUpKickC;

let ghbackKickC;

let ghAirNeu;

let ghAirNeuC;

let ghAirDodgeC;

let ghWhip;

let ghWhipC;

let ghMeteor;
let ghMeteorC;



let stKick;

let stKickC;

let sldKick;

let sldKickC;

let stRunAtk;

let stRunAtkC;

let stSpecKick;

let stSpecKickC;

let stpunch5C;

let stUpNeu;




let shieldHit;

let normalHit;


let shadowHit;





let hbFxKickCtrl = new hitboxCtrl('foxKick', [67, 68]);





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

nullHitEffect = new hitEffectCtrl(true);

normHit = new hitEffectCtrl(false);



console.log(dude);




let player,
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
//checks to see if player is currenlty jumping
//meant for hitboxes, position relative to the sprite its a hitbox for

const lzzzzs = {
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


        game.load.spritesheet('dbox', '../assets/art/2pbox.png', 25, 25);


        //soundControl.loadSFX();

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

        game.load.audio('ghAirNeu', '../assets/sfx/ghAirKick.wav');

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
        //sound, sprite, atkBox, charObj





    },
    create: function () {
        // Starting game physics

        game.physics.startSystem(Phaser.Physics.ARCADE);

        //game.physics.arcade.gravity.y = 900;
        game.stage.backgroundColor = '#800080'
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        bfBackground = game.add.sprite(0, 0, 'back');

        //scott = game.add.sprite(400, 100, 'tester');
        dummy = game.add.sprite(200, 100, 'tester2');

        //ghost = game.add.sprite(500, 100, 'ghosty');
        dude.createFighter();

        dude.addSFX();


        music = game.add.audio('battle1');

        //music.play();

        resizeToSprite(bfBackground, game, 0, 0);

        bfBackground.animations.add('on', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
            , 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], 30, true);


        bfBackground.animations.play('on');



        lives = game.add.group();

        let lifename;

        if (dude.name == 'mghosty') {
            lifename = 'ghostStock';
        } else {
            lifename = 'scottStock';
        }

        for (var i = 0; i < 3; i++) {
            //  This creates a new Phaser.Sprite instance within the group
            //  It will be randomly placed within the world and use the 'baddie' image to display
            life = lives.create(45 + (i * 50), 700, lifename, i);
            life.name = 'life' + i;
        }
        console.log(life);


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
        dummy.animations.add('knockback', [96, 97, 98, 99, 100], 13, false);

        dummy.animations.add('startDwnKick', [100, 101, 102], 12, false);
        dummy.animations.add('loopDwnKick', [103, 104, 105], 12, true);
        dummy.animations.add('endDwnKick', [106], 12, false);

        dummy.animations.add('slideKick', [107, 108, 109, 110, 111, 112, 113], 16, false);

        dummy.animations.add('notloopJump', [24, 25], 12, false);
        dummy.animations.add('pushback1', [148], 10, false);
        dummy.animations.add('pushback2', [149], 10, false);
        dummy.animations.add('pushback3', [150], 10, false);


        //creates hitbox when player attacks
        //gets attack animname passed in playerCombo
        //based on what attack it is, it renders around the attack point, and disappears after 1 second

        //creates a hitbox group
        hitboxes = game.add.group();
        hitboxes.enableBody = true;

        //creates an instance of hitbox;
        atkBox = hitboxes.create(0, 0, 'hbox');


        scndBox = hitboxes.create(0, 0, 'dbox');
        //sets the size of the hitbox, without any offset

        //dummyBox = hitboxes.create(0, 0, 'hbox');

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

        elec = hitEffects.create(0, 0, 'hardHit');

        elec.animations.add('show', [0, 1, 2, 3, 4, 5], 20, false);

        elec.animations.currentAnim.killOnComplete = true;

        shadowHit = hitEffects.create(0, 0, 'ballHit');

        shadowHit.animations.add('show', [0, 1, 2, 3, 4, 5], 20, false);

        shadowHit.animations.currentAnim.killOnComplete = true;

        //elec.alpha = 1;

        shieldHitS = hitEffects.create(0, 0, 'shieldHit');

        shieldHitS.animations.add('show', [0, 1, 2, 3, 4, 5], 20, false);

        shieldHitS.animations.currentAnim.killOnComplete = true;

        shieldHitS.play();


        //plays added animaiton


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

        dude.enablePhysics(scott);




        platform.enableBody = true;
        platform2.enableBody = true;
        platform3.enableBody = true;
        battlefield.enableBody = true;
        battlefield.scale.setTo(2, 2);
        battlefield.body.setSize(321, 126, 0, 25);

        //scott
        //scott.body.setSize(60, 120, 20, 69);
        //ghost
        //scott.body.setSize(60, 120, 20, 47);



        scott.anchor.setTo(0.5, 0.5);
        shield.anchor.setTo(0.5, 0.5);

        dummy.body.gravity.y = 2100;

        //scott.body.drag.y = 500;
        dummy.body.drag.x = 400;
        dummy.body.drag.y = 0;


        //testing player collsinion box resize


        dummy.body.setSize(60, 120, 20,60);




        platform.body.immovable = true;
        platform2.body.immovable = true;
        platform3.body.immovable = true;
        battlefield.body.immovable = true;

        console.log(atkBox);
        console.log(scott);
        console.log(dude.isGrounded);

    },
    update: function () {

        game.physics.arcade.collide(scott, battlefield, resetFilp);
        game.physics.arcade.collide(dummy, [platform, platform1, platform2, platform3, battlefield]);

        game.physics.arcade.overlap(dummy, projectile, proxyBulletCallback);

        //hitbox on dummy, runs hit();
        game.physics.arcade.overlap(dummy, atkBox, hit);

        game.physics.arcade.overlap(dummy, atkBox, function () {


            normHit.run(normalHit, elec, atkBox, dummy, scott, dude);


        });

        //nullHitEffect.run(shieldHit, shieldHitS, atkBox, dummy);

        //normHit.run(hit, elec, atkBox, dummy);


        //sound, sprite, atkBox, charObj

        game.physics.arcade.overlap(scott, scndBox, dummyhit);



        //EVERYTHING WE NEED TO HAVE SCOTT ACTIVE***************************
        //game.debug.body(scott);
        updateGrounded(scott, dude);

        keyListener(scott, dude, true, 's', 'd', 'a', 'x', 'z');
        dude.setupRelations();
        dude.runIdleControl(scott);
        dude.jump(scott, 15);
        dude.glideDownJump(scott);
        dude.jumpAnimLoop(scott);
        dude.downAerialMotion(scott, 'ghost');
        dude.downAerial(scott);


        dude.moveAttackBox(atkBox, scott);
        dude.moveRunAttack(scott, 'runAttack', 10);
        dude.moveRunAttack(scott, 'slideKick', 12);
        dude.moveDodge(scott);
        dude.airDodged(scott);
        dude.resetAirDodge(scott);
        dude.showShield(shield, scott);
        dude.upRecovery(scott);

        shootBullet(dude, scott, atkBox, projectile, -900, 0);

        bar.run(barr, scott).listen(scott);
        jumpSndC.run(jumpSnd, scott).listen(scott);

        natk1C.run(natk1, scott).listen(scott);

        ghAirRecC.run(ghAirRec, scott).listen(scott);

        ghRunAtkC.run(ghRunAtk, scott).listen(scott);

        ghDownKickC.run(ghDownKick, scott).listen(scott);

        ghAtk2C.run(ghAtk2, scott).listen(scott);

        natk2C.run(natk1, scott).listen(scott);

        ghUpKickC.run(foxKicks, scott).listen(scott);

        ghbackKickC.run(ghAirNeu, scott).listen(scott);

        ghAirNeuC.run(ghAirNeu, scott).listen(scott);

        ghWhipC.run(ghWhip, scott).listen(scott);

        ghMeteorC.run(ghMeteor, scott).listen(scott);

        stKickC.run(stKick, scott).listen(scott);

        sldKickC.run(sldKick, scott).listen(scott);

        if (dude.name == 'scott') {
            stRunAtkC.run(stRunAtk, scott).listen(scott);

            stSpecKickC.run(stSpecKick, scott).listen(scott);
        }



        hbFxKickCtrl.run(scott, atkBox).listen(scott, atkBox);

        hurt(scott, dummy, dude, comp);



        resizeToSprite(shield, scott, 0, 0);

        trajectoryBounce(dummy, comp);


        getLoser(dude, scott);

        getLoser(comp, dummy);


        ghostLand(dude, scott);

        /*************************TESTING DUMMY (2PLAYER )*********** */

        updateGrounded(dummy, comp);
        //dummykeyListener(dummy, comp,true, 'u', 'i', 'o', 'p', 'l');
        /*    comp.runIdleControl(dummy);
           comp.jump(dummy, 15);
           comp.glideDownJump(dummy, 1000, dude.stats.gravity);
           comp.jumpAnimLoop(dummy);
           comp.downAerialMotion(dummy, 'low');
           comp.downAerial(dummy);
   
   
           comp.moveAttackBox(scndBox, dummy);
           comp.moveRunAttack(dummy, 'runAttack', 10);
           comp.moveRunAttack(dummy, 'slideKick', 12);
           comp.moveDodge(dummy);
           comp.airDodged(dummy);
           comp.resetAirDodge(dummy);
           //comp.showShield(shield, dummy);
           comp.upRecovery(dummy);
    */
        //comp.velocityStallControl(dummy); 
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


        //make tthis dymanic
        function hit(sprit, obj, injObj) {
            let charObj = dude;
            let sprite = scott;
            let inCharObj = comp;
            let inSprite = dummy;



            if (sprite.animations.currentAnim.name != 'idle' && (['foxKick', 'upAir', 'meteorSmash', 'neutralKick', 'neutralPunch1', 'neutralPunch2',

                'neutralPunch3', 'neutralPunch4', 'specialKick1', 'runAttack', 'slideKick', 'loopDwnKick', 'upNeutral', 'airRecovery', 'airNeutral'].includes(sprite.animations.currentAnim.name))) {

                charObj.hitbox.isOverlapping = true;
                charObj.hitbox.isAtkBoxActive = true;

                alertIsHurt(sprite, inSprite, inCharObj);
                /*                 inCharObj.getHitWith = sprite.animations.currentAnim.name;   
                                inCharObj.isHurt = true; */
                console.log("dummy's speed", dummy.body.speed);
                //console.log('Dummy is hurt',  inCharObj.isHurt);

            } else {

                charObj.hitbox.isOverlapping = false;
                charObj.hitbox.isAtkBoxActive = false;
                //inCharObj.isHurt = false;
                //inCharObj.stopMotion = false;



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

        function dummyhit(sprit, obj) {
            let charObj = comp;
            let sprite = dummy;


            if (sprite.animations.currentAnim.name != 'idle' && (['foxKick', 'upAir', 'meteorSmash', 'neutralKick', 'neutralPunch1', 'neutralPunch2',

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


function proxyBulletCallback() {
    runBulletCollide(dude, comp, dummy, projectile);
}




//********************GLOBAL FUNCTIONS************* */


// sprite = sprite that is attacking
// injSprite = sprite that is hurt
// charObj = char obj for the sprite that is attacking
// hurtCharObj = char obj for the sprite that is hurt

function hurt(sprite, injSprite, charObj, hurtCharObj, bulletSprite, pushback, length, collisionType, hboxName) {
    if (charObj.hitbox.isOverlapping && charObj.hitbox.isAtkBoxActive) {
        hurtCharObj.stats.damage += 0.93;
        console.log(hurtCharObj.stats.damage);
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
        console.log(charObj.isShotLeft)
        effectSprite.x = contactSprite.x;
        effectSprite.y = contactSprite.y - 50;


    } else {
        console.log(charObj.isShotLeft)
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
        console.log('beep')


    } else {
        Xvector = 120 + injCharObj.stats.damage;
        Yvector = -40 - injCharObj.stats.damage;
        console.log('boop');
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

            if (charObj.timedBonus) {
                console.log('time bonus', charObj.timedBonus);
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

function destroyEmitter() {

    emitter.destroy();

}

function trajectoryBounce(injSprite, injcharObj) {
    if (60 < injcharObj.stats.damage < 100) {
        injSprite.body.bounce.set(0.3);
    } else if (100 < injcharObj.stats.damage < 300) {
        injSprite.body.bounce.set(10);
    }
    else {
        return;
    }
}






let once = false;

function getLoser(charObj, sprite) {
    if (sprite.world.y > 2000 || sprite.world.y < -100 || sprite.world.x < -300 || sprite.world.x > 1500) {
        if (!once) {
            alert(`${charObj.name} has lost a life`);
            once = true;
        }
        //alert(`${charObj.name} has lost a life`);
        sprite.x = 500;
        sprite.y = 100;
        removeStock(charObj, lives);
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

        /* if(!game.physics.arcade.overlap(sprite, atkBox)){
            sprite.alpha = 0;
        } */
    }
    this.checkReset = function (sprite, attacker, atkCharObj) {
        /*  if (sprite.animations.currentAnim.isFinished) {
 
 
             sprite.alpha = 0;
 
         } */
        /*   if (attacker.animations.currentAnim.name !== this.hitterAnim) {
              sprite.alpha = 0;
  
              this.hasPlayed = false;
          } */

        sprite.alpha = 0;
        this.hitterAnim = false;
        this.hasPlayed = false;
        return this;
    };



}

function hitboxCtrl(anim, frames, charObj) {

    this.animName = anim;
    this.frames = frames;
    this.hasPlayed = false;
    this.canReset = false;

    //hitbox sprite
    this.run = function (sprite, atckBox) {

        if (!this.hasPlayed && (this.frames).includes(sprite.animations.currentFrame.index)) {
            atckBox.alpha = 1;
            console.log('rrrrr');

            this.hasPlayed = true;
        }
        return this;
    };
    this.listen = function (sprite, atckBox) {
        if (this.animName == sprite.animations.currentAnim.name && ![(this.frames).join()].includes(sprite.animations.currentFrame.index)) {

            this.reset(atckBox);
        }
        return this;
    };
    this.reset = function (atckBox) {
        atckBox.alpha = 0;
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
        alert(`${charObj.name} has lost the battle!`);
    }


}




function resetStats(charObj) {
    charObj.stats.damage = 0;
}

function ghostLand(charObj, sprite) {
    if (charObj.name == 'mghosty' && charObj.isGrounded && ['notloopJump'].includes(sprite.animations.currentAnim.name)) {
        sprite.animations.play('endJump');
    }
}






function resetFilp() {

    flipFlop = false;
}

