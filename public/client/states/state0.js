let demo = window.demo || (window.demo = {});

//var demo = {};
let background;
demo.state0 = function () {};
demo.state0.prototype = {
    preload: function () {

        game.load.spritesheet('startMenu', 'client/assets/art/start.png',600 ,600 , 4);
    },
    create: function () {
background = game.add.sprite(0,0,'startMenu');
background.height = 800;
background.width = 1000;
background.animations.add('start-state', [0,1,], 3, false);

background.animations.add('enter', [2,3], 3,true);

background.animations.play('start');


    },
    update: function () {
        background.animations.play('enter');
    },
};
