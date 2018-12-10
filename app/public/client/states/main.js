var game = new Phaser.Game(
  1200,
  1000,
  Phaser.AUTO,
  document.getElementById("game")
);

function Main() {}

Main.prototype = {
  preload: function() {},
  create: function() {
 
  }
};

game.state.add("state0", demo.state0);
game.state.add("state1", demo.state1);
game.state.add("online", demo.online);
game.state.start("state0");
