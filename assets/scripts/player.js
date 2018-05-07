// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var game_scene = require("game_scene");
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
        init_speed: 150,
        a_power: 600,
        y_radio: 0.5560472,

        game_manager: {
            type: game_scene,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.next_block = null;
        this.direction = 1; // 1，-1
    },

    player_jump() {
        var x_distance = this.x_distance * this.direction;
        var y_distance = this.x_distance * this.y_radio;

        var target_pos = this.node.getPosition();
        target_pos.x += x_distance;
        target_pos.y += y_distance;

        this.rot_node.runAction(cc.rotateBy(0.5, 360 * this.direction));

        

        var w_pos = this.node.parent.convertToWorldSpaceAR(target_pos);
        var is_game_over = false;
        if (this.next_block.is_jump_on_block(w_pos, this.direction)) {
            target_pos = this.node.parent.convertToNodeSpaceAR(w_pos); // target_pos就变成了参考点的位置;
        }
        else {
            is_game_over = true;
        }

        var j = cc.jumpTo(0.5, target_pos, 200, 1);
        this.direction = (Math.random() < 0.5) ? -1 : 1;

        var end_func = cc.callFunc(function() {
            if (is_game_over) {
                this.game_manager.on_checkout_game();
            }
            else {
                if (this.direction === -1) {
                    this.game_manager.move_map(580 - w_pos.x, -y_distance);    
                }
                else {
                    this.game_manager.move_map(180 - w_pos.x, -y_distance);
                }
            }
        }.bind(this));

        
        var seq = cc.sequence(j, end_func);

        this.node.runAction(seq);
    },

    set_next_block(block) {
        this.next_block = block;
    },

    start () {
        

        this.rot_node = this.node.getChildByName("rotate");
        this.anim_node = this.rot_node.getChildByName("anim");

        this.is_power_mode = false;
        this.speed = 0;
        this.x_distance = 0;

        this.anim_node.on(cc.Node.EventType.TOUCH_START, function(e) {
            this.is_power_mode = true;
            this.x_distance = 0;
            this.speed = this.init_speed;

            this.anim_node.stopAllActions();
            this.anim_node.runAction(cc.scaleTo(2, 1, 0.5));
        }.bind(this), this);

        this.anim_node.on(cc.Node.EventType.TOUCH_END, function(e) {
            this.is_power_mode = false;
            this.anim_node.stopAllActions();
            this.anim_node.runAction(cc.scaleTo(0.5, 1, 1));

            this.player_jump();
        }.bind(this), this);

        this.anim_node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
            this.is_power_mode = false;
            this.anim_node.stopAllActions();
            this.anim_node.runAction(cc.scaleTo(0.5, 1, 1));

            this.player_jump();
        }.bind(this), this);
    },

    update (dt) {
        if (this.is_power_mode) {
            this.speed += (this.a_power * dt);
            this.x_distance += this.speed * dt;
        }
    },
});
