export default class BoostButton {
  constructor(scene, x, y, options = {}) {
    this.scene = scene;
    this.charge = 100;
    this.cost = options.cost || 35;
    this.recoveryPerSecond = options.recoveryPerSecond || 12;
    this.boostDuration = options.boostDuration || 450;
    this.boostRemaining = 0;
    this.button = scene.add.image(x, y, "ui-boost").setInteractive();
    this.label = scene.add.text(x, y + 1, "BOOST", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#fff7ed",
      stroke: "#7c2d12",
      strokeThickness: 3
    }).setOrigin(0.5);
    this.gaugeBg = scene.add.rectangle(x, y - 58, 92, 12, 0x0f172a).setStrokeStyle(2, 0xf8fafc);
    this.gauge = scene.add.rectangle(x - 44, y - 58, 88, 7, 0xfb923c).setOrigin(0, 0.5);
    this.gaugeText = scene.add.text(x, y - 76, "100", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#f8fafc",
      stroke: "#0f172a",
      strokeThickness: 3
    }).setOrigin(0.5);

    this.button.on("pointerdown", () => {
      this.tryBoost();
    });
    scene.input.on("pointerup", () => {
      this.button.setScale(1);
      this.label.setScale(1);
    });
  }

  update(delta) {
    if (this.boostRemaining > 0) {
      this.boostRemaining = Math.max(0, this.boostRemaining - delta);
    }

    this.charge = Math.min(100, this.charge + this.recoveryPerSecond * (delta / 1000));
    this.gauge.width = 88 * (this.charge / 100);
    this.gauge.fillColor = this.charge >= this.cost ? 0xfb923c : 0x64748b;
    this.gaugeText.setText(`${Math.floor(this.charge)}`);
  }

  tryBoost() {
    if (this.boostRemaining > 0 || this.charge < this.cost) {
      this.scene.tweens.add({
        targets: [this.button, this.label],
        alpha: 0.55,
        duration: 60,
        yoyo: true
      });
      return false;
    }

    this.charge -= this.cost;
    this.boostRemaining = this.boostDuration;
    this.button.setScale(0.9);
    this.label.setScale(0.9);
    return true;
  }

  get isBoosting() {
    return this.boostRemaining > 0;
  }
}
