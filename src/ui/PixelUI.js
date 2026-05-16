export default class PixelUI {
  static addPixelText(scene, x, y, text, size = 24, origin = 0.5) {
    return scene.add.text(x, y, text, {
      fontFamily: "monospace",
      fontSize: `${size}px`,
      color: "#f8fafc",
      stroke: "#0f172a",
      strokeThickness: Math.max(3, Math.floor(size / 6)),
      align: "center"
    }).setOrigin(origin);
  }

  static addButton(scene, x, y, label, onClick, options = {}) {
    const button = scene.add.image(x, y, options.texture || "ui-button").setInteractive({ useHandCursor: true });
    const text = this.addPixelText(scene, x, y - 1, label, options.fontSize || 18);
    button.on("pointerdown", () => {
      button.setScale(0.96);
      text.setScale(0.96);
    });
    button.on("pointerup", () => {
      button.setScale(1);
      text.setScale(1);
      onClick();
    });
    button.on("pointerout", () => {
      button.setScale(1);
      text.setScale(1);
    });
    return scene.add.container(0, 0, [button, text]);
  }
}
