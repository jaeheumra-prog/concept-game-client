import * as Phaser from 'phaser';
import { Client } from 'colyseus.js';

const PLAYER_DATA = {
  "라재흠": { job: "창의자", character: "slime_green" },
  "홍원준": { job: "길잡이", character: "slime_red" },
  "이정훈": { job: "설계자", character: "slime_purple" },
  "이지원": { job: "개척자", character: "slime_blue" },
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
      const inputGroup = groupInput.value.trim(); // 💡 입력한 모둠 번호

      if (!inputName || !inputGroup) {
        return alert('이름과 모둠 번호를 모두 입력해주세요!');
      }

      const playerInfo = PLAYER_DATA[inputName];
      if (!playerInfo) return alert('등록되지 않은 이름입니다!');

      // 💡 선택한 모둠 번호를 정보에 합침
      const joinOptions = { ...playerInfo, group: inputGroup };

      console.log(`${inputGroup}모둠 접속 시도...`);
      // 배포 전에는 localhost, 배포 후에는 서버 주소로 변경 예정
      const client = new Client('ws://127.0.0.1:2567');

      try {
        // 💡 joinOrCreate의 두 번째 인자로 group 정보를 넘깁니다.
        const room = await client.joinOrCreate('my_room', joinOptions);
        ui.style.display = 'none';
        this.scene.start('GameScene', { room: room, myInfo: joinOptions });
      } catch (e) {
        alert('서버 접속 실패! 서버가 켜져 있는지 확인하세요.');
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
  }
  create() {
    this.cameras.main.setBackgroundColor('#2c3e50');
    // 상단에 현재 모둠 표시
    this.add.text(10, 10, `[ ${this.myInfo.group}모둠 ] ${this.myInfo.job}: ${this.room.sessionId}`, { font: '18px Arial', fill: '#ffffff' });
    this.cursors = this.input.keyboard.createCursorKeys();

    const syncPlayers = () => {
      this.room.state.players.forEach((player, sessionId) => {
        if (!this.playerSprites[sessionId]) {
          let color = 0x00ff00;
          if (player.character.includes('red')) color = 0xff0000;
          if (player.character.includes('purple')) color = 0x800080;
          if (player.character.includes('blue')) color = 0x0000ff;
          if (player.character.includes('yellow')) color = 0xffff00;
          const rect = this.add.rectangle(player.x, player.y, 40, 40, color);
          this.playerSprites[sessionId] = rect;
        } else {
          this.playerSprites[sessionId].x = player.x;
          this.playerSprites[sessionId].y = player.y;
        }
      });
    };
    this.room.onStateChange(() => syncPlayers());
  }
  update() {
    if (!this.room) return;
    if (this.cursors.left.isDown) this.room.send("move", { dir: "left" });
    if (this.cursors.right.isDown) this.room.send("move", { dir: "right" });
    if (this.cursors.up.isDown) this.room.send("move", { dir: "up" });
    if (this.cursors.down.isDown) this.room.send("move", { dir: "down" });
  }
}

const config = { type: Phaser.AUTO, width: 800, height: 600, parent: 'game-container', scene: [LoginScene, GameScene] };
new Phaser.Game(config);