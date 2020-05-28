let canvas;
let stage;
let isPlaying;
let startTime;
let currentFrame;
let salmonidId;
let lostSalmonidId;
let lostSalmonidCounts;
let popSalmonidCounts;
let updater;
let salmonids;
let goldenIkuras;
let debugs;
let ika;
let mapSizeX;
let mapSizeY;
let routeMapCache;
let rowWallStrs;
let colWallStrs;
let landStrs;
let walkableDirMap;
let ikuraContainerX;
let ikuraContainerY;
let xors;
let spawnDirs;
let currentSpawnDir;
let nextSpawnDirChangeFrame;
let spawnDirId;
let totalSalmonidsCount;
let goldenIkuraPopCount;
let goldenIkuraCount;
let deadEffects;
let attackX;
let attackY;
let selectMabikiRatio = 0;
let specifiedSpawnDirs = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
let mabikiCells = [];
let inputValues = {
	'seed-fix-checkbox': false,
	'seed-fix-input': 999,
	'auto-ikura-pickup-checkbox': true,
	'auto-mabiki-checkbox': false,
	'mabiki-cell-checkbox': false,
	'spawn-dir-checkbox': false,
	'ikura-pickup-seconds-input': 4,
	'ikura-pickup-seconds-width-input': 9,
	'auto-mabiki-shomen-checkbox': false,
	'mabiki-shomen-ratio-input': 80,
	'mabiki-shomen-speed-input': 3,
	'auto-mabiki-migi-checkbox': false,
	'mabiki-migi-ratio-input': 80,
	'mabiki-migi-speed-input': 3,
	'auto-mabiki-ura-checkbox': false,
	'mabiki-ura-ratio-input': 80,
	'mabiki-ura-speed-input': 3,
};
const COLOR_MABIKI = 'rgba(0, 100, 255, alpha)';
const COLOR_BG = '#FFFFFF';
const COLOR_WALL = '#000000';
const COLOR_GOLDIE = '#FFCC00';
const COLOR_CHUM = '#FF4400';
const COLOR_SNATCHER = '#8800CC';
const COLOR_STROKE = '#000000'
const COLOR_GOLDEN_IKURA = '#FFFFCC';
/** 描画上のマップの左からの余白(px) */
const MARGIN_X = 40;
/** 描画上のマップの左からの余白(px) */
const MARGIN_Y = 40;
/** 描画上の1マスの大きさ(px) */
const CELL_SIZE = 40;
/** キャンバス要素のID */
const CANVAS_ID = 'createjs-canvas';
/** キャンバスの横幅 */
const CANVAS_WIDTH = 520;
/** キャンバスの高さ */
const CANVAS_HEIGHT = 640;
/** StageGLが有効か */
const IS_ENABLED_STAGEGL = false;
/** setTimeoutを使うか */
const SHOULD_USE_TIMEOUT = true;
/** StageGL有効時の背景塗りつぶし色 */
const CLEAR_COLOR = 'White';
/** フレームレート */
const FRAME_RATE = 60;
/** 再描画レート */
const REDRAW_RATE = 2;
/** Stageをアップデートするか */
const STAGE_UPDATE = true;
/** シャケ生成ルーチンが呼ばれる間隔(F) */
const SALMONID_INTERVAL = Math.floor(FRAME_RATE / 6);
/** 何匹毎にキンシャケが生まれるか */
const GOLDIE_CYCLE = 20;
/** キンシャケのライフ */
const GOLDIE_LIFE = 500;
/** キンシャケの削りイクラ */
const GOLDIE_HIT_IKURA = 12;
/** キンシャケの撃破イクラ */
const GOLDIE_KILL_IKURA = 6;
/** キンシャケのドロップ金イクラ数 */
const GOLDIE_GOLDEN_IKURA = 3;
/** キンシャケの同時存在上限数 */
const GOLDIE_NUM_MAX = 8;
/** タマヒロイのライフ */
const SNATCHER_LIFE = 100;
/** タマヒロイの削りイクラ */
const SNATCHER_HIT_IKURA = 3;
/** タマヒロイの撃破イクラ */
const SNATCHER_KILL_IKURA = 3;
/** 中シャケのライフ */
const CHUM_LIFE = 50;
/** 中シャケの削りイクラ */
const CHUM_HIT_IKURA = 3;
/** 中シャケの撃破イクラ */
const CHUM_KILL_IKURA = 2;
/** すべてのシャケの同時合計存在上限数 */
const ACTIVE_MAX = 32;
/** 1WAVEの秒数(秒) */
const WAVE_SECONDS = 100;
/** 1WAVEの時間(F) */
const WAVE_FRAMES = WAVE_SECONDS * FRAME_RATE;
/** マップデータ(横) */
const MAP_DATA_WALL_ROW = `
　　　　　　　━　━　
　　　　　　　　　　　
　　　　　　　　　　　
　　　　━━　　　　　
　　━━　　━　━　━
　　　━━━━┻━　　
　　　━┻━━━　　　
　━　　　┻━　　　━
━　　　　　　　　　　
　　　　　　　　　　　
　　　　　━┳━━　　
　　　　━┳┳━━━　
　　　　　　　　━　　
━　　　　　　━　　　
　━━━━━━　　　　`;
/** マップデータ(縦) */
const MAP_DATA_WALL_COL = `
　　　　　　　┃┃┃┃　
　　　　　　　┃┃┃┃　
　　　　　　　┃┃┃┃　
　　　　┃　┃┃┃┃┃　
　　┃　　　　　　　　┃
　　┃　　　　　　┃　┃
　　┃┃　　　　┃┣　┃
　┃　┃┃┃　　┣┃┃　
┃　　┃┃　　　┃┣┃　
┃　　┫┫┃　　　┃┃　
┃　　┃┃　　　　　┃　
┃　　　　　　　　┃　　
┃　　　　　　　┃　　　
　┃　　　　　┃　　　　`;
/** マップデータ(地形) */
const MAP_DATA_LAND = `
□□□□□□□Ａ□Ｂ□
□□□□□□□■□■□
□□□□□□□■□■□
□□□□ＡＡ□■□■□
□□■■■■■■■■Ｂ
□□■■■■■■■■Ｂ
□□■■■■■■■■Ｂ
□■■■■■■■■■□
Ｃ■■■■■★■■■□
Ｃ■■■■■■■■■□
Ｃ■■■■■■■■■□
Ｃ■■■■■■■Ｃ□□
Ｃ■■■■■■Ｃ□□□
□ＣＣＣＣＣＣ□□□□`;
/* 速度係数1のシャケが1秒間に進むマス数 */
const MOVE_UNIT = 0.42 / FRAME_RATE;
/* ラスト湧きの秒数 */
const LAST_SPAWN_SECONDS = 28;
/* タマヒロイの速度係数 */
const SNATCHER_SPEED = 1.5;
/* キンシャケの速度係数 */
const GOLDIE_SPEED = 3.5;
/* 中シャケの速度係数 */
const CHUM_SPEED = 3.5;
/** タマヒロイの生成ルーチンが呼ばれる間隔(F) */
const SNATCHER_INTERVAL = Math.floor(FRAME_RATE / 10);
/** タマヒロイが生成されてから動き始めるまでの時間(F) */
const SNATCHER_WAITING_FRAME = Math.floor(3.5 * FRAME_RATE);
/** タマヒロイが金イクラの位置に到達してから金イクラを1個拾いあげるまで時間 */
const SNATCHER_PICKUP_FRAME = Math.floor(4 * FRAME_RATE);
/** 湧き方角の変更回数 */
const SPAWN_DIR_CHANGE_COUNT = 7;
/** 湧き方角の変更時間(秒) */
const SPAWN_DIR_CHANGE_SECONDS = [10, 20, 30, 41, 51, 61, 72, 82, 92];
/** 湧き方角の変更時間(F) */
const SPAWN_DIR_CHANGE_FRAMES = (() => {
  const arr = [];
  SPAWN_DIR_CHANGE_SECONDS.forEach((num) => {
    arr.push(num * FRAME_RATE);
  });
  return arr;
})();
/** すべての湧きポイント */
const SPAWN_POINTS = [];
/** 湧き方角定義 */
const SPAWN_DIRS = [
  {
  	name: 'shomen',
    str: 'Ａ',
    weight: 40,
    points: [],
  },
  {
  	name: 'migi',
    str: 'Ｂ',
    weight: 35,
    points: [],
  },
  {
  	name: 'ura',
    str: 'Ｃ',
    weight: 25,
    points: [],
  },
];
/** 上下左右4マスのdx, dy */
const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
/** 周囲8マスのdx, dy */
const AROUNDS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];
const NORM_DIST_MAX = 982;
const NORM_DIST_ARRAY = [1, 2, 3, 5, 6, 8, 10, 12, 15, 17, 20, 24, 27, 31, 35, 40, 45, 50, 56, 62, 69, 76, 83, 91, 100, 109, 119, 129, 139, 151, 162, 175, 188, 201, 215, 230, 244, 260, 276, 292, 309, 326, 344, 361, 380, 398, 416, 435, 454, 473, 492, 511, 530, 549, 568, 586, 604, 623, 640, 658, 675, 692, 708, 724, 740, 754, 769, 783, 796, 809, 822, 833, 845, 855, 865, 875, 884, 893, 901, 908, 915, 922, 928, 934, 939, 944, 949, 953, 957, 960, 964, 967, 969, 972, 974, 976, 978, 979, 981, 982];
/** イクラ取得平均時間(秒) */
const AVG_PICKUP_SECONDS = 3.5;
/** シャケ出現から間引きまでの時間(秒) */
const MABIKI_SECONDS = 3.5;
/** シャケ出現から間引きまでの時間の幅(秒) */
const MABIKI_SECONDS_WIDTH = 1.5;
/** 間引き割合 */
const MABIKI_RATIO = 0.5;
/** ゲームスピード */
const GAME_SPEED = 1;
/** 固定シード値 */
const FIXED_SEED = 100;
/** 固定湧き方角 */
const FIXED_SPAWN_DIRS = [1, 1, 1, 1, 1, 1, 0, 1, 1, 1];


