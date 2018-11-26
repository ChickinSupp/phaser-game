let game = new Phaser.Game(1000,800,Phaser.AUTO);
game.state.add('state1', demo.state1);
game.state.start('state1');