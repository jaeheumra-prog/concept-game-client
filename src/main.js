import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

// 📊 1조 ~ 11조 전체 팀원 성향 분석 결과 데이터
const PLAYER_DATA = {
  // 1조 only1
  "김민재": { job: "분석자(창의)", character: "slime_green" },
  "박채연": { job: "개척자(성실)", character: "slime_blue" },
  "손유정": { job: "길잡이(외향)", character: "slime_red" },
  "이승환": { job: "조율자(협력)", character: "slime_yellow" },
  "이연재": { job: "설계자(신경)", character: "slime_purple" },
  // 2조 plot twist
  "윤현근": { job: "분석자(창의)", character: "slime_green" },
  "심나이": { job: "개척자(성실)", character: "slime_blue" },
  "차시훈": { job: "길잡이(외향)", character: "slime_red" },
  "이율": { job: "조율자(협력)", character: "slime_yellow" },
  "남윤주": { job: "설계자(신경)", character: "slime_purple" },
  // 3조 세얼간이
  "안비비안": { job: "분석자(창의)", character: "slime_green" },
  "이택준": { job: "개척자(성실)", character: "slime_blue" },
  "송수현": { job: "길잡이(외향)", character: "slime_red" },
  "김찬영": { job: "조율자(협력)", character: "slime_yellow" },
  // 4조 일단해보조
  "김가윤": { job: "분석자(창의)", character: "slime_green" },
  "김수지": { job: "개척자(성실)", character: "slime_blue" },
  "김재현": { job: "길잡이(외향)", character: "slime_red" },
  "이용은": { job: "조율자(협력)", character: "slime_yellow" },
  "현동건": { job: "설계자(신경)", character: "slime_purple" },
  // 5조 HighFive
  "라재흠": { job: "분석자(창의)", character: "slime_green" },
  "이정훈": { job: "개척자(성실)", character: "slime_blue" },
  "이지원": { job: "길잡이(외향)", character: "slime_red" },
  "홍원준": { job: "조율자(협력)", character: "slime_yellow" },
  // 6조 허니
  "석민정": { job: "분석자(창의)", character: "slime_green" },
  "손채빈": { job: "개척자(성실)", character: "slime_blue" },
  "안은기": { job: "길잡이(외향)", character: "slime_red" },
  "홍석준": { job: "조율자(협력)", character: "slime_yellow" },
  // 7조 마감직전 오캐스트라
  "민승기": { job: "분석자(창의)", character: "slime_green" },
  "하윤채": { job: "개척자(성실)", character: "slime_blue" },
  "강민서": { job: "길잡이(외향)", character: "slime_red" },
  "최재석": { job: "조율자(협력)", character: "slime_yellow" },
  // 8조 일단틀어줘
  "김유찬": { job: "분석자(창의)", character: "slime_green" },
  "박승훈": { job: "개척자(성실)", character: "slime_blue" },
  "박재현": { job: "길잡이(외향)", character: "slime_red" },
  "배지우": { job: "조율자(협력)", character: "slime_yellow" },
  // 9조 제작소
  "김담희": { job: "분석자(창의)", character: "slime_green" },
  "이기서": { job: "개척자(성실)", character: "slime_blue" },
  "장윤서": { job: "길잡이(외향)", character: "slime_red" },
  "박민우": { job: "조율자(협력)", character: "slime_yellow" },
  "박지연": { job: "설계자(신경)", character: "slime_purple" },
  // 10조 카트라이더
  "설진": { job: "분석자(창의)", character: "slime_green" },
  "장원우": { job: "개척자(성실)", character: "slime_blue" },
  "이지민": { job: "길잡이(외향)", character: "slime_red" },
  "이지훈": { job: "조율자(협력)", character: "slime_yellow" },
  "김태성": { job: "설계자(신경)", character: "slime_purple" },
  // 11조 최예
  "김수현": { job: "분석자(창의)", character: "slime_green" },
  "이성주": { job: "개척자(성실)", character: "slime_blue" },
  "최시현": { job: "길잡이(외향)", character: "slime_red" },
  "이승회": { job: "조율자(협력)", character: "slime_yellow" },
  "황유주": { job: "설계자(신경)", character: "slime_purple" },
  // 테스터
  "테스터": { job: "조율자", character: "slime_yellow" }
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
      if (!inputName || !inputGroup) return alert('이름과 모둠 번호를 모두 입력해주세요!');
      const playerInfo = PLAYER_DATA[inputName];
      if (!playerInfo) return alert('등록되지 않은 이름입니다!');

      const joinOptions = { ...playerInfo, group: inputGroup };
      const client = new Client('wss://concept-game-server.onrender.com');

      try {
        const room = await client.joinOrCreate('my_room', joinOptions);
        ui.style.display = 'none';
        this.scene.start('GameScene', { room: room, myInfo: joinOptions, inputName: inputName });
      } catch (e) {
        alert('서버 접속 실패! 서버가 깨어날 때까지 1분 뒤 다시 시도하세요.');
      }
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }
  init(data) {
    this.room = data.room;
    this.myInfo = data.myInfo;
    this.userName = data.inputName;
    this.playerSprites = {};
  }

  preload() {
    // 💡 Tiled 파일 로드 (public/assets/ 폴더에 파일이 있어야 함)
    this.load.image('tiles', 'assets/test.1.png'); // 타일셋 이미지 파일명
    this.load.tilemapTiledJSON('map', 'assets/my_map.json'); // Tiled에서 저장한 JSON 파일명
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    
    // 💡 [중요] 'test.1' 부분은 Tiled에서 타일셋을 만들 때 정한 이름으로 바꿔야 합니다!
    const tileset = map.addTilesetImage('test.1', 'tiles'); 

    if (tileset) {
      // Tiled 레이어 이름: "바닥", "타일 레이어 2"
      map.createLayer('바닥', tileset, 0, 0);
      const wallLayer = map.createLayer('타일 레이어 2', tileset, 0, 0);
      
      // 충돌 설정 (Tiled에서 collides 속성을 준 경우)
      if (wallLayer) wallLayer.setCollisionByProperty({ collides: true });
    }

    this.cameras.main.setBackgroundColor('#2c3e50');
    this.add.text(10, 10, `[ ${this.myInfo.group}모둠 ] ${this.userName} (${this.myInfo.job})`, { font: '18px Arial', fill: '#ffffff' }).setScrollFactor(0);
    
    this.cursors = this.input.keyboard.createCursorKeys();
    this.room.onStateChange(() => this.syncPlayers());
  }

  syncPlayers() {
    this.room.state.players.forEach((player, sessionId) => {
      if (!this.playerSprites[sessionId]) {
        let color = 0x00ff00;
        if (player.character.includes('red')) color = 0xff0000;
        if (player.character.includes('purple')) color = 0x800080;
        if (player.character.includes('blue')) color = 0x0000ff;
        if (player.character.includes('yellow')) color = 0xffff00;
        
        const rect = this.add.rectangle(player.x, player.y, 32, 32, color);
        this.playerSprites[sessionId] = rect;
      } else {
        this.playerSprites[sessionId].x = player.x;
        this.playerSprites[sessionId].y = player.y;
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
  type: Phaser.AUTO,
  width: 800, height: 600,
  parent: 'game-container',
  scene: [LoginScene, GameScene],
  physics: { default: 'arcade', arcade: { debug: false } }
};
new Phaser.Game(config);