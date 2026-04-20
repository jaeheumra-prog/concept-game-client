
import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

// Render 배포 서버는 `coordinatorTeleport` 핸들러가 없으면 이동이 반영되지 않습니다.
// 로컬 테스트: `server` 폴더에서 npm install && npm start 후, HTML에 아래 한 줄을 넣거나
// 이 상수를 'ws://127.0.0.1:2567' 로 바꿉니다.
const COLYSEUS_URL =
  (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'ws://localhost:2567'
    : 'wss://concept-game-server.onrender.com';

// 📊 1조 ~ 11조 전체 팀원 데이터
const PLAYER_DATA = {
  1: {
    "김민재": { job: "분석자(창의)", character: "test_buddy1" },
    "박채연": { job: "개척자(성실)", character: "test_buddy2" },
    "손유정": { job: "길잡이(외향)", character: "test_buddy3" },
    "이승환": { job: "조율자(협력)", character: "test_buddy4" },
    "이연재": { job: "설계자(신경)", character: "test_buddy5" }
  },
  2: {
    "윤현근": { job: "분석자(창의)", character: "test_buddy1" },
    "심나이": { job: "개척자(성실)", character: "test_buddy2" },
    "차시훈": { job: "길잡이(외향)", character: "test_buddy3" },
    "이율": { job: "조율자(협력)", character: "test_buddy4" },
    "남윤주": { job: "설계자(신경)", character: "test_buddy5" }
  },
  3: {
    "안비비안": { job: "분석자(창의)", character: "test_buddy1" },
    "이택준": { job: "개척자(성실)", character: "test_buddy2" },
    "송수현": { job: "길잡이(외향)", character: "test_buddy3" },
    "김찬영": { job: "조율자(협력)", character: "test_buddy4" }
  },
  4: {
    "김가윤": { job: "분석자(창의)", character: "test_buddy1" },
    "김수지": { job: "개척자(성실)", character: "test_buddy2" },
    "김재현": { job: "길잡이(외향)", character: "test_buddy3" },
    "이용은": { job: "조율자(협력)", character: "test_buddy4" },
    "현동건": { job: "설계자(신경)", character: "test_buddy5" }
  },
  5: {
    "라재흠": { job: "분석자(창의)", character: "test_buddy1" },
    "이정훈": { job: "개척자(성실)", character: "test_buddy2" },
    "이지원": { job: "길잡이(외향)", character: "test_buddy3" },
    "홍원준": { job: "조율자(협력)", character: "test_buddy4" }
  },
  6: {
    "석민정": { job: "분석자(창의)", character: "test_buddy1" },
    "손채빈": { job: "개척자(성실)", character: "test_buddy2" },
    "안은기": { job: "길잡이(외향)", character: "test_buddy3" },
    "홍석준": { job: "조율자(협력)", character: "test_buddy4" }
  },
  7: {
    "민승기": { job: "분석자(창의)", character: "test_buddy1" },
    "하윤채": { job: "개척자(성실)", character: "test_buddy2" },
    "강민서": { job: "길잡이(외향)", character: "test_buddy3" },
    "최재석": { job: "조율자(협력)", character: "test_buddy4" }
  },
  8: {
    "김유찬": { job: "분석자(창의)", character: "test_buddy1" },
    "박승훈": { job: "개척자(성실)", character: "test_buddy2" },
    "박재현": { job: "길잡이(외향)", character: "test_buddy3" },
    "배지우": { job: "조율자(협력)", character: "test_buddy4" }
  },
  9: {
    "김담희": { job: "분석자(창의)", character: "test_buddy1" },
    "이기서": { job: "개척자(성실)", character: "test_buddy2" },
    "장윤서": { job: "길잡이(외향)", character: "test_buddy3" },
    "박민우": { job: "조율자(협력)", character: "test_buddy4" },
    "박지연": { job: "설계자(신경)", character: "test_buddy5" }
  },
  10: {
    "설진": { job: "분석자(창의)", character: "test_buddy1" },
    "장원우": { job: "개척자(성실)", character: "test_buddy2" },
    "이지민": { job: "길잡이(외향)", character: "test_buddy3" },
    "이지훈": { job: "조율자(협력)", character: "test_buddy4" },
    "김태성": { job: "설계자(신경)", character: "test_buddy5" }
  },
  11: {
    "김수현": { job: "분석자(창의)", character: "test_buddy1" },
    "이성주": { job: "개척자(성실)", character: "test_buddy2" },
    "최시현": { job: "길잡이(외향)", character: "test_buddy3" },
    "이승회": { job: "조율자(협력)", character: "test_buddy4" },
    "황유주": { job: "설계자(신경)", character: "test_buddy5" }
  },
  999: {
    "테스터": { job: "조율자", character: "test_buddy4" }
  }
};

// 학생분들이 업로드한 파일명 포맷: "[조번호]조 [조이름]_[이름]_[직업].png"
const GROUP_NAMES = {
  1: "only1", 2: "plot twist", 3: "세얼간이", 4: "일단해보조",
  5: "HighFive", 6: "허니", 7: "마감직전 오캐스트라", 8: "일단틀어줘",
  9: "제작소", 10: "카트라이더", 11: "최예"
};

// 스크립트가 실행될 때 모든 캐릭터 키를 test_buddy 대신 파일명 기반의 고유한 키로 덮어씁니다.
Object.keys(PLAYER_DATA).forEach(groupNumber => {
  const gName = GROUP_NAMES[groupNumber];
  if (!gName) return; // 테스터(999)는 스킵

  const members = PLAYER_DATA[groupNumber];
  Object.keys(members).forEach(realName => {
    const jobBase = members[realName].job.split('(')[0];
    const filename = `${groupNumber}조 ${gName}_${realName}_${jobBase}.png`;
    // 고유 키: 캐릭터 이미지를 Phaser에서 꺼낼 때 사용
    members[realName].character = filename;
  });
});

class LoginScene extends Phaser.Scene {
  constructor() { super({ key: 'LoginScene' }); }
  create() {
    const ui = document.getElementById('login-ui');
    const nameInput = document.getElementById('name-input');
    const groupInput = document.getElementById('group-input');
    const jobDisplay = document.getElementById('job-display');
    ui.style.display = 'flex';

    const updateJobDisplay = () => {
      const inputName = nameInput.value.trim();
      const groupValue = groupInput.value.trim();

      if (!inputName || !groupValue) {
        jobDisplay.textContent = '직업: (이름과 조를 입력해주세요)';
        jobDisplay.style.color = '#ffeb3b';
        return;
      }

      if (PLAYER_DATA[groupValue]) {
        const playerInfo = PLAYER_DATA[groupValue][inputName];
        if (playerInfo) {
          jobDisplay.textContent = `직업: ${playerInfo.job}`;
          jobDisplay.style.color = '#00ff00';
        } else {
          jobDisplay.textContent = '등록되지 않은 이름입니다.';
          jobDisplay.style.color = '#ff4444';
        }
      } else {
        jobDisplay.textContent = '등록되지 않은 조입니다.';
        jobDisplay.style.color = '#ff4444';
      }
    };

    nameInput.addEventListener('input', updateJobDisplay);
    groupInput.addEventListener('input', updateJobDisplay);

    document.getElementById('login-button').onclick = async () => {
      const inputName = nameInput.value.trim();
      const groupValue = groupInput.value.trim();

      if (!PLAYER_DATA[groupValue]) return alert('등록되지 않은 조 번호입니다!');
      const playerInfo = PLAYER_DATA[groupValue][inputName];
      if (!playerInfo) return alert('등록되지 않은 이름입니다!');

      const client = new Client(COLYSEUS_URL);
      try {
        const room = await client.joinOrCreate('my_room', { ...playerInfo, group: groupValue, realName: inputName });
        ui.style.display = 'none';
        this.scene.start('GameScene', { room, myInfo: { ...playerInfo, group: groupValue } });
      } catch (e) { alert('서버 접속 실패! ' + e.message); }
    };
  }
}

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    this.room = data.room;
    this.myInfo = data.myInfo;
    this.playerSprites = {};
    this.mySprite = null;
    this.isChangeScene = false;
    this.coordSkillMode = 'idle';
    this.coordSkillTargetId = null;
    this._coordPointerHandler = null;
    this.coordOverlayRoot = null;
    this.explorerSpeedBuff = 1; // 개척자 속도 버프 배율
    this.hintText = null; // 분석자 힌트 UI
  }

  preload() {
    this.cameras.main.setBackgroundColor('#2c3e50');

    // Load new map JSON - 현재 7층 맵 불러오기로 세팅!
    this.load.tilemapTiledJSON('map', '/assets/7floor.tmj');
    this.load.image('item', '/assets/item.png');

    // Load 6floor.3.tmj tilesets (원래 쓰던 것들)
    this.load.image('Wall', '/assets/test.3.png'); // Tiled에서 다시 Wall로 저장됨
    this.load.image('Floor2', '/assets/Floor2.png');
    this.load.image('Kakao001', '/assets/KakaoTalk_Photo_2026-04-17-13-18-24-001.png');
    this.load.image('Kakao002', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25-002.png');
    this.load.image('Kakao004', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25-004.png');
    this.load.image('Kakao005', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25 005.png');

    // Load 7floor.tmj tilesets (7층 전용)
    this.load.image('7flo0r', '/assets/7flo0r.png');
    this.load.image('6floor101', '/assets/6floor101.png');
    this.load.image('6floor', '/assets/6floor.png');

    // Fallback load images in case they use old ones
    this.load.image('img1', '/assets/test.1.png');
    this.load.image('img2', '/assets/test.3.png');
    this.load.image('test_buddy1', '/assets/test_buddy1.png');
    this.load.image('test_buddy2', '/assets/test_buddy2.png');
    this.load.image('test_buddy3', '/assets/test_buddy3.png');
    this.load.image('test_buddy4', '/assets/test_buddy4.png');
    this.load.image('test_buddy5', '/assets/test_buddy5.png');

    // 🌟 방금 업로드된 모든 조원들의 캐릭터 이미지(PNG)를 동적으로 로드합니다 🌟
    Object.keys(PLAYER_DATA).forEach(groupNumber => {
      const gName = GROUP_NAMES[groupNumber];
      if (!gName) return;
      const members = PLAYER_DATA[groupNumber];
      Object.keys(members).forEach(realName => {
        const filename = members[realName].character; // 방금 위에서 덮어쓴 그 파일명
        this.load.image(filename, `/assets/${filename}`);
      });
    });
  }

  ensureCoordOverlay() {
    if (this.coordOverlayRoot) return this.coordOverlayRoot;
    const parent = document.getElementById('game-container');
    if (!parent) return null;
    const root = document.createElement('div');
    root.id = 'coord-skill-overlay';
    root.style.cssText = [
      'display:none',
      'position:absolute',
      'inset:0',
      'z-index:150',
      'pointer-events:auto',
      'font-family:sans-serif',
      'box-sizing:border-box'
    ].join(';');
    root.innerHTML = `
      <div id="coord-skill-panel" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:min(360px,92%);max-height:70%;overflow:auto;background:#1a1a1a;color:#fff;border:2px solid #00ff00;
        border-radius:10px;padding:14px 16px;box-shadow:0 8px 24px rgba(0,0,0,.6);">
        <div id="coord-skill-title" style="font-size:17px;font-weight:bold;margin-bottom:10px;text-align:center;">팀원 선택</div>
        <div id="coord-skill-hint" style="font-size:13px;color:#ccc;margin-bottom:12px;text-align:center;line-height:1.4;"></div>
        <div id="coord-skill-list" style="display:flex;flex-direction:column;gap:8px;"></div>
        <button type="button" id="coord-skill-cancel" style="margin-top:14px;width:100%;padding:10px;border-radius:8px;border:none;
          background:#444;color:#fff;font-size:14px;cursor:pointer;">닫기 (ESC)</button>
      </div>
    `;
    parent.appendChild(root);
    root.querySelector('#coord-skill-cancel').onclick = () => this.closeCoordinatorSkillFlow();
    this.coordOverlayRoot = root;
    return root;
  }

  closeCoordinatorSkillFlow() {
    this.coordSkillMode = 'idle';
    this.coordSkillTargetId = null;
    if (this._coordPointerHandler) {
      this.input.off('pointerdown', this._coordPointerHandler);
      this._coordPointerHandler = null;
    }
    if (this.coordOverlayRoot) {
      this.coordOverlayRoot.style.display = 'none';
    }
    if (this.scoreText && this._baseHudText) {
      this.scoreText.setText(this._baseHudText);
    }
  }

  openCoordinatorSkillFlow() {
    if (this.myInfo.character !== 'test_buddy4') return;
    const root = this.ensureCoordOverlay();
    if (!root) return;
    this.coordSkillMode = 'picking';
    this.coordSkillTargetId = null;
    if (this._coordPointerHandler) {
      this.input.off('pointerdown', this._coordPointerHandler);
      this._coordPointerHandler = null;
    }
    root.style.display = 'block';
    const title = root.querySelector('#coord-skill-title');
    const hint = root.querySelector('#coord-skill-hint');
    const list = root.querySelector('#coord-skill-list');
    title.textContent = '이동시킬 팀원 선택';
    hint.textContent = '같은 모둠 팀원(본인 포함)을 클릭한 뒤, 맵에서 이동할 위치를 클릭합니다.';
    list.innerHTML = '';

    const myGroup = String(this.myInfo.group);
    this.room.state.players.forEach((player, sessionId) => {
      if (String(player.group) !== myGroup) return;
      const name = (player.realName && String(player.realName).trim()) || '(이름 없음)';
      const job = player.job || '';
      const ch = player.character || '';
      const row = document.createElement('button');
      row.type = 'button';
      row.style.cssText = 'text-align:left;padding:10px 12px;border-radius:8px;border:1px solid #333;background:#2a2a2a;color:#fff;cursor:pointer;font-size:14px;';
      row.innerHTML = `<span style="color:#7dff9a;font-weight:bold;">${name}</span><br/><span style="color:#aaa;font-size:12px;">${job} · ${ch}</span>`;
      row.onmouseenter = () => { row.style.background = '#333'; };
      row.onmouseleave = () => { row.style.background = '#2a2a2a'; };
      row.onclick = () => {
        this.coordSkillTargetId = sessionId;
        this.coordSkillMode = 'placing';
        list.innerHTML = '';
        root.style.display = 'none';
        if (this.scoreText && this._baseHudText) {
          this.scoreText.setText(
            `${this._baseHudText} — ${name} 이동: 맵 클릭 (ESC/Shift 취소)`
          );
        }
        this.attachPlacingPointer();
      };
      list.appendChild(row);
    });

    if (!list.children.length) {
      hint.textContent = '같은 모둠으로 접속한 플레이어가 없습니다.';
    }
  }

  attachPlacingPointer() {
    if (this._coordPointerHandler) {
      this.input.off('pointerdown', this._coordPointerHandler);
    }
    this._coordPointerHandler = (pointer) => {
      if (this.coordSkillMode !== 'placing' || !this.coordSkillTargetId) return;
      const world = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      this.room.send('coordinatorTeleport', {
        targetSessionId: this.coordSkillTargetId,
        x: world.x,
        y: world.y
      });
      this.closeCoordinatorSkillFlow();
    };
    this.input.on('pointerdown', this._coordPointerHandler);
  }

  create() {
    this.cameras.main.setBackgroundColor('#2c3e50');
    this.wallLayers = [];
    // 시야 가리기용 (Fog of War) 세팅: Phaser 4 전용 (Canvas API 우회 기법)
    const cw = this.cameras.main.width;
    const ch = this.cameras.main.height;

    // 네이티브 캔버스 텍스처를 생성하여 완벽히 호환되게 만듬
    this.fogCanvas = this.textures.createCanvas('fogTex', cw, ch);

    // 생성한 텍스처를 화면 고정 이미지로 덮음
    this.fogImage = this.add.image(0, 0, 'fogTex')
      .setOrigin(0, 0)
      .setDepth(95)
      .setScrollFactor(0);

    try {
      const map = this.make.tilemap({ key: 'map' });

      // 카메라와 캐릭터가 맵 밖(회색 영역)으로 나가지 않도록 맵 크기만큼 제한 설정
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      // Binding 6floor.3 맵의 타일셋들
      const wall = map.addTilesetImage('Wall', 'Wall');
      const floor2 = map.addTilesetImage('Floor2', 'Floor2');
      const kakao001 = map.addTilesetImage('KakaoTalk_Photo_2026-04-17-13-18-24-001', 'Kakao001');
      const kakao002 = map.addTilesetImage('KakaoTalk_Photo_2026-04-17-13-18-25-002', 'Kakao002');
      const kakao004 = map.addTilesetImage('KakaoTalk_Photo_2026-04-17-13-18-25-004', 'Kakao004');
      const kakao005 = map.addTilesetImage('KakaoTalk_Photo_2026-04-17-13-18-25-005', 'Kakao005');

      // Binding 7floor 맵의 타일셋들
      const t7flo0r = map.addTilesetImage('7flo0r', '7flo0r');
      const t6floor101 = map.addTilesetImage('6floor101', '6floor101');
      const t6floor = map.addTilesetImage('6floor', '6floor');

      // Fallbacks if they still use old map names internally
      const tiles1 = map.addTilesetImage('test.1', 'img1');
      const tiles2 = map.addTilesetImage('test.3', 'img2');

      // 모아놓은 타일들을 거대한 배열로 만들어 줍니다.
      const allTiles = [
        wall, floor2, kakao001, kakao002, kakao004, kakao005,
        t7flo0r, t6floor101, t6floor,
        tiles1, tiles2
      ].filter(t => t !== null);

      if (allTiles.length > 0) {
        map.layers.forEach(layer => {
          const createdLayer = map.createLayer(layer.name, allTiles, 0, 0);

          // 레이어 이름이 벽, wall, objective 중 하나이거나, 레이어 자체 속성에 collides: true 가 있는지 확인
          let isWall = layer.name.includes('벽') ||
            layer.name.toLowerCase().includes('wall') ||
            layer.name.toLowerCase() === 'objective';

          if (!isWall && layer.properties) {
            if (Array.isArray(layer.properties)) {
              if (layer.properties.find(p => p.name === 'collides' && p.value === true)) isWall = true;
            } else if (layer.properties.collides === true) {
              isWall = true;
            }
          }

          if (createdLayer && isWall) {
            // Tiled에서 설정한 'collides' 속성이 타일이 아닌 레이어 전체에 걸려있으므로, 
            // 빈 공간(-1)을 제외한 배치된 모든 타일들을 강제 충돌 물리 벽으로 지정
            createdLayer.setCollisionByExclusion([-1]);
            this.wallLayers.push(createdLayer);
          }
        });
      }
    } catch (e) {
      console.warn("맵을 불러오는 데 실패했습니다. 에셋 경로를 확인하세요.", e);
    }

    let uiText = `[ ${this.myInfo.group}모둠 ] 접속 성공`;
    if (this.myInfo.job.includes("조율자")) uiText += " (Space: 스왑 / Shift: 지정 이동)";
    if (this.myInfo.job.includes("길잡이")) uiText += " (상시: 넓은 시야)";
    if (this.myInfo.job.includes("분석자")) uiText += " (Space: 힌트 확인)";
    if (this.myInfo.job.includes("개척자")) uiText += " (Space: 이동 가속)";
    // if (this.myInfo.job.includes("설계자")) uiText += " (Space: 특수 상호작용)"; 
    this._baseHudText = uiText;

    this.scoreText = this.add.text(10, 10, uiText, {
      font: '20px Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESCAPE);

    // 💡 서버 메시지 리스너 등록
    this.room.onMessage("showHint", (data) => {
      this.displayHint(data.message);
    });

    this.room.onMessage("skillUsed", (data) => {
      // 다른 플레이어가 스킬 썼을 때 알림 (간단히 콘솔 혹은 텍스트)
      console.log(`[Skill] ${data.name}(${data.job})님이 ${data.skill} 스킬을 사용했습니다!`);
    });

    this.room.onStateChange(() => this.syncPlayers());
    this.syncPlayers(); // 강제 초기 동기화! (이걸 안 하면 움직이기 전까지 캐릭터가 안 보임)

    this.events.once('shutdown', () => {
      this.closeCoordinatorSkillFlow();
      if (this.coordOverlayRoot && this.coordOverlayRoot.parentNode) {
        this.coordOverlayRoot.parentNode.removeChild(this.coordOverlayRoot);
      }
      this.coordOverlayRoot = null;
    });
  }

  syncPlayers() {
    this.room.state.players.forEach((player, sessionId) => {
      if (!this.playerSprites[sessionId]) {
        const sprite = this.physics.add.image(player.x, player.y, player.character);
        sprite.setScale(0.2).setDepth(90);

        // 💡 히트박스를 캐릭터 몸통에 맞는 '원형'으로 변경 (더 매끄러운 이동)
        // 원의 반지름을 이미지 너비의 약 40%로 설정하여 발밑 위주로 충돌 판정
        const radius = sprite.width * 0.35;
        sprite.setCircle(radius, sprite.width * 0.15, sprite.height * 0.15);

        // 4. 캐릭터와 벽의 충돌 감지 (요청하신 코드 연동)
        this.wallLayers.forEach(wallLayer => {
          this.physics.add.collider(sprite, wallLayer);
        });

        this.playerSprites[sessionId] = sprite;

        const label = this.add.text(player.x, player.y - 15, player.realName, { font: '10px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.playerSprites[sessionId].label = label;
        this.playerSprites[sessionId].label.setDepth(91);

        if (sessionId === this.room.sessionId) {
          this.mySprite = sprite;
          // 캐릭터가 생성된 직후, 카메라가 내 캐릭터를 졸졸 따라다니게 설정 (맵 전체 이동 가능)
          this.cameras.main.startFollow(this.mySprite, true, 0.1, 0.1);
          this.mySprite.setCollideWorldBounds(true); // 맵 끝에 부딪히면 멈춤
        }
      } else {
        const sprite = this.playerSprites[sessionId];

        // 내 캐릭터가 아닐 때만 서버 좌표를 그대로 덮어씀 (나는 로컬 물리 엔진을 믿음!)
        if (sessionId !== this.room.sessionId) {
          sprite.x = player.x;
          sprite.y = player.y;
        }
        if (sprite.label) {
          sprite.label.x = player.x;
          sprite.label.y = player.y - 15;
        }
      }
    });
  }

  update() {
    if (!this.room || !this.mySprite) return;

    // 어둠(안개) 그리기 및 내 주변 시야 뚫기 (웹 네이티브 Canvas 기법)
    if (this.fogCanvas && this.mySprite) {
      const ctx = this.fogCanvas.context;
      const w = this.fogCanvas.width;
      const h = this.fogCanvas.height;

      // 1. 도화지 초기화 후 전체 까맣게 칠하기
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(0,0,0,0.95)';
      ctx.fillRect(0, 0, w, h);

      // 2. 화면 상의 플레이어 위치 계산
      const screenX = this.mySprite.x - this.cameras.main.scrollX;
      const screenY = this.mySprite.y - this.cameras.main.scrollY;
      const myVision = this.myInfo.vision || 150;

      // 3. 지우개(destination-out) 모드로 원형 뚫기
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(screenX, screenY, myVision, 0, Math.PI * 2);
      ctx.fill();

      // 상태 원상복구 및 GPU 텍스처 업데이트
      ctx.globalCompositeOperation = 'source-over';
      this.fogCanvas.refresh();
    }

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      if (this.coordSkillMode !== 'idle') this.closeCoordinatorSkillFlow();
    }

    if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
      if (this.myInfo.job.includes("조율자")) {
        if (this.coordSkillMode !== 'idle') {
          this.closeCoordinatorSkillFlow();
        } else {
          this.openCoordinatorSkillFlow();
        }
      }
    }

    // 💡 Space Key: 직업별 액티브 스킬 실행
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      const job = this.myInfo.job;
      if (job.includes("조율자")) {
        this.room.send("useSkill"); // 서버의 Swap 스킬 호출
      } else if (job.includes("분석자")) {
        this.room.send("useAnalystSkill");
      } else if (job.includes("개척자")) {
        // 개척자: 자신에게 3초간 속도 1.8배 버프
        this.explorerSpeedBuff = 1.8;
        this.room.send("useExplorerSkill");
        this.time.delayedCall(3000, () => {
          this.explorerSpeedBuff = 1.0;
        });
      }
    }

    if (this.coordSkillMode !== 'idle') {
      this.mySprite.setVelocity(0, 0); // 스킬 모드일 땐 멈춤
      return;
    }

    let vx = 0;
    let vy = 0;
    const speed = 250 * (this.explorerSpeedBuff || 1);

    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = speed;

    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = speed;

    this.mySprite.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      // 로컬 물리 엔진(벽 충돌 완벽 적용된)의 좌표를 서버에 동기화
      this.room.send("movePos", { x: this.mySprite.x, y: this.mySprite.y });
    }
  }

  // 💡 분석가 힌트 노출 UI 함수
  displayHint(message) {
    if (this.hintText) this.hintText.destroy();

    this.hintText = this.add.text(400, 500, message, {
      font: '18px Arial',
      fill: '#ffff00',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    // 5초 후 메시지 삭제
    this.time.delayedCall(5000, () => {
      if (this.hintText) this.hintText.destroy();
    });
  }
}

const config = {
  type: Phaser.AUTO, width: 800, height: 600,
  parent: 'game-container', scene: [LoginScene, GameScene],
  physics: { default: 'arcade', arcade: { debug: false } }
};
new Phaser.Game(config);



/*
import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

const COLYSEUS_URL = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  ? 'ws://localhost:2567' : 'wss://concept-game-server.onrender.com';

const PLAYER_DATA = { // 기존 조원 데이터 유지 
  1: { "김민재": { job: "분석자(창의)", character: "test_buddy1" }, "박채연": { job: "개척자(성실)", character: "test_buddy2" }, "손유정": { job: "길잡이(외향)", character: "test_buddy3" }, "이승환": { job: "조율자(협력)", character: "test_buddy4" }, "이연재": { job: "설계자(신경)", character: "test_buddy5" } },
  2: { "윤현근": { job: "분석자(창의)", character: "test_buddy1" }, "심나이": { job: "개척자(성실)", character: "test_buddy2" }, "차시훈": { job: "길잡이(외향)", character: "test_buddy3" }, "이율": { job: "조율자(협력)", character: "test_buddy4" }, "남윤주": { job: "설계자(신경)", character: "test_buddy5" } },
  3: { "안비비안": { job: "분석자(창의)", character: "test_buddy1" }, "이택준": { job: "개척자(성실)", character: "test_buddy2" }, "송수현": { job: "길잡이(외향)", character: "test_buddy3" }, "김찬영": { job: "조율자(협력)", character: "test_buddy4" } },
  4: { "김가윤": { job: "분석자(창의)", character: "test_buddy1" }, "김수지": { job: "개척자(성실)", character: "test_buddy2" }, "김재현": { job: "길잡이(외향)", character: "test_buddy3" }, "이용은": { job: "조율자(협력)", character: "test_buddy4" }, "현동건": { job: "설계자(신경)", character: "test_buddy5" } },
  5: { "라재흠": { job: "분석자(창의)", character: "test_buddy1" }, "이정훈": { job: "개척자(성실)", character: "test_buddy2" }, "이지원": { job: "길잡이(외향)", character: "test_buddy3" }, "홍원준": { job: "조율자(협력)", character: "test_buddy4" } },
  6: { "석민정": { job: "분석자(창의)", character: "test_buddy1" }, "손채빈": { job: "개척자(성실)", character: "test_buddy2" }, "안은기": { job: "길잡이(외향)", character: "test_buddy3" }, "홍석준": { job: "조율자(협력)", character: "test_buddy4" } },
  7: { "민승기": { job: "분석자(창의)", character: "test_buddy1" }, "하윤채": { job: "개척자(성실)", character: "test_buddy2" }, "강민서": { job: "길잡이(외향)", character: "test_buddy3" }, "최재석": { job: "조율자(협력)", character: "test_buddy4" } },
  8: { "김유찬": { job: "분석자(창의)", character: "test_buddy1" }, "박승훈": { job: "개척자(성실)", character: "test_buddy2" }, "박재현": { job: "길잡이(외향)", character: "test_buddy3" }, "배지우": { job: "조율자(협력)", character: "test_buddy4" } },
  9: { "김담희": { job: "분석자(창의)", character: "test_buddy1" }, "이기서": { job: "개척자(성실)", character: "test_buddy2" }, "장윤서": { job: "길잡이(외향)", character: "test_buddy3" }, "박민우": { job: "조율자(협력)", character: "test_buddy4" }, "박지연": { job: "설계자(신경)", character: "test_buddy5" } },
  10: { "설진": { job: "분석자(창의)", character: "test_buddy1" }, "장원우": { job: "개척자(성실)", character: "test_buddy2" }, "이지민": { job: "길잡이(외향)", character: "test_buddy3" }, "이지훈": { job: "조율자(협력)", character: "test_buddy4" }, "김태성": { job: "설계자(신경)", character: "test_buddy5" } },
  11: { "김수현": { job: "분석자(창의)", character: "test_buddy1" }, "이성주": { job: "개척자(성실)", character: "test_buddy2" }, "최시현": { job: "길잡이(외향)", character: "test_buddy3" }, "이승회": { job: "조율자(협력)", character: "test_buddy4" }, "황유주": { job: "설계자(신경)", character: "test_buddy5" } },
  999: { "테스터": { job: "조율자", character: "test_buddy4" } }
};
const GROUP_NAMES = { 1: "only1", 2: "plot twist", 3: "세얼간이", 4: "일단해보조", 5: "HighFive", 6: "허니", 7: "마감직전 오캐스트라", 8: "일단틀어줘", 9: "제작소", 10: "카트라이더", 11: "최예" };

Object.keys(PLAYER_DATA).forEach(groupNumber => {
  const gName = GROUP_NAMES[groupNumber];
  if (!gName) return;
  Object.keys(PLAYER_DATA[groupNumber]).forEach(realName => {
    const jobBase = PLAYER_DATA[groupNumber][realName].job.split('(')[0];
    PLAYER_DATA[groupNumber][realName].character = `${groupNumber}조 ${gName}_${realName}_${jobBase}.png`;
  });
});

class LoginScene extends Phaser.Scene {
  constructor() { super({ key: 'LoginScene' }); }
  create() {
    const ui = document.getElementById('login-ui');
    const nameInput = document.getElementById('name-input');
    const groupInput = document.getElementById('group-input');
    ui.style.display = 'flex';

    document.getElementById('login-button').onclick = async () => {
      const inputName = nameInput.value.trim();
      const groupValue = groupInput.value.trim();
      if (!PLAYER_DATA[groupValue] || !PLAYER_DATA[groupValue][inputName]) return alert('정보를 확인해주세요!');
      const playerInfo = PLAYER_DATA[groupValue][inputName];
      const client = new Client(COLYSEUS_URL);
      try {
        const room = await client.joinOrCreate('my_room', { ...playerInfo, group: groupValue, realName: inputName });
        ui.style.display = 'none';
        this.scene.start('GameScene', { room, myInfo: { ...playerInfo, group: groupValue } });
      } catch (e) { alert('서버 접속 실패! ' + e.message); }
    };
  }
}

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    this.room = data.room;
    this.myInfo = data.myInfo;
    this.playerSprites = {};
    this.explorerSpeedBuff = 1;
    this.itemSpeedBuff = 1;
    this.attackPower = 1;
    this.hintText = null;
    this.coordSkillMode = 'idle';
  }

  preload() {
    this.cameras.main.setBackgroundColor('#2c3e50');
    this.load.tilemapTiledJSON('map', '/assets/7floor.tmj');
    this.load.image('item', '/assets/item.png');
    // 기타 타일 로드 (원본 유지)
    this.load.image('Wall', '/assets/test.3.png');
    this.load.image('Floor2', '/assets/Floor2.png');
    this.load.image('7flo0r', '/assets/7flo0r.png');
    this.load.image('6floor', '/assets/6floor.png');
    Object.keys(PLAYER_DATA).forEach(g => Object.keys(PLAYER_DATA[g]).forEach(n => {
      this.load.image(PLAYER_DATA[g][n].character, `/assets/${PLAYER_DATA[g][n].character}`);
    }));
  }

  create() {
    this.wallLayers = [];
    
    // 🌟 타이머 UI
    this.timerText = this.add.text(400, 20, '남은 시간: 05:00', {
      font: '24px Arial', fill: '#ff4444', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    // 🌟 인벤토리 UI
    this.inventoryText = this.add.text(400, 560, '내 아이템: 없음 (숫자키 1~5 사용)', {
      font: '18px Arial', fill: '#00ff00', backgroundColor: '#000000aa', padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    // 🌟 가상 15개 방 데이터 구축 (Tiled 대체용)
    this.obstaclesGroup = this.physics.add.staticGroup();
    this.interactablesGroup = this.physics.add.group();

    const mockObstacles = [
      // 7층
      { id: "r1_bridge", type: "bridge", job: "설계자", x: 100, y: 100, name: "[방1] 다리 건설" },
      { id: "r2_puzzle", type: "puzzle", job: "분석자", x: 200, y: 100, name: "[방2] 퍼즐 장치" },
      { id: "r3_wall", type: "wall", job: "개척자", x: 300, y: 100, name: "[방3] 부서지는 벽" },
      { id: "r4_torch", type: "torch", job: "개척자", x: 400, y: 100, name: "[방4] 미로 횃불" },
      { id: "r5_safe", type: "safe", job: "any", x: 500, y: 100, keyX: 550, keyY: 100, name: "[방5] 금고" },
      { id: "r5_key", type: "key_plate", x: 550, y: 100, name: "열쇠 발판" },
      { id: "r6_quiz", type: "puzzle", job: "분석자", x: 600, y: 100, name: "[방6] 넌센스 퀴즈" },
      { id: "r7_debris", type: "wall", job: "개척자", x: 700, y: 100, name: "[방7] 거대 잔해" },
      // 6층
      { id: "r8_engine", type: "puzzle", job: "분석자", x: 100, y: 300, name: "[방8] 동력 장치" },
      { id: "r9_glass", type: "torch", job: "길잡이", x: 200, y: 300, name: "[방9] 유리 다리" },
      { id: "r10_door", type: "dual_door", job: "any", x: 300, y: 300, key1X: 250, key1Y: 350, key2X: 350, key2Y: 350, name: "[방10] 중량 문" },
      { id: "r10_k1", type: "key_plate", x: 250, y: 350, name: "발판 A" },
      { id: "r10_k2", type: "key_plate", x: 350, y: 350, name: "발판 B" },
      { id: "r11_rock", type: "two_step_rock", job: "개척자", x: 400, y: 310, name: "[방11] 매몰된 바위" },
      { id: "r11_safe", type: "two_step_safe", job: "분석자", x: 400, y: 290, reqId: "r11_rock", name: "[방11] 속 금고" },
      { id: "r12_water", type: "bridge", job: "설계자", x: 500, y: 300, name: "[방12] 급류 차단벽" },
      { id: "r13_conv", type: "puzzle", job: "조율자", x: 600, y: 300, name: "[방13] 컨베이어 정지" },
      { id: "r14_ladder", type: "bridge", job: "설계자", x: 700, y: 300, name: "[방14] 사다리 수리" },
      { id: "r15_laser", type: "puzzle", job: "분석자", x: 400, y: 450, name: "[방15] 레이저 제어" }
    ];

    const mockItems = [
      { id: "i1", name: "!", x: 100, y: 130 }, { id: "i2", name: "케이크", x: 200, y: 130 }, { id: "i3", name: "바퀴", x: 300, y: 130 },
      { id: "i4", name: "미생물", x: 400, y: 130 }, { id: "i5", name: "조이스틱", x: 500, y: 130 }, { id: "i6", name: "찰흙", x: 600, y: 130 }, { id: "i7", name: "레이싱카", x: 700, y: 130 },
      { id: "i8", name: "향수", x: 100, y: 330 }, { id: "i9", name: "vlog", x: 200, y: 330 }, { id: "i10", name: "찢어진종이조각", x: 300, y: 330 },
      { id: "i11", name: "거울", x: 400, y: 270 }, { id: "i12", name: "음표", x: 500, y: 330 }, { id: "i13", name: "시계", x: 600, y: 330 },
      { id: "i14", name: "곰", x: 700, y: 330 }, { id: "i15", name: "dance", x: 400, y: 480 }
    ];

    mockObstacles.forEach(d => {
      let s = this.obstaclesGroup.create(d.x, d.y, 'item');
      s.customData = d;
      this.add.text(d.x, d.y - 20, d.name, { font: '12px Arial', fill: '#fff' }).setOrigin(0.5);
      
      if (d.type === "wall" || d.type === "two_step_rock") s.setTint(0xff0000); // 길막
      else if (d.type === "bridge") s.setTint(0x0000ff).setAlpha(0.3); // 다리 예정
      else if (d.type === "key_plate") { s.setTint(0x00ff00).setAlpha(0.3); this.physics.world.disableBody(s.body); } // 밟는 곳
      else s.setTint(0x888888); // 금고, 퍼즐
    });

    mockItems.forEach(d => {
      let s = this.interactablesGroup.create(d.x, d.y, 'item').setScale(0.5).setTint(0xffff00);
      s.customData = d; s.isPicking = false;
      this.add.text(d.x, d.y + 15, d.name, { font: '10px Arial', fill: '#ff0' }).setOrigin(0.5);
    });

    // 🌟 입력 키 세팅
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.numKeys = [
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
    ];

    // 🌟 서버 이벤트 리스너
    this.room.onMessage("serverMessage", (msg) => this.displayHint(msg));
    this.room.onMessage("applyBuff", (data) => {
        if (data.type === "speed") {
            this.itemSpeedBuff = data.multiplier;
            this.time.delayedCall(data.duration, () => this.itemSpeedBuff = 1);
            this.displayHint(`⚡ 속도 증가 버프 발동!`);
        } else if (data.type === "attack") {
            this.attackPower = data.multiplier;
            this.time.delayedCall(data.duration, () => this.attackPower = 1);
            this.displayHint(`⚔️ 공격력 증가 버프 발동!`);
        }
    });

    this.room.onMessage("itemPicked", (d) => {
      const s = this.interactablesGroup.getChildren().find(o => o.customData.id === d.id);
      if (s) s.destroy();
    });

    this.room.onMessage("pathOpened", (d) => {
      const s = this.obstaclesGroup.getChildren().find(o => o.customData.id === d.id);
      if (s) {
        if (d.type === "wall" || d.type === "two_step_rock") s.destroy();
        else { s.setAlpha(1).setTint(0xffffff); this.physics.world.disableBody(s.body); }
      }
    });

    this.room.onStateChange(() => this.syncPlayers());
  }

  syncPlayers() {
    this.room.state.players.forEach((p, id) => {
      if (!this.playerSprites[id]) {
        const s = this.physics.add.image(p.x, p.y, p.character).setScale(0.2).setDepth(90);
        s.setCircle(s.width * 0.35, s.width * 0.15, s.height * 0.15);
        this.playerSprites[id] = s;
        s.label = this.add.text(p.x, p.y - 15, p.realName, { font: '10px Arial' }).setOrigin(0.5).setDepth(91);

        if (id === this.room.sessionId) {
          this.mySprite = s;
          this.physics.add.overlap(this.mySprite, this.interactablesGroup, (me, item) => {
            if (!item.isPicking) {
              item.isPicking = true;
              this.room.send("interact", { action: "pickItem", targetId: item.customData.id, targetName: item.customData.name });
            }
          });
          this.physics.add.collider(this.mySprite, this.obstaclesGroup, null, (me, obj) => {
            return obj.customData.type === "wall" || obj.customData.type === "two_step_rock"; // 벽만 길막
          });
        }
      } else {
        const s = this.playerSprites[id];
        if (id !== this.room.sessionId) { s.x = p.x; s.y = p.y; }
        if (s.label) { s.label.x = p.x; s.label.y = p.y - 15; }
      }
    });

    // ⏱️ 타이머 및 UI 동기화
    const t = this.room.state.timeRemaining;
    if (t !== undefined) {
      this.timerText.setText(`남은 시간: ${Math.floor(t/60).toString().padStart(2,'0')}:${(t%60).toString().padStart(2,'0')}`);
    }
    const myP = this.room.state.players.get(this.room.sessionId);
    if (myP && myP.inventory) {
      this.inventoryText.setText(`내 아이템: ${Array.from(myP.inventory).join(", ") || '없음'} (숫자 1,2,3 사용)`);
    }
  }

  update() {
    if (!this.room || !this.mySprite) return;

    // 🌟 아이템 사용 (숫자키 1, 2, 3)
    this.numKeys.forEach((key, idx) => {
      if (Phaser.Input.Keyboard.JustDown(key)) {
        const p = this.room.state.players.get(this.room.sessionId);
        if (p && p.inventory && p.inventory.length > idx) this.room.send("useItem", { itemIndex: idx });
      }
    });

    // 🌟 만능 상호작용 (Space)
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      const job = this.myInfo.job;
      let near = null;
      this.obstaclesGroup.getChildren().forEach(o => {
        if (Phaser.Math.Distance.Between(this.mySprite.x, this.mySprite.y, o.x, o.y) < 60) near = o;
      });

      if (near) {
        const { type, job: reqJob, id, keyX, keyY, key1X, key1Y, key2X, key2Y, reqId } = near.customData;
        
        if (type === "safe") this.room.send("interact", { action: "openSafe", targetId: id, keyX, keyY });
        else if (type === "dual_door") this.room.send("interact", { action: "openDualDoor", targetId: id, key1X, key1Y, key2X, key2Y });
        else if (job.includes(reqJob)) {
          if (type === "two_step_safe") this.room.send("interact", { action: "openTwoStepSafe", targetId: id, reqId });
          else this.room.send("interact", { action: "openPath", targetId: id, targetType: type });
        } else {
          this.displayHint(`🚫 이 상호작용은 [${reqJob}] 직업이 필요합니다!`);
        }
      } else {
        if (job.includes("조율자")) this.room.send("useSkill");
        else if (job.includes("개척자")) { this.explorerSpeedBuff = 1.8; this.time.delayedCall(3000, () => this.explorerSpeedBuff = 1); }
      }
    }

    let vx = 0; let vy = 0;
    const speed = 250 * (this.explorerSpeedBuff || 1) * (this.itemSpeedBuff || 1);
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = speed;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = speed;
    
    this.mySprite.setVelocity(vx, vy);
    if (vx !== 0 || vy !== 0) this.room.send("movePos", { x: this.mySprite.x, y: this.mySprite.y });
  }

  displayHint(m) {
    if (this.hintText) this.hintText.destroy();
    this.hintText = this.add.text(400, 500, m, { font: '18px Arial', fill: '#ff0', backgroundColor: '#000000aa', padding: 10 }).setOrigin(0.5).setScrollFactor(0).setDepth(300);
    this.time.delayedCall(4000, () => this.hintText?.destroy());
  }
}

new Phaser.Game({ type: Phaser.AUTO, width: 800, height: 600, parent: 'game-container', scene: [LoginScene, GameScene], physics: { default: 'arcade' } });

*/

/*
// 직업 이름에 '길잡이'가 포함되어 있으면 시야 250, 아니면 기본 150
const myVision = this.myInfo.job.includes("길잡이") ? 250 : 150;

// 안개 뚫기
ctx.globalCompositeOperation = 'destination-out';
ctx.beginPath();
ctx.arc(sX, sY, myVision, 0, Math.PI * 2);
ctx.fill();
*/

/*
if (job.includes("개척자")) {
    // 1. 근처에 장애물이 없을 때: 3초간 이동 속도 1.8배 버프 발동
    if (!nearObstacle) {
        this.explorerSpeedBuff = 1.8; 
        this.time.delayedCall(3000, () => { this.explorerSpeedBuff = 1.0; });
        this.displayHint("🚀 이동 속도가 빨라집니다!");
    }
}
// 이동 속도 계산 시 반영
const speed = 250 * (this.explorerSpeedBuff || 1);
*/

/*
if (nearObstacle) {
    const reqJob = nearObstacle.customData.job; // 예: "설계자" 또는 "분석자"
    
    // 내 직업이 해당 기믹을 담당하는 직업일 때만 실행
    if (this.myInfo.job.includes(reqJob)) {
        this.room.send("interact", { 
            action: "openPath", 
            targetId: nearObstacle.customData.id, 
            targetType: nearObstacle.customData.type 
        });
    } else {
        this.displayHint(`🚫 이 상호작용은 [${reqJob}] 전용입니다!`);
    }
} else if (job.includes("분석자")) {
    // 분석가는 장애물이 없을 때 스페이스바를 누르면 힌트 스킬 발동
    this.room.send("useAnalystSkill");
}
*/

/*
if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
    if (this.myInfo.job.includes("조율자")) {
        // 팀원 이동 스킬 UI 토글
        if (this.coordSkillMode !== 'idle') this.closeCoordinatorSkillFlow();
        else this.openCoordinatorSkillFlow(); 
    }
}

// 맵 클릭 시 텔레포트 전송 로직 (attachPlacingPointer 내부)
this._coordPointerHandler = (pointer) => {
    const world = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    this.room.send('coordinatorTeleport', { 
        targetSessionId: this.coordSkillTargetId, // 이동시킬 팀원
        x: world.x, 
        y: world.y 
    });
    this.closeCoordinatorSkillFlow();
};
*/

/*
// 1. mockObstacles 배열 안에 방 9의 숨겨진 발판 데이터 추가
const mockObstacles = [
    // ... 기존 데이터 ...
    { id: "r9_glass_1", type: "hidden_path", job: "길잡이", x: 200, y: 300, name: "[방9] 안전 발판" },
    { id: "r9_glass_2", type: "hidden_path", job: "길잡이", x: 250, y: 300, name: "[방9] 안전 발판" }
];

// 2. 장애물 렌더링 부분에 hidden_path (투명 발판) 조건 추가
mockObstacles.forEach(d => {
    let s = this.obstaclesGroup.create(d.x, d.y, 'item');
    s.customData = d;
    
    // 이름표(텍스트) 객체도 변수에 담아 제어할 수 있게 합니다
    s.nameText = this.add.text(d.x, d.y - 20, d.name, { font: '12px Arial', fill: '#fff' }).setOrigin(0.5);
    
    if (d.type === "wall" || d.type === "two_step_rock") {
        s.setTint(0xff0000); 
    } 
    else if (d.type === "hidden_path") {
        // 🌟 길잡이 기믹: 처음에는 완벽히 투명하게(안 보이게) 설정
        s.setTint(0x00ffff); // 유리 다리 느낌의 청록색
        s.setAlpha(0);
        s.nameText.setAlpha(0); // 텍스트도 숨김
    }
    // ... 나머지 조건(bridge, key_plate 등) 유지 ...
});
*/

/*
// main.js - create() 내부 서버 리스너 모음에 추가

this.room.onMessage("pathRevealed", (d) => {
    const s = this.obstaclesGroup.getChildren().find(o => o.customData.id === d.id);
    if (s) {
        // 🌟 투명했던 발판이 부드럽게 나타나는 연출 (횃불로 비춘 느낌)
        this.tweens.add({ targets: [s, s.nameText], alpha: 0.8, duration: 800 });
        this.displayHint(`🔥 ${d.by}님이 횃불로 안전한 길을 밝혔습니다!`);
    }
});

*/

/*
// main.js - update() 내부 스페이스바 상호작용 로직 수정

if (near) {
    const { type, job: reqJob, id, keyX, keyY, key1X, key1Y, key2X, key2Y, reqId } = near.customData;
    
    if (type === "safe") this.room.send("interact", { action: "openSafe", targetId: id, keyX, keyY });
    else if (type === "dual_door") this.room.send("interact", { action: "openDualDoor", targetId: id, key1X, key1Y, key2X, key2Y });
    else if (job.includes(reqJob)) {
        if (type === "two_step_safe") {
            this.room.send("interact", { action: "openTwoStepSafe", targetId: id, reqId });
        } 
        // 🌟 길잡이의 숨겨진 길 밝히기 액션 전송
        else if (type === "hidden_path") {
            this.room.send("interact", { action: "revealPath", targetId: id });
        } 
        else {
            this.room.send("interact", { action: "openPath", targetId: id, targetType: type });
        }
    } else {
        this.displayHint(`🚫 이 상호작용은 [${reqJob}] 직업이 필요합니다!`);
    }
}
*/

/*

// 1. mockObstacles 배열 안에 방 11 데이터 추가
const mockObstacles = [
    // ... 기존 데이터 ...
    // 겉면의 암석 (개척자 전용)
    { id: "r11_rock", type: "two_step_rock", job: "개척자", x: 400, y: 310, name: "[방11] 매몰된 바위" },
    
    // 내부의 금고 (분석가 전용, reqId로 바위와 연결)
    { id: "r11_safe", type: "two_step_safe", job: "분석자", x: 400, y: 290, reqId: "r11_rock", name: "[방11] 속 금고" }
];

// 2. 장애물 렌더링 부분에 색상/충돌 속성 추가
mockObstacles.forEach(d => {
    let s = this.obstaclesGroup.create(d.x, d.y, 'item');
    s.customData = d;
    
    if (d.type === "wall" || d.type === "two_step_rock") {
        s.setTint(0xff0000); // 바위는 빨간색 장애물
    } 
    else if (d.type === "two_step_safe") {
        s.setTint(0x888888); // 금고는 회색
    }
    // ... 나머지 조건 유지 ...
});
*/
/*

// main.js - update() 내부 스페이스바 상호작용 로직 수정

if (near) {
    // 🌟 near.customData에서 reqId도 함께 꺼냅니다.
    const { type, job: reqJob, id, keyX, keyY, key1X, key1Y, key2X, key2Y, reqId } = near.customData;
    
    if (type === "safe") this.room.send("interact", { action: "openSafe", targetId: id, keyX, keyY });
    else if (type === "dual_door") this.room.send("interact", { action: "openDualDoor", targetId: id, key1X, key1Y, key2X, key2Y });
    
    // 내 직업이 해당 기믹의 요구 직업과 맞을 때
    else if (job.includes(reqJob)) {
        
        // 🌟 [방 11] 분석가의 연계 금고 해제 요청
        if (type === "two_step_safe") {
            this.room.send("interact", { action: "openTwoStepSafe", targetId: id, reqId: reqId });
        } 
        // 🌟 [방 11] 개척자의 암석 파괴 (기존 openPath 로직 그대로 사용)
        else {
            this.room.send("interact", { action: "openPath", targetId: id, targetType: type });
        }
        
    } else {
        this.displayHint(`🚫 이 상호작용은 [${reqJob}] 직업이 필요합니다!`);
    }
}
*/