Array.prototype.shuffle = function() {
  let i;
  let j;
  let temp;
  i = this.length;
  while (i) {
    j = Math.floor(random() * i);
    i -= 1;
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
}

/** random() */
function random() {
  return xors.getRandom(100) / 100;
}

/** normalRandom() */
function normalRandom(minValue = 0, maxValue = 0.99) {
  const minIndex = Math.floor(minValue * 100);
  const maxIndex = Math.floor(maxValue * 100);
  const minFrequency = NORM_DIST_ARRAY[minIndex];
  const maxFrequency = NORM_DIST_ARRAY[maxIndex];
  const frequencyWidth = maxFrequency - minFrequency;
  const r = minFrequency + xors.getRandom(frequencyWidth);
  for (let i = minIndex; i < NORM_DIST_ARRAY.length; i += 1) {
    if (r < NORM_DIST_ARRAY[i]) {
      return i / 100;
    }
  }
  return 
}

/** Xors(seed)
 * XOR交換アルゴリズムによる乱数生成機のクラスです。
 */
class Xors {
  /** .constructor(seed)
   * 初期シード値を指定して乱数生成器を作ります。
   * 省略した場合は88675123になります。
   * @param {number} seed - 初期シード値。
   */
  constructor(seed) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = seed || 88675123;
  }
  /** .random()
   * 0から数億の整数乱数を返します。
   * @return {number} 0以上の整数乱数。
   */
  random() {
    const t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
    return this.w;
  }
  /** .getRandom(max)
   * 0以上max未満の整数乱数を返します。
   * たとえばgetRandom(10)で0～9の乱数が取得できます。
   * @param {number} max - 乱数の最大値+1（max自体は取得できない）。
   * @return {number} 0以上max未満の整数乱数。
   */
  getRandom(max) {
    return (this.random() % max);
  }
};


/** createMapData
 * マップデータを定義した文字列を解析します。
 */
function createMapData() {
  /** parseMapDefStr(str)
   * 文字列strを解析し、y行x列目の文字列がarray[y][x]で取り出せるようにします。
   */
  const parseMapDefStr = (str) => {
    let split = str.split('\n');
    const array = [];
    for (let i = 0, j = 0; i < split.length; i += 1) {
      const line = split[i];
      if (line.length > 0) {
        array[j] = [];
        for (let k = 0; k < line.length; k += 1) {
          array[j][k] = line.charAt(k);
        }
        j += 1;
      }
    }
    return array;
  };
  /** createArrayWithMapSize(value)
   */
  const createArrayWithMapSize = (value) => {
    const array = [];
    for (let y = 0; y < mapSizeY; y += 1) {
      array[y] = [];
      for (let x = 0; x < mapSizeX; x += 1) {
        array[y][x] = value;
      }
    }
    return array;
  };
  /** withMapSize(func)
   */
  const withMapSize = (func) => {
    for (let y = 0; y < mapSizeY; y += 1) {
      for (let x = 0; x < mapSizeX; x += 1) {
        func(x, y);
      }
    }
  };
  rowWallStrs = parseMapDefStr(MAP_DATA_WALL_ROW);
  colWallStrs = parseMapDefStr(MAP_DATA_WALL_COL);
  landStrs = parseMapDefStr(MAP_DATA_LAND);
  mapSizeY = landStrs.length;
  mapSizeX = landStrs[0].length;
  routeMapCache = createArrayWithMapSize(null);
  walkableDirMap = createArrayWithMapSize(null);
  withMapSize((x, y) => {
    // このマスから[上, 右, 下, 左]に進めるかどうかが格納されている配列
    // 進めるなら1、進めないなら0が入る
    walkableDirMap[y][x] = [0, 0, 0, 0];
    // '★'ならばイクラコンテナ。そのxy座標を格納する
    if (landStrs[y][x] === '★') {
      ikuraContainerX = x;
      ikuraContainerY = y;
    }
    let isSpawnPoint = false;
    SPAWN_DIRS.forEach((dir) => {
      if (dir.str.indexOf(landStrs[y][x]) > -1) {
        isSpawnPoint = true;
        dir.points.push({x, y});
      }
    });
    if (isSpawnPoint) {
      SPAWN_POINTS.push({x, y});
    }
    // '□'ならばステージ外。ステージ外ではないならば
    if (landStrs[y][x] !== '□') {
      // 上に行けるかどうか
      if (rowWallStrs[y][x] === '　' || rowWallStrs[y][x] === '┻') {
        walkableDirMap[y][x][0] = 1;
      }
      // 右に行けるかどうか
      if (colWallStrs[y][x + 1] === '　' || colWallStrs[y][x + 1] === '┣') {
        walkableDirMap[y][x][1] = 1;
      }
      // 下に行けるかどうか
      if (rowWallStrs[y + 1][x] === '　' || rowWallStrs[y + 1][x] === '┳') {
        walkableDirMap[y][x][2] = 1;
      }
      // 左に行けるかどうか
      if (colWallStrs[y][x] === '　' || colWallStrs[y][x] === '┫') {
        walkableDirMap[y][x][3] = 1;
      }
    }
  });
}


