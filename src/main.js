import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

// 📊 1조 ~ 11조 전체 팀원 데이터 (손실 없이 유지)
const PLAYER_DATA = {
  // 1조 only1
  "김민재": { job: "분석자(창의)", character: "test_buddy1" },
  "박채연": { job: "개척자(성실)", character: "test_buddy2" },
  "손유정": { job: "길잡이(외향)", character: "test_buddy3" },
  "이승환": { job: "조율자(협력)", character: "test_buddy4" },
  "이연재": { job: "설계자(신경)", character: "test_buddy5" },
  // 2조 plot twist
  "윤현근": { job: "분석자(창의)", character: "test_buddy1" },
  "심나이": { job: "개척자(성실)", character: "test_buddy2" },
  "차시훈": { job: "길잡이(외향)", character: "test_buddy3" },
  "이율":   { job: "조율자(협력)", character: "test_buddy4" },
  "남윤주": { job: "설계자(신경)", character: "test_buddy5" },
  // 3조 세얼간이
  "안비비안": { job: "분석자(창의)", character: "test_buddy1" },
  "이택준": { job: "개척자(성실)", character: "test_buddy2" },
  "송수현": { job: "길잡이(외향)", character: "test_buddy3" },
  "김찬영": { job: "조율자(협력)", character: "test_buddy4" },
  // 4조 일단해보조
  "김가윤": { job: "분석자(창의)", character: "test_buddy1" },
  "김수지": { job: "개척자(성실)", character: "test_buddy2" },
  "김재현": { job: "길잡이(외향)", character: "test_buddy3" },
  "이용은": { job: "조율자(협력)", character: "test_buddy4" },
  "현동건": { job: "설계자(신경)", character: "test_buddy5" },
  // 5조 HIGH five
  "라재흠": { job: "분석자(창의)", character: "test_buddy1" },
  "이정훈": { job: "개척자(성실)", character: "test_buddy2" },
  "이지원": { job: "길잡이(외향)", character: "test_buddy3" },
  "홍원준": { job: "조율자(협력)", character: "test_buddy4" },
  // 6조 허니
  "석민정": { job: "분석자(창의)", character: "test_buddy1" },
  "손채빈": { job: "개척자(성실)", character: "test_buddy2" },
  "안은기": { job: "길잡이(외향)", character: "test_buddy3" },
  "홍석준": { job: "조율자(협력)", character: "test_buddy4" },
  // 7조 마감직전 오캐스트라
  "민승기": { job: "분석자(창의)", character: "test_buddy1" },
  "하윤채": { job: "개척자(성실)", character: "test_buddy2" },
  "강민서": { job: "길잡이(외향)", character: "test_buddy3" },
  "최재석": { job: "조율자(협력)", character: "test_buddy4" },
  // 8조 일단틀어줘
  "김유찬": { job: "분석자(창의)", character: "test_buddy1" },
  "박승훈": { job: "개척자(성실)", character: "test_buddy2" },
  "박재현": { job: "길잡이(외향)", character: "test_buddy3" },
  "배지우": { job: "조율자(협력)", character: "test_buddy4" },
  // 9조 제작소
  "김담희": { job: "분석자(창의)", character: "test_buddy1" },
  "이기서": { job: "개척자(성실)", character: "test_buddy2" },
  "장윤서": { job: "길잡이(외향)", character: "test_buddy3" },
  "박민우": { job: "조율자(협력)", character: "test_buddy4" },
  "박지연": { job: "설계자(신경)", character: "test_buddy5" },
  // 10조 카트라이더
  "설진":   { job: "분석자(창의)", character: "test_buddy1" },
  "장원우": { job: "개척자(성실)", character: "test_buddy2" },
  "이지민": { job: "길잡이(외향)", character: "test_buddy3" },
  "이지훈": { job: "조율자(협력)", character: "test_buddy4" },
  "김태성": { job: "설계자(신경)", character: "test_buddy5" },
  // 11조 최예
  "김수현": { job: "분석자(창의)", character: "test_buddy1" },
  "이성주": { job: "개척자(성실)", character: "test_buddy2" },
  "최시현": { job: "길잡이(외향)", character: "test_buddy3" },
  "이승회": { job: "조율자(협력)", character: "test_buddy4" },
  "황유주": { job: "설계자(신경)", character: "test_buddy5" },
  // 테스트용
  "테스터": { job: "조율자", character: "test_buddy4" }
};

