// LEGACY PROJECT COMMENTED OUT FOR NEW PROJECT START
// Original file: client\src\main.js
// import * as Phaser from 'phaser';
// import { Client } from 'colyseus.js';
// 
// const COLYSEUS_URL =
//   (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname))
//     ? 'ws://localhost:2567'
//     : 'wss://concept-game-server.onrender.com';
// 
// const ITEM_OBJECT_IMAGES = [
//   'itemObject01',
//   'itemObject02',
//   'itemObject03',
//   'itemObject04',
//   'itemObject05',
//   'itemObject06',
//   'itemObject07',
//   'itemObject08',
// ];
// 
// const ROLE_INFO = {
//   navigator: {
//     job: '길잡이',
//     fileRole: '길잡이',
//     color: 0x66e2ff,
//     vision: 330,
//     skill: '넓은 시야',
//     help: '항상 넓은 횃불 시야로 숨은 길을 확인합니다.',
//   },
//   analyst: {
//     job: '분석가',
//     fileRole: '분석자',
//     color: 0xffd166,
//     vision: 160,
//     skill: '힌트 해석',
//     help: 'Space: 퍼즐 힌트를 팀 전체에 공유합니다.',
//   },
//   supporter: {
//     job: '개척자',
//     fileRole: '개척자',
//     color: 0xff6b6b,
//     vision: 155,
//     skill: '장애물 돌파',
//     help: 'Space: 잠깐 이동 속도가 증가합니다.',
//   },
//   specialist: {
//     job: '조율자',
//     fileRole: '조율자',
//     color: 0xa78bfa,
//     vision: 155,
//     skill: '위치 조율',
//     help: 'Space: 가까운 팀원과 위치 교환, Shift: 팀원 지정 이동.',
//   },
//   optimist: {
//     job: '설계자',
//     fileRole: '설계자',
//     color: 0x7dff9a,
//     vision: 155,
//     skill: '구조 설계',
//     help: '끊어진 길, 급류, 사다리 구간을 복구합니다.',
//   },
// };
// 
// const GROUPS = {
//   1: { name: 'only1', members: { '김민재': 'analyst', '박채연': 'supporter', '손유정': 'navigator', '이승환': 'specialist', '이연재': 'optimist' } },
//   2: { name: 'plot twist', members: { '남윤주': 'optimist', '심나이': 'supporter', '윤현근': 'analyst', '이율': 'specialist', '하동환': 'navigator' } },
//   3: { name: '세얼간이', members: { '김찬영': 'specialist', '송수현': 'navigator', '안비비안': 'analyst', '이택준': 'supporter' } },
//   4: { name: '일단해보조', members: { '김가윤': 'analyst', '김수지': 'supporter', '김재현': 'navigator', '이용은': 'specialist', '현동건': 'optimist' } },
//   5: { name: 'HighFive', members: { '라재흠': 'analyst', '이정훈': 'supporter', '이지원': 'navigator', '홍원준': 'specialist' } },
//   6: { name: '허니', members: { '석민정': 'analyst', '손채빈': 'supporter', '안은기': 'navigator', '홍석준': 'specialist' } },
//   7: { name: '마감직전 오캐스트라', members: { '강민서': 'navigator', '민승기': 'analyst', '최재석': 'specialist', '하윤채': 'supporter', '최동혁': 'optimist' } },
//   8: { name: '일단틀어줘', members: { '김유찬': 'analyst', '박승훈': 'supporter', '박재현': 'navigator', '배지우': 'specialist' } },
//   9: { name: '제작소', members: { '김담희': 'analyst', '박민우': 'specialist', '박지연': 'optimist', '이기서': 'supporter', '장윤서': 'navigator' } },
//   10: { name: '카트라이더', members: { '김태성': 'optimist', '설진': 'analyst', '이지민': 'navigator', '이지훈': 'specialist', '장원우': 'supporter' } },
//   11: { name: '최예', members: { '김수현': 'analyst', '이성주': 'supporter', '이승회': 'specialist', '최시현': 'navigator', '황유주': 'optimist' } },
// };
// 
// const PLAYER_DATA = buildPlayerData();
// PLAYER_DATA[999] = {
//   tester: {
//     job: '조율자',
//     roleKey: 'specialist',
//     character: 'test_buddy4',
//     vision: ROLE_INFO.specialist.vision,
//     realName: 'tester',
//   },
// };
// 
// const ROOMS = [
//   { id: 'r1_bridge', floor: '7F', no: 1, title: '끊어진 다리', type: 'bridge', roles: ['optimist'], roleLabel: '설계자', itemName: '!', x: 115, y: 155, description: '설계자가 다리를 놓아야 아이템 획득' },
//   { id: 'r2_puzzle', floor: '7F', no: 2, title: '분석 퍼즐', type: 'puzzle', roles: ['analyst'], roleLabel: '분석가', itemName: '감자 고추 말차 딸기 케이크', x: 315, y: 155, description: '분석가가 힌트를 읽고 퍼즐 해제' },
//   { id: 'r3_wall', floor: '7F', no: 3, title: '봉쇄 벽', type: 'wall', roles: ['supporter'], roleLabel: '개척자', itemName: '바퀴', x: 515, y: 155, description: '개척자가 벽을 부수고 통로 개방' },
//   { id: 'r4_maze', floor: '7F', no: 4, title: '어둠 미로', type: 'torch', roles: ['supporter'], roleLabel: '개척자', itemName: '미생물', x: 715, y: 155, description: '횃불을 밝혀 미로 돌파' },
//   { id: 'r5_safe', floor: '7F', no: 5, title: '분리 금고', type: 'safe', roles: ['specialist'], roleLabel: '조율자', itemName: '조이스틱', x: 915, y: 155, plates: [{ x: 875, y: 115 }, { x: 955, y: 195 }], description: '두 방의 발판을 맞춘 뒤 금고 개방' },
//   { id: 'r6_quiz', floor: '7F', no: 6, title: '넌센스 퀴즈', type: 'puzzle', roles: ['analyst'], roleLabel: '분석가', itemName: '찰흙', x: 115, y: 435, description: '힌트 조합으로 답을 찾아 해제' },
//   { id: 'r7_debris', floor: '7F', no: 7, title: '낙하 잔해', type: 'wall', roles: ['supporter'], roleLabel: '개척자', itemName: '레이싱카', x: 315, y: 435, description: '떨어진 구조물을 파괴' },
//   { id: 'r8_engine', floor: '6F', no: 8, title: '동력 장치', type: 'puzzle', roles: ['analyst'], roleLabel: '분석가', itemName: '향수', x: 515, y: 435, description: '과부하 장치의 퍼즐을 해제' },
//   { id: 'r9_glass', floor: '6F', no: 9, title: '유리 다리', type: 'glass', roles: ['navigator'], roleLabel: '길잡이', itemName: 'vlog', x: 715, y: 435, description: '길잡이가 안전 발판을 밝혀 이동' },
//   { id: 'r10_sensor', floor: '6F', no: 10, title: '중량 센서', type: 'sensor', roles: ['specialist'], roleLabel: '조율자', itemName: '찢어진 종이 조각', x: 915, y: 435, plates: [{ x: 875, y: 395 }, { x: 955, y: 475 }], description: '두 발판을 동시에 눌러 문 개방' },
//   { id: 'r11_buried', floor: '6F', no: 11, title: '매몰 금고', type: 'buried', roles: ['supporter', 'analyst'], roleLabel: '개척자 또는 분석가', itemName: '거울', x: 115, y: 715, description: '암석 파괴 후 금고 해제' },
//   { id: 'r12_waterway', floor: '6F', no: 12, title: '급류 수로', type: 'waterway', roles: ['optimist'], roleLabel: '설계자', itemName: '음표', x: 315, y: 715, description: '차단벽을 설계해 물길 우회' },
//   { id: 'r13_belt', floor: '6F', no: 13, title: '컨베이어 벨트', type: 'belt', roles: ['specialist'], roleLabel: '조율자', itemName: '시계', x: 515, y: 715, description: '팀원을 안전 구역으로 이동' },
//   { id: 'r14_ladder', floor: '6F', no: 14, title: '부서진 사다리', type: 'ladder', roles: ['optimist'], roleLabel: '설계자', itemName: '곰', x: 715, y: 715, description: '수직 통로를 수리' },
//   { id: 'r15_laser', floor: '6F', no: 15, title: '레이저 복도', type: 'laser', roles: ['analyst'], roleLabel: '분석가', itemName: 'dance', x: 915, y: 715, description: '레이저 패턴 퍼즐 정지' },
// ];
// 
// const ROOM_BY_ID = Object.fromEntries(ROOMS.map((room) => [room.id, room]));
// 
// function buildPlayerData() {
//   const data = {};
//   Object.entries(GROUPS).forEach(([groupNumber, group]) => {
//     data[groupNumber] = {};
//     Object.entries(group.members).forEach(([realName, roleKey]) => {
//       const role = ROLE_INFO[roleKey];
//       data[groupNumber][realName] = {
//         job: role.job,
//         roleKey,
//         character: `${groupNumber}조 ${group.name}_${realName}_${role.fileRole}.png`,
//         vision: role.vision,
//         realName,
//       };
//     });
//   });
//   return data;
// }
// 
// class LoginScene extends Phaser.Scene {
//   constructor() {
//     super({ key: 'LoginScene' });
//   }
// 
//   create() {
//     const ui = document.getElementById('login-ui');
//     const nameInput = document.getElementById('name-input');
//     const groupInput = document.getElementById('group-input');
//     const jobDisplay = document.getElementById('job-display');
//     ui.style.display = 'flex';
//     nameInput.placeholder = '이름을 입력하세요';
//     groupInput.placeholder = '조 번호를 입력하세요';
//     jobDisplay.textContent = '직업: 이름과 조를 입력하면 표시됩니다';
//     document.querySelector('#login-ui h1').textContent = 'Concept Room: 어둠의 연구동';
//     document.getElementById('login-button').textContent = '게임 접속';
// 
//     const updateJobDisplay = () => {
//       const inputName = nameInput.value.trim();
//       const groupValue = groupInput.value.trim();
//       const info = PLAYER_DATA[groupValue]?.[inputName];
// 
//       if (!inputName || !groupValue) {
//         jobDisplay.textContent = '직업: 이름과 조를 입력하면 표시됩니다';
//         jobDisplay.style.color = '#ffeb3b';
//       } else if (info) {
//         jobDisplay.textContent = `직업: ${info.job} (${ROLE_INFO[info.roleKey].skill})`;
//         jobDisplay.style.color = '#7dff9a';
//       } else {
//         jobDisplay.textContent = '등록된 조/이름을 찾지 못했습니다';
//         jobDisplay.style.color = '#ff6666';
//       }
//     };
// 
//     nameInput.addEventListener('input', updateJobDisplay);
//     groupInput.addEventListener('input', updateJobDisplay);
// 
//     document.getElementById('login-button').onclick = async () => {
//       const inputName = nameInput.value.trim();
//       const groupValue = groupInput.value.trim();
//       const playerInfo = PLAYER_DATA[groupValue]?.[inputName];
//       if (!playerInfo) {
//         alert('등록된 조/이름을 확인해주세요. 테스트는 조 999, 이름 tester를 사용할 수 있습니다.');
//         return;
//       }
// 
//       const client = new Client(COLYSEUS_URL);
//       try {
//         const room = await client.joinOrCreate('my_room', {
//           ...playerInfo,
//           group: groupValue,
//           realName: inputName,
//         });
//         ui.style.display = 'none';
//         this.scene.start('GameScene', { room, myInfo: { ...playerInfo, group: groupValue } });
//       } catch (e) {
//         alert(`서버 접속 실패: ${e.message}`);
//       }
//     };
//   }
// }
// 
// class GameScene extends Phaser.Scene {
//   constructor() {
//     super({ key: 'GameScene' });
//   }
// 
//   init(data) {
//     this.room = data.room;
//     this.myInfo = data.myInfo;
//     this.playerSprites = {};
//     this.mySprite = null;
//     this.wallLayers = [];
//     this.roomMarkers = {};
//     this.clearedRooms = new Set();
//     this.openDoors = new Set();
//     this.objectItemSprites = [];
//     this.coordSkillMode = 'idle';
//     this.coordSkillTargetId = null;
//     this._coordPointerHandler = null;
//     this.coordOverlayRoot = null;
//     this.hintText = null;
//     this.attackPower = 1;
//     this.attackSpeedBuff = 1;
//     this.moveBuff = 1;
//     this.nextAttackAt = 0;
//   }
// 
//   preload() {
//     this.cameras.main.setBackgroundColor('#141824');
//     this.load.tilemapTiledJSON('map', '/assets/1floor-new.tmj');
//     this.load.image('item', '/assets/item.png');
//     this.load.image('Wall', '/assets/test.3.png');
//     this.load.image('Floor2', '/assets/Floor2.png');
//     this.load.image('7flo0r', '/assets/7flo0r.png');
//     this.load.image('6floor101', '/assets/6floor101.png');
//     this.load.image('6floor', '/assets/6floor.png');
//     this.load.image('img1', '/assets/test.1.png');
//     this.load.image('img2', '/assets/test.3.png');
//     this.load.image('test_buddy1', '/assets/test_buddy1.png');
//     this.load.image('test_buddy2', '/assets/test_buddy2.png');
//     this.load.image('test_buddy3', '/assets/test_buddy3.png');
//     this.load.image('test_buddy4', '/assets/test_buddy4.png');
//     this.load.image('test_buddy5', '/assets/test_buddy5.png');
// 
//     this.load.image('pixelDungeonTiles', '/assets/game/pixel_dungeon_tileset.png');
//     this.load.image('techTiles', '/assets/game/tech_tileset.png');
//     this.load.image('structure', '/assets/game/structure.png');
//     this.load.image('waterTile', '/assets/game/water.png');
//     this.load.image('buttonPlate', '/assets/game/button.png');
//     this.load.image('uiFrame', '/assets/game/ui_frame.png');
//     this.load.image('uiBar', '/assets/game/ui_bar.png');
//     this.load.image('uiBarFill', '/assets/game/ui_bar_fill.png');
//     ITEM_OBJECT_IMAGES.forEach((key, index) => {
//       this.load.image(key, `/assets/items/item_${String(index + 1).padStart(2, '0')}.png`);
//     });
//     this.load.spritesheet('torchYellow', '/assets/game/torch_yellow.png', { frameWidth: 16, frameHeight: 16 });
//     this.load.spritesheet('potionItems', '/assets/game/potions.png', { frameWidth: 16, frameHeight: 16 });
//     this.load.spritesheet('bossIdle', '/assets/game/boss_vampire_idle.png', { frameWidth: 32, frameHeight: 32 });
//     this.load.spritesheet('bossAttack', '/assets/game/boss_vampire_attack.png', { frameWidth: 32, frameHeight: 32 });
//     this.load.spritesheet('bossHurt', '/assets/game/boss_vampire_hurt.png', { frameWidth: 32, frameHeight: 32 });
//     this.load.spritesheet('bossDeath', '/assets/game/boss_vampire_death.png', { frameWidth: 32, frameHeight: 32 });
// 
//     Object.values(PLAYER_DATA).forEach((members) => {
//       Object.values(members).forEach((info) => {
//         if (info.character.endsWith('.png')) {
//           this.load.image(info.character, `/assets/${info.character}`);
//         }
//       });
//     });
//   }
// 
//   create() {
//     this.createAnimations();
//     this.createMapLayers();
//     this.createDungeonRooms();
//     this.createBoss();
//     this.createHud();
//     this.createFog();
// 
//     this.cursors = this.input.keyboard.createCursorKeys();
//     this.wasd = this.input.keyboard.addKeys('W,A,S,D');
//     this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
//     this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
//     this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
//     this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
//     this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
//     this.numKeys = [
//       this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
//       this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
//       this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
//       this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
//       this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
//     ];
// 
//     this.room.onMessage('showHint', (data) => this.displayHint(data.message));
//     this.room.onMessage('serverMessage', (message) => this.displayHint(message));
//     this.room.onMessage('roomCleared', (data) => {
//       this.clearedRooms.add(data.roomId);
//       this.displayHint(`${data.by} 획득: [${data.itemName}] (${data.total}/15)`);
//       this.refreshRoomVisuals();
//     });
//     this.room.onMessage('skillUsed', (data) => this.displayHint(`${data.name}: ${data.skill}`));
//     this.room.onMessage('applyBuff', (data) => this.applyBuff(data));
//     this.room.onMessage('bossHit', (data) => {
//       this.cameras.main.shake(100, 0.006);
//       this.displayFloatingText(this.bossSprite.x, this.bossSprite.y - 45, `-${data.damage}`, '#ff6666');
//       this.bossSprite.play('boss-hurt', true);
//     });
//     this.room.onMessage('gameEnded', (data) => {
//       this.displayHint(data.message || '게임 클리어!');
//       this.bossSprite.play('boss-death', true);
//       this.cameras.main.flash(900, 255, 245, 180);
//     });
// 
//     this.room.onStateChange(() => {
//       this.syncPlayers();
//       this.syncClearedRooms();
//       this.updateHud();
//       this.updateBossVisual();
//     });
// 
//     this.syncPlayers();
//     this.syncClearedRooms();
//     this.refreshRoomVisuals();
//     this.updateHud();
// 
//     this.events.once('shutdown', () => {
//       this.closeCoordinatorSkillFlow();
//       if (this.coordOverlayRoot?.parentNode) this.coordOverlayRoot.parentNode.removeChild(this.coordOverlayRoot);
//       this.coordOverlayRoot = null;
//     });
// 
//     this.displayHint(`${this.myInfo.job} 역할로 접속했습니다. E: 방 해결, Space: 직업 스킬, F: 보스 공격, 1~5: 아이템`);
//   }
// 
//   createAnimations() {
//     if (!this.anims.exists('torch-burn')) {
//       this.anims.create({ key: 'torch-burn', frames: this.anims.generateFrameNumbers('torchYellow', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
//       this.anims.create({ key: 'boss-idle', frames: this.anims.generateFrameNumbers('bossIdle', { start: 0, end: 5 }), frameRate: 6, repeat: -1 });
//       this.anims.create({ key: 'boss-attack', frames: this.anims.generateFrameNumbers('bossAttack', { start: 0, end: 15 }), frameRate: 14, repeat: 0 });
//       this.anims.create({ key: 'boss-hurt', frames: this.anims.generateFrameNumbers('bossHurt', { start: 0, end: 2 }), frameRate: 10, repeat: 0 });
//       this.anims.create({ key: 'boss-death', frames: this.anims.generateFrameNumbers('bossDeath', { start: 0, end: 6 }), frameRate: 8, repeat: 0 });
//     }
//   }
// 
//   createMapLayers() {
//     try {
//       const map = this.make.tilemap({ key: 'map' });
//       this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
//       this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
// 
//       const allTiles = [
//         map.addTilesetImage('Wall', 'Wall'),
//         map.addTilesetImage('Floor2', 'Floor2'),
//         map.addTilesetImage('7flo0r', '7flo0r'),
//         map.addTilesetImage('6floor101', '6floor101'),
//         map.addTilesetImage('6floor', '6floor'),
//         map.addTilesetImage('6floor-extra', '6floor'),
//         map.addTilesetImage('test.1', 'img1'),
//         map.addTilesetImage('test.3', 'img2'),
//       ].filter(Boolean);
// 
//       map.layers.forEach((layer) => {
//         const createdLayer = map.createLayer(layer.name, allTiles, 0, 0);
//         const isWall = layer.name.toLowerCase().includes('wall') || layer.name.toLowerCase() === 'objective';
//         if (createdLayer && isWall) {
//           createdLayer.setCollisionByExclusion([-1]);
//           this.wallLayers.push(createdLayer);
//         }
//       });
// 
//       const rawMap = this.cache.tilemap.get('map')?.data;
//       if (rawMap) this.createObjectLayerItems(rawMap);
//     } catch (error) {
//       console.warn('맵 로드 실패, 수동 방 배치만 표시합니다.', error);
//       this.cameras.main.setBounds(0, 0, 1020, 1020);
//       this.physics.world.setBounds(0, 0, 1020, 1020);
//     }
//   }
// 
//   createObjectLayerItems(rawMap) {
//     let itemIndex = 0;
//     rawMap.layers
//       .filter((layer) => layer.type === 'objectgroup' && layer.name.toLowerCase().includes('item'))
//       .forEach((layer) => {
//         layer.objects.forEach((object) => {
//           const textureKey = ITEM_OBJECT_IMAGES[itemIndex % ITEM_OBJECT_IMAGES.length];
//           const width = object.width || 36;
//           const height = object.height || 36;
//           const sprite = this.add.image(object.x + width / 2, object.y + height / 2, textureKey)
//             .setDisplaySize(Math.max(32, width), Math.max(32, height))
//             .setDepth(62)
//             .setName(object.name || layer.name);
//           sprite.setData('sourceLayer', layer.name);
//           sprite.setData('objectId', object.id);
//           this.objectItemSprites.push(sprite);
//           itemIndex += 1;
//         });
//       });
//   }
// 
//   createDungeonRooms() {
//     const bg = this.add.tileSprite(510, 510, 1020, 1020, 'pixelDungeonTiles').setAlpha(0.08).setDepth(-10);
//     bg.setScrollFactor(1);
// 
//     ROOMS.forEach((room) => {
//       const role = ROLE_INFO[room.roles[0]] || ROLE_INFO.analyst;
//       const card = this.add.rectangle(room.x, room.y, 154, 104, 0x101827, 0.86)
//         .setStrokeStyle(2, role.color, 0.75)
//         .setDepth(20);
//       const title = this.add.text(room.x, room.y - 40, `${room.floor} 방${room.no}`, {
//         font: '12px Arial',
//         color: '#e5eefc',
//         stroke: '#000',
//         strokeThickness: 3,
//       }).setOrigin(0.5).setDepth(25);
//       const desc = this.add.text(room.x, room.y - 21, room.title, {
//         font: '13px Arial',
//         color: '#ffffff',
//         stroke: '#000',
//         strokeThickness: 3,
//       }).setOrigin(0.5).setDepth(25);
//       const roleText = this.add.text(room.x, room.y + 35, room.roleLabel, {
//         font: '11px Arial',
//         color: '#a7f3d0',
//         stroke: '#000',
//         strokeThickness: 3,
//       }).setOrigin(0.5).setDepth(25);
// 
//       const icon = this.createRoomIcon(room);
//       const item = this.add.sprite(room.x + 54, room.y + 22, 'potionItems', room.no % 6)
//         .setScale(1.35)
//         .setDepth(26);
// 
//       const plates = [];
//       (room.plates || []).forEach((plate) => {
//         plates.push(this.add.image(plate.x, plate.y, 'buttonPlate').setScale(1.8).setDepth(22).setTint(0x7dff9a));
//       });
// 
//       const door = this.add.rectangle(room.x, room.y, 56, 76, 0x2b1d14, 0.96)
//         .setStrokeStyle(3, 0xfbbf24, 0.9)
//         .setDepth(32);
//       const doorLabel = this.add.text(room.x, room.y, `문 ${room.no}`, {
//         font: '13px Arial',
//         color: '#fff7ad',
//         stroke: '#000',
//         strokeThickness: 3,
//       }).setOrigin(0.5).setDepth(33);
// 
//       this.roomMarkers[room.id] = {
//         card,
//         title,
//         desc,
//         roleText,
//         icon,
//         item,
//         plates,
//         door,
//         doorLabel,
//         roomObjects: [card, title, desc, roleText, icon, item, ...plates],
//       };
//       this.setRoomDoorState(room.id, false);
//     });
//   }
// 
//   createRoomIcon(room) {
//     if (room.type === 'torch' || room.type === 'glass') {
//       return this.add.sprite(room.x - 52, room.y + 18, 'torchYellow').setScale(1.6).setDepth(26).play('torch-burn');
//     }
//     if (room.type === 'waterway') {
//       return this.add.image(room.x - 50, room.y + 18, 'waterTile').setScale(1.1).setDepth(26).setTint(0x66e2ff);
//     }
//     if (room.type === 'safe' || room.type === 'sensor') {
//       return this.add.image(room.x - 50, room.y + 18, 'buttonPlate').setScale(2).setDepth(26);
//     }
//     return this.add.image(room.x - 50, room.y + 18, 'structure').setScale(1.65).setDepth(26);
//   }
// 
//   setRoomDoorState(roomId, open) {
//     const marker = this.roomMarkers[roomId];
//     if (!marker) return;
//     const cleared = this.clearedRooms.has(roomId);
//     marker.roomObjects.forEach((object) => {
//       const isRewardItem = object === marker.item;
//       object.setVisible((open || cleared) && (!isRewardItem || !cleared));
//     });
//     marker.door.setVisible(!open && !cleared);
//     marker.doorLabel.setVisible(!open && !cleared);
//   }
// 
//   openRoomDoor(room) {
//     if (this.openDoors.has(room.id)) return;
//     this.openDoors.add(room.id);
//     this.setRoomDoorState(room.id, true);
//     this.tweens.add({
//       targets: [this.roomMarkers[room.id].door, this.roomMarkers[room.id].doorLabel],
//       alpha: 0,
//       duration: 180,
//     });
//     this.displayHint(`${room.title} 문이 열렸습니다. 안쪽 장치에 가까이 가서 E로 방을 해결하세요.`);
//   }
// 
//   createBoss() {
//     this.bossSprite = this.physics.add.sprite(900, 900, 'bossIdle')
//       .setScale(3)
//       .setDepth(80)
//       .play('boss-idle');
//     this.bossName = this.add.text(900, 830, '최종 보스: 하동환 교수', {
//       font: '18px Arial',
//       color: '#ffdddd',
//       stroke: '#000',
//       strokeThickness: 4,
//     }).setOrigin(0.5).setDepth(90);
//   }
// 
//   createHud() {
//     this.hudBg = this.add.rectangle(400, 34, 770, 58, 0x08111f, 0.82)
//       .setScrollFactor(0)
//       .setDepth(200)
//       .setStrokeStyle(2, 0x84cc16, 0.35);
//     this.statusText = this.add.text(18, 12, '', {
//       font: '15px Arial',
//       color: '#ffffff',
//       stroke: '#000',
//       strokeThickness: 3,
//     }).setScrollFactor(0).setDepth(201);
//     this.inventoryText = this.add.text(18, 563, '', {
//       font: '15px Arial',
//       color: '#e8f9ff',
//       backgroundColor: '#07111fcc',
//       padding: { x: 10, y: 6 },
//     }).setScrollFactor(0).setDepth(201);
//     this.bossBar = this.add.graphics().setScrollFactor(0).setDepth(201);
//     this.nearText = this.add.text(400, 520, '', {
//       font: '15px Arial',
//       color: '#ffffff',
//       backgroundColor: '#000000aa',
//       padding: { x: 10, y: 6 },
//     }).setOrigin(0.5).setScrollFactor(0).setDepth(202);
//   }
// 
//   createFog() {
//     const width = this.cameras.main.width;
//     const height = this.cameras.main.height;
//     this.fogCanvas = this.textures.createCanvas('fogTex', width, height);
//     this.fogImage = this.add.image(0, 0, 'fogTex')
//       .setOrigin(0, 0)
//       .setDepth(120)
//       .setScrollFactor(0);
//   }
// 
//   syncPlayers() {
//     const aliveIds = new Set();
//     this.room.state.players.forEach((player, sessionId) => {
//       aliveIds.add(sessionId);
//       if (!this.playerSprites[sessionId]) {
//         const texture = this.textures.exists(player.character) ? player.character : 'test_buddy1';
//         const sprite = this.physics.add.image(player.x, player.y, texture);
//         sprite.setScale(texture.endsWith('.png') ? 0.32 : 0.45).setDepth(75);
//         sprite.setCircle(Math.max(12, sprite.width * 0.25), sprite.width * 0.25, sprite.height * 0.25);
//         this.wallLayers.forEach((wallLayer) => this.physics.add.collider(sprite, wallLayer));
// 
//         const label = this.add.text(player.x, player.y - 24, player.realName || player.job, {
//           font: '10px Arial',
//           color: '#ffffff',
//           stroke: '#000',
//           strokeThickness: 3,
//         }).setOrigin(0.5).setDepth(95);
// 
//         this.playerSprites[sessionId] = { sprite, label };
//         if (sessionId === this.room.sessionId) {
//           this.mySprite = sprite;
//           this.cameras.main.startFollow(this.mySprite, true, 0.12, 0.12);
//           this.mySprite.setCollideWorldBounds(true);
//         }
//       } else {
//         const entry = this.playerSprites[sessionId];
//         if (sessionId !== this.room.sessionId) {
//           entry.sprite.x = player.x;
//           entry.sprite.y = player.y;
//         }
//         entry.label.x = player.x;
//         entry.label.y = player.y - 24;
//       }
//     });
// 
//     Object.entries(this.playerSprites).forEach(([sessionId, entry]) => {
//       if (aliveIds.has(sessionId)) return;
//       entry.sprite.destroy();
//       entry.label.destroy();
//       delete this.playerSprites[sessionId];
//     });
//   }
// 
//   syncClearedRooms() {
//     this.room.state.mapStatus.forEach((status, roomId) => {
//       if (status === 'cleared') this.clearedRooms.add(roomId);
//     });
//     this.refreshRoomVisuals();
//   }
// 
//   refreshRoomVisuals() {
//     Object.entries(this.roomMarkers).forEach(([roomId, marker]) => {
//       const cleared = this.clearedRooms.has(roomId);
//       marker.card.setFillStyle(cleared ? 0x11351f : 0x101827, cleared ? 0.9 : 0.86);
//       marker.card.setStrokeStyle(2, cleared ? 0x86efac : 0x64748b, cleared ? 0.95 : 0.55);
//       marker.item.setVisible(!cleared);
//       marker.desc.setColor(cleared ? '#86efac' : '#ffffff');
//       marker.roleText.setText(cleared ? '해결 완료' : ROOM_BY_ID[roomId].roleLabel);
//       marker.plates.forEach((plate) => plate.setTint(cleared ? 0x86efac : 0x7dff9a).setAlpha(cleared ? 0.45 : 1));
//       this.setRoomDoorState(roomId, this.openDoors.has(roomId));
//     });
//   }
// 
//   update() {
//     if (!this.room || !this.mySprite) return;
//     this.updateFog();
//     this.handleKeys();
//     this.handleMovement();
//     this.updateNearRoomPrompt();
//   }
// 
//   updateFog() {
//     if (!this.fogCanvas || !this.mySprite) return;
//     const ctx = this.fogCanvas.context;
//     const width = this.fogCanvas.width;
//     const height = this.fogCanvas.height;
//     const player = this.room.state.players.get(this.room.sessionId);
//     const vision = player?.vision || this.myInfo.vision || 155;
//     const screenX = this.mySprite.x - this.cameras.main.scrollX;
//     const screenY = this.mySprite.y - this.cameras.main.scrollY;
// 
//     ctx.clearRect(0, 0, width, height);
//     ctx.fillStyle = 'rgba(0,0,0,0.90)';
//     ctx.fillRect(0, 0, width, height);
//     ctx.globalCompositeOperation = 'destination-out';
//     ctx.beginPath();
//     ctx.arc(screenX, screenY, vision, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.globalCompositeOperation = 'source-over';
//     this.fogCanvas.refresh();
//   }
// 
//   handleKeys() {
//     if (Phaser.Input.Keyboard.JustDown(this.escKey) && this.coordSkillMode !== 'idle') {
//       this.closeCoordinatorSkillFlow();
//     }
//     if (Phaser.Input.Keyboard.JustDown(this.interactKey)) this.tryResolveNearestRoom();
//     if (Phaser.Input.Keyboard.JustDown(this.attackKey)) this.tryAttackBoss();
// 
//     if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
//       if (this.myInfo.roleKey === 'specialist') {
//         this.room.send('useSkill');
//       } else if (this.myInfo.roleKey === 'analyst') {
//         this.room.send('useAnalystSkill');
//       } else if (this.myInfo.roleKey === 'supporter') {
//         this.moveBuff = 1.7;
//         this.room.send('useExplorerSkill');
//         this.time.delayedCall(3000, () => { this.moveBuff = 1; });
//       } else {
//         this.displayHint(ROLE_INFO[this.myInfo.roleKey].help);
//       }
//     }
// 
//     if (Phaser.Input.Keyboard.JustDown(this.shiftKey) && this.myInfo.roleKey === 'specialist') {
//       if (this.coordSkillMode !== 'idle') this.closeCoordinatorSkillFlow();
//       else this.openCoordinatorSkillFlow();
//     }
// 
//     this.numKeys.forEach((key, index) => {
//       if (Phaser.Input.Keyboard.JustDown(key)) this.room.send('useItem', { itemIndex: index });
//     });
//   }
// 
//   handleMovement() {
//     if (this.coordSkillMode !== 'idle') {
//       this.mySprite.setVelocity(0, 0);
//       return;
//     }
// 
//     let vx = 0;
//     let vy = 0;
//     const speed = 230 * this.moveBuff;
//     if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -speed;
//     else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = speed;
//     if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -speed;
//     else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = speed;
// 
//     this.mySprite.setVelocity(vx, vy);
//     if (vx !== 0 || vy !== 0) {
//       this.room.send('movePos', { x: this.mySprite.x, y: this.mySprite.y });
//     }
//   }
// 
//   updateNearRoomPrompt() {
//     const doorRoom = this.getNearestClosedDoor(88);
//     if (doorRoom) {
//       this.nearText.setText(`[E] ${doorRoom.title} 문 열기`);
//       return;
//     }
// 
//     const room = this.getNearestRoom(88);
//     if (!room) {
//       this.nearText.setText('');
//       return;
//     }
//     const cleared = this.clearedRooms.has(room.id);
//     const allowed = room.roles.includes(this.myInfo.roleKey);
//     this.nearText.setText(
//       cleared
//         ? `${room.title}: 해결 완료`
//         : `[E] ${room.title} 해결 | 필요: ${room.roleLabel} | 보상: ${room.itemName}${allowed ? '' : ' (다른 역할 필요)'}`
//     );
//   }
// 
//   tryResolveNearestRoom() {
//     const doorRoom = this.getNearestClosedDoor(94);
//     if (doorRoom) {
//       this.openRoomDoor(doorRoom);
//       return;
//     }
// 
//     const room = this.getNearestRoom(94);
//     if (!room) {
//       this.displayHint('가까운 방 장치가 없습니다.');
//       return;
//     }
//     if (this.clearedRooms.has(room.id)) {
//       this.displayHint('이미 해결한 방입니다.');
//       return;
//     }
//     this.room.send('interact', { action: 'resolveRoom', ...room });
//   }
// 
//   tryAttackBoss() {
//     if ((this.room.state.itemsCollected || 0) < 15) {
//       this.displayHint(`보스전 준비 부족: 아이템 ${this.room.state.itemsCollected || 0}/15`);
//       return;
//     }
//     if (this.time.now < this.nextAttackAt) return;
//     const cooldown = 560 / this.attackSpeedBuff;
//     this.nextAttackAt = this.time.now + cooldown;
//     this.room.send('attackBoss', { attackPower: this.attackPower });
//     this.bossSprite.play('boss-attack', true);
//   }
// 
//   getNearestRoom(maxDistance) {
//     if (!this.mySprite) return null;
//     let best = null;
//     let bestDistance = maxDistance;
//     ROOMS.forEach((room) => {
//       if (!this.openDoors.has(room.id) && !this.clearedRooms.has(room.id)) return;
//       const distance = Phaser.Math.Distance.Between(this.mySprite.x, this.mySprite.y, room.x, room.y);
//       if (distance < bestDistance) {
//         best = room;
//         bestDistance = distance;
//       }
//     });
//     return best;
//   }
// 
//   getNearestClosedDoor(maxDistance) {
//     if (!this.mySprite) return null;
//     let best = null;
//     let bestDistance = maxDistance;
//     ROOMS.forEach((room) => {
//       if (this.openDoors.has(room.id) || this.clearedRooms.has(room.id)) return;
//       const distance = Phaser.Math.Distance.Between(this.mySprite.x, this.mySprite.y, room.x, room.y);
//       if (distance < bestDistance) {
//         best = room;
//         bestDistance = distance;
//       }
//     });
//     return best;
//   }
// 
//   applyBuff(data) {
//     const duration = data.duration || 3000;
//     const multiplier = data.multiplier || 2;
//     if (data.type === 'attack') {
//       this.attackPower = multiplier;
//       this.displayHint(`[${data.itemName}] 공격력 ${multiplier}배`);
//       this.time.delayedCall(duration, () => { this.attackPower = 1; });
//     }
//     if (data.type === 'speed') {
//       this.moveBuff = multiplier;
//       this.displayHint(`[${data.itemName}] 이동 속도 ${multiplier}배`);
//       this.time.delayedCall(duration, () => { this.moveBuff = 1; });
//     }
//     if (data.type === 'attackSpeed') {
//       this.attackSpeedBuff = multiplier;
//       this.displayHint(`[${data.itemName}] 공격 속도 ${multiplier}배`);
//       this.time.delayedCall(duration, () => { this.attackSpeedBuff = 1; });
//     }
//   }
// 
//   updateHud() {
//     if (!this.statusText) return;
//     const state = this.room.state;
//     const me = state.players.get(this.room.sessionId);
//     const inventory = me?.inventory ? Array.from(me.inventory) : [];
//     const minutes = String(Math.floor((state.timeRemaining || 0) / 60)).padStart(2, '0');
//     const seconds = String((state.timeRemaining || 0) % 60).padStart(2, '0');
//     const role = ROLE_INFO[this.myInfo.roleKey];
// 
//     this.statusText.setText(
//       `[${this.myInfo.group}조] ${this.myInfo.realName || me?.realName} / ${role.job} | 아이템 ${state.itemsCollected || 0}/15 | 남은 시간 ${minutes}:${seconds} | ${role.help}`
//     );
//     this.inventoryText.setText(
//       inventory.length
//         ? `아이템: ${inventory.slice(0, 5).map((item, index) => `${index + 1}.${item}`).join('  ')}`
//         : '아이템 없음 | 방 가까이에서 E로 역할 퍼즐을 해결하세요'
//     );
// 
//     const hp = state.boss?.hp ?? 0;
//     const maxHp = state.boss?.maxHp ?? 1;
//     this.bossBar.clear();
//     this.bossBar.fillStyle(0x111827, 0.95).fillRoundedRect(522, 16, 250, 18, 7);
//     this.bossBar.fillStyle(0xef4444, 0.95).fillRoundedRect(525, 19, 244 * (hp / maxHp), 12, 5);
//     this.bossBar.lineStyle(1, 0xffffff, 0.35).strokeRoundedRect(522, 16, 250, 18, 7);
//   }
// 
//   updateBossVisual() {
//     const boss = this.room.state.boss;
//     if (!boss || !this.bossSprite) return;
//     this.bossSprite.x = boss.x;
//     this.bossSprite.y = boss.y;
//     if (boss.status === 'stun') this.bossSprite.setTint(0x66e2ff);
//     else if (boss.status === 'weak') this.bossSprite.setTint(0xffd166);
//     else if (boss.status === 'defeated') this.bossSprite.setTint(0x999999);
//     else this.bossSprite.clearTint();
//     if (boss.status === 'idle' && !this.bossSprite.anims.isPlaying) {
//       this.bossSprite.play('boss-idle', true);
//     }
//   }
// 
//   ensureCoordOverlay() {
//     if (this.coordOverlayRoot) return this.coordOverlayRoot;
//     const parent = document.getElementById('game-container');
//     if (!parent) return null;
//     const root = document.createElement('div');
//     root.id = 'coord-skill-overlay';
//     root.style.cssText = [
//       'display:none',
//       'position:absolute',
//       'inset:0',
//       'z-index:150',
//       'pointer-events:auto',
//       'font-family:sans-serif',
//       'box-sizing:border-box',
//     ].join(';');
//     root.innerHTML = `
//       <div id="coord-skill-panel" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
//         width:min(380px,92%);max-height:70%;overflow:auto;background:#101827;color:#fff;border:2px solid #a78bfa;
//         border-radius:12px;padding:16px;box-shadow:0 12px 30px rgba(0,0,0,.65);">
//         <div id="coord-skill-title" style="font-size:18px;font-weight:bold;margin-bottom:8px;text-align:center;">팀원 지정 이동</div>
//         <div id="coord-skill-hint" style="font-size:13px;color:#cbd5e1;margin-bottom:12px;text-align:center;line-height:1.45;">같은 조 팀원을 고르고 맵 위 목적지를 클릭하세요.</div>
//         <div id="coord-skill-list" style="display:flex;flex-direction:column;gap:8px;"></div>
//         <button type="button" id="coord-skill-cancel" style="margin-top:14px;width:100%;padding:10px;border-radius:8px;border:none;
//           background:#334155;color:#fff;font-size:14px;cursor:pointer;">닫기 (ESC)</button>
//       </div>
//     `;
//     parent.appendChild(root);
//     root.querySelector('#coord-skill-cancel').onclick = () => this.closeCoordinatorSkillFlow();
//     this.coordOverlayRoot = root;
//     return root;
//   }
// 
//   openCoordinatorSkillFlow() {
//     const root = this.ensureCoordOverlay();
//     if (!root) return;
//     this.coordSkillMode = 'picking';
//     this.coordSkillTargetId = null;
//     if (this._coordPointerHandler) {
//       this.input.off('pointerdown', this._coordPointerHandler);
//       this._coordPointerHandler = null;
//     }
// 
//     const list = root.querySelector('#coord-skill-list');
//     list.innerHTML = '';
//     root.style.display = 'block';
//     const myGroup = String(this.myInfo.group);
// 
//     this.room.state.players.forEach((player, sessionId) => {
//       if (String(player.group) !== myGroup) return;
//       const row = document.createElement('button');
//       row.type = 'button';
//       row.style.cssText = 'text-align:left;padding:10px 12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fff;cursor:pointer;font-size:14px;';
//       row.innerHTML = `<b style="color:#c4b5fd;">${player.realName || '(이름 없음)'}</b><br/><span style="font-size:12px;color:#cbd5e1;">${player.job}</span>`;
//       row.onclick = () => {
//         this.coordSkillTargetId = sessionId;
//         this.coordSkillMode = 'placing';
//         root.style.display = 'none';
//         this.displayHint(`${player.realName} 이동 위치를 맵에서 클릭하세요. ESC로 취소`);
//         this.attachPlacingPointer();
//       };
//       list.appendChild(row);
//     });
//   }
// 
//   attachPlacingPointer() {
//     if (this._coordPointerHandler) this.input.off('pointerdown', this._coordPointerHandler);
//     this._coordPointerHandler = (pointer) => {
//       if (this.coordSkillMode !== 'placing' || !this.coordSkillTargetId) return;
//       const world = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
//       this.room.send('coordinatorTeleport', {
//         targetSessionId: this.coordSkillTargetId,
//         x: world.x,
//         y: world.y,
//       });
//       this.closeCoordinatorSkillFlow();
//     };
//     this.input.on('pointerdown', this._coordPointerHandler);
//   }
// 
//   closeCoordinatorSkillFlow() {
//     this.coordSkillMode = 'idle';
//     this.coordSkillTargetId = null;
//     if (this._coordPointerHandler) {
//       this.input.off('pointerdown', this._coordPointerHandler);
//       this._coordPointerHandler = null;
//     }
//     if (this.coordOverlayRoot) this.coordOverlayRoot.style.display = 'none';
//   }
// 
//   displayHint(message) {
//     if (this.hintText) this.hintText.destroy();
//     this.hintText = this.add.text(400, 490, message, {
//       font: '17px Arial',
//       color: '#fff7ad',
//       backgroundColor: '#000000cc',
//       padding: { x: 12, y: 7 },
//       wordWrap: { width: 720 },
//       align: 'center',
//     }).setOrigin(0.5).setScrollFactor(0).setDepth(260);
//     this.time.delayedCall(4200, () => {
//       if (this.hintText) {
//         this.hintText.destroy();
//         this.hintText = null;
//       }
//     });
//   }
// 
//   displayFloatingText(x, y, text, color) {
//     const floating = this.add.text(x, y, text, {
//       font: '20px Arial',
//       color,
//       stroke: '#000',
//       strokeThickness: 4,
//     }).setOrigin(0.5).setDepth(240);
//     this.tweens.add({
//       targets: floating,
//       y: y - 42,
//       alpha: 0,
//       duration: 700,
//       onComplete: () => floating.destroy(),
//     });
//   }
// }
// 
// const config = {
//   type: Phaser.AUTO,
//   width: 800,
//   height: 600,
//   parent: 'game-container',
//   scene: [LoginScene, GameScene],
//   physics: { default: 'arcade', arcade: { debug: false } },
//   pixelArt: true,
// };
// 
// new Phaser.Game(config);
// 
// LEGACY PROJECT COMMENTED OUT END
