import { CHARACTERS, getCharacterById } from "../data/characters.js";
import VehicleFactory from "../graphics/VehicleFactory.js";
import PixelUI from "../ui/PixelUI.js";
import VirtualJoystick from "../ui/VirtualJoystick.js";
import BoostButton from "../ui/BoostButton.js";
import KeyboardControls from "../ui/KeyboardControls.js";
import ScoreSystem from "../systems/ScoreSystem.js";
import VehicleController from "../systems/VehicleController.js";
import EnemySystem from "../systems/EnemySystem.js";
import CollisionSystem from "../systems/CollisionSystem.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.selectedCharacter = getCharacterById(data.characterId);
    this.lives = 3;
    this.remainingTime = 45;
    this.invulnerableUntil = 0;
    this.hasEnded = false;
  }

  create() {
    const { width, height } = this.scale;
    this.scoreSystem = new ScoreSystem();
    this.scoreSystem.start(this.time.now, this.selectedCharacter);
    this.arenaBounds = this.drawArena(width, height);
    this.player = VehicleFactory.addVehicle(this, width / 2, height / 2 + 120, this.selectedCharacter);
    this.player.setDepth(5);
    this.enemies = CHARACTERS.map((character, index) => {
      const carKeys = ["car-yellow", "car-blue", "car-purple"];
      const enemy = VehicleFactory.addVehicle(this, 92 + index * 102, 332, character, {
        scale: 0.86,
        carKey: carKeys[index],
        showFace: false
      });
      enemy.rotation = Phaser.Math.DegToRad(180 + index * 18);
      enemy.setDepth(4);
      return enemy;
    });
    this.createHud(width);
    this.joystick = new VirtualJoystick(this, width - 78, height - 84);
    this.boostButton = new BoostButton(this, 76, height - 86, {
      recoveryPerSecond: this.selectedCharacter.stats.boostRegen
    });
    this.keyboardControls = new KeyboardControls(this);
    this.playerController = new VehicleController(this, this.player, {
      bounds: this.arenaBounds,
      maxSpeed: this.selectedCharacter.stats.maxSpeed,
      acceleration: this.selectedCharacter.stats.acceleration,
      friction: this.selectedCharacter.stats.friction,
      turnSpeed: this.selectedCharacter.stats.turnRate,
      boostMultiplier: this.selectedCharacter.stats.boostPower
    });
    this.enemySystem = new EnemySystem(this, this.enemies, this.player, this.arenaBounds);
    this.collisionSystem = new CollisionSystem(
      this,
      this.player,
      this.playerController,
      this.enemySystem,
      this.scoreSystem,
      { character: this.selectedCharacter }
    );
    this.input.addPointer(2);
    this.showRuleOverlay(width, height);
  }

  drawArena(width, height) {
    this.add.rectangle(width / 2, height / 2, width, height, 0x172554);
    const graphics = this.add.graphics();
    graphics.fillStyle(0x334155);
    graphics.fillRect(26, 126, width - 52, height - 260);
    graphics.lineStyle(8, 0xf8fafc);
    graphics.strokeRect(30, 130, width - 60, height - 268);
    graphics.lineStyle(4, 0xfacc15);
    graphics.strokeRect(48, 148, width - 96, height - 304);
    graphics.fillStyle(0x475569, 0.8);
    for (let y = 164; y < height - 150; y += 42) {
      for (let x = 48; x < width - 50; x += 42) {
        graphics.fillRect(x, y, 18, 18);
      }
    }
    return {
      left: 48,
      right: width - 48,
      top: 148,
      bottom: height - 156
    };
  }

  createHud(width) {
    this.livesText = PixelUI.addPixelText(this, 20, 26, "목숨", 16, 0);
    this.timeText = PixelUI.addPixelText(this, width / 2, 26, "45", 22);
    this.scoreText = PixelUI.addPixelText(this, width - 20, 26, "점수 0", 17, 1);
    this.heartIcons = [0, 1, 2].map((index) => this.add.image(24 + index * 24, 58, "ui-heart"));
    this.addProfile(width);
  }

  addProfile(width) {
    const x = width / 2;
    const y = 68;
    this.add.rectangle(x, y, 132, 34, 0x0f172a, 0.86).setStrokeStyle(2, this.selectedCharacter.tint);
    const faceKey = this.textures.exists(this.selectedCharacter.faceKey) ? this.selectedCharacter.faceKey : "face-fallback";
    const frame = this.add.circle(x - 50, y, 17, 0x0f172a).setStrokeStyle(3, this.selectedCharacter.tint);
    const face = this.add.image(x - 50, y, faceKey).setDisplaySize(28, 28);
    const maskShape = this.add.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillCircle(x - 50, y, 14);
    face.setMask(maskShape.createGeometryMask());
    maskShape.setVisible(false);
    PixelUI.addPixelText(this, x - 25, y - 1, this.selectedCharacter.name, 14, 0);
    this.profileFrame = frame;
  }

  showRuleOverlay(width, height) {
    const overlay = this.add.container(0, 0).setDepth(50);
    const panel = this.add.rectangle(width / 2, height / 2, width - 54, 170, 0x0f172a, 0.9)
      .setStrokeStyle(4, 0xfacc15);
    overlay.add(panel);
    overlay.add(PixelUI.addPixelText(this, width / 2, height / 2 - 52, "정면충돌 = 점수", 20));
    overlay.add(PixelUI.addPixelText(this, width / 2, height / 2 - 8, "상대 옆면 공격 = 고득점", 18));
    overlay.add(PixelUI.addPixelText(this, width / 2, height / 2 + 34, "내 옆면 피격 = 목숨 감소", 18));
    this.tweens.add({
      targets: overlay,
      alpha: 0,
      delay: 2000,
      duration: 350,
      onComplete: () => overlay.destroy()
    });
  }

  update(time, delta) {
    if (this.hasEnded) {
      return;
    }

    this.boostButton.update(delta);
    this.keyboardControls.update();
    if (this.keyboardControls.consumeBoostPressed()) {
      this.boostButton.tryBoost();
    }
    this.playerController.update(delta, this.getMoveInput(), this.boostButton.isBoosting);
    const elapsed = Math.floor((time - this.scoreSystem.startedAt) / 1000);
    const difficulty = this.getDifficulty(elapsed);
    this.enemySystem.update(delta, difficulty, elapsed >= 30);
    this.collisionSystem.update(
      time,
      this.boostButton.isBoosting,
      () => this.damagePlayer(time),
      (type, points, x, y) => this.showImpactText(type, points, x, y)
    );
    this.enemySystem.resolveVehiclePush(this.player, this.playerController.velocity);
    this.playerController.resolveWallCollision();
    this.player.updateFaceMask();
    this.remainingTime = Math.max(0, 45 - elapsed);
    this.scoreText.setText(`점수 ${this.scoreSystem.getTotal(time)}`);
    this.timeText.setText(`${this.remainingTime}`);

    if (this.remainingTime <= 0) {
      this.endGame(time, "time");
    }
  }

  getMoveInput() {
    if (this.joystick.isActive) {
      return this.joystick.value;
    }

    return this.keyboardControls.value;
  }

  getDifficulty(elapsed) {
    if (elapsed < 15) {
      return 0;
    }

    if (elapsed < 30) {
      return 0.24 + ((elapsed - 15) / 15) * 0.18;
    }

    return 0.5 + ((elapsed - 30) / 15) * 0.2;
  }

  damagePlayer(time) {
    if (time < this.invulnerableUntil) {
      return false;
    }

    this.lives = Math.max(0, this.lives - 1);
    this.scoreSystem.addDamage();
    this.invulnerableUntil = time + 1000;
    this.updateLivesHud();
    this.flashPlayer();

    if (this.lives <= 0) {
      this.endGame(time, "lives");
    }

    return true;
  }

  showImpactText(type, points, x, y) {
    const labels = {
      "front-hit": `정면충돌 +${points}`,
      "side-attack": points >= 300 ? `부스터 공격 +${points}` : `측면공격 +${points}`,
      "side-damaged": "피격!",
      "rear-bump": ""
    };

    const label = labels[type];
    if (!label) {
      return;
    }

    const color = type === "side-damaged" ? "#f87171" : "#fef08a";
    const text = this.add.text(x, y, label, {
      fontFamily: "monospace",
      fontSize: "16px",
      color,
      stroke: "#0f172a",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(40);

    this.tweens.add({
      targets: text,
      y: y - 28,
      alpha: 0,
      duration: 620,
      onComplete: () => text.destroy()
    });
  }

  updateLivesHud() {
    this.heartIcons.forEach((heart, index) => {
      heart.setAlpha(index < this.lives ? 1 : 0.18);
    });
  }

  flashPlayer() {
    this.tweens.killTweensOf(this.player);
    this.tweens.add({
      targets: this.player,
      alpha: 0.3,
      duration: 90,
      yoyo: true,
      repeat: 5,
      onComplete: () => this.player.setAlpha(1)
    });
  }

  endGame(time, reason) {
    if (this.hasEnded) {
      return;
    }

    this.hasEnded = true;
    this.scoreSystem.finish(time, reason);
    this.scene.start("ResultScene", this.scoreSystem.getResult(time, {
      characterId: this.selectedCharacter.id,
      lives: this.lives
    }));
  }
}
