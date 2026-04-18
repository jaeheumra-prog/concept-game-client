import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

const PLAYER_DATA = {
  "김민재": { job: "분석가", character: "test_buddy1" },
  "박채연": { job: "개척자", character: "test_buddy2" },
  "손유정": { job: "길잡이", character: "test_buddy3" },
  "이승환": { job: "조율자", character: "test_buddy4" },
  "이연재": { job: "설계자", character: "test_buddy5" },
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
      if (!playerInfo) return alert('등록되지 않은 이름!');
      const client = new Client('wss://concept-game-server.onrender.com');
      try {
        const room = await client.joinOrCreate('my_room', { ...playerInfo, group: groupInput.value.trim(), realName: inputName });
        ui.style.display = 'none';
        this.scene.start('GameScene', { room, myInfo: playerInfo });
      } catch (e) { alert('접속 실패!'); }
    };
  }
}

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }
  init(data) {
    this.room = data.room;
    this.myInfo = data.myInfo;
    this.playerSprites = {};
  }

  preload() {
    // 💡 404 방지를 위해 경로를 다시 한번 확인하세요!
    this.load.image('tiles', '/assets/test.1.png'); 
    this.load.tilemapTiledJSON('map', '/assets/my_map.json'); 
    this.load.image('item_img', '/assets/item.png');
    for(let i=1; i<=5; i++) this.load.image(`test_buddy${i}`, `/assets/test_buddy${i}.png`);
  }

  create() {
    // 💡 1. 빛 텍스처 생성 (가장자리가 부드럽게 깎인 원)
    const canvas = this.textures.createCanvas('light_mask', 256, 256);
    const ctx = canvas.context;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');   
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    canvas.refresh();

    // 맵 로드
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('test.1', 'tiles'); 
    if (tileset) {
      map.createLayer('바닥', tileset, 0, 0);
      const walls = map.createLayer('타일 레이어 2', tileset, 0, 0);
      if (walls) walls.setCollisionByProperty({ collides: true });
    }

    // 💡 2. Fog of War 안개 레이어 생성
    // 맵이 없을 경우를 대비해 최소 800x600 크기 확보
    const fogW = map.widthInPixels || 800;
    const fogH = map.heightInPixels || 600;
    this.fog = this.make.renderTexture({ width: fogW, height: fogH }, true);
    this.fog.setDepth(100); 

    this.lightBrush = this.make.image({ key: 'light_mask' }, false);

    // 아이템 배치
    this.items = this.physics.add.group();
    const itemLayer = map.getObjectLayer('Items');
    if (itemLayer) {
      itemLayer.objects.forEach(obj => {
        const item = this.items.create(obj.x, obj.y, 'item_img');
        item.setOrigin(0, 1).setDepth(50);
      });
    }

    // UI: 수집 현황 (5개 모으면 전환) 
    this.scoreText = this.add.text(10, 10, `아이템 수집: 0 / 5`, { 
        font: '20px Arial', fill: '#ffff00'
    }).setScrollFactor(0).setDepth(110);

    this.cameras.main.setBackgroundColor('#1a1a1a'); // 💡 배경을 아주 어둡게 설정
    this.cursors = this.input.keyboard.createCursorKeys();
    this.room.onStateChange(() => this.syncPlayers());
    
    // 서버 메시지 수신
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

        // 💡 길잡이(test_buddy3)는 시야를 훨씬 넓게 설정 
        this.playerSprites[sessionId].visionSize = (player.character === "test_buddy3") ? 400 : 200;

        if (sessionId === this.room.sessionId) {
          this.mySprite = sprite;
          this.physics.add.overlap(this.mySprite, this.items, (me, item) => {
            item.destroy(); 
            this.room.send("collectItem"); 
          });
        }
      } else {
        this.playerSprites[sessionId].x = player.x;
        this.playerSprites[sessionId].y = player.y;
      }
    });
  }

  update() {
    if (!this.room) return;
    
    // 💡 3. 매 프레임 안개를 다시 칠하고 모든 팀원의 시야 확보
    this.fog.clear();
    this.fog.fill(0x000000, 0.9); // 0.9 농도로 안개 채우기

    Object.keys(this.playerSprites).forEach(id => {
        const sprite = this.playerSprites[id];
        const vSize = sprite.visionSize || 200;
        this.lightBrush.setScale(vSize / 256);
        // 안개 레이어에서 플레이어 위치만큼 구멍을 뚫음
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