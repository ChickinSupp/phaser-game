var game = new Phaser.Game(1000,800,Phaser.AUTO, document.getElementById('game'));

function Main() {}

Main.prototype = {
    preload: function () {
        game.load.script('state0', './state0.js');
        game.load.script('state1', './state1.js');
        game.load.script('online', './online.js');
    },
    create: function () {
        game.state.add('state0', state0);
        game.state.add('state1', state1);
        game.state.add('online', online);
    }
};

game.state.add('state0', demo.state0);
game.state.add('online', demo.online);
game.state.add('state1', demo.state1);
game.state.start('state0');




