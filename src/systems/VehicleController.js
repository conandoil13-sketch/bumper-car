export default class VehicleController {
  constructor(scene, vehicle, options = {}) {
    this.scene = scene;
    this.vehicle = vehicle;
    this.velocity = new Phaser.Math.Vector2(0, 0);
    this.maxSpeed = options.maxSpeed || 230;
    this.acceleration = options.acceleration || 560;
    this.friction = options.friction || 0.9;
    this.turnSpeed = options.turnSpeed || 5.2;
    this.wallBounce = options.wallBounce || 0.48;
    this.radius = options.radius || 30;
    this.bounds = options.bounds;
    this.boostMultiplier = options.boostMultiplier || 1.85;
    this.boostTrailTimer = 0;
  }

  update(delta, input, isBoosting) {
    const dt = delta / 1000;
    const strength = input.length();

    if (strength > 0.08) {
      const targetRotation = input.angle() + Math.PI / 2;
      this.vehicle.rotation = Phaser.Math.Angle.RotateTo(
        this.vehicle.rotation,
        targetRotation,
        this.turnSpeed * dt
      );

      const forward = this.getForwardVector();
      const boost = isBoosting ? this.boostMultiplier : 1;
      this.velocity.add(forward.scale(this.acceleration * strength * boost * dt));
    }

    const speedLimit = this.maxSpeed * (isBoosting ? this.boostMultiplier : 1);
    if (this.velocity.length() > speedLimit) {
      this.velocity.setLength(speedLimit);
    }

    const drag = Math.pow(this.friction, dt * 60);
    this.velocity.scale(drag);
    if (this.velocity.length() < 4 && strength <= 0.08) {
      this.velocity.set(0, 0);
    }

    this.vehicle.x += this.velocity.x * dt;
    this.vehicle.y += this.velocity.y * dt;
    this.resolveWallCollision();

    if (isBoosting) {
      this.emitBoostTrail(delta);
    }
  }

  getForwardVector() {
    return new Phaser.Math.Vector2(
      Math.cos(this.vehicle.rotation - Math.PI / 2),
      Math.sin(this.vehicle.rotation - Math.PI / 2)
    );
  }

  resolveWallCollision() {
    const bounds = this.bounds;
    if (!bounds) {
      return;
    }

    if (this.vehicle.x < bounds.left + this.radius) {
      this.vehicle.x = bounds.left + this.radius;
      this.velocity.x = Math.abs(this.velocity.x) * this.wallBounce;
    } else if (this.vehicle.x > bounds.right - this.radius) {
      this.vehicle.x = bounds.right - this.radius;
      this.velocity.x = -Math.abs(this.velocity.x) * this.wallBounce;
    }

    if (this.vehicle.y < bounds.top + this.radius) {
      this.vehicle.y = bounds.top + this.radius;
      this.velocity.y = Math.abs(this.velocity.y) * this.wallBounce;
    } else if (this.vehicle.y > bounds.bottom - this.radius) {
      this.vehicle.y = bounds.bottom - this.radius;
      this.velocity.y = -Math.abs(this.velocity.y) * this.wallBounce;
    }
  }

  emitBoostTrail(delta) {
    this.boostTrailTimer -= delta;
    if (this.boostTrailTimer > 0) {
      return;
    }

    this.boostTrailTimer = 45;
    const back = this.getForwardVector().scale(-34);
    const trail = this.scene.add.image(this.vehicle.x + back.x, this.vehicle.y + back.y, "fx-boost-trail");
    trail.setRotation(this.vehicle.rotation);
    trail.setDepth(this.vehicle.depth - 1);
    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      scaleX: 0.65,
      scaleY: 0.65,
      duration: 220,
      onComplete: () => trail.destroy()
    });
  }
}