class LoginScene extends Phaser.Scene {
  constructor() { super({ key: 'LoginScene' }); }
  create() {
    const ui = document.getElementById('login-ui');
    const nameInput = document.getElementById('name-input');
    const groupInput = document.getElementById('group-input');
    const button = document.getElementById('login-button');
    ui.style.display = 'flex';
    button.replaceWith(button.cloneNode(true));
    const newButton = document.getElementById('login-button');

    newButton.addEventListener('click', async () => {
      const inputName = nameInput.value.trim();
      const inputGroup = groupInput.value.trim();
      if (!inputName || !inputGroup) return alert('이름과 모둠 번호를 입력하세요!');
      const playerInfo = PLAYER_DATA[inputName];
      if (!playerInfo) return alert('등록되지 않은 이름입니다!');

      const joinOptions = { ...playerInfo, group: inputGroup, realName: inputName };
      const client = new Client('wss://concept-game-server.onrender.com');

      try {
        const room = await client.joinOrCreate('my_room', joinOptions);
        ui.style.display = 'none';
        this.scene.start('GameScene', { room: room, myInfo: joinOptions });
      } catch (e) {
        alert('서버 접속 실패! 잠시 후 다시 시도하세요.');
      }
    });
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
    this.load.image('item', '/assets/item.png');

    this.load.image('test_buddy1', '/assets/test_buddy1.png');
    this.load.image('test_buddy2', '/assets/test_buddy2.png');
    this.load.image('test_buddy3', '/assets/test_buddy3.png');
    this.load.image('test_buddy4', '/assets/test_buddy4.png');
    this.load.image('test_buddy5', '/assets/test_buddy5.png');
  }

  create() {
    // 💡 1. 코드로 빛 마스크 텍스처 생성
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
      const wallLayer = map.createLayer('타일 레이어 2', tileset, 0, 0);
      if (wallLayer) wallLayer.setCollisionByProperty({ collides: true });
    }

    // 💡 2. Fog of War 안개 레이어 생성
    this.fog = this.make.renderTexture({
      width: map.widthInPixels || 800,
      height: map.heightInPixels || 600
    }, true);
    this.fog.fill(0x000000, 0.95); 
    this.fog.setDepth(80); 

    this.lightBrush = this.make.image({ key: 'light_mask' }, false);

    this.cameras.main.setBackgroundColor('#2c3e50');

    // 아이템 배치
    this.items = this.physics.add.group();
    const itemLayer = map.getObjectLayer('Items');
    if (itemLayer) {
      itemLayer.objects.forEach(obj => {
        const item = this.items.create(obj.x, obj.y, 'item');
        item.setOrigin(0, 1).setDepth(50);
      });
    } else {
      // Tiled 데이터가 없을 경우를 위한 임시 랜덤 배치
      for(let i=0; i<5; i++) {
        this.items.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'item').setDepth(50);
      }
    }

    this.scoreText = this.add.text(10, 40, `아이템 수집: 0 / 5`, { 
        font: '20px Arial', fill: '#ffff00', stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.room.onStateChange(() => this.syncPlayers());

    this.room.state.listen("itemsCollected", (current) => {
        this.scoreText.setText(`아이템 수집: ${current} / 5`);
    });

    this.room.onMessage("changeMap", (data) => {
        alert(data.message);
        this.scene.restart({ room: this.room, myInfo: this.myInfo });
    });
  }

  syncPlayers() {
    this.room.state.players.forEach((player, sessionId) => {
      if (!this.playerSprites[sessionId]) {
        const sprite = this.physics.add.image(player.x, player.y, player.character);
        sprite.setScale(0.8).setDepth(90); 
        this.playerSprites[sessionId] = sprite;

        const label = this.add.text(player.x, player.y - 45, player.job, { font: '14px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.playerSprites[sessionId].label = label;
        this.playerSprites[sessionId].label.setDepth(100);

        // 💡 길잡이(test_buddy3)는 시야 범위를 훨씬 넓게 설정
        this.playerSprites[sessionId].visionSize = (player.character === "test_buddy3") ? 450 : 200;

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
    if (!this.room) return;
    
    // 💡 3. 매 프레임 안개를 다시 칠하고 플레이어 위치 구멍 뚫기
    this.fog.clear();
    this.fog.fill(0x000000, 0.95);

    Object.keys(this.playerSprites).forEach(id => {
      const sprite = this.playerSprites[id];
      const vSize = sprite.visionSize || 200;
      this.lightBrush.setScale(vSize / 256);
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