let game = new Phaser.Game(1200,1000,Phaser.AUTO, document.getElementById('game'));
game.state.add('state0', demo.state0);
game.state.add('state1', demo.state1);
game.state.add('state2', demo.state2);
game.state.start('state0');

