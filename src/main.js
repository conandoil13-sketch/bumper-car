import BootScene from "./scenes/BootScene.js";
import MenuScene from "./scenes/MenuScene.js";
import GameScene from "./scenes/GameScene.js";
import ResultScene from "./scenes/ResultScene.js";

window.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });
window.addEventListener("gesturestart", (event) => event.preventDefault());

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#111827",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,
    height: 844
  },
  render: {
    pixelArt: true,
    antialias: false
  },
  scene: [BootScene, MenuScene, GameScene, ResultScene]
};

new Phaser.Game(config);
