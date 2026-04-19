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
  }

  preload() {
    this.cameras.main.setBackgroundColor('#2c3e50');

    // Load new map JSON - 현재 7층 맵 불러오기로 세팅!
    this.load.tilemapTiledJSON('map', '/assets/7floor.tmj');
    this.load.image('item', '/assets/item.png');

    // Load 6floor.3.tmj tilesets (원래 쓰던 것들)
    this.load.image('Wall', '/assets/test.3.png'); // Tiled에서 다시 Wall로 저장됨
    this.load.image('Floor2', '/assets/Floor2.png');
    this.load.image('Kakao001', '/assets/KakaoTalk_Photo_2026-04-17-13-18-24 001.png');
    this.load.image('Kakao002', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25 002.png');
    this.load.image('Kakao004', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25 004.png');
    this.load.image('Kakao005', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25 005.png');

    // Load 7floor.tmj tilesets (7층 전용)
    this.load.image('7flo0r', '/assets/7flo0r.png');
    this.load.image('6floor101', '/assets/6floor101.png');
    this.load.image('6floor', '/assets/6floor.png');

    // Fallback load images in case they use old ones
    this.load.image('img1', '/assets/test.1.png');
    this.load.image('img2', '/assets/test.3.png');
    this.load.image('img3', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25-005.png');
    this.load.image('img4', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25-002.png');

    for (let i = 1; i <= 5; i++) {
      this.load.image(`test_buddy${i}`, `/assets/test_buddy${i}.png`);
    }
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
    // 시야 가리기용 (Fog of War) 세팅
    // 맵 전체를 덮는 거대한 까만 사각형
    this.fogOverlay = this.add.rectangle(0, 0, 6000, 6000, 0x000000, 0.95).setOrigin(0,0).setDepth(95);

    // 구멍을 뚫을 마스크용 그래픽 (화면에 직접 그려지진 않음)
    this.visionGraphics = this.make.graphics(); 
    
    // 마스크 반전 활성화 (BitmapMask는 invertAlpha 속성을 지원합니다!)
    const fogMask = this.visionGraphics.createBitmapMask();
    fogMask.invertAlpha = true;
    this.fogOverlay.setMask(fogMask);

    try {
      const map = this.make.tilemap({ key: 'map' });

      // Binding 6floor.3 맵의 타일셋들
      const wall = map.addTilesetImage('Wall', 'Wall');
      const floor2 = map.addTilesetImage('Floor2', 'Floor2');
      const kakao001 = map.addTilesetImage('KakaoTalk_Photo_2026-04-17-13-18-24 001', 'Kakao001');
      const kakao002 = map.addTilesetImage('KakaoTalk_Photo_2026-04-17-13-18-25 002', 'Kakao002');
      const kakao004 = map.addTilesetImage('KakaoTalk_Photo_2026-04-17-13-18-25 004', 'Kakao004');
      const kakao005 = map.addTilesetImage('KakaoTalk_Photo_2026-04-17-13-18-25 005', 'Kakao005');

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

          if (createdLayer && (layer.name.includes('벽') || layer.name.toLowerCase().includes('wall'))) {
            createdLayer.setCollisionByProperty({ collides: true });
            this.wallLayers.push(createdLayer);
          }
        });
      }
    } catch (e) {
      console.warn("맵을 불러오는 데 실패했습니다. 에셋 경로를 확인하세요.", e);
    }

    let uiText = `[ ${this.myInfo.group}모둠 ] 접속 성공`;
    if (this.myInfo.character === "test_buddy4") uiText += " (Shift: 팀원 이동 지정)";
    if (this.myInfo.character === "test_buddy3") uiText += " (길잡이 시야 활성화)"; // 길잡이 안내 추가
    this._baseHudText = uiText;

    this.scoreText = this.add.text(10, 10, uiText, {
      font: '20px Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESCAPE);

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
        sprite.setScale(0.8).setDepth(90);
        
        // 4. 캐릭터와 벽의 충돌 감지 (요청하신 코드 연동)
        this.wallLayers.forEach(wallLayer => {
          this.physics.add.collider(sprite, wallLayer);
        });

        this.playerSprites[sessionId] = sprite;

        const label = this.add.text(player.x, player.y - 45, player.job, { font: '14px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.playerSprites[sessionId].label = label;
        this.playerSprites[sessionId].label.setDepth(100);

        if (sessionId === this.room.sessionId) {
          this.mySprite = sprite;
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
          sprite.label.y = player.y - 45;
        }
      }
    });
  }

  update() {
    if (!this.room || !this.mySprite) return;

    // 어둠(안개) 그리기 및 내 주변 시야 뚫기 (완벽한 마스크 반전 기법)
    if (this.mySprite && this.visionGraphics) {
      this.visionGraphics.clear();
      this.visionGraphics.fillStyle(0xffffff, 1);

      // 길잡이면 크게, 아니면 작게 시야 반경 설정
      const myVision = this.myInfo.vision || 150;
      
      // 내 중심만 뻥 뚫기
      this.visionGraphics.fillCircle(this.mySprite.x, this.mySprite.y, myVision);
    }

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      if (this.coordSkillMode !== 'idle') this.closeCoordinatorSkillFlow();
    }

    if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
      if (this.myInfo.character === "test_buddy4") {
        if (this.coordSkillMode !== 'idle') {
          this.closeCoordinatorSkillFlow();
        } else {
          this.openCoordinatorSkillFlow();
        }
      }
    }

    if (this.coordSkillMode !== 'idle') {
      this.mySprite.setVelocity(0, 0); // 스킬 모드일 땐 멈춤
      return;
    }

    let vx = 0;
    let vy = 0;
    const speed = 250;

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
}

const config = {
  type: Phaser.AUTO, width: 800, height: 600,
  parent: 'game-container', scene: [LoginScene, GameScene],
  physics: { default: 'arcade', arcade: { debug: false } }
};
new Phaser.Game(config);
