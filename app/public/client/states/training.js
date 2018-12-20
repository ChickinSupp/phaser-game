
player = new Character('mghosty', 10, 1000, 1600);

comp = new Ai('scott', 10, 1110, 1700 );



demo.training= function () { };
demo.training.prototype = {
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
/*         attackSense(comp, dummy, player, scott);
        moveSense(comp, dummy, player, scott); */
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
        comp.moveDodge(dummy);
        //comp.upRecovery(dummy);

    }
}

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