/** runRecursive(func, ...args)
 * 再起関数を実行・管理するための関数。
 * https://qiita.com/uhyo/items/21e2dc2b9b139473d859
 */
function runRecursive(func, ...args) {
  const rootCaller = {
    lastReturnValue: null,
  };
  const callStack = [];
  callStack.push({
    iterator: func(...args),
    lastReturnValue: null,
    caller: rootCaller,
  });
  while (callStack.length > 0) {
    const stackFrame = callStack[callStack.length - 1];
    const { iterator, lastReturnValue, caller } = stackFrame;
    const { value, done } = iterator.next(lastReturnValue);
    if (done) {
      caller.lastReturnValue = value;
      callStack.pop();
    } else {
      callStack.push({
        iterator: func(...value),
        lastReturnValue: null,
        caller: stackFrame,
      });
    }
  }
  return rootCaller.lastReturnValue;
};


/** search(x, y, depth, routeMap, fromX, fromY)
 * 上下左右に探索を行っていく再帰関数。
 */
function* search(x, y, depth, routeMap, fromX, fromY) {
  // 訪れたことがあり（距離が記録されており）
  if (routeMap[y][x].distance > -1) {
    // かつ、記録されている距離が現在の歩数を下回っているならば
    if (routeMap[y][x].distance < depth) {
      // 更新の必要はない
      return;
    }
  }
  routeMap[y][x].distance = depth;
  routeMap[y][x].connectX = fromX;
  routeMap[y][x].connectY = fromY;
  // 上下左右を探索する
  for (let i = 0; i < DIRS.length; i += 1) {
    // 移動量
    const dx = DIRS[i][0];
    const dy = DIRS[i][1];
    // 次の場所
    const nx = x + dx;
    const ny = y + dy;
    // はみ出したら次の方向へ
    if (nx < 0 || ny < 0 || nx >= mapSizeX || ny >= mapSizeY) {
      continue;
    }
    // はみ出してはいないようだ！
    if (!walkableDirMap[ny][nx][(i+2)%4]) {
      continue;
    }
    // yieldで再帰する
    yield [nx, ny, depth + 1, routeMap, x, y];
  }
  return;
}


/** createRouteMap(goalX, goalY)
 */
function createRouteMap(goalX, goalY) {
  const routeMap = [];
  for (let y = 0; y < mapSizeY; y += 1) {
    routeMap[y] = [];
    for (let x = 0; x < mapSizeX; x += 1) {
      routeMap[y][x] = {
        distance: -1,
        connectX: -1,
        connectY: -1,
      };
    }
  }
  runRecursive(search, goalX, goalY, 0, routeMap, null, null);
  return routeMap;
}


/** getRouteMap(goalX, goalY)
 */
function getRouteMap(goalX, goalY) {
  if (!routeMapCache[goalY][goalX]) {
    routeMapCache[goalY][goalX] = createRouteMap(goalX, goalY);
  }
  return routeMapCache[goalY][goalX];
}


/** Salmonid()
 */
class Salmonid {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tx = 0;
    this.ty = 0;
    this.dx = 0;
    this.dy = 0;
    this.bookingX = -1;
    this.bookingY = -1;
    this.speed = 1;
    this.routeMap = null;
    this.sprite = null;
    this.frame = 0;
    this.life = 1;
  }
  createGraphics() {
    const shape = new createjs.Shape();
    shape.alpha = 1;
    shape.graphics.beginStroke(COLOR_STROKE);
    shape.graphics.setStrokeStyle(1);
    shape.graphics.beginFill(this.color);
    //shape.graphics.beginLinearGradientFill(['#80c', '#80c', '#fc0'], [0, 0.5, 0.5],
    //  0, CELL_SIZE / 2 - CELL_SIZE / 6, 0, CELL_SIZE / 2 + CELL_SIZE / 6);
    shape.graphics.drawCircle(0, 0, this.radius);
    shape.cache(- CELL_SIZE / 2, - CELL_SIZE / 2, CELL_SIZE, CELL_SIZE);
    stage.addChild(shape);
    this.sprite = shape;
  }
  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.sprite.x = (this.x + this.tx * this.dx) * CELL_SIZE + MARGIN_X + CELL_SIZE / 2;
    this.sprite.y = (this.y + this.ty * this.dy) * CELL_SIZE + MARGIN_Y + CELL_SIZE / 2;
  }
  bookingRouteMap(x, y) {
    if (this.dx === 0 && this.dy === 0) {
      this.setRouteMap(x, y);
    } else {
      this.bookingX = x;
      this.bookingY = y;
    }
  }
  setRouteMap(x, y) {
    this.routeMap = getRouteMap(x, y);
    if (this.routeMap[this.y][this.x].distance > 0) {
      this.dx = this.routeMap[this.y][this.x].connectX - this.x;
      this.dy = this.routeMap[this.y][this.x].connectY - this.y;
    } else {
      this.dx = 0;
      this.dy = 0;
    }
  }
  update() {
    this.move();
  }
  move() {
    const dx = (this.dx === 0) ? 0 : this.speed * MOVE_UNIT;
    const dy = (this.dy === 0) ? 0 : this.speed * MOVE_UNIT;
    this.tx += dx;
    this.ty += dy;
    let surplus = -1;
    if (this.tx >= 1) {
      surplus = this.tx - 1;
      this.tx = 1;
    } else if (this.ty >= 1) {
      surplus = this.ty - 1;
      this.ty = 1;
    }
    if (surplus > -1) {
      this.x += this.dx;
      this.y += this.dy;
      if (this.bookingX > -1) {
        this.setRouteMap(this.bookingX, this.bookingY);
        this.bookingX = -1;
        this.bookingY = -1;
        surplus = 0;
      }
      this.tx = surplus;
      this.ty = surplus;
      this.dx = 0;
      this.dy = 0;
      if (this.routeMap[this.y][this.x].distance > 0) {
        this.dx = this.routeMap[this.y][this.x].connectX - this.x;
        this.dy = this.routeMap[this.y][this.x].connectY - this.y;
      } else {
        this.reachGoal();
      }
    }
    this.sprite.x = (this.x + this.tx * this.dx) * CELL_SIZE + MARGIN_X + CELL_SIZE / 2;
    this.sprite.y = (this.y + this.ty * this.dy) * CELL_SIZE + MARGIN_Y + CELL_SIZE / 2;
  }
  reachGoal() {
  }
  receiveDamage(dmg) {
    this.life = Math.max(0, this.life - dmg);
    if (this.life === 0) {
      this.die();
    }
  }
  die() {
    this.pushDeadEffect();
    this.remove();
  }
  pushDeadEffect() {
    pushDeadEffect({
      x: this.sprite.x,
      y: this.sprite.y,
      color: this.color,
      radius: this.radius,
    });
  }
  remove() {
    stage.removeChild(this.sprite);
    const index = salmonids.indexOf(this);
    if (index > -1) {
      salmonids.splice(index, 1);
    }
  }
  test() {
    console.log('Salmonid Test');
  }
}


