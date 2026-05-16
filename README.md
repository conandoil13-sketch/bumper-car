# 노엘의 범퍼카

Phaser 3 기반 모바일 웹 미니게임입니다. 한 줄 규칙은 간단합니다.

> 앞으로 박으면 점수, 옆에서 받히면 목숨 감소

45초 동안 범퍼카 경기장에서 적 차량을 들이받고, 목숨 3개를 지키며 높은 점수를 노리는 탑뷰 충돌 아케이드 게임입니다.

## 조작법

### 모바일

- 오른쪽 하단 조이스틱: 차량 이동
- 왼쪽 하단 `BOOST`: 짧은 급가속

### 데스크탑 테스트

- 방향키 또는 `WASD`: 차량 이동
- `Space` 또는 `Shift`: 부스터

차량은 즉시 방향을 바꾸지 않고, 자동차처럼 회전과 관성을 가지고 움직입니다. 조이스틱을 놓아도 짧게 미끄러진 뒤 감속합니다.

## 캐릭터

### 노엘

- 타입: 균형형
- 속도: 보통
- 회전: 보통
- 충돌력: 높음
- 부스터 충돌 시 상대를 더 멀리 밀어냅니다.
- 초보자가 쓰기 좋은 기본 캐릭터입니다.

### 한요한

- 타입: 고속형
- 최고 속도와 부스터 가속이 높습니다.
- 회전 반응은 둔합니다.
- 정면충돌 점수 보너스가 있습니다.
- 빠르지만 옆면 피격 위험이 높은 캐릭터입니다.

### 영비

- 타입: 컨트롤형
- 회전 성능과 감속 안정성이 좋습니다.
- 부스터 게이지 회복 속도가 빠릅니다.
- 측면공격 연속 성공 시 콤보 보너스가 붙습니다.
- 충돌력은 약간 낮습니다.

## 점수 규칙

- 정면충돌: `+100`
- 부스터 정면충돌: `+150`
- 상대 옆면 공격: `+200`
- 부스터 측면공격: `+300`
- 내 옆면 피격: 목숨 `-1`
- 생존 시간 보너스: 1초당 `+5`
- 최종 점수: 충돌 점수 + 생존 시간 보너스 + 캐릭터 보너스

목숨이 0이 되거나 45초가 끝나면 결과 화면으로 이동합니다.

## 등급

- `0~999`: 초보 범퍼카
- `1000~2499`: 길들이는 중
- `2500~3999`: 들이받기의 재능
- `4000 이상`: 범퍼카 전설

## 사용 에셋

외부 이미지 파일은 운전자 얼굴 사진 3장만 사용합니다.

- `assets/images/noel-face.png`
- `assets/images/hanyohan-face.png`
- `assets/images/youngb-face.png`

자동차, 경기장, 하트, 게이지, 버튼, 충돌 이펙트, 부스터 잔상은 모두 Phaser Graphics 또는 Canvas Texture 기반 코드 생성 픽셀아트입니다.

얼굴 사진이 없거나 로드되지 않아도 게임이 깨지지 않도록 코드 기반 대체 얼굴 그래픽을 사용합니다.

## 로컬 실행 방법

빌드 도구 없이 정적 파일로 실행합니다.

```bash
python3 -m http.server 8000
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:8000
```

## GitHub Pages 배포 방법

1. 이 프로젝트 파일을 GitHub 저장소에 올립니다.
2. 저장소의 `Settings`로 이동합니다.
3. `Pages` 메뉴를 엽니다.
4. `Build and deployment`의 `Source`를 `Deploy from a branch`로 설정합니다.
5. 배포 브랜치를 `main`, 폴더를 `/root`로 설정합니다.
6. 저장 후 GitHub Pages URL에서 `index.html`이 자동으로 실행되는지 확인합니다.

모든 경로는 상대 경로를 사용하므로 GitHub Pages 정적 호스팅에서 바로 동작합니다.

## 프로젝트 구조

```text
index.html
README.md
assets/images/
  noel-face.png
  hanyohan-face.png
  youngb-face.png
src/
  main.js
  styles.css
  data/characters.js
  graphics/PixelArtFactory.js
  graphics/VehicleFactory.js
  scenes/BootScene.js
  scenes/MenuScene.js
  scenes/GameScene.js
  scenes/ResultScene.js
  systems/CollisionSystem.js
  systems/EnemySystem.js
  systems/ScoreSystem.js
  systems/VehicleController.js
  ui/BoostButton.js
  ui/KeyboardControls.js
  ui/PixelUI.js
  ui/VirtualJoystick.js
```

## 추후 확장 아이디어

- 랭킹 저장
- 결과 이미지 캡처 공유
- 추가 운전자
- 맵 테마 변경
- 적 차량 종류 추가
- 콤보 연출 강화
