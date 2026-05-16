export default class VirtualJoystick {
  constructor(scene, x, y, options = {}) {
    this.scene = scene;
    this.origin = new Phaser.Math.Vector2(x, y);
    this.value = new Phaser.Math.Vector2(0, 0);
    this.radius = options.radius || 48;
    this.base = scene.add.image(x, y, "ui-joystick-base").setAlpha(0.88);
    this.hitArea = scene.add.circle(x, y, this.radius + 22, 0xffffff, 0.001).setInteractive();
    this.knob = scene.add.image(x, y, "ui-joystick-knob");
    this.pointerId = null;
    this.isActive = false;

    this.hitArea.on("pointerdown", (pointer) => {
      this.pointerId = pointer.id;
      this.isActive = true;
      this.update(pointer);
    });
    scene.input.on("pointermove", (pointer) => {
      if (pointer.id === this.pointerId) {
        this.update(pointer);
      }
    });
    scene.input.on("pointerup", (pointer) => {
      if (pointer.id === this.pointerId) {
        this.release();
      }
    });
  }

  update(pointer) {
    const delta = new Phaser.Math.Vector2(pointer.x - this.origin.x, pointer.y - this.origin.y);
    if (delta.length() > this.radius) {
      delta.setLength(this.radius);
    }
    this.knob.setPosition(this.origin.x + delta.x, this.origin.y + delta.y);
    this.value.set(delta.x / this.radius, delta.y / this.radius);
  }

  release() {
    this.pointerId = null;
    this.isActive = false;
    this.value.set(0, 0);
    this.knob.setPosition(this.origin.x, this.origin.y);
  }
}
