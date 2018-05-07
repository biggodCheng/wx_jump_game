// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.mid = this.node.getChildByName("mid");
        this.up = this.node.getChildByName("up");
        this.down = this.node.getChildByName("down");

        this.left = this.node.getChildByName("left");
        this.right = this.node.getChildByName("right");
    },

    // dir = 1, 右边跳跃, -1 表示左边跳跃
    is_jump_on_block(w_dst_pos, direction) {
        var mid_pos = this.mid.convertToWorldSpaceAR(cc.p(0, 0));
        var dir = cc.pSub(w_dst_pos, mid_pos);
        var min_len = cc.pLength(dir);
        var min_pos = mid_pos;

        if (direction === 1) {
            var up_pos = this.up.convertToWorldSpaceAR(cc.p(0, 0));
            dir = cc.pSub(w_dst_pos, up_pos);
            var len = cc.pLength(dir);
            if (min_len > len) {
                min_len = len;
                min_pos = up_pos;
            }

            var down_pos = this.down.convertToWorldSpaceAR(cc.p(0, 0));
            dir = cc.pSub(w_dst_pos, down_pos);
            var len = cc.pLength(dir);
            if (min_len > len) {
                min_len = len;
                min_pos = down_pos;
            }
        }
        else {
            var left_pos = this.left.convertToWorldSpaceAR(cc.p(0, 0));
            dir = cc.pSub(w_dst_pos, left_pos);
            var len = cc.pLength(dir);
            if (min_len > len) {
                min_len = len;
                min_pos = left_pos;
            }
            var right_pos = this.right.convertToWorldSpaceAR(cc.p(0, 0));
            dir = cc.pSub(w_dst_pos, right_pos);
            var len = cc.pLength(dir);
            if (min_len > len) {
                min_len = len;
                min_pos = right_pos;
            }
        }

        // 找到了跳跃的位置距离参考点最近的那个参考点以及位置;
        dir = cc.pSub(w_dst_pos, min_pos);
        if (cc.pLength(dir) < 100) {
            w_dst_pos.x = min_pos.x;
            w_dst_pos.y = min_pos.y;
            return true;
        }
        // end 

        return false;
    }

    // update (dt) {},
});
