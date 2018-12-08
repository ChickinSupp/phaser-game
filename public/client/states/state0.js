let demo = window.demo || (window.demo = {});
let background;

// Loading start sprites and animation
// function loadStartSprite () {
//     background = game.add.sprite(0,0,'startMenu');
//     background.height = 800;
//     background.width = 1000;
    
//     background.animations.add('start', [0,1,2] , 3, false);
//     background.animations.add('enter', [2,3] , 3, true);
//     background.animations.play('start');
// };

// function Menu (){
//     var self = this;
//     this.gameRoom;
//     this.viewId;
//     this.playerCount;
//     this.selectchar;
//   }

demo.state0 = function () {};
demo.state0.prototype = {
    init: function () {
        this.titleText = game.make.text(game.world.centerX, 90, 'Pixel Smash', {
        font: '100px PipeDream',
        align: 'center',
    });
    this.titleText.addColor('white', 0);
    this.titleText.addColor('white', 1);
    this.titleText.addColor('white', 2);
    this.titleText.addColor('white', 3);
    this.titleText.addColor('white', 4);
    this.titleText.addColor('white', 5);
    this.titleText.addColor('white', 7);
    this.titleText.addColor('white', 8);
    this.titleText.addColor('white', 9);
    this.titleText.addColor('white', 10);

    this.titleText.anchor.setTo(0.5);
    this.titleText.setShadow(5, 5, 'rgba(0, 0, 0, 0.5)', 0);
    },
    create: function () {
        game.add.existing(this.titleText);
    },
    update: function () {
        // if(background.animations.currentAnim.name =='start' && background.animations.currentAnim.isFinished) {

        //     background.animations.play('enter');
        // }
        //background.animations.play('enter');
    }
};
