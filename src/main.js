import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

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
  "석민정": { job: "분석자(창의)", character: "test_buddy1" },
  "손채빈": { job: "개척자(성실)", character: "test_buddy2" },
  "안은기": { job: "길잡이(외향)", character: "test_buddy3" },
  "홍석준": { job: "조율자(협력)", character: "test_buddy4" },
  "민승기": { job: "분석자(창의)", character: "test_buddy1" },
  "하윤채": { job: "개척자(성실)", character: "test_buddy2" },
  "강민서": { job: "길잡이(외향)", character: "test_buddy3" },
  "최재석": { job: "조율자(협력)", character: "test_buddy4" },
  "김유찬": { job: "분석자(창의)", character: "test_buddy1" },
  "박승훈": { job: "개척자(성실)", character: "test_buddy2" },
  "박재현": { job: "길잡이(외향)", character: "test_buddy3" },
  "배지우": { job: "조율자(협력)", character: "test_buddy4" },
  "김담희": { job: "분석자(창의)", character: "test_buddy1" },
  "이기서": { job: "개척자(성실)", character: "test_buddy2" },
  "장윤서": { job: "길잡이(외향)", character: "test_buddy3" },
  "박민우": { job: "조율자(협력)", character: "test_buddy4" },
  "박지연": { job: "설계자(신경)", character: "test_buddy5" },
  "설진":   { job: "분석자(창의)", character: "test_buddy1" },
  "장원우": { job: "개척자(성실)", character: "test_buddy2" },
  "이지민": { job: "길잡이(외향)", character: "test_buddy3" },
  "이지민": { job: "조율자(협력)", character: "test_buddy4" },
  "김태성": { job: "설계자(신경)", character: "test_buddy5" },
  "김수현": { job: "분석자(창의)", character: "test_buddy1" },
  "이성주": { job: "개척자(성실)", character: "test_buddy2" },
  "최시현": { job: "길잡이(외향)", character: "test_buddy3" },
  "이승회": { job: "조율자(협력)", character: "test_buddy4" },
  "황유주": { job: "설계자(신경)", character: "test_buddy5" },
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
    console.log("🎮 로그인 성공! 내 캐릭터:", this.myInfo.character);
  }

  preload() {
    this.load.image('tiles', 'assets/test.1.png'); 
    this.load.tilemapTiledJSON('map', '/assets/my_map.json'); 

    // 💡 이미지 5개 로드
    this.load.image('test_buddy1', '/assets/test_buddy1.png');
    this.load.image('test_buddy2', '/assets/test_buddy2.png');
    this.load.image('test_buddy3', '/assets/test_buddy3.png');
    this.load.image('test_buddy4', '/assets/test_buddy4.png');
    this.load.image('test_buddy5', '/assets/test_buddy5.png');
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('test.1', 'tiles'); 
    if (tileset) {
      map.createLayer('바닥', tileset, 0, 0);
      const wallLayer = map.createLayer('타일 레이어 2', tileset, 0, 0);
      if (wallLayer) wallLayer.setCollisionByProperty({ collides: true });
    }
    this.cameras.main.setBackgroundColor('#2c3e50');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.room.onStateChange(() => this.syncPlayers());
  }

  syncPlayers() {
    this.room.state.players.forEach((player, sessionId) => {
      if (!this.playerSprites[sessionId]) {
        console.log(`👤 플레이어 생성 시도: ${player.character} (Session: ${sessionId})`);
        
        // 💡 만약 여기서도 네모가 뜬다면 코드 자체가 안 바뀐 것입니다.
        const sprite = this.add.image(player.x, player.y, player.character);
        sprite.setScale(0.8); 
        this.playerSprites[sessionId] = sprite;

        const label = this.add.text(player.x, player.y - 45, player.job, { font: '14px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.playerSprites[sessionId].label = label;
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