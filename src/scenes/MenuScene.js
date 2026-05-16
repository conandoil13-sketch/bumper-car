import { CHARACTERS } from "../data/characters.js";
import PixelUI from "../ui/PixelUI.js";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x111827);
    this.drawPixelBackdrop(width, height);
    this.titleLayer = this.add.container(0, 0);
    this.titleLayer.add(PixelUI.addPixelText(this, width / 2, 86, "노엘의\n범퍼카", 36));
    this.titleLayer.add(PixelUI.addPixelText(this, width / 2, 170, "앞으로 박으면 점수\n옆에서 받히면 목숨 감소", 16));
    this.titleLayer.add(PixelUI.addButton(this, width / 2, 252, "시작", () => this.showCharacterSelect()));
    this.characterLayer = this.add.container(0, 0).setVisible(false);
    this.createCharacterCards(width, height);
  }

  drawPixelBackdrop(width, height) {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x1f2937);
    for (let y = 0; y < height; y += 32) {
      for (let x = (y / 32) % 2 ? 16 : 0; x < width; x += 64) {
        graphics.fillRect(x, y, 28, 8);
      }
    }
    graphics.lineStyle(6, 0xfacc15, 0.55);
    graphics.strokeRect(22, 294, width - 44, 382);
  }

  showCharacterSelect() {
    this.titleLayer.setVisible(false);
    this.characterLayer.setVisible(true);
  }

  createCharacterCards(width) {
    this.characterLayer.add(PixelUI.addPixelText(this, width / 2, 160, "운전자 선택", 24));
    CHARACTERS.forEach((character, index) => {
      const x = width / 2;
      const y = 252 + index * 128;
      const card = this.add.image(x, y, "ui-button-dark").setInteractive({ useHandCursor: true });
      card.setDisplaySize(306, 104);
      const faceKey = this.textures.exists(character.faceKey) ? character.faceKey : "face-fallback";
      const frame = this.add.circle(x - 112, y, 35, 0x0f172a).setStrokeStyle(4, character.tint);
      const face = this.add.image(x - 112, y, faceKey).setDisplaySize(62, 62);
      const maskShape = this.add.graphics();
      maskShape.fillStyle(0xffffff);
      maskShape.fillCircle(x - 112, y, 31);
      face.setMask(maskShape.createGeometryMask());
      maskShape.setVisible(false);
      const name = PixelUI.addPixelText(this, x - 62, y - 28, character.name, 22, 0);
      const type = PixelUI.addPixelText(this, x + 18, y - 22, character.type, 14, 0);
      type.setColor("#fef08a");
      const desc = PixelUI.addPixelText(this, x - 62, y + 10, character.description, 13, 0);
      desc.setWordWrapWidth(210);
      card.on("pointerup", () => {
        this.scene.start("GameScene", { characterId: character.id });
      });
      this.characterLayer.add([card, frame, face, maskShape, name, type, desc]);
    });
  }
}
