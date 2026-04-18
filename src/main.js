import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

// 📊 1조 ~ 11조 전체 팀원 데이터
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
    this.load.image('tiles', '/assets/test.1.png'); 
    this.load.tilemapTiledJSON('map', '/assets/7floor.tmj'); 
    this.load.image('item', '/assets/item.png');

    this.load.image('img1', '/assets/test.1.png');
    this.load.image('img2', '/assets/test.3.png');
    // 실제 파일 이름은 -005, -002 로 읽어옵니다.
    this.load.image('img3', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25-005.png');
    this.load.image('img4', '/assets/KakaoTalk_Photo_2026-04-17-13-18-25-002.png');
    
    for(let i=1; i<=5; i++) {
        this.load.image(`test_buddy${i}`, `/assets/test_buddy${i}.png`);
    }
  }

  create() {
    this.cameras.main.setBackgroundColor('#2c3e50');

    try {
        const map = this.make.tilemap({ key: 'map' });

        // 🚨 1번 수정사항: Tiled JSON 내부에 적힌 이름에는 '띄어쓰기'가 있으므로 띄어쓰기를 넣어야 합니다.
        const tiles1 = map.addTilesetImage('test.1', 'img1');
        const tiles2 = map.addTilesetImage('test.3', 'img2');
        const tiles3 = map.addTilesetImage('KakaoTalk_Photo_2026-04-17-13-18-25 005', 'img3');
        const tiles4 = map.addTilesetImage('KakaoTalk_Photo_2026-04-17-13-18-25 002', 'img4');

        const allTiles = [tiles1, tiles2, tiles3, tiles4].filter(t => t !== null);

        if (allTiles.length > 0) {
            // 🚨 2번 수정사항: 한글 이름 대신 번호(0, 1, 2, 3)를 사용합니다.
            // 최신 7층.js 레이어 구조 기준: 0(타일1), 1(타일5), 2(벽), 3(중간벽)
            map.createLayer(0, allTiles, 0, 0); 
            map.createLayer(1, allTiles, 0, 0); 
            const wallLayer = map.createLayer(2, allTiles, 0, 0); 
            map.createLayer(3, allTiles, 0, 0); 

            if (wallLayer) {
                wallLayer.setCollisionByProperty({ collides: true });
            }
        }
    } catch (e) {
        console.warn("맵을 불러오는 데 실패했습니다. 에셋 경로를 확인하세요.", e);
    }

    // 상단 UI: 접속 정보 및 조율자 전용 가이드
    let uiText = `[ ${this.myInfo.group}모둠 ] 접속 성공`;
    if (this.myInfo.character === "test_buddy4") uiText += " (Shift: 위치 바꾸기)";
    
    this.scoreText = this.add.text(10, 10, uiText, { 
        font: '20px Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    this.room.onStateChange(() => this.syncPlayers());
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

    if (this.cursors.left.isDown) this.room.send("move", { dir: "left" });
    else if (this.cursors.right.isDown) this.room.send("move", { dir: "right" });
    if (this.cursors.up.isDown) this.room.send("move", { dir: "up" });
    else if (this.cursors.down.isDown) this.room.send("move", { dir: "down" });

    if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
        if (this.myInfo.character === "test_buddy4") {
            this.room.send("useSkill");
        }
    }
  }
}

const config = {
  type: Phaser.AUTO, width: 800, height: 600,
  parent: 'game-container', scene: [LoginScene, GameScene],
  physics: { default: 'arcade', arcade: { debug: false } }
};
new Phaser.Game(config);