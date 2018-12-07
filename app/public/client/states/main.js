var sockets = io();

var game = new Phaser.Game(1000,800,Phaser.AUTO, document.getElementById('game'));

function Main() {}

Main.prototype = {
    preload: function () {
        game.load.script('state1', './state1.js')
    },
    create: function () {
        game.state.add('state1', state1);
        game.state.start('state1');
    }
};


game.state.add('state1', demo.state1);
game.state.start('state1');


