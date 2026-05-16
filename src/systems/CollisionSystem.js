export default class CollisionSystem {
  constructor(scene, player, playerController, enemySystem, scoreSystem, options = {}) {
    this.scene = scene;
    this.player = player;
    this.playerController = playerController;
    this.enemySystem = enemySystem;
    this.scoreSystem = scoreSystem;
    this.hitDistance = options.hitDistance || 58;
    this.frontCone = options.frontCone || 0.82;
    this.sideCone = options.sideCone || 0.82;
    this.cooldown = options.cooldown || 420;
    this.character = options.character || null;
    this.lastHitAt = new Map();
  }

  update(time, isBoosting, onPlayerDamaged, onFeedback) {
    this.enemySystem.enemies.forEach((enemyState, index) => {
      const enemy = enemyState.sprite;
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
      if (distance > this.hitDistance) {
        return;
      }

      const lastHit = this.lastHitAt.get(index) || 0;
      if (time - lastHit < this.cooldown) {
        return;
      }

      const type = this.classify(this.player, enemy, enemyState);
      this.lastHitAt.set(index, time);
      this.applyReaction(type, enemyState, isBoosting);
      this.spawnHitEffect((this.player.x + enemy.x) / 2, (this.player.y + enemy.y) / 2, type);

      if (type === "front-hit" || type === "side-attack") {
        const points = this.scoreSystem.addImpact(type, isBoosting);
        onFeedback?.(type, points, (this.player.x + enemy.x) / 2, (this.player.y + enemy.y) / 2);
      }

      if (type === "side-damaged") {
        const damaged = onPlayerDamaged?.();
        if (damaged) {
          onFeedback?.(type, 0, this.player.x, this.player.y - 26);
        }
      }
    });
  }

  classify(player, enemy, enemyState) {
    const playerFront = this.isFrontToward(player, enemy);
    const enemyFront = this.isFrontToward(enemy, player);
    const enemySide = this.isSideToward(enemy, player);
    const playerSide = this.isSideToward(player, enemy);

    if (playerFront && enemyFront) {
      return "front-hit";
    }

    if (playerFront && enemySide) {
      return "side-attack";
    }

    if (enemyFront && playerSide && this.isEnemyThreatening(enemyState)) {
      return "side-damaged";
    }

    return "rear-bump";
  }

  isEnemyThreatening(enemyState) {
    const velocity = enemyState.velocity;
    if (!velocity || velocity.length() < 52) {
      return false;
    }

    const enemy = enemyState.sprite;
    const movementAngle = velocity.angle();
    const angleToPlayer = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
    return Math.abs(Phaser.Math.Angle.Wrap(angleToPlayer - movementAngle)) < 0.95;
  }

  isFrontToward(source, target) {
    const angleToTarget = Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y);
    return Math.abs(Phaser.Math.Angle.Wrap(angleToTarget - this.forwardAngle(source))) < this.frontCone;
  }

  isSideToward(source, target) {
    const angleToTarget = Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y);
    const delta = Math.abs(Phaser.Math.Angle.Wrap(angleToTarget - this.forwardAngle(source)));
    return Math.abs(delta - Math.PI / 2) < this.sideCone;
  }

  forwardAngle(vehicle) {
    return vehicle.rotation - Math.PI / 2;
  }

  applyReaction(type, enemyState, isBoosting) {
    const enemy = enemyState.sprite;
    const normal = new Phaser.Math.Vector2(enemy.x - this.player.x, enemy.y - this.player.y);
    if (normal.length() === 0) {
      normal.set(1, 0);
    }
    normal.normalize();

    const impactPower = this.character?.stats.impactPower || 1;
    const boostPower = this.character?.stats.boostPower || 2;
    const sideBoost = isBoosting ? boostPower : 1;
    const frontBoost = isBoosting ? 1 + (boostPower - 1) * 0.45 : 1;
    const attackPower = type === "side-attack"
      ? 320 * sideBoost * impactPower
      : 210 * frontBoost * impactPower;
    const playerPower = type === "side-damaged" ? 240 : 150;
    enemyState.velocity.add(normal.clone().scale(attackPower));
    this.playerController.velocity.add(normal.clone().scale(-playerPower));
    enemy.x += normal.x * 12;
    enemy.y += normal.y * 12;
    this.player.x -= normal.x * 8;
    this.player.y -= normal.y * 8;
  }

  spawnHitEffect(x, y, type) {
    const effect = this.scene.add.image(x, y, "fx-hit").setDepth(20);
    effect.setScale(type === "side-attack" ? 1.22 : 0.95);
    effect.setRotation(Phaser.Math.FloatBetween(-0.4, 0.4));
    this.scene.tweens.add({
      targets: effect,
      alpha: 0,
      scale: effect.scale + 0.45,
      duration: 180,
      onComplete: () => effect.destroy()
    });
  }
}
