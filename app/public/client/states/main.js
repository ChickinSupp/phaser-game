var game = new Phaser.Game(1200,1000,Phaser.AUTO, document.getElementById('game'));

function Main() {}

Main.prototype = {
    preload: function () {
        game.load.script('state0', './state0.js')
    },
    create: function () {
        game.state.add('state0', state1);
        game.state.start('state0');
    }
};

game.state.add('state0', demo.state1);
game.state.start('state0');




