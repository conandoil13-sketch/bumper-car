export default class ScoreSystem {
  constructor() {
    this.collisionScore = 0;
    this.startedAt = 0;
    this.endedAt = 0;
    this.frontHits = 0;
    this.sideAttacks = 0;
    this.damageTaken = 0;
    this.sideCombo = 0;
    this.character = null;
    this.characterBonus = 0;
  }

  start(time, character = null) {
    this.startedAt = time;
    this.endedAt = 0;
    this.collisionScore = 0;
    this.frontHits = 0;
    this.sideAttacks = 0;
    this.damageTaken = 0;
    this.sideCombo = 0;
    this.character = character;
    this.characterBonus = 0;
  }

  addImpact(type, boosted = false) {
    let points = 0;

    if (type === "front-hit") {
      this.frontHits += 1;
      this.sideCombo = 0;
      const bonus = this.character?.stats.frontScoreBonus || 1;
      const base = boosted ? 150 : 100;
      points = Math.round(base * bonus);
      this.collisionScore += base;
      this.characterBonus += Math.max(0, points - base);
    }

    if (type === "side-attack") {
      this.sideAttacks += 1;
      this.sideCombo += 1;
      const comboBonus = this.character?.stats.scoreBonusType === "side-combo"
        ? 1 + Math.min(0.45, (this.sideCombo - 1) * ((this.character.stats.sideComboBonus || 1.15) - 1))
        : 1;
      const base = boosted ? 300 : 200;
      points = Math.round(base * comboBonus);
      this.collisionScore += base;
      this.characterBonus += Math.max(0, points - base);
    }

    return points;
  }

  addDamage() {
    this.damageTaken += 1;
    this.sideCombo = 0;
  }

  getSurvivalBonus(time) {
    const endTime = this.endedAt || time;
    return Math.floor(Math.max(0, endTime - this.startedAt) / 1000) * 5;
  }

  getTotal(time) {
    return this.collisionScore + this.getSurvivalBonus(time) + this.characterBonus;
  }

  finish(time, reason) {
    if (!this.endedAt) {
      this.endedAt = time;
      this.endReason = reason;
    }
  }

  getResult(time, extra = {}) {
    const survivalBonus = this.getSurvivalBonus(time);
    return {
      ...extra,
      finalScore: this.collisionScore + survivalBonus + this.characterBonus,
      collisionScore: this.collisionScore,
      survivalBonus,
      characterBonus: this.characterBonus,
      frontHits: this.frontHits,
      sideAttacks: this.sideAttacks,
      damageTaken: this.damageTaken,
      survivedSeconds: Math.floor(Math.max(0, (this.endedAt || time) - this.startedAt) / 1000),
      endReason: this.endReason || "time"
    };
  }
}
