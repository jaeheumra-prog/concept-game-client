import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

const PLAYER_DATA = {
  "김민재": { job: "분석자(창의)", character: "test_buddy1" },
  "박채연": { job: "개척자(성실)", character: "test_buddy2" },
  "손유정": { job: "길잡이(외향)", character: "test_buddy3" },
  "이승환": { job: "조율자(협력)", character: "test_buddy4" },
  "이연재": { job: "설계자(신경)", character: "test_buddy5" },
  "라재흠": { job: "분석자(창의)", character: "test_buddy1" },
  "이정훈": { job: "개척자(성실)", character: "test_buddy2" },
  "이지원": { job: "길잡이(외향)", character: "test_buddy3" },
  "홍원준": { job: "조율자(협력)", character: "test_buddy4" },
};

class LoginScene extends Phaser.Scene {
  constructor() { super({ key: 'LoginScene' }); }
  create() {
    const ui = document.getElementById('login-ui');
    const nameInput = document.getElementById('name-input');
    const groupInput = document.getElementById('group-input');
    ui.style.display = 'flex';
    document.getElementById('login-button').onclick = async () => {
      const playerInfo = PLAYER_DATA[nameInput.value];
      if (!playerInfo) return alert('등록되지 않은 이름!');
      const client = new Client('wss://concept-game-server.onrender.com');
      try {
        const room = await client.joinOrCreate('my_room', { ...playerInfo, group: groupInput.value, realName: nameInput.value });
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
    this.playerSprites = {};
  }

  preload() {
    this.load.image('tiles', '/assets/test.1.png'); 
    this.load.tilemapTiledJSON('map', '/assets/my_map.json'); 
    this.load.image('item', '/assets/item.png');
    this.load.image('light', '/assets/light_mask.png'); // 💡 부드러운 원형 빛 이미지 (중요!)
    for(let i=1; i<=5; i++) this.load.image(`test_buddy${i}`, `/assets/test_buddy${i}.png`);
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('test.1', 'tiles'); 
    if (tileset) {
      map.createLayer('바닥', tileset, 0, 0);
      this.wallLayer = map.createLayer('타일 레이어 2', tileset, 0, 0);
      this.wallLayer.setCollisionByProperty({ collides: true });
    }

    // 💡 1. Fog of War 설정
    // 맵 전체 크기만큼 검은색 도화지를 만듭니다.
    this.fog = this.make.renderTexture({
        width: map.widthInPixels,
        height: map.heightInPixels
    }, true);
    this.fog.fill(0x000000, 0.9); // 0.9는 약간 투명한 어둠, 1.0은 완전 암흑
    this.fog.setDepth(100); // 플레이어보다 위에 그림

    // 💡 2. 빛 마스크용 이미지 준비 (화면에는 안보임)
    this.lightMask = this.make.image({ key: 'light' }, false);

    this.items = this.physics.add.group();
    const itemObjects = map.getObjectLayer('Items');
    if (itemObjects) {
      itemObjects.objects.forEach(obj => {
        const item = this.items.create(obj.x, obj.y, 'item');
        item.setOrigin(0, 1);
      });
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.room.onStateChange(() => this.syncPlayers());
  }

  syncPlayers() {
    this.room.state.players.forEach((player, sessionId) => {
      if (!this.playerSprites[sessionId]) {
        const sprite = this.physics.add.image(player.x, player.y, player.character);
        sprite.setScale(0.8);
        this.playerSprites[sessionId] = sprite;
        this.playerSprites[sessionId].vision = player.vision; // 서버에서 받은 시야값 저장

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
    if (!this.room || !this.mySprite) return;
    
    // 💡 3. 매 프레임 안개를 지워서 시야를 밝힘
    this.fog.clear();
    this.fog.fill(0x000000, 0.9); // 다시 어둡게 칠함

    // 모든 플레이어 위치에 구멍을 뚫음 (멀티플레이 동기화 시야)
    Object.keys(this.playerSprites).forEach(id => {
        const p = this.playerSprites[id];
        const playerState = this.room.state.players.get(id);
        
        if (playerState) {
            this.lightMask.setScale(playerState.vision / 100); // 직업별 시야 크기 조절
            this.fog.erase(this.lightMask, playerState.x, playerState.y);
        }
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