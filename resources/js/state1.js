let demo = window.demo || (window.demo = {});

let pSpeed = 15;
let player, 
sprite2;

demo.state1 = function (){};
demo.state1.prototype = {
    preload: function() {
        game.load.spritesheet('test', 'resources/art/test_idle.png',123,204,8);
        game.load.spritesheet('ground', 'resources/art/platform.png',123,204,8);
        
    },
    create: function () {
        // Starting game physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 100;
        game.stage.backgroundColor = '#800080'
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // Generating player 1
        let player = game.add.sprite(492,408, 'test');

        game.physics.enable([player], Phaser.Physics.ARCADE);
        player.anchor.setTo(0.5,0.5);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 200;
        
        let idle = player.animations.add('idle');
        player.animations.play('idle',13 ,true);
        console.log('animation is working');
        console.log('state1');

        // Creating platform
        sprite2 = game.add.sprite(300,700,'ground',3);
        this.game.physics.arcade.enable(sprite2);

        sprite2.body.allowGravity = false;
        sprite2.enableBody = true;
        sprite2.body.immovable = true;

    },
    update : function (){
        this.game.physics.arcade.collide(player,sprite2);
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