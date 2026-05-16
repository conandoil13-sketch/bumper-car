export default class PixelArtFactory {
  static create(scene) {
    this.createButton(scene, "ui-button", 160, 52, 0x22c55e, 0x052e16);
    this.createButton(scene, "ui-button-dark", 170, 56, 0x334155, 0x0f172a);
    this.createHeart(scene, "ui-heart");
    this.createBoostButton(scene, "ui-boost");
    this.createJoystick(scene, "ui-joystick-base", "ui-joystick-knob");
    this.createCollisionBurst(scene, "fx-hit");
    this.createBoostTrail(scene, "fx-boost-trail");
    this.createFaceFallback(scene, "face-fallback");
  }

  static createButton(scene, key, width, height, fill, stroke) {
    const texture = scene.textures.createCanvas(key, width, height);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = Phaser.Display.Color.IntegerToColor(stroke).rgba;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = Phaser.Display.Color.IntegerToColor(fill).rgba;
    ctx.fillRect(4, 4, width - 8, height - 8);
    ctx.fillStyle = "rgba(255,255,255,0.24)";
    ctx.fillRect(8, 8, width - 16, 8);
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(8, height - 14, width - 16, 6);
    this.refreshPixelTexture(texture);
  }

  static createHeart(scene, key) {
    const texture = scene.textures.createCanvas(key, 24, 22);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(4, 2, 6, 4);
    ctx.fillRect(14, 2, 6, 4);
    ctx.fillRect(2, 6, 20, 8);
    ctx.fillRect(5, 14, 14, 4);
    ctx.fillRect(9, 18, 6, 4);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(5, 4, 5, 4);
    ctx.fillRect(14, 4, 5, 4);
    ctx.fillRect(4, 8, 16, 5);
    ctx.fillRect(7, 13, 10, 4);
    ctx.fillRect(10, 17, 4, 3);
    this.refreshPixelTexture(texture);
  }

  static createBoostButton(scene, key) {
    const texture = scene.textures.createCanvas(key, 88, 88);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#7c2d12";
    ctx.fillRect(12, 8, 64, 8);
    ctx.fillRect(4, 16, 80, 56);
    ctx.fillRect(12, 72, 64, 8);
    ctx.fillStyle = "#fb923c";
    ctx.fillRect(16, 16, 56, 8);
    ctx.fillRect(12, 24, 64, 40);
    ctx.fillRect(20, 64, 48, 8);
    ctx.fillStyle = "#fff7ed";
    ctx.fillRect(40, 22, 10, 26);
    ctx.fillRect(30, 42, 28, 8);
    ctx.fillRect(26, 50, 8, 10);
    ctx.fillRect(54, 50, 8, 10);
    this.refreshPixelTexture(texture);
  }

  static createJoystick(scene, baseKey, knobKey) {
    const base = scene.textures.createCanvas(baseKey, 120, 120);
    const baseCtx = base.getContext();
    baseCtx.imageSmoothingEnabled = false;
    baseCtx.fillStyle = "rgba(15, 23, 42, 0.58)";
    baseCtx.fillRect(20, 8, 80, 8);
    baseCtx.fillRect(8, 20, 104, 80);
    baseCtx.fillRect(20, 100, 80, 8);
    baseCtx.strokeStyle = "rgba(248, 250, 252, 0.48)";
    baseCtx.lineWidth = 4;
    baseCtx.strokeRect(22, 22, 76, 76);
    this.refreshPixelTexture(base);

    const knob = scene.textures.createCanvas(knobKey, 48, 48);
    const knobCtx = knob.getContext();
    knobCtx.imageSmoothingEnabled = false;
    knobCtx.fillStyle = "#0f172a";
    knobCtx.fillRect(8, 0, 32, 8);
    knobCtx.fillRect(0, 8, 48, 32);
    knobCtx.fillRect(8, 40, 32, 8);
    knobCtx.fillStyle = "#94a3b8";
    knobCtx.fillRect(12, 8, 24, 8);
    knobCtx.fillRect(8, 16, 32, 16);
    knobCtx.fillRect(12, 32, 24, 8);
    this.refreshPixelTexture(knob);
  }

  static createCollisionBurst(scene, key) {
    const texture = scene.textures.createCanvas(key, 48, 48);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#f97316";
    ctx.fillRect(20, 0, 8, 16);
    ctx.fillRect(20, 32, 8, 16);
    ctx.fillRect(0, 20, 16, 8);
    ctx.fillRect(32, 20, 16, 8);
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(14, 14, 20, 20);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(20, 20, 8, 8);
    this.refreshPixelTexture(texture);
  }

  static createBoostTrail(scene, key) {
    const texture = scene.textures.createCanvas(key, 54, 42);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "rgba(251, 146, 60, 0.72)";
    ctx.fillRect(20, 6, 22, 8);
    ctx.fillRect(12, 17, 34, 8);
    ctx.fillRect(22, 28, 20, 6);
    ctx.fillStyle = "rgba(254, 240, 138, 0.86)";
    ctx.fillRect(8, 10, 18, 6);
    ctx.fillRect(4, 24, 22, 6);
    this.refreshPixelTexture(texture);
  }

  static createFaceFallback(scene, key) {
    const texture = scene.textures.createCanvas(key, 96, 96);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(0, 0, 96, 96);
    ctx.fillStyle = "#facc15";
    ctx.fillRect(24, 20, 48, 14);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(22, 34, 52, 42);
    ctx.fillStyle = "#111827";
    ctx.fillRect(34, 48, 8, 8);
    ctx.fillRect(54, 48, 8, 8);
    ctx.fillRect(40, 64, 16, 4);
    this.refreshPixelTexture(texture);
  }

  static refreshPixelTexture(texture) {
    texture.refresh();
    texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
}
