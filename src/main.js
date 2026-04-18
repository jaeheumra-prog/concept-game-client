import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

const PLAYER_DATA = {
  "라재흠": { job: "분석가", character: "test_buddy1" },
  "이정훈": { job: "개척자", character: "test_buddy2" },
  "이지원": { job: "길잡이", character: "test_buddy3" },
  "홍원준": { job: "조율자", character: "test_buddy4" },
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
      const inputName = nameInput.value.trim();
      const playerInfo = PLAYER_DATA[inputName];
      if (!playerInfo) return alert('등록되지 않은 이름입니다!');
      const client = new Client('wss://concept-game-server.onrender.com');
      try {
        const room = await client.joinOrCreate('my_room', { 
          ...playerInfo, 
          group: groupInput.value.trim(), 
          realName: inputName 
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
    // 💡 [중요] 경로 앞에 /를 붙여서 절대 경로로 설정 (404 방지)
    this.load.image('tiles', '/assets/test.1.png'); 
    this.load.tilemapTiledJSON('map', '/assets/my_map.json'); 
    this.load.image('item_img', '/assets/item.png');
    for(let i=1; i<=5; i++) this.load.image(`test_buddy${i}`, `/assets/test_buddy${i}.png`);
  }

  create() {
    // 💡 1. 코드로 빛 텍스처 즉석 생성 (파일 로드 필요 없음)
    const canvas = this.textures.createCanvas('light_mask', 256, 256);
    const ctx = canvas.context;
    const gradient = ctx.context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');   
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    canvas.refresh();

    // 맵 로드 시도
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('test.1', 'tiles'); 
    if (tileset) {
      map.createLayer('바닥', tileset, 0, 0);
      const walls = map.createLayer('타일 레이어 2', tileset, 0, 0);
      if (walls) walls.setCollisionByProperty({ collides: true });
    }

    // 💡 2. Fog of War (안개) 설정
    // 맵 크기에 맞추되, 맵 로드 실패를 대비해 기본값 설정
    const fogWidth = (map.widthInPixels > 0) ? map.widthInPixels : 2000;
    const fogHeight = (map.heightInPixels > 0) ? map.heightInPixels : 2000;

    this.fog = this.make.renderTexture({ width: fogWidth, height: fogHeight }, true);
    this.fog.fill(0x000000, 0.9); // 0.9 농도의 어둠 
    this.fog.setDepth(80); // 맵(0)보다는 위, 캐릭터(100)보다는 아래로 설정

    this.lightBrush = this.make.image({ key: 'light_mask' }, false);

    // 아이템 배치
    this.items = this.physics.add.group();
    const itemLayer = map.getObjectLayer('Items');
    if (itemLayer) {
      itemLayer.objects.forEach(obj => {
        const item = this.items.create(obj.x, obj.y, 'item_img');
        item.setOrigin(0, 1).setDepth(10); // 안개 밑에 배치
      });
    }

    // UI: 아이템 수집 현황 [cite: 5]
    this.scoreText = this.add.text(10, 10, `아이템 수집: 0 / 5`, { 
        font: '20px Arial', fill: '#ffff00'
    }).setScrollFactor(0).setDepth(200);

    this.cameras.main.setBackgroundColor('#1a1a1a'); 
    this.cursors = this.input.keyboard.createCursorKeys();
    this.room.onStateChange(() => this.syncPlayers());
    
    // 서버 이벤트
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
        sprite.setScale(0.8).setDepth(100); // 안개(80)보다 위에 배치하여 항상 보이게 함
        this.playerSprites[sessionId] = sprite;

        // 💡 길잡이(test_buddy3)는 시야를 훨씬 넓게 설정 
        this.playerSprites[sessionId].visionSize = (player.character === "test_buddy3") ? 450 : 180;

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
      }
    });
  }

  update() {
    if (!this.room) return;
    
    // 💡 3. 매 프레임 안개 초기화 및 시야 뚫기
    this.fog.clear();
    this.fog.fill(0x000000, 0.9);

    Object.keys(this.playerSprites).forEach(id => {
        const sprite = this.playerSprites[id];
        const vSize = sprite.visionSize || 180;
        this.lightBrush.setScale(vSize / 256);
        // 안개 레이어에서 플레이어 위치의 구멍을 뚫어 맵을 보여줌 
        this.fog.erase(this.lightBrush, sprite.x, sprite.y);
    });

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