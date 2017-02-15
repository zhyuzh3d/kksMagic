(function () {
    //所有函数都放在这里备用
    window.KKsMagicMethods = {
        _init: defaultInit,
        _tick: defaultTick,
        _update: function () {},
    };

    /**
     * 默认的初始化粒子函数,
     * 400立方的范围随机生成粒子
     * 读取默认图片材质
     * @returns {object} THREE.Points
     */
    function defaultInit() {
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
            color: 0xffffff,
            size: 4,
            map: THREE.ImageUtils.loadTexture("./imgs/particle.png"),
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        var kk = new THREE.Points(geo, mat);

        return kk;
    };


    /**
     * 默认每次tick的函数
     */
    function defaultTick() {
        var time = arguments[0][0];
        var deltaTime = arguments[0][1];

        var verts = this.KK.geometry.vertices;
        for (var i = 0; i < verts.length; i++) {
            var vert = verts[i];
            if (vert.y < -200) {
                vert.y = Math.random() * 400 - 200;
            }
            vert.y = vert.y - (0.1 * deltaTime);
        }
        this.KK.geometry.verticesNeedUpdate = true;
    };


    //注册组件
    AFRAME.registerComponent('kks-magic', {
        schema: {
            init: {
                type: 'string',
                default: '_init',
            },
            tick: {
                type: 'string',
                default: '_tick',
            },
            update: {
                type: 'string',
                default: '_update',
            },
        },
        init: function () {
            this.KK = KKsMagicMethods[this.data.init].call(this, arguments);
            this.el.setObject3D('kks-magic', this.KK);
        },
        update: function () {
            KKsMagicMethods[this.data.update].call(this, arguments);
        },
        tick: function () {
            KKsMagicMethods[this.data.tick].call(this, arguments);
        },
        remove: function () {
            if (!this.KK) {
                return;
            }
            this.el.removeObject3D('kks-magic');
        },
    });
})();









//
