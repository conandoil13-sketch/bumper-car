import { CHARACTERS } from "../data/characters.js";
import PixelArtFactory from "../graphics/PixelArtFactory.js";
import VehicleFactory from "../graphics/VehicleFactory.js";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    CHARACTERS.forEach((character) => {
      this.load.image(character.faceKey, character.imagePath);
    });
  }

  create() {
    PixelArtFactory.create(this);
    VehicleFactory.create(this);
    CHARACTERS.forEach((character) => {
      if (this.textures.exists(character.faceKey)) {
        this.textures.get(character.faceKey).setFilter(Phaser.Textures.FilterMode.LINEAR);
      }
    });
    this.scene.start("MenuScene");
  }
}