/** Goldie()
 */
class Goldie extends Salmonid {
  constructor(x, y) {
    super(x, y);
    this.life = GOLDIE_LIFE;
    this.name = 'Goldie';
    this.speed = GOLDIE_SPEED;
    this.color = COLOR_GOLDIE;
    this.radius = CELL_SIZE / 3;
    this.createGraphics();
    this.setXY(x, y);
    this.setRouteMap(ikuraContainerX, ikuraContainerY);
  }
  reachGoal() {
    this.receiveDamage(GOLDIE_LIFE);
  }
  die() {
    // イクラの落下位置を検討する
    const candidates = [];
    AROUNDS.forEach((around) => {
      const x = this.x + around[0];
      const y = this.y + around[1];
      // '■'で定義されているマスにのみ落下可能
      if (landStrs[y][x] === '■') {
        candidates.push({x, y});
      }
    });
    if (candidates.length > 0) {
      candidates.shuffle();
      for (let i = 0; i < GOLDIE_GOLDEN_IKURA; i += 1) {
        const p = candidates[i % candidates.length];
        new GoldenIkura(p.x, p.y);
        goldenIkuraPopCount += 1;
      }
    }
    super.die();
  }
  test() {
    super.test();
    console.log('Goldie Test');
  }
}


/** Chum()
 */
class Chum extends Salmonid {
  constructor(x, y) {
    super(x, y);
    this.life = CHUM_LIFE;
    this.name = 'Chum';
    this.speed = CHUM_SPEED;
    this.color = COLOR_CHUM;
    this.radius = CELL_SIZE / 6;
    this.isJudgedMabiki = false;
    this.createGraphics();
    this.setXY(x, y);
    this.setRouteMap(ikuraContainerX, ikuraContainerY);
    this.deadFrame = -1;
    if (inputValues['auto-mabiki-checkbox'] && inputValues[`auto-mabiki-${currentSpawnDir.name}-checkbox`]) {
    	const mabikiRatio = inputValues[`mabiki-${currentSpawnDir.name}-ratio-input`];
	    if (random() < mabikiRatio / 100) {
    		const mabikiSeconds = inputValues[`mabiki-${currentSpawnDir.name}-speed-input`];
	      const width = 0; //MABIKI_SECONDS_WIDTH * (2 * random() - 1);
	      this.deadFrame = currentFrame + Math.floor((mabikiSeconds + width) * FRAME_RATE);
	    }
    }
  }
  update() {
    super.update();
    if (this.life > 0) {
      if (currentFrame === this.deadFrame) {
        this.receiveDamage(CHUM_LIFE);
      } else if (attackX > -1 && this.x === attackX && this.y === attackY) {
				this.receiveDamage(CHUM_LIFE);
      } else if (!this.isJudgedMabiki && inputValues['mabiki-cell-checkbox']) {
        mabikiCells.forEach((cell) => {
          if (this.x === cell.x && this.y === cell.y) {
          	this.isJudgedMabiki = true;
          	if (random() < cell.ratio / 100) {
            	this.receiveDamage(CHUM_LIFE);
          	}
          }
        });
      }
    }
  }
  reachGoal() {
    this.receiveDamage(CHUM_LIFE);
  }
}


/** Snatcher()
 */
class Snatcher extends Salmonid {
  constructor(x, y, goldenIkura) {
    super(x, y);
    this.name = 'Snatcher';
    this.speed = SNATCHER_SPEED;
    this.targetIkuraExists = true;
    this.color = COLOR_SNATCHER;
    this.radius = CELL_SIZE / 6;
    this.createGraphics();
    this.sprite.alpha = 0;
    this.options = {x, y};
    this.goldenIkura = goldenIkura;
    this.sleep();
    this.sprite.on('click', () => {
      this.receiveDamage(100);
    });
  }
  gotosea() {
    if (this.isWaiting) {
      this.remove();
      return;
    }
    let minDistancePoint;
    let minDistance = 9999;
    // すべての帰宅地点候補について
    SPAWN_POINTS.forEach((p) => {
      // その帰宅地点へのルートマップを取得する
      const routeMap = getRouteMap(p.x, p.y);
      // ここからその帰宅地点までの距離
      const distance = routeMap[this.y][this.x].distance;
      // 最短のものを選択する
      if (distance < minDistance) {
        minDistance = distance;
        minDistancePoint = p;
      }
    });
    // 最短の帰宅地点に向かって移動する
    this.bookingRouteMap(minDistancePoint.x, minDistancePoint.y);
    this.reachGoal = this.reachSea;
  }
  sleep() {
    this.life = SNATCHER_LIFE;
    this.setXY(this.options.x, this.options.y);
    this.setRouteMap(this.goldenIkura.x, this.goldenIkura.y);
    this.frame = 0;
    this.isSleeping = true;
    this.isWaiting = true;
    this.didReachedGoldenIkura = false;
    this.hasGoldenIkura = false;
    this.sprite.alpha = 0;
    this.reachGoal = this.reachGoldenIkura;
  }
  wakeup() {
    this.isSleeping = false;
  }
  depart() {
    this.isWaiting = false;
    this.sprite.alpha = 1;
  }
  update() {
    if (!this.isSleeping) {
      if (this.isWaiting) {
        if (this.frame === SNATCHER_WAITING_FRAME) {
          this.depart();
        }
      } else {
        this.move();
        if (this.hasGoldenIkura) {
          this.goldenIkura.x = this.x;
          this.goldenIkura.y = this.y;
          this.goldenIkura.sprite.x = (this.x + this.tx * this.dx) * CELL_SIZE + MARGIN_X;
          this.goldenIkura.sprite.y = (this.y + this.ty * this.dy) * CELL_SIZE + MARGIN_Y;
        }
        if (this.didReachedGoldenIkura) {
          if (this.frame === SNATCHER_PICKUP_FRAME) {
            this.pickup();
          }
        }
      }
      this.frame += 1;
    }
  }
  pickup() {
    this.hasGoldenIkura = true;
    this.gotosea();
  }
  reachGoldenIkura() {
    //SNATCHER_PICKUP_FRAME
    this.didReachedGoldenIkura = true;
    this.frame = 0;
  }
  reachSea() {
    this.remove();
    if (this.hasGoldenIkura) {
      this.goldenIkura.remove();
    }
  }
  die() {
    // 死んだとき
    if (this.hasGoldenIkura) {
      // イクラを持っている場合
      this.goldenIkura.x = this.x;
      this.goldenIkura.y = this.y;
      this.goldenIkura.sprite.x = this.x * CELL_SIZE + MARGIN_X;
      this.goldenIkura.sprite.y = this.y * CELL_SIZE + MARGIN_Y;
      this.pushDeadEffect();
      this.sleep();
    } else if (this.goldenIkura.isOnGround) {
      // イクラを持ってはいないが、ターゲットのイクラはまだフィールド上にある、そういう場合
      this.pushDeadEffect();
      this.sleep();
    } else {
      // イクラを持っているわけではないし、ターゲットのイクラもフィールド上から消えた場合
      this.pushDeadEffect();
      this.remove();
    }
  }
}


/** GoldenIkura()
 */
