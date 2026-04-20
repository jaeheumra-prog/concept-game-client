import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

const COLYSEUS_URL = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  ? 'ws://localhost:2567' : 'wss://concept-game-server.onrender.com';

const PLAYER_DATA = {
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
  const members = PLAYER_DATA[groupNumber];
  Object.keys(members).forEach(realName => {
    const jobBase = members[realName].job.split('(')[0];
    const filename = `${groupNumber}조 ${gName}_${realName}_${jobBase}.png`;
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
    this.explorerSpeedBuff = 1;
    this.hintText = null;
    this.coordSkillMode = 'idle';
    this.coordSkillTargetId = null;
    this.coordOverlayRoot = null;
    this._coordPointerHandler = null;
  }

  preload() {
    this.cameras.main.setBackgroundColor('#2c3e50');
    this.load.tilemapTiledJSON('map', '/assets/7floor.tmj');
    this.load.image('item', '/assets/item.png');

    // 타일셋 로드
    this.load.image('Wall', '/assets/test.3.png');
    this.load.image('Floor2', '/assets/Floor2.png');
    this.load.image('Kakao001', '/assets/KakaoTalk_Photo_2026-04-17-13-18-24-001.png');
    this.load.image('Kakao002', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25-002.png');
    this.load.image('Kakao004', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25-004.png');
    this.load.image('Kakao005', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25-005.png');
    this.load.image('7flo0r', '/assets/7flo0r.png');
    this.load.image('6floor101', '/assets/6floor101.png');
    this.load.image('6floor', '/assets/6floor.png');
    this.load.image('img1', '/assets/test.1.png');
    this.load.image('img2', '/assets/test.3.png');

    Object.keys(PLAYER_DATA).forEach(groupNumber => {
      const gName = GROUP_NAMES[groupNumber];
      if (!gName) return;
      const members = PLAYER_DATA[groupNumber];
      Object.keys(members).forEach(realName => {
        const filename = members[realName].character;
        this.load.image(filename, `/assets/${filename}`);
      });
    });
  }

  // --- 조율자 전용 오버레이 및 이동 로직 (기존 유지) ---
  ensureCoordOverlay() {
    if (this.coordOverlayRoot) return this.coordOverlayRoot;
    const parent = document.getElementById('game-container');
    if (!parent) return null;
    const root = document.createElement('div');
    root.id = 'coord-skill-overlay';
    root.style.cssText = 'display:none;position:absolute;inset:0;z-index:150;pointer-events:auto;font-family:sans-serif;';
    root.innerHTML = `<div id="coord-skill-panel" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(360px,92%);background:#1a1a1a;color:#fff;border:2px solid #00ff00;border-radius:10px;padding:16px;">
            <div id="coord-skill-title" style="font-weight:bold;margin-bottom:10px;text-align:center;">팀원 선택</div>
            <div id="coord-skill-hint" style="font-size:13px;color:#ccc;margin-bottom:12px;text-align:center;"></div>
            <div id="coord-skill-list" style="display:flex;flex-direction:column;gap:8px;"></div>
            <button id="coord-skill-cancel" style="margin-top:14px;width:100%;padding:10px;background:#444;color:#fff;border:none;cursor:pointer;">닫기 (ESC)</button>
        </div>`;
    parent.appendChild(root);
    root.querySelector('#coord-skill-cancel').onclick = () => this.closeCoordinatorSkillFlow();
    this.coordOverlayRoot = root;
    return root;
  }
  closeCoordinatorSkillFlow() {
    this.coordSkillMode = 'idle';
    if (this._coordPointerHandler) { this.input.off('pointerdown', this._coordPointerHandler); this._coordPointerHandler = null; }
    if (this.coordOverlayRoot) this.coordOverlayRoot.style.display = 'none';
    if (this.scoreText) this.scoreText.setText(this._baseHudText);
  }
  openCoordinatorSkillFlow() {
    if (!this.myInfo.job.includes('조율자')) return;
    const root = this.ensureCoordOverlay();
    this.coordSkillMode = 'picking';
    root.style.display = 'block';
    const list = root.querySelector('#coord-skill-list');
    list.innerHTML = '';
    this.room.state.players.forEach((player, sessionId) => {
      if (String(player.group) !== String(this.myInfo.group)) return;
      const btn = document.createElement('button');
      btn.style.cssText = 'padding:10px;background:#2a2a2a;color:#fff;border:1px solid #333;cursor:pointer;';
      btn.innerHTML = `${player.realName || '팀원'} (${player.job})`;
      btn.onclick = () => {
        this.coordSkillTargetId = sessionId;
        this.coordSkillMode = 'placing';
        root.style.display = 'none';
        this.attachPlacingPointer();
      };
      list.appendChild(btn);
    });
  }
  attachPlacingPointer() {
    this._coordPointerHandler = (pointer) => {
      const world = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      this.room.send('coordinatorTeleport', { targetSessionId: this.coordSkillTargetId, x: world.x, y: world.y });
      this.closeCoordinatorSkillFlow();
    };
    this.input.on('pointerdown', this._coordPointerHandler);
  }

  create() {
    this.cameras.main.setBackgroundColor('#2c3e50');
    this.wallLayers = [];

    // Fog of War
    const cw = this.cameras.main.width;
    const ch = this.cameras.main.height;
    this.fogCanvas = this.textures.createCanvas('fogTex', cw, ch);
    this.fogImage = this.add.image(0, 0, 'fogTex').setOrigin(0, 0).setDepth(95).setScrollFactor(0);

    // Map 및 레이어 설정
    try {
      const map = this.make.tilemap({ key: 'map' });
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      const tilesets = [
        map.addTilesetImage('Wall', 'Wall'),
        map.addTilesetImage('Floor2', 'Floor2'),
        map.addTilesetImage('7flo0r', '7flo0r'),
        map.addTilesetImage('6floor', '6floor')
        // 추가 타일셋 생략...
      ];

      map.layers.forEach(layer => {
        const createdLayer = map.createLayer(layer.name, tilesets.filter(t => t), 0, 0);
        if (createdLayer && (layer.name.includes('벽') || layer.name.toLowerCase().includes('wall'))) {
          createdLayer.setCollisionByExclusion([-1]);
          this.wallLayers.push(createdLayer);
        }
      });
    } catch (e) { console.warn(e); }

    // 🌟 인벤토리 UI
    this.inventoryText = this.add.text(400, 560, '내 아이템: 없음', {
      font: '18px Arial', fill: '#00ff00', backgroundColor: '#000000aa', padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    // 🌟 아이템 그룹 및 가짜 데이터
    this.interactablesGroup = this.physics.add.group();
    const mockItems = [
      { id: "item_potato", type: "item", name: "감자", x: 300, y: 300 },
      { id: "item_wheel", type: "item", name: "바퀴", x: 500, y: 400 }
    ];
    mockItems.forEach(d => {
      let s = this.interactablesGroup.create(d.x, d.y, 'item').setScale(0.5);
      s.customData = d;
      s.isPicking = false;
    });

    // 🌟 장애물 그룹 (벽, 다리 등)
    this.obstaclesGroup = this.physics.add.staticGroup();
    const mockObstacles = [
      { id: "bridge_room1", type: "bridge", job: "설계자", x: 700, y: 200 },
      { id: "wall_room3", type: "wall", job: "개척자", x: 450, y: 450 }
    ];
    mockObstacles.forEach(d => {
      let s = this.obstaclesGroup.create(d.x, d.y, 'item'); // 임시 이미지
      s.customData = d;
      if (d.type === "wall") { s.setTint(0xff0000); }
      else { s.setTint(0x0000ff).setAlpha(0.4); }
    });

    // 상단 HUD 및 키 설정
    this._baseHudText = `[ ${this.myInfo.group}모둠 ] 접속 성공 - Space: 스킬/상호작용`;
    this.scoreText = this.add.text(10, 10, this._baseHudText, { font: '20px Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 3 }).setScrollFactor(0).setDepth(100);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESCAPE);

    // 서버 리스너 등록
    this.room.onMessage("showHint", (d) => this.displayHint(d.message));
    this.room.onMessage("itemPicked", (d) => {
      const s = this.interactablesGroup.getChildren().find(obj => obj.customData.id === d.id);
      if (s) s.destroy();
      this.displayHint(`${d.by}님이 [${d.itemName}] 획득!`);
    });
    this.room.onMessage("pathOpened", (d) => {
      const s = this.obstaclesGroup.getChildren().find(obj => obj.customData.id === d.id);
      if (s) {
        if (d.type === "wall") s.destroy();
        else { s.setAlpha(1).setTint(0xffffff); this.physics.world.disableBody(s.body); }
        this.displayHint(`${d.by}님이 길을 열었습니다!`);
      }
    });

    this.room.onStateChange(() => this.syncPlayers());
    this.syncPlayers();
  }

  syncPlayers() {
    this.room.state.players.forEach((player, sessionId) => {
      if (!this.playerSprites[sessionId]) {
        const sprite = this.physics.add.image(player.x, player.y, player.character).setScale(0.2).setDepth(90);
        sprite.setCircle(sprite.width * 0.35, sprite.width * 0.15, sprite.height * 0.15);
        this.wallLayers.forEach(l => this.physics.add.collider(sprite, l));
        this.playerSprites[sessionId] = sprite;
        sprite.label = this.add.text(player.x, player.y - 15, player.realName, { font: '10px Arial' }).setOrigin(0.5).setDepth(91);

        if (sessionId === this.room.sessionId) {
          this.mySprite = sprite;
          this.cameras.main.startFollow(this.mySprite, true, 0.1, 0.1);
          this.mySprite.setCollideWorldBounds(true);
          // 🌟 자동 아이템 획득 오버랩
          this.physics.add.overlap(this.mySprite, this.interactablesGroup, this.handleItemCollision, null, this);
          // 🌟 장애물 충돌 (벽일 경우)
          this.physics.add.collider(this.mySprite, this.obstaclesGroup, (p, obj) => {
            if (obj.customData.type !== "wall") return false;
          });
        }
      } else {
        const s = this.playerSprites[sessionId];
        if (sessionId !== this.room.sessionId) { s.x = player.x; s.y = player.y; }
        if (s.label) { s.label.x = player.x; s.label.y = player.y - 15; }
      }
    });

    const myP = this.room.state.players.get(this.room.sessionId);
    if (myP && myP.inventory) {
      this.inventoryText.setText(`내 아이템: ${Array.from(myP.inventory).join(", ") || '없음'}`);
    }
  }

  handleItemCollision(p, item) {
    if (item.isPicking) return;
    item.isPicking = true;
    this.room.send("interact", { action: "pickItem", targetId: item.customData.id, targetName: item.customData.name });
  }

  update() {
    if (!this.room || !this.mySprite) return;

    // Fog of War (생략 없이 원본 기법)
    const ctx = this.fogCanvas.context;
    ctx.clearRect(0, 0, this.fogCanvas.width, this.fogCanvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.95)';
    ctx.fillRect(0, 0, this.fogCanvas.width, this.fogCanvas.height);
    const sX = this.mySprite.x - this.cameras.main.scrollX;
    const sY = this.mySprite.y - this.cameras.main.scrollY;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(sX, sY, this.myInfo.vision || 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    this.fogCanvas.refresh();

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) this.closeCoordinatorSkillFlow();
    if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) this.openCoordinatorSkillFlow();

    // 🌟 통합 스페이스바 처리
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      const job = this.myInfo.job;
      let nearObs = null;
      this.obstaclesGroup.getChildren().forEach(o => {
        if (Phaser.Math.Distance.Between(this.mySprite.x, this.mySprite.y, o.x, o.y) < 80) nearObs = o;
      });

      if (nearObs && job.includes(nearObs.customData.job)) {
        this.room.send("interact", { action: "openPath", targetId: nearObs.customData.id, targetType: nearObs.customData.type });
      } else {
        if (job.includes("조율자")) this.room.send("useSkill");
        else if (job.includes("분석자")) this.room.send("useAnalystSkill");
        else if (job.includes("개척자")) {
          this.explorerSpeedBuff = 1.8; this.room.send("useExplorerSkill");
          this.time.delayedCall(3000, () => this.explorerSpeedBuff = 1.0);
        }
      }
    }

    if (this.coordSkillMode !== 'idle') { this.mySprite.setVelocity(0); return; }

    let vx = 0; let vy = 0;
    const speed = 250 * this.explorerSpeedBuff;
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = speed;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = speed;
    this.mySprite.setVelocity(vx, vy);
    if (vx !== 0 || vy !== 0) this.room.send("movePos", { x: this.mySprite.x, y: this.mySprite.y });
  }

  displayHint(m) {
    if (this.hintText) this.hintText.destroy();
    this.hintText = this.add.text(400, 500, m, { font: '18px Arial', fill: '#ffff00', backgroundColor: '#000000aa', padding: 10 }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
    this.time.delayedCall(5000, () => this.hintText?.destroy());
  }
}

new Phaser.Game({ type: Phaser.AUTO, width: 800, height: 600, parent: 'game-container', scene: [LoginScene, GameScene], physics: { default: 'arcade' } });