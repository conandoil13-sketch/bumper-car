export default class EnemySystem {
  constructor(scene, enemies, player, bounds) {
    this.scene = scene;
    this.enemies = enemies.map((enemy, index) => ({
      sprite: enemy,
      mode: index === 1 ? "chase" : "wander",
      velocity: new Phaser.Math.Vector2(
        Phaser.Math.Between(-85, 85),
        Phaser.Math.Between(-85, 85)
      ),
      turnTimer: Phaser.Math.Between(600, 1600),
      speed: index === 1 ? 78 : Phaser.Math.Between(70, 105),
      aggression: index === 1 ? 1 : Phaser.Math.FloatBetween(0.35, 0.65)
    }));
    this.player = player;
    this.bounds = bounds;
    this.radius = 28;
  }

  update(delta, difficulty = 0, lateGame = false) {
    const dt = delta / 1000;
    this.enemies.forEach((enemy) => {
      if (enemy.mode === "chase") {
        this.updateChaser(enemy, dt, difficulty, lateGame);
      } else {
        this.updateWanderer(enemy, delta, dt, difficulty, lateGame);
      }

      enemy.sprite.x += enemy.velocity.x * dt;
      enemy.sprite.y += enemy.velocity.y * dt;
      enemy.sprite.rotation = enemy.velocity.angle() + Math.PI / 2;
      this.resolveWall(enemy);
      enemy.sprite.updateFaceMask?.();
    });
    this.resolveEnemyCollisions();
  }

  updateChaser(enemy, dt, difficulty, lateGame) {
    const desired = new Phaser.Math.Vector2(
      this.player.x - enemy.sprite.x,
      this.player.y - enemy.sprite.y
    );
    if (desired.length() > 0) {
      desired.setLength(enemy.speed * (1 + difficulty * 0.34));
      enemy.velocity.lerp(desired, (1.35 + difficulty * 0.82 + (lateGame ? 0.35 : 0)) * dt);
      this.limitEnemySpeed(enemy, difficulty);
    }
  }

  updateWanderer(enemy, delta, dt, difficulty, lateGame) {
    enemy.turnTimer -= delta;
    if (enemy.turnTimer <= 0) {
      enemy.turnTimer = Phaser.Math.Between(740 - difficulty * 180, 1700 - difficulty * 280);
      const randomDirection = new Phaser.Math.Vector2()
        .setToPolar(Phaser.Math.FloatBetween(0, Math.PI * 2), enemy.speed);
      const playerDirection = new Phaser.Math.Vector2(
        this.player.x - enemy.sprite.x,
        this.player.y - enemy.sprite.y
      );
      if (playerDirection.length() > 0) {
        playerDirection.setLength(enemy.speed);
        randomDirection.lerp(playerDirection, enemy.aggression * difficulty * (lateGame ? 0.72 : 0.48));
      }
      enemy.velocity.lerp(randomDirection, 0.78);
      enemy.velocity.setLength(enemy.speed);
    }
    if (enemy.velocity.length() < 30) {
      enemy.velocity.setToPolar(Phaser.Math.FloatBetween(0, Math.PI * 2), enemy.speed);
    }
    enemy.velocity.scale(1 + (0.04 + difficulty * 0.06) * dt);
    this.limitEnemySpeed(enemy, difficulty);
  }

  limitEnemySpeed(enemy, difficulty) {
    const maxSpeed = enemy.speed * (1.12 + difficulty * 0.42);
    if (enemy.velocity.length() > maxSpeed) {
      enemy.velocity.setLength(maxSpeed);
    }
  }

  resolveWall(enemy) {
    const sprite = enemy.sprite;
    if (sprite.x < this.bounds.left + this.radius) {
      sprite.x = this.bounds.left + this.radius;
      enemy.velocity.x = Math.abs(enemy.velocity.x);
    } else if (sprite.x > this.bounds.right - this.radius) {
      sprite.x = this.bounds.right - this.radius;
      enemy.velocity.x = -Math.abs(enemy.velocity.x);
    }

    if (sprite.y < this.bounds.top + this.radius) {
      sprite.y = this.bounds.top + this.radius;
      enemy.velocity.y = Math.abs(enemy.velocity.y);
    } else if (sprite.y > this.bounds.bottom - this.radius) {
      sprite.y = this.bounds.bottom - this.radius;
      enemy.velocity.y = -Math.abs(enemy.velocity.y);
    }
  }

  resolveVehiclePush(player, playerVelocity) {
    this.enemies.forEach((enemy) => {
      const dx = enemy.sprite.x - player.x;
      const dy = enemy.sprite.y - player.y;
      const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const minDistance = 56;
      if (distance >= minDistance) {
        return;
      }

      const normal = new Phaser.Math.Vector2(dx / distance, dy / distance);
      const overlap = minDistance - distance;
      player.x -= normal.x * overlap * 0.45;
      player.y -= normal.y * overlap * 0.45;
      enemy.sprite.x += normal.x * overlap * 0.55;
      enemy.sprite.y += normal.y * overlap * 0.55;
      enemy.velocity.add(normal.clone().scale(90));
      playerVelocity.add(normal.clone().scale(-65));
    });
  }

  resolveEnemyCollisions() {
    for (let i = 0; i < this.enemies.length; i += 1) {
      for (let j = i + 1; j < this.enemies.length; j += 1) {
        this.resolveEnemyPair(this.enemies[i], this.enemies[j]);
      }
    }
  }

  resolveEnemyPair(a, b) {
    const dx = b.sprite.x - a.sprite.x;
    const dy = b.sprite.y - a.sprite.y;
    const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const minDistance = this.radius * 2;

    if (distance >= minDistance) {
      return;
    }

    const normal = new Phaser.Math.Vector2(dx / distance, dy / distance);
    const overlap = minDistance - distance;
    a.sprite.x -= normal.x * overlap * 0.5;
    a.sprite.y -= normal.y * overlap * 0.5;
    b.sprite.x += normal.x * overlap * 0.5;
    b.sprite.y += normal.y * overlap * 0.5;

    const relativeVelocity = b.velocity.clone().subtract(a.velocity);
    const closingSpeed = relativeVelocity.dot(normal);
    if (closingSpeed < 0) {
      const bounce = normal.clone().scale(-closingSpeed * 0.72 + 42);
      a.velocity.subtract(bounce.clone().scale(0.5));
      b.velocity.add(bounce.clone().scale(0.5));
    } else {
      const nudge = normal.clone().scale(28);
      a.velocity.subtract(nudge);
      b.velocity.add(nudge);
    }

    a.sprite.rotation = a.velocity.angle() + Math.PI / 2;
    b.sprite.rotation = b.velocity.angle() + Math.PI / 2;
  }
}
