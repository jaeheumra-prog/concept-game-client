import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

// 📊 팀원 및 직업 데이터
const PLAYER_DATA = {
  "김민재": { job: "분석자(창의)", character: "test_buddy1" },
  "박채연": { job: "개척자(성실)", character: "test_buddy2" },
  "손유정": { job: "길잡이(외향)", character: "test_buddy3" },
  "이승환": { job: "조율자(협력)", character: "test_buddy4" },
  "이연재": { job: "설계자(신경)", character: "test_buddy5" },
  "윤현근": { job: "분석자(창의)", character: "test_buddy1" },
  "심나이": { job: "개척자(성실)", character: "test_buddy2" },
  "차시훈": { job: "길잡이(외향)", character: "test_buddy3" },
  "이율":   { job: "조율자(협력)", character: "test_buddy4" },
  "남윤주": { job: "설계자(신경)", character: "test_buddy5" },
  "안비비안": { job: "분석자(창의)", character: "test_buddy1" },
  "이택준": { job: "개척자(성실)", character: "test_buddy2" },
  "송수현": { job: "길잡이(외향)", character: "test_buddy3" },
  "김찬영": { job: "조율자(협력)", character: "test_buddy4" },
  "김가윤": { job: "분석자(창의)", character: "test_buddy1" },
  "김수지": { job: "개척자(성실)", character: "test_buddy2" },
  "김재현": { job: "길잡이(외향)", character: "test_buddy3" },
  "이용은": { job: "조율자(협력)", character: "test_buddy4" },
  "현동건": { job: "설계자(신경)", character: "test_buddy5" },
  "라재흠": { job: "분석자(창의)", character: "test_buddy1" },
  "이정훈": { job: "개척자(성실)", character: "test_buddy2" },
  "이지원": { job: "길잡이(외향)", character: "test_buddy3" },
  "홍원준": { job: "조율자(협력)", character: "test_buddy4" },
  "테스터": { job: "조율자", character: "test_buddy4" }
};

class LoginScene extends Phaser.Scene {
  constructor() { super({ key: 'LoginScene' }); }
  create() {
    const ui = document.getElementById('login-ui');
    const nameInput = document.getElementById('name-input');
    const groupInput = document.getElementById('group-input');
    ui.style.display = 'flex';
    document.getElementById('login-button').onclick = async () => {
      const playerInfo = PLAYER_DATA[nameInput.value.trim()];
      if (!playerInfo) return alert('등록되지 않은 이름입니다!');
      const client = new Client('wss://concept-game-server.onrender.com');
      try {
        const room = await client.joinOrCreate('my_room', { 
          ...playerInfo, 
          group: groupInput.value.trim(), 
          realName: nameInput.value.trim() 
        });
        ui.style.display = 'none';
        this.scene.start('GameScene', { room, myInfo: playerInfo });
      } catch (e) { alert('서버 접속 실패!'); }
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
  }

  preload() {
    this.load.image('tiles', '/assets/test.1.png'); 
    this.load.tilemapTiledJSON('map', '/assets/my_map.json'); 
    this.load.image('item_img', '/assets/item.png');
    for(let i=1; i<=5; i++) this.load.image(`test_buddy${i}`, `/assets/test_buddy${i}.png`);
  }

  create() {
    // 💡 [핵심] 코드로 직접 '부드러운 빛' 텍스처 생성 (404 에러 방지)
    const canvas = this.textures.createCanvas('light_mask', 256, 256);
    const ctx = canvas.context;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   // 중앙
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');   // 외곽
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    canvas.refresh();

    // 맵 로드
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('test.1', 'tiles'); 
    if (tileset) {
      map.createLayer('바닥', tileset, 0, 0);
      this.wallLayer = map.createLayer('타일 레이어 2', tileset, 0, 0);
      this.wallLayer.setCollisionByProperty({ collides: true });
    }

    // 💡 Fog of War 설정
    this.fog = this.make.renderTexture({
        width: map.widthInPixels,
        height: map.heightInPixels
    }, true);
    this.fog.fill(0x000000, 0.95); // 어둠의 농도 (0.95 = 매우 어두움)
    this.fog.setDepth(100); 

    // 빛 마스크용 이미지 (위에서 만든 'light_mask' 사용)
    this.lightBrush = this.make.image({ key: 'light_mask' }, false);

    // Tiled에서 아이템 불러오기
    this.items = this.physics.add.group();
    const itemObjects = map.getObjectLayer('Items');
    if (itemObjects) {
      itemObjects.objects.forEach(obj => {
        const item = this.items.create(obj.x, obj.y, 'item_img');
        item.setOrigin(0, 1).setDepth(50);
      });
    }

    // UI: 아이템 수집 현황
    this.scoreText = this.add.text(10, 40, `아이템 수집: 0 / 5`, { 
        font: '20px Arial', fill: '#ffff00'
    }).setScrollFactor(0).setDepth(101);

    this.cursors = this.input.keyboard.createCursorKeys();
    
    // 서버 이벤트 리스너
    this.room.onStateChange(() => this.syncPlayers());
    this.room.state.listen("itemsCollected", (val) => this.scoreText.setText(`아이템 수집: ${val} / 5`));
    this.room.onMessage("changeMap", (data) => {
        alert(data.message);
        this.scene.restart({ room: this.room, myInfo: this.myInfo });
    });
  }

  syncPlayers() {
    this.room.state.players.forEach((player, sessionId) => {
      if (!this.playerSprites[sessionId]) {
        const sprite = this.physics.add.image(player.x, player.y, player.character);
        sprite.setScale(0.8).setDepth(60);
        this.playerSprites[sessionId] = sprite;

        const label = this.add.text(player.x, player.y - 45, player.job, { font: '14px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.playerSprites[sessionId].label = label;

        // 내 캐릭터일 때만 아이템 충돌 로직 추가
        if (sessionId === this.room.sessionId) {
          this.mySprite = sprite;
          this.physics.add.overlap(this.mySprite, this.items, (me, item) => {
            item.destroy(); 
            this.room.send("collectItem"); 
          });
        }
      } else {
        const sprite = this.playerSprites[sessionId];
        sprite.x = player.x;
        sprite.y = player.y;
        if (sprite.label) {
          sprite.label.x = player.x;
          sprite.label.y = player.y - 45;
        }
      }
    });
  }

  update() {
    if (!this.room || !this.mySprite) return;
    
    // 매 프레임 안개 초기화 및 모든 플레이어 시야 뚫기
    this.fog.clear();
    this.fog.fill(0x000000, 0.95);

    this.room.state.players.forEach((playerState, id) => {
        // 서버에서 설정한 직업별 vision 값 적용 (길잡이는 더 넓음)
        const visionSize = playerState.vision || 200;
        this.lightBrush.setScale(visionSize / 256);
        this.fog.erase(this.lightBrush, playerState.x, playerState.y);
    });

    // 이동 명령 전송
    if (this.cursors.left.isDown) this.room.send("move", { dir: "left" });
    if (this.cursors.right.isDown) this.room.send("move", { dir: "right" });
    if (this.cursors.up.isDown) this.room.send("move", { dir: "up" });
    if (this.cursors.down.isDown) this.room.send("move", { dir: "down" });
  }
}

const config = {
  type: Phaser.AUTO, width: 800, height: 600,
  parent: 'game-container', scene: [LoginScene, GameScene],
  physics: { default: 'arcade', arcade: { debug: false } }
};
new Phaser.Game(config);