class GoldenIkura {
  constructor(x, y) {
  	const hitArea = new createjs.Shape();
    hitArea.graphics.beginStroke(COLOR_STROKE);
    hitArea.graphics.setStrokeStyle(1);
    hitArea.graphics.beginFill(COLOR_STROKE);
    hitArea.graphics.drawCircle(CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 2);
    const shape = new createjs.Shape();
    shape.graphics.beginStroke(COLOR_STROKE);
    shape.graphics.setStrokeStyle(1);
    shape.graphics.beginFill(COLOR_GOLDEN_IKURA);
    shape.graphics.drawCircle(CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 4);
    shape.hitArea = hitArea;
    shape.cursor = 'pointer';
    stage.addChild(shape);
    this.sprite = shape;
    this.setXY(x, y);
    this.pickupFrame = -1;
    this.isOnGround = true;
    goldenIkuras.push(this);
    this.createSnatcher();
    this.sprite.on('click', () => {
      this.pickup();
    });
    if (inputValues['auto-ikura-pickup-checkbox']) {
    	/*
	    const minPickupTime = 1;
	    const avgPickupTime = inputValues['ikura-pickup-seconds-input'];
	    const pickupTimeWidth = inputValues['ikura-pickup-seconds-width-input'];
	    const r = random() * pickupTimeWidth * 2 - pickupTimeWidth;
	    const pickupTime = avgPickupTime + r;
	    const pickupFrame = Math.max(1, Math.floor(pickupTime * FRAME_RATE));
	    this.pickupFrame = currentFrame + pickupFrame;
	    */
		  const nohinSecondsMode = inputValues['ikura-pickup-seconds-input'];
		  const nohinSecondsMin = 1;
		  const nohinSecondsWidth = inputValues['ikura-pickup-seconds-width-input'];
		  let normalRandomMin = 0;
		  const nohinSecondsLeftWidth = Math.min(nohinSecondsWidth, nohinSecondsMode - nohinSecondsMin);
		  if (nohinSecondsMode - nohinSecondsMin < nohinSecondsWidth) {
		    const ratio = (nohinSecondsMode - nohinSecondsMin) / nohinSecondsWidth;
		    normalRandomMin = (1 - ratio) / 2;
		  }
			const seconds = nohinSecondsMode + nohinSecondsWidth * (normalRandom(normalRandomMin) * 2 - 1);
	    this.pickupFrame = currentFrame + Math.floor(seconds * FRAME_RATE);
    }
  }
  update() {
    if (currentFrame === this.pickupFrame && this.isOnGround) {
      this.pickup();
    }
  }
  pickup() {
    goldenIkuraCount += 1;
    this.isOnGround = false;
    this.remove();
    if (this.snatcher) {
      this.snatcher.gotosea();
    }
  }
  createSnatcher() {
    let minDistancePoint;
    let minDistance = 9999;
    // このイクラへのルートマップを取得する
    const routeMap = getRouteMap(this.x, this.y);
    // すべての湧き地点について
    SPAWN_POINTS.forEach((p) => {
      // イクラまでの距離を取得
      const distance = routeMap[p.y][p.x].distance;
      // 最短のものを選択する
      if (distance < minDistance) {
        minDistance = distance;
        minDistancePoint = p;
      }
    });
    this.snatcher = new Snatcher(minDistancePoint.x, minDistancePoint.y, this);
    salmonids.push(this.snatcher);
  }
  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.sprite.x = (this.x + (random() - 0.5) * 0.8) * CELL_SIZE + MARGIN_X;
    this.sprite.y = (this.y + (random() - 0.5) * 0.8) * CELL_SIZE + MARGIN_Y;
  }
  remove() {
    stage.removeChild(this.sprite);
    const index = goldenIkuras.indexOf(this);
    if (index > -1) {
      goldenIkuras.splice(index, 1);
    }
  }
}


/** wakeupSnatcher()
 */
function wakeupSnatcher() {
  if (totalSalmonidsCount >= ACTIVE_MAX) {
    return;
  }
  for (let i = 0; i < salmonids.length; i += 1) {
    if (salmonids[i].name === 'Snatcher') {
      if (salmonids[i].isSleeping) {
        salmonids[i].wakeup();
        break;
      }
    }
  }
}


/** createSalmonid()
 */
function createSalmonid() {
  // 同時活動数が上限に達しているならば何もしない
  if (totalSalmonidsCount >= ACTIVE_MAX) {
    if (lostSalmonidId % GOLDIE_CYCLE === 0) {
      lostSalmonidCounts.Goldie += 1;
    } else {
      lostSalmonidCounts.Chum += 1;
    }
    lostSalmonidId += 1;
    return;
  }
  // そうでないならばシャケを追加することができる
  salmonidId += 1;
  let chumOrGoldie;
  const r = xors.getRandom(currentSpawnDir.points.length);
  const p = currentSpawnDir.points[r];
  if (salmonidId % GOLDIE_CYCLE === 0) {
    chumOrGoldie = new Goldie(p.x, p.y);
    popSalmonidCounts.Goldie += 1;
  } else {
    chumOrGoldie = new Chum(p.x, p.y);
    popSalmonidCounts.Chum += 1;
  }
  salmonids.push(chumOrGoldie);
}


/** finishGame()
 */
function finishGame() {
	isPlaying = false;
  updater = () => {};
  let tmp;
  while (goldenIkuras && goldenIkuras[0] && goldenIkuras[0] !== tmp) {
    tmp = goldenIkuras[0];
    goldenIkuras[0].remove();
  }
  while (salmonids && salmonids[0] && salmonids[0] !== tmp) {
    tmp = salmonids[0];
    salmonids[0].remove();
  }
  while (deadEffects && deadEffects[0] && deadEffects[0] !== tmp) {
    tmp = deadEffects[0];
    deadEffects.shift();
    stage.removeChild(tmp);
  }
  stage.update();
}


/** createSpawnDirs()
 */
function createSpawnDirs() {
  spawnDirs = [];
  const spawnDirsLength = SPAWN_DIR_CHANGE_FRAMES.length + 1;
  for (let i = 0; i < spawnDirsLength; i += 1) {
    let totalWeight = 0;
    SPAWN_DIRS.forEach((dir) => {
      totalWeight += dir.weight;
    });
    let r = xors.getRandom(totalWeight);
    let spawnDir = SPAWN_DIRS[0];
    for (let j = 0; j < SPAWN_DIRS.length; j += 1) {
      if (r < SPAWN_DIRS[j].weight) {
        spawnDir = SPAWN_DIRS[j];
        break; 
      } else {
        r -= SPAWN_DIRS[j].weight;
      }
    }
    if (inputValues['spawn-dir-checkbox']) {
      spawnDir = SPAWN_DIRS[specifiedSpawnDirs[i]];
    }
    spawnDirs.push(spawnDir);
  }
}

/** gameUpdater()
 */
