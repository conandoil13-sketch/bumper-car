export default class VehicleFactory {
  static create(scene) {
    this.createCar(scene, "car-red", 0xef4444, 0x7f1d1d);
    this.createCar(scene, "car-yellow", 0xfacc15, 0x854d0e);
    this.createCar(scene, "car-blue", 0x38bdf8, 0x075985);
    this.createCar(scene, "car-purple", 0xa78bfa, 0x4c1d95);
  }

  static createCar(scene, key, bodyColor, shadowColor) {
    const texture = scene.textures.createCanvas(key, 72, 96);
    const ctx = texture.getContext();
    const body = Phaser.Display.Color.IntegerToColor(bodyColor).rgba;
    const shadow = Phaser.Display.Color.IntegerToColor(shadowColor).rgba;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = shadow;
    ctx.fillRect(14, 8, 44, 8);
    ctx.fillRect(6, 16, 60, 64);
    ctx.fillRect(14, 80, 44, 8);
    ctx.fillStyle = body;
    ctx.fillRect(18, 12, 36, 8);
    ctx.fillRect(10, 20, 52, 52);
    ctx.fillRect(18, 72, 36, 10);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(22, 24, 28, 10);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(8, 28, 8, 16);
    ctx.fillRect(56, 28, 8, 16);
    ctx.fillRect(8, 58, 8, 16);
    ctx.fillRect(56, 58, 8, 16);
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(24, 38, 24, 24);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(14, 20, 6, 48);
    texture.refresh();
    texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  static addVehicle(scene, x, y, character, options = {}) {
    const container = scene.add.container(x, y);
    const car = scene.add.image(0, 0, options.carKey || character.carKey).setScale(options.scale || 1);
    container.add(car);
    container.car = car;

    if (options.showFace !== false) {
      const faceKey = scene.textures.exists(character.faceKey) ? character.faceKey : "face-fallback";
      const face = scene.add.image(0, -18, faceKey).setDisplaySize(38, 38);
      const frame = scene.add.circle(0, -18, 22, 0x0f172a).setStrokeStyle(3, 0xf8fafc);
      const maskShape = scene.add.graphics();
      const mask = maskShape.createGeometryMask();
      face.setMask(mask);
      maskShape.setVisible(false);
      container.add([frame, face]);
      container.faceMaskShape = maskShape;
      container.updateFaceMask = () => {
        const offset = new Phaser.Math.Vector2(0, -18).rotate(container.rotation);
        maskShape.clear();
        maskShape.fillStyle(0xffffff);
        maskShape.fillCircle(container.x + offset.x, container.y + offset.y, 19);
      };
      container.updateFaceMask();
    } else {
      container.updateFaceMask = () => {};
    }

    return container;
  }
}
