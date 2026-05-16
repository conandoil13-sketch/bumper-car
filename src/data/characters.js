export const CHARACTERS = [
  {
    id: "noel",
    name: "노엘",
    type: "균형형",
    faceKey: "face-noel",
    imagePath: "assets/images/noel-face.png",
    carKey: "car-red",
    tint: 0xef4444,
    description: "묵직하고 안정적인 기본 범퍼카",
    resultMessage: "박긴 박았는데 많이 박혔습니다.",
    stats: {
      maxSpeed: 265,
      acceleration: 710,
      turnRate: 4.55,
      friction: 0.915,
      boostPower: 2.05,
      boostRegen: 12,
      impactPower: 1.18,
      scoreBonusType: "none",
      frontScoreBonus: 1,
      sideComboBonus: 1
    }
  },
  {
    id: "hanyohan",
    name: "한요한",
    type: "고속형",
    faceKey: "face-hanyohan",
    imagePath: "assets/images/hanyohan-face.png",
    carKey: "car-yellow",
    tint: 0xfacc15,
    description: "직선 속도와 부스터가 강한 돌격형",
    resultMessage: "속도는 있었지만 방향은 없었습니다.",
    stats: {
      maxSpeed: 318,
      acceleration: 760,
      turnRate: 3.55,
      friction: 0.905,
      boostPower: 2.35,
      boostRegen: 11,
      impactPower: 1.04,
      scoreBonusType: "front",
      frontScoreBonus: 1.2,
      sideComboBonus: 1
    }
  },
  {
    id: "youngb",
    name: "영비",
    type: "컨트롤형",
    faceKey: "face-youngb",
    imagePath: "assets/images/youngb-face.png",
    carKey: "car-blue",
    tint: 0x38bdf8,
    description: "잘 돌고 회복이 빠른 테크니션",
    resultMessage: "피하는 줄 알았는데 옆구리 열려 있었습니다.",
    stats: {
      maxSpeed: 252,
      acceleration: 680,
      turnRate: 5.75,
      friction: 0.89,
      boostPower: 1.95,
      boostRegen: 17,
      impactPower: 0.94,
      scoreBonusType: "side-combo",
      frontScoreBonus: 1,
      sideComboBonus: 1.15
    }
  }
];

export function getCharacterById(id) {
  return CHARACTERS.find((character) => character.id === id) || CHARACTERS[0];
}