function gameUpdater() {
  // 残り秒数を計算
  const secondsLeft = Math.max(0, Math.ceil((WAVE_FRAMES - currentFrame) / FRAME_RATE));
  // キンシャケ、シャケ、タマヒロイの数を数える
  totalSalmonidsCount = 0;
  const counts = {
    'Goldie': 0,
    'Chum': 0,
    'Snatcher': 0,
  };
  for (let i = 0; i < salmonids.length; i += 1) {
    const name = salmonids[i].name;
    if (name in counts) {
      if (name === 'Snatcher') {
        if (!salmonids[i].isSleeping && salmonids[i].life > 0) {
          counts[name] += 1;
          totalSalmonidsCount += 1;
        }
      } else {
        if (salmonids[i].life > 0) {
          counts[name] += 1;
          totalSalmonidsCount += 1;
        }
      }
    } else {
      if (salmonids[i].life > 0) {
        counts[name] = 1;
        totalSalmonidsCount += 1;
      }
    }
  }
  // 保有するすべてのシャケオブジェクトについてmoveメソッドを呼ぶ
  for (let i = salmonids.length - 1; i >= 0; i -= 1) {
    salmonids[i].update();
  }
  // 保有するすべてのイクラオブジェクトについてmoveメソッドを呼ぶ
  for (let i = goldenIkuras.length - 1; i >= 0; i -= 1) {
    goldenIkuras[i].update();
  }
  // 保有するすべてのエフェクトオブジェクトについてmoveメソッドを呼ぶ
  for (let i = deadEffects.length - 1; i >= 0; i -= 1) {
    const eff = deadEffects[i];
    eff.frame += 1;
    eff.scale = 1 + eff.frame * 2 / 15;
    eff.alpha = 1 - eff.frame / 15;
    if (eff.frame >= 15) {
      stage.removeChild(eff);
      deadEffects.splice(i, 1);
      i -= 1;
    }
  }
  // デバッグ用のテキストを更新
  debugs['info-left-seconds'].textContent = secondsLeft;
  debugs['info-pop-golden-egg-counts'].textContent = goldenIkuraPopCount;
  debugs['info-golden-egg-counts'].textContent = goldenIkuraCount;
  debugs['info-salmonid-counts'].textContent = `(キ) ${counts.Goldie} / (シ) ${counts.Chum} / (タ) ${counts.Snatcher}`;
  debugs['info-pop-salmonid-counts'].textContent = `(キ) ${popSalmonidCounts.Goldie} / (シ) ${popSalmonidCounts.Chum}`;
  debugs['info-lost-salmonid-counts'].textContent = `(キ) ${lostSalmonidCounts.Goldie} / (シ) ${lostSalmonidCounts.Chum}`;
  /*
  if (totalSalmonidsCount >= ACTIVE_MAX) {
  	debugs['info-manseki'].style.setProperty('display', 'inline-block');
  } else {
  	debugs['info-manseki'].style.setProperty('display', 'none');
  }
  */
  // シャケ生成周期が訪れたならばシャケを生成する
  if (currentFrame % SALMONID_INTERVAL === 0) {
    if (counts.Goldie < GOLDIE_NUM_MAX) {
      createSalmonid();
    }
  }
  // シャケ生成周期が訪れたならばシャケを生成する
  if (currentFrame % SNATCHER_INTERVAL === 0) {
    wakeupSnatcher();
  }
  if (currentFrame == SPAWN_DIR_CHANGE_FRAMES[spawnDirId]) {
    spawnDirId += 1;
    currentSpawnDir = spawnDirs[spawnDirId];
  }
  // 現在フレームが1WAVEあたりのフレーム数以上になったならばゲームを終了する
  if (currentFrame >= WAVE_FRAMES) {
    finishGame();
  }
  // インクリメント
  currentFrame += 1;
  if (STAGE_UPDATE && currentFrame % (REDRAW_RATE * GAME_SPEED) === 0) {
    stage.update();
  }
}

function pushDeadEffect(eff) {
  const shape = new createjs.Shape();
  shape.alpha = 1;
  shape.x = eff.x;
  shape.y = eff.y;
  // shape.graphics.beginStroke("#000");
  // shape.graphics.setStrokeStyle(1);
  shape.graphics.beginFill(eff.color);
  shape.graphics.drawCircle(0, 0, eff.radius);
  shape.cache(- CELL_SIZE / 2, - CELL_SIZE / 2, CELL_SIZE, CELL_SIZE);
  stage.addChild(shape);
  shape.frame = 0;
  deadEffects.push(shape);
}

/** startGame()
 */
function startGame() {
  createjs.Ticker.reset();
  createjs.Ticker.on('tick', () => {
    updater();
  });
  createjs.Ticker.isPaused = false;
  finishGame();
	isPlaying = true;
	attackX = -1;
	attackY = -1;
  goldenIkuraCount = 0;
  goldenIkuraPopCount = 0;
  spawnDirId = 0;
  salmonidId = 0;
  lostSalmonidId = 0;
  lostSalmonidCounts = {
    'Goldie': 0,
    'Chum': 0,
  };
  popSalmonidCounts = {
  	'Goldie': 0,
  	'Chum': 0,
  }
  currentFrame = 0;
  nextSpawnDirChangeFrame = SPAWN_DIR_CHANGE_FRAMES[0];
  deadEffects = [];
  salmonids = [];
  goldenIkuras = [];
  startTime = new Date().getTime();
  updater = gameUpdater;
  const seed = (inputValues['seed-fix-checkbox'] > 0) ? Math.max(0, inputValues['seed-fix-input']) : Math.floor(startTime);
  xors = new Xors(seed);
  createSpawnDirs();
  currentSpawnDir = spawnDirs[0];
  /*
  const nohinSecondsMode = 4;
  const nohinSecondsMin = 1;
  const nohinSecondsWidth = 10;
  let normalRandomMin = 0;
  const nohinSecondsLeftWidth = Math.min(nohinSecondsWidth, nohinSecondsMode - nohinSecondsMin);
  if (nohinSecondsMode - nohinSecondsMin < nohinSecondsWidth) {
    const ratio = (nohinSecondsMode - nohinSecondsMin) / nohinSecondsWidth;
    normalRandomMin = (1 - ratio) / 2;
  }
  let sum = 0;
  for (let i = 0; i < 100; i += 1) {
    const s = 4 + 10 * (normalRandom(normalRandomMin) * 2 - 1);
    console.log(s.toFixed(2));
    sum += s;
  }
  console.log(sum / 100);
  */
}

/** save()
 * ローカルストレージにデータを保存する。
 */
const STORAGE_KEY = 'salmon_rush';
function save() {
  const saveDataObj = {
    inputValues,
    specifiedSpawnDirs,
    mabikiCells,
  };
  const jsonStr = JSON.stringify(saveDataObj);
  localStorage.setItem(STORAGE_KEY, jsonStr);
};

/** load()
 * ローカルストレージからデータを持ってくる。
 */
function load() {
  const jsonStr = localStorage.getItem(STORAGE_KEY);
  if (jsonStr !== null) {
    const saveDataObj = JSON.parse(jsonStr);
    if ('inputValues' in saveDataObj) {
    	Object.keys(saveDataObj.inputValues).forEach((key) => {
    		inputValues[key] = saveDataObj.inputValues[key];
    	});
    }
    if ('specifiedSpawnDirs' in saveDataObj) {
    	specifiedSpawnDirs = saveDataObj.specifiedSpawnDirs;
    }
    if ('mabikiCells' in saveDataObj) {
    	mabikiCells = saveDataObj.mabikiCells;
    }
  }
  Object.keys(inputValues).forEach((key) => {
    if (key.indexOf('checkbox') > -1) {
      document.getElementById(key).checked = inputValues[key];
    } else {
      document.getElementById(key).value = inputValues[key];
    }
  });
	for (let i = 1; i <= 10; i += 1) {
		const elms = document.getElementsByName(`spawn-dir-${i}`);
		elms[specifiedSpawnDirs[i - 1]].checked = true;
	}
};


/** setEvents()
 */
