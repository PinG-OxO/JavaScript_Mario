// 仮想キャンバスの作成
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

// 実キャンバスの作成
let can = document.getElementById("can");
let con = can.getContext("2d");

// フレームレート関連
let frameCount = 0;
let startTime;

// 仮想キャンバスのサイズ設定
vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;   

// 実キャンバスのサイズ設定
can.width = SCREEN_SIZE_W * 3;
can.height = SCREEN_SIZE_H * 3;

con.imageSmoothingEnabled = false;     // モザイクを防ぐ

let chImg = new Image(); chImg.src = "Image/sprite.png";    // 画像を取得

let keyb = {}; // キーボードの状態を保存する連想配列

let field = new Field();    // フィールドのインスタンスを生成

let ojisan = new Ojisan(100, 150); // おじさんのインスタンスを生成

// 更新処理
function update()
{
    // マップを更新
    field.update();
    // おじさんの更新
    ojisan.update();
}

function drawSprite(snum, x, y)
{
    let sx = (snum & 15) << 4;
    let sy = (snum >> 4) << 4;
    vcon.drawImage(chImg, sx, sy, 16, 32, x, y, 16, 32);
}

// 描画処理
function draw()
{
    // 仮想画面のクリア
    vcon.fillStyle = "#66AAFF";
    vcon.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H); 

    // マップを描画
    field.draw();

    // おじさんを描画
    ojisan.draw();

    // デバッグ情報を表示
    vcon.font = "24px 'Impact' ";
    vcon.fillStyle = "white";
    vcon.fillText("Frame: " + frameCount, 10, 20);

    // 仮想画面から実画面へ拡大転送
    con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H, 0, 0, SCREEN_SIZE_W * 3, SCREEN_SIZE_H * 3);
}

// ループ開始
window.onload = function()
{
    startTime = performance.now();
    mainLoop();
}

// メインループ
function mainLoop()
{
    let nowTime = performance.now();
    let nowFrame = (nowTime - startTime) / GAME_FPS;

    if(nowFrame > frameCount)
    {
        let c = 0;
        while(nowFrame > frameCount)
        {
            frameCount++;
            // 更新処理
            update();
            if(++c >= 4)break;
        }

            // 描画処理
            draw();
    }
    requestAnimationFrame(mainLoop);
}

// キーボードが押された時
document.onkeydown = function(e)
{
    switch(e.key) {
        case 'ArrowLeft':
            keyb.Left = true;
            break;
        case 'ArrowRight':
            keyb.Right = true;
            break;
        case 'z':
            keyb.Bbutton = true;
            break;
        case 'x':
            keyb.Abutton = true;
            break;
        case 'a':
            field.scx--;
            break;
        case 's':
            field.scx++;
            break;
    }
}

// キーボードが離された時
document.onkeyup = function(e)
{
    switch(e.key) {
        case 'ArrowLeft':
            keyb.Left = false;
            break;
        case 'ArrowRight':
            keyb.Right = false;
            break;
        case 'z':
            keyb.Bbutton = false;
            break;
        case 'x':
            keyb.Abutton = false;
            break;
    }
}