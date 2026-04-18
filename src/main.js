import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

// 📊 1조 ~ 11조 전체 팀원 데이터 (손실 없이 완벽 보존)
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
    ui.style.display = 'flex';
    document.getElementById('login-button').onclick = async () => {
      const inputName = nameInput.value.trim();
      const playerInfo = PLAYER_DATA[inputName];
      if (!playerInfo) return alert('등록되지 않은 이름입니다!');
      const client = new Client('wss://concept-game-server.onrender.com');
      try {
        const room = await client.joinOrCreate('my_room', { ...playerInfo, group: groupInput.value.trim(), realName: inputName });
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
    this.isChangeScene = false; 
  }

  preload() {
    // ⚠️ TODO: 에셋 404 에러 해결(GitHub 업로드) 후 활성화 필요
    this.load.image('tiles', '/assets/test.1.png'); 
    this.load.tilemapTiledJSON('map', '/assets/my_map.json'); 
    this.load.image('item', '/assets/item.png');
    for(let i=1; i<=5; i++) this.load.image(`test_buddy${i}`, `/assets/test_buddy${i}.png`);
  }

  create() {
    /* ---------------------------------------------------------
       💡 [메모] 시야(Fog of War) 및 맵 로드 일시 중단
       - 404 에러로 인해 화면이 검게 변하는 현상을 방지하기 위함
       - 밝은 배경에서 캐릭터 이동이 동기화되는지 우선 확인
       --------------------------------------------------------- */
    this.cameras.main.setBackgroundColor('#2c3e50');

    // 💡 TODO: 빛 텍스처 생성 로직 (나중에 활성화)
    /*
    if (!this.textures.exists('light_mask')) {
        const canvas = this.textures.createCanvas('light_mask', 256, 256);
        const ctx = canvas.context;
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        canvas.refresh();
    }
    */

    // 💡 TODO: 맵 레이어 생성 (나중에 활성화)
    /*
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('test.1', 'tiles'); 
    if (tileset) {
      map.createLayer('바닥', tileset, 0, 0);
      const wallLayer = map.createLayer('타일 레이어 2', tileset, 0, 0);
      if (wallLayer) wallLayer.setCollisionByProperty({ collides: true });
    }
    */

    // 💡 TODO: Fog of War 레이어 (나중에 활성화)
    /*
    this.fog = this.make.renderTexture({ width: 800, height: 600 }, true);
    this.fog.fill(0x000000, 0.95).setDepth(80);
    this.lightBrush = this.make.image({ key: 'light_mask' }, false);
    */

    // 상단 UI: 접속 정보 표시
    this.scoreText = this.add.text(10, 10, `[ ${this.myInfo.group}모둠 ] 접속 성공 - 이동 테스트 중`, { 
        font: '20px Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.room.onStateChange(() => this.syncPlayers());

    // 💡 TODO: 아이템 수집 및 맵 전환 메시지 리스너 (나중에 활성화)
    /*
    this.room.state.listen("itemsCollected", (current) => {
        this.scoreText.setText(`[ ${this.myInfo.group}모둠 ] 아이템: ${current} / 5`);
    });

    this.room.onMessage("changeMap", (data) => {
        if (this.isChangeScene) return;
        this.isChangeScene = true;
        alert(data.message);
        this.scene.restart({ room: this.room, myInfo: this.myInfo });
    });
    */
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

        if (sessionId === this.room.sessionId) {
          this.mySprite = sprite;
          // 💡 TODO: 아이템 충돌 감지 로직 (나중에 활성화)
          /*
          this.physics.add.overlap(this.mySprite, this.items, (me, item) => {
            item.destroy(); 
            this.room.send("collectItem"); 
          }, null, this);
          */
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
    
    // 💡 TODO: 매 프레임 시야 구멍 뚫기 로직 (나중에 활성화)
    /*
    if (this.fog) {
        this.fog.clear().fill(0x000000, 0.95);
        Object.keys(this.playerSprites).forEach(id => {
          const sprite = this.playerSprites[id];
          const vSize = (sprite.texture.key === "test_buddy3") ? 450 : 200;
          this.lightBrush.setScale(vSize / 256);
          this.fog.erase(this.lightBrush, sprite.x, sprite.y);
        });
    }
    */

    if (this.cursors.left.isDown) this.room.send("move", { dir: "left" });
    else if (this.cursors.right.isDown) this.room.send("move", { dir: "right" });
    if (this.cursors.up.isDown) this.room.send("move", { dir: "up" });
    else if (this.cursors.down.isDown) this.room.send("move", { dir: "down" });
  }
}

const config = {
  type: Phaser.AUTO, width: 800, height: 600,
  parent: 'game-container', scene: [LoginScene, GameScene],
  physics: { default: 'arcade', arcade: { debug: false } }
};
new Phaser.Game(config);