function setEvents() {
	// ローカルストレージからロード
  load();
  
  // 開始ボタン
  const startButton = document.getElementById('start-button');
  // クリックしたとき
  startButton.addEventListener('click', (e) => {
  	// ゲームを開始
    startGame();
  });
  
  // 一時停止/再開ボタン
  const pauseButton = document.getElementById('pause-button');
  // 一時停止/再開ボタンをクリックしたとき
  pauseButton.addEventListener('click', function(e) {
  	// 現在一時停止中かどうかで場合分け
    if (createjs.Ticker.isPaused) {
    	// 一時停止中なら再開処理を入れてやる
    	isPlaying = true;
      createjs.Ticker.isPaused = false;
      createjs.Ticker.on('tick', updater);
      this.textContent = '一時停止';
    } else {
    	// ゲーム中ならば一時停止処理を入れてやる
    	isPlaying = false;
      createjs.Ticker.isPaused = true;
      createjs.Ticker.reset();
      this.textContent = '再開';
    }
  });
  
  // 停止ボタン
  const stopButton = document.getElementById('stop-button');
  // クリックしたとき
  stopButton.addEventListener('click', (e) => {
    // ゲームを停止
    finishGame();
  });
  
  // チェックボックス要素<input>
  const checkboxElements = document.getElementsByClassName('checkbox-input');
  // すべてのチェックボックス要素について
  Array.prototype.forEach.call(checkboxElements, (elm) => {
  	// 値が変更されたとき
    elm.addEventListener('change', (e) => {
      // チェックが入っているかどうかの真偽値を
      const value = elm.checked;
      // idをキーにして連想配列inputValuesに代入し
      inputValues[elm.id] = value;
      // ローカルストレージにセーブ
      save();
    });
  });
  
  // 数値入力要素<input>
  const numberInputElements = document.getElementsByClassName('number-input');
  // すべての数値入力要素について
  Array.prototype.forEach.call(numberInputElements, (elm) => {
  	// 値が変更されたとき
    elm.addEventListener('change', (e) => {
    	// 入力値を小数に変換
      let value = parseFloat(elm.value);
      // 数値かどうか
      if (isNaN(value)) {
        // 数値ではないならばerrorクラスを追加する
        elm.classList.add('error');
      } else {
      	// 数値ならば0以上100以下に丸め込み
      	if (elm.getAttribute('max') != '-1') {
        	value = Math.max(0, Math.min(100, value));
      	}
        // errorクラスを削除し
        elm.classList.remove('error');
        // idをキーにして連想配列inputValuesに代入し
        inputValues[elm.id] = value;
        // ローカルストレージにセーブ
        save();
        // 入力値を更新する
        elm.value = value;
      }
    });
  });
  
  // 各チェックボックス
  // チェックボックスにチェックが入っているときだけ
  // コンテンツを表示する
  [
  	'auto-mabiki-checkbox',
  	'mabiki-cell-checkbox',
  	'spawn-dir-checkbox',
  	'auto-ikura-pickup-checkbox',
  	'seed-fix-checkbox',
  ].forEach((item) => {
	  const checkbox = document.getElementById(item);
	  const onchange = () => {
	  	const value = checkbox.checked;
	  	const prop = (value) ? 'block' : 'none';
	  	document.getElementById(`${item}-content`).style.setProperty('display', prop);
	  };
	  checkbox.addEventListener('change', onchange);
	  onchange();
  	if (item === 'mabiki-cell-checkbox') {
  		checkbox.addEventListener('change', drawMap);
  	}
  });
  
  // 間引きレートセル
  const mabikiRatios = document.querySelectorAll('.mabiki-table td');
  // すべての間引きレートセルについて
  Array.prototype.forEach.call(mabikiRatios, (elm) => {
  	// クリックされたとき
    elm.addEventListener('click', (e) => {
      // テキストコンテントから間引きレートを取得、整数に変換
      const value = parseInt(elm.textContent);
      // 選択中の間引きレートを表示するためのセルを書き換える
      const selectSpan = document.getElementsByClassName('mabiki-select')[0];
      selectSpan.textContent = value;
      selectSpan.style.setProperty('background', COLOR_MABIKI.replace('alpha', value / 100));
      // 選択中の間引きレートを変数に代入
      selectMabikiRatio = value;
    });
  });
  
  // 間引きマスリセットボタン
  const mabikiResetButton = document.getElementById('mabiki-reset-button');
  // クリックしたとき
  mabikiResetButton.addEventListener('click', (e) => {
  	console.log('間引きマスをリセットしました');
    while (mabikiCells[0]) {
    	mabikiCells.pop();
    }
    drawMap();
  });
  
  // 湧き方角指定ラジオボタン
  const spawnDirTable = document.getElementById('spawn-dir-table');
  const spawnDirRadios = spawnDirTable.querySelectorAll('input[type=radio]');
  Array.prototype.forEach.call(spawnDirRadios, (elm) => {
  	if (elm.name === 'spawn-dir-0') {
	    elm.addEventListener('change', (e) => {
	    	const no = parseInt(elm.name.replace('spawn-dir-', ''));
	    	const value = elm.value;
	    	let dir = 0;
	    	for (let i = 0; i < SPAWN_DIRS.length; i += 1) {
	    		if (SPAWN_DIRS[i].name === value) {
	    			dir = i;
	    			break;
	    		}
	    	}
		  	for (let i = 1; i <= 10; i += 1) {
		  		const elms = document.getElementsByName(`spawn-dir-${i}`);
		  		elms[dir].checked = true;
	    		specifiedSpawnDirs[i - 1] = dir;
		  	}
	    	save();
	    });
  	} else {
	    elm.addEventListener('change', (e) => {
	    	const no = parseInt(elm.name.replace('spawn-dir-', ''));
	    	const value = elm.value;
	    	let dir = 0;
	    	for (let i = 0; i < SPAWN_DIRS.length; i += 1) {
	    		if (SPAWN_DIRS[i].name === value) {
	    			dir = i;
	    			break;
	    		}
	    	}
	    	specifiedSpawnDirs[no - 1] = dir;
	    	save();
	    });
  	}
  });
  
  
}

/** drawMap()
 */
let mapSprite;
function drawMap() {
  // マップ描画
  if (!mapSprite) {
    mapSprite = new createjs.Shape();
    stage.addChild(mapSprite);
  } else {
    mapSprite.graphics.clear();
  }
  mapSprite.graphics
    .beginFill(COLOR_BG)
    .rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  for (let y = 0; y < rowWallStrs.length; y += 1) {
    for (let x = 0; x < rowWallStrs[0].length; x += 1) {
      if (rowWallStrs[y][x] !== '　') {
        mapSprite.graphics
          .beginStroke(COLOR_WALL)
          .moveTo(MARGIN_X + (x + 0) * CELL_SIZE, MARGIN_Y + (y + 0) * CELL_SIZE)
          .lineTo(MARGIN_X + (x + 1) * CELL_SIZE, MARGIN_Y + (y + 0) * CELL_SIZE)
          .endStroke();
      }
    }
  }
  for (let y = 0; y < colWallStrs.length; y += 1) {
    for (let x = 0; x < colWallStrs[0].length; x += 1) {
      if (colWallStrs[y][x] !== '　') {
        mapSprite.graphics
          .beginStroke(COLOR_WALL)
          .moveTo(MARGIN_X + (x + 0) * CELL_SIZE, MARGIN_Y + (y + 0) * CELL_SIZE)
          .lineTo(MARGIN_X + (x + 0) * CELL_SIZE, MARGIN_Y + (y + 1) * CELL_SIZE)
          .endStroke();
      }
    }
  }
  if (inputValues['mabiki-cell-checkbox']) {
	  mabikiCells.forEach((cell) => {
	    mapSprite.graphics
	      .beginFill(COLOR_MABIKI.replace('alpha', cell.ratio / 100))
	      .rect(
	        MARGIN_X + (cell.x + 0) * CELL_SIZE,
	        MARGIN_Y + (cell.y + 0) * CELL_SIZE,
	        CELL_SIZE - 1,
	        CELL_SIZE - 1
	      );
	  });
	}
  mapSprite.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  stage.update();
}

