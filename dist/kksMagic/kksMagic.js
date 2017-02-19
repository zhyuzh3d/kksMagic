/**
 * <a-entity kks-magic='preset:_default,options:{color:"#E91E61"}'></a-entity>
 * 最基本的aframe粒子系统注册kks-magic组件
 * 生成全局KKsMagic对象
 * 可以使用KKsMagic.addPreset(name preset)方法添加新的预设，然后再使用
 * preset格式{init,tick,update}三个函数
 * preset.init函数必须返回一个THREE.Points对象
 * 在函数中this指向el，比如this.$kksMagic.geometry指向threejs对象
 * preset.tick函数通过修改ctx.$kksMagic.geometry.vertices数组所有点实现动画效果
 * 在函数中可以访问this.data.options对象访问用户entity中设定的参数，注意parse处理
 * 默认_default预设为400立方范围内降落的方形白色粒子
 */

(function () {
    window.KKsMagic = {
        /**
         * 添加一个新的预设模版
         * @param {string} name   预设模版的名称
         * @param {object} preset {init,tick,update}三个函数
         */
        addPreset: function (name, preset) {
            if (this.presets[name]) {
                console.log('KKsMagic:addPreset:', name, 'has used.');
                console.info('┖--You can log KKsMagic.presets to see all presets.');
            } else {
                this.presets[name] = preset;
            };
        },
        presets: {},
    };

    //-------------注册组件--------------
    AFRAME.registerComponent('kks-magic', {
        schema: {
            preset: {
                type: 'string',
                default: '_default',
            },
            options: {
                type: 'string',
                parse: function (val) {
                    var res = eval('(function(){return ' + val + '})()');
                    return res;
                },
            },
            init: {
                type: 'string',
                default: 'init',
            },
            tick: {
                type: 'string',
                default: 'tick',
            },
            update: {
                type: 'string',
                default: 'update',
            },
        },
        init: function () {
            var ctx = this;
            if (!KKsMagic.presets[ctx.data.preset]) {
                console.warn('KKsMagic:init:preset not found:', ctx.data.preset, ',set as _default.');
                console.info('┖--You can log KKsMagic.presets to see all valid names.');
                ctx.data.preset = '_default';
            };

            var points;
            if (KKsMagic.presets[ctx.data.preset].init) {
                points = KKsMagic.presets[ctx.data.preset].init.call(ctx, arguments);

            };

            if (points) {
                if (points.constructor != THREE.Points && points.constructor != THREE.Group) {
                    points = new THREE.Points(new THREE.Geometry(), new THREE.PointsMaterial());
                    console.warn('KKsMagic:init:not return a THREE.Points/THREE.Group object:', ctx.data.preset, ',use a default THREE.Points.');
                };
            } else {
                points = new THREE.Points(new THREE.Geometry(), new THREE.PointsMaterial());
                console.warn('KKsMagic:init:not return a object:', ctx.data.preset, ',use a default THREE.Points..');
            };

            ctx.$kksMagic = points;
            ctx.el.setObject3D('kks-magic', ctx.$kksMagic);
        },
        update: function () {
            var ctx = this;
            if (KKsMagic.presets[ctx.data.preset].update) {
                KKsMagic.presets[ctx.data.preset].update.call(ctx, arguments);
            };
        },
        tick: function () {
            var ctx = this;
            if (KKsMagic.presets[ctx.data.preset].tick) {
                KKsMagic.presets[ctx.data.preset].tick.call(ctx, arguments);
            };
        },
        remove: function () {
            var ctx = this;
            if (KKsMagic.presets[ctx.data.preset].remove) {
                KKsMagic.presets[ctx.data.preset].remove.call(ctx, arguments);
            };
            if (!ctx.$kksMagic) {
                return;
            };
            ctx.el.removeObject3D('kks-magic');
        },
        pause: function () {
            var ctx = this;
            if (KKsMagic.presets[ctx.data.preset].pause) {
                KKsMagic.presets[ctx.data.preset].pause.call(ctx, arguments);
            };
        },
        play: function () {
            var ctx = this;
            if (KKsMagic.presets[ctx.data.preset].play) {
                KKsMagic.presets[ctx.data.preset].play.call(ctx, arguments);
            };
        },
    });


    //--------------添加默认default预设-----------------

    KKsMagic.addPreset('_default', {
        init: defaultInit,
        tick: defaultTick,
        update: undefined,
        author: 'zhyuzh',
        desc: 'A 400X400X400 snow box,not textured,with options.color,as default preset.',
    });

    /**
     * 默认的初始化粒子函数,
     * 400立方的范围随机生成粒子
     * 读取默认图片材质
     * @returns {object} THREE.Points
     */
    function defaultInit() {
        var ctx = this;
        var count = 100;
        var geo = new THREE.Geometry();

        for (var p = 0; p < count; p++) {
            var x = Math.random() * 400 - 200;
            var y = Math.random() * 400 - 200;
            var z = Math.random() * 400 - 200;
            var particle = new THREE.Vector3(x, y, z);
            geo.vertices.push(particle);
        };

        var mat = new THREE.PointsMaterial({
            color: ctx.data.options.color || '#FFFFFF',
            size: 4,
            //map: new THREE.TextureLoader().load("./imgs/particle.png"),
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        var kk = new THREE.Points(geo, mat);
        return kk;
    };

    /**
     * 默认每次tick的函数,自动下落，落到最低返回顶部
     */
    function defaultTick() {
        var ctx = this;
        var time = arguments[0][0];
        var deltaTime = arguments[0][1];

        var verts = ctx.$kksMagic.geometry.vertices;
        for (var i = 0; i < verts.length; i++) {
            var vert = verts[i];
            if (vert.y < -200) {
                vert.y = Math.random() * 400 - 200;
            }
            vert.y = vert.y - (0.1 * deltaTime);
        }
        ctx.$kksMagic.geometry.verticesNeedUpdate = true;
    };

})();






//
