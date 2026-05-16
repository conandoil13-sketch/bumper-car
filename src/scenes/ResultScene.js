import { getCharacterById } from "../data/characters.js";
import PixelUI from "../ui/PixelUI.js";

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  init(data) {
    this.result = data;
    this.character = getCharacterById(data.characterId);
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f172a);
    PixelUI.addPixelText(this, width / 2, 58, "결과", 32);
    const faceKey = this.textures.exists(this.character.faceKey) ? this.character.faceKey : "face-fallback";
    this.add.circle(width / 2, 146, 54, 0x111827).setStrokeStyle(5, this.character.tint);
    const face = this.add.image(width / 2, 146, faceKey).setDisplaySize(92, 92);
    const maskShape = this.add.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillCircle(width / 2, 146, 46);
    face.setMask(maskShape.createGeometryMask());
    maskShape.setVisible(false);
    PixelUI.addPixelText(this, width / 2, 218, `${this.character.name} / ${this.character.type}`, 18);
    const message = PixelUI.addPixelText(this, width / 2, 258, this.character.resultMessage, 14);
    message.setWordWrapWidth(width - 70);
    PixelUI.addPixelText(this, width / 2, 306, `최종 점수 ${this.result.finalScore}`, 24);
    const grade = PixelUI.addPixelText(this, width / 2, 340, this.getGrade(this.result.finalScore), 18);
    grade.setColor("#fef08a");
    this.addResultRows(width);
    PixelUI.addButton(this, width / 2, height - 126, "다시하기", () => {
      this.scene.start("GameScene", { characterId: this.character.id });
    });
    PixelUI.addButton(this, width / 2, height - 64, "메뉴로", () => {
      this.scene.start("MenuScene");
    });
  }

  addResultRows(width) {
    const rows = [
      ["충돌 점수", this.result.collisionScore],
      ["생존 보너스", this.result.survivalBonus],
      ["캐릭터 보너스", this.result.characterBonus],
      ["정면충돌", this.result.frontHits],
      ["측면공격", this.result.sideAttacks],
      ["피격 횟수", this.result.damageTaken],
      ["생존 시간", `${this.result.survivedSeconds}초`]
    ];

    rows.forEach(([label, value], index) => {
      const y = 378 + index * 27;
      PixelUI.addPixelText(this, 72, y, label, 16, 0);
      PixelUI.addPixelText(this, width - 72, y, `${value}`, 16, 1);
    });
  }

  getGrade(score) {
    if (score >= 4000) {
      return "범퍼카 전설";
    }
    if (score >= 2500) {
      return "들이받기의 재능";
    }
    if (score >= 1000) {
      return "길들이는 중";
    }
    return "초보 범퍼카";
  }
}