/** initialize()
 */
function initialize() {
  setEvents();
  createMapData();
  createjs = window.createjs;
  canvas = document.getElementById(CANVAS_ID);
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const canvasWrapper = document.getElementById('canvas-wrapper');
  canvasWrapper.style.setProperty('width', CANVAS_WIDTH + 'px');
  canvasWrapper.style.setProperty('height', CANVAS_HEIGHT + 'px');
  
  // WebGLが有効かどうかで場合分け
  if (IS_ENABLED_STAGEGL) {
    // WebGLが有効な場合
    // StageGL(WebGL製のステージ)を作成して背景色を設定
    stage = new createjs.StageGL(canvas);
    stage.setClearColor(CLEAR_COLOR);
  } else {
    // WebGLが有効ではない場合
    // Stage(2dContext製のステージ)を作成
    stage = new createjs.Stage(canvas);
  }
  // stageをcanvasから参照できるようにしておく
  canvas.stage = stage;
  // マウスオーバーを有効化
  stage.enableMouseOver();
  // タッチが有効なデバイスならタッチ操作の有効化
  if (createjs.Touch.isSupported()) {
    createjs.Touch.enable(stage);
  }
  // CreateJSのフレームレートの設定
  if (SHOULD_USE_TIMEOUT) {
    // setTimeoutを使う場合
    createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
    createjs.Ticker.framerate = FRAME_RATE * GAME_SPEED;
  } else if (FRAME_RATE >= 60) {
    // RAF(Request Animation Frame)を使用する、かつ、60FPS以上の場合
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
  } else {
    // RAF(Request Animation Frame)を使用する、かつ、60FPS未満の場合
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = FRAME_RATE;
  }
  updater = () => {};
  drawMap();
  mapSprite.on('mousedown', (e) => {
    const mx = stage.mouseX - MARGIN_X;
    const my = stage.mouseY - MARGIN_Y;
    const cx = Math.floor(mx / CELL_SIZE);
    const cy = Math.floor(my / CELL_SIZE);
    if (cx >= 0 && cx < mapSizeX && cy >= 0 && cy < mapSizeY) {
    	attackX = cx;
    	attackY = cy;
    }
  });
  mapSprite.on('pressmove', (e) => {
    const mx = stage.mouseX - MARGIN_X;
    const my = stage.mouseY - MARGIN_Y;
    const cx = Math.floor(mx / CELL_SIZE);
    const cy = Math.floor(my / CELL_SIZE);
    if (cx >= 0 && cx < mapSizeX && cy >= 0 && cy < mapSizeY) {
    	attackX = cx;
    	attackY = cy;
    }
  });
  mapSprite.on('pressup', (e) => {
  	attackX = -1;
  	attackY = -1;
  });
  // マップをクリックしたとき
  mapSprite.on('click', (e) => {
  	if (isPlaying) {
  		return;
  	}
  	// マップ上の何マス目をクリックしたのかを判定
  	// キャンバス上のクリック座標から余白を引いてセルサイズで割ればいい
    const mx = stage.mouseX - MARGIN_X;
    const my = stage.mouseY - MARGIN_Y;
    const cx = Math.floor(mx / CELL_SIZE);
    const cy = Math.floor(my / CELL_SIZE);
    // クリックしたマスがマップ内かどうか
    if (cx >= 0 && cx < mapSizeX && cy >= 0 && cy < mapSizeY) {
      // マップ内ならば
      console.log(`クリックした場所 = (${cx}, ${cy})`);
      console.log(`選択中の間引きレート = ${selectMabikiRatio}%`);
      // クリックしたマスにすでに間引きマスが設置されているかどうか
      // mabikiCellsを走査して確かめよう
      let exists = false;
      for (let i = 0; i < mabikiCells.length; i += 1) {
        const cell = mabikiCells[i];
        if (cx === cell.x && cy === cell.y) {
        	// すでに設定されていた！
          exists = true;
          if (selectMabikiRatio === 0) {
            // 選択中の間引きレートがゼロならばこの間引きマスは削除する必要がある
            mabikiCells.splice(i, 1);
          } else {
            // 選択中の間引きレートがゼロではないならば上書き
            cell.ratio = selectMabikiRatio;
          }
          break;
        }
      }
      // クリックしたマスに間引きマスがまだ設定されておらず
      if (!exists) {
      	// 選択中の間引きレートがゼロではないならば
        if (selectMabikiRatio !== 0) {
        	// mabikiCellsにプッシュ
          mabikiCells.push({
            x: cx,
            y: cy,
            ratio: selectMabikiRatio,
          });
        }
      }
      console.log(`現在の間引きセル = %o`, mabikiCells);
      // マップを再描画する
      drawMap();
      save();
    } else {
    	// クリックしたマスがマップ外ならば何もしない
      console.log(`クリックした場所 = (${cx}, ${cy})`);
      console.error('マップ外です');
    }
  });
  
	const style = document.createElement('style');
	let html = '';
  for (let i = 0; i <= 100; i += 10) {
  	const color = COLOR_MABIKI.replace('alpha', i / 100);
  	html += `.mabiki-${i}{background:${color};}`;
  }
	style.innerHTML = html;
  document.head.appendChild(style);
  
  
  debugs = {};
  [
  	'info-left-seconds',
  	'info-pop-golden-egg-counts',
  	'info-golden-egg-counts',
  	'info-salmonid-counts',
  	'info-pop-salmonid-counts',
  	'info-lost-salmonid-counts',
  	'info-aki',
  	'info-manseki',
  ].forEach((id) => {
  	debugs[id] = document.getElementById(id);
  });
  // すべての帰宅地点候補について
  SPAWN_POINTS.forEach((p) => {
    // その帰宅地点へのルートマップを取得する
    getRouteMap(p.x, p.y);
  });
}

window.addEventListener('load', () => {
  initialize();
});

/*
let myChum;
window.addEventListener('keydown', (e) => {
  if (!ika) {
    return;
  }
  let dirId = -1;
  switch (e.key) {
    case 'ArrowUp':
      dirId = 0;
      break;
    case 'ArrowRight':
      dirId = 1;
      break;
    case 'ArrowDown':
      dirId = 2;
      break;
    case 'ArrowLeft':
      dirId = 3;
      break;
    case 'a':
      myChum = new Chum();
      myChum.setXY(6, 6);
      myChum.setRouteMap(9, 8);
      stage.update();
      break;
    case 'b':
      myChum.move();
      stage.update();
      break;
  }
  if (dirId > -1) {
    if (walkableDirMap[ika.y][ika.x][dirId]) {
      const dir = DIRS[dirId];
      ika.addPos(...dir);
    }
  }
});
*/