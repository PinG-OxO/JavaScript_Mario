// おじさんクラス

const ANIME_STAND = 0;          // 立ちアニメーション
const ANIME_WALK  = 1;          // 歩きアニメーション
const ANIME_BRAKE = 2;          // ブレーキアニメーション
const ANIME_JUMP  = 4;          // ジャンプのアニメーション
const GRAVITY     = 4;          // 重力
const MAX_SPEED   = 32;         // 最高速度
const WALK_LEFT   = 1;          // 左向き
const WALK_RIGHT  = 0;          // 右向き

class Ojisan {
    constructor(x, y){
        this.x  = x<<4;
        this.y  = y<<4;
        this.vx = 0;
        this.vy = 0;
        this.animeNum  = 0;
        this.spriteNum = 0;
        this.animeCount = 0;
        this.direction = 0;
        this.jump = 0;
    }

    // フレームごとの更新処理
    update(){
        // アニメーションのカウント
        this.animeCount++;
        if(Math.abs(this.vx) === MAX_SPEED) this.animeCount++;

        this.updateAnime();
        this.updateWalk();
        this.updateJump();

        // 重力を追加
        if(this.vy < 64) this.vy += GRAVITY;

        // おじさんの座標を更新
        this.x += this.vx;
        this.y += this.vy;

        // 床に着地させる
        if(this.y > 160<<4) {
            if(this.animeNum === ANIME_JUMP)this.animeNum = ANIME_WALK;
            this.jump = 0;
            this.y = 160<<4;
            this.vy = 0;
        }
    }

    // 移動処理

    updateWalkSub(dir){
        // 最高速まで加速
        if(dir === 0 && this.vx <  MAX_SPEED)this.vx++;
        if(dir === 1 && this.vx > -MAX_SPEED)this.vx--;

        if(!this.jump){
            // 歩きアニメ
            this.animeNum   = ANIME_WALK;
            // 方向転換
            this.direction  = dir;
            // 逆キー入力でブレーキ
            if(this.vx < 0 && dir === WALK_RIGHT)this.vx++;
            if(this.vx > 0 && dir ===  WALK_LEFT)this.vx--;
            // 強いブレーキのときブレーキアニメ
            if(this.vx > 8 && dir ===  WALK_LEFT ||
               this.vx < -8 && dir === WALK_RIGHT)
                this.animeNum = ANIME_BRAKE;
            // 立ちアニメのときカウンタリセット
            if(this.animeNum === 0)this.animeCount = 0;
        }
    }

    updateWalk(){
        // 左右の移動
        if(keyb.Left) {
            this.updateWalkSub(WALK_LEFT);
        }
        else if(keyb.Right) {
            this.updateWalkSub(WALK_RIGHT);
        }
        else {
            if(!this.jump){
                if(this.vx > 0)this.vx--;
                if(this.vx < 0)this.vx++;
                if(!this.vx)this.animeNum = ANIME_STAND;
            }
        }
    }

    // ジャンプ処理
    updateJump(){
        if(keyb.Abutton) {
            if(this.jump === 0) {
                this.animeNum = ANIME_JUMP;
                this.jump = 1;
            }
            if(this.jump < 15)this.vy = -(64 - this.jump);
        }
        if(this.jump)this.jump++;
    }

    // アニメーション処理
    updateAnime(){
        // スプライトの決定
        switch(this.animeNum) {
            case ANIME_STAND:
                this.spriteNum = 0;
                break;
            case ANIME_WALK:
                this.spriteNum = 2 + (this.animeCount/6) % 3;
                break;
            case ANIME_BRAKE:
                this.spriteNum = 5;
                break;
            case ANIME_JUMP:
                this.spriteNum = 6;
                break;
        }
        // 向きの決定
        if(this.direction)this.spriteNum += 48;
    }

    // フレームごとの描画処理
    draw(){
        let px = (this.x>>4) - field.scx;
        let py = (this.y>>4) - field.scy;
        drawSprite(this.spriteNum, px, py);
    }
}