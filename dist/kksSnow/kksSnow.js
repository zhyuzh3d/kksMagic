/**
 * v0.2.0
 * KKsMagic飘雪预设
 */


(function () {
    //获取预设所在路径
    var js = document.scripts;
    js = js[js.length - 1];
    var path = js.src.substring(0, js.src.lastIndexOf("/") + 1);

    //注册预设
    KKsMagic.addPreset('snow', {
        init: init,
        tick: tick,
        author: 'zhyuzh',
        desc: 'A 400X400X400 snow box,not textured,with options.color,as default preset.',
    });


    var kksOpt = {
        maxCount: 2000, //最大雪花数量，超过这个数量的雪花会被忽略
        count: 20, //每秒产生雪花数量，推荐60～100
        size: 1, //雪花大小，不推荐修改
        speed: 5, //每秒向下移动数值
        color: '#FFFFFF', //雪花的颜色，不推荐修改
        colors: undefined, //随机颜色，数组，将覆盖color选项。不推荐使用
        opacity: 0.66, //雪花透明度，推荐0.1～1
        textrue: path + "imgs/dot-64.png", //雪花的形状图片，不推荐修改
        height: 50, //雪花生成的高度，不推荐修改
        low: -20, //雪花消失的高度，不推荐修改
        range: 100, //飘雪的范围，范围越大需要生成越多的雪花
        pos: '0 0 0', //飘雪范围的中心，不推荐修改
    }

    /**
     * 默认的初始化粒子函数,
     * 400立方的范围随机生成粒子
     * 读取默认图片材质
     * @returns {object} THREE.Points
     */
    function init() {
        var ctx = this;

        //生成基本数据
        ctx.$kksData = {
            points: [],
            colors: [],
        };

        genOpt.call(ctx);



        //生成Object3D对象
        ctx.$kksSnow = new THREE.Points(new THREE.Geometry(), ctx.$kksData.mat);
        var kksMagic = new THREE.Group();
        kksMagic.add(ctx.$kksSnow);

        //添加更新监听
        ctx.el.addEventListener('kksUpdate', function (evt) {
            ctx.data.options = evt.detail || {};
            genOpt.call(ctx);
            ctx.$kksSnow.material = ctx.$kksData.mat;
        });

        return kksMagic;
    };


    /**
     * 默认每次tick的函数,自动下落，落到最低返回顶部
     */
    function tick() {
        var ctx = this;
        var time = arguments[0][0];
        var deltaTime = arguments[0][1];

        genSnow.call(ctx, deltaTime);
        tickSnow.call(ctx, deltaTime);
    };


    //---------------functions--------------

    /**
     * 动态生成设置选项
     */
    function genOpt() {
        var ctx = this;
        ctx.$kksOpt = kksOpt;

        //合并用户设置，整理数据，以及数量限定
        ctx.$kksOpt = Object.assign(ctx.$kksOpt, ctx.data.options);

        //整理数据
        if (ctx.$kksOpt.pos.constructor == String) {
            var posArr = ctx.$kksOpt.pos.split(' ');
            ctx.$kksOpt.pos = new THREE.Vector3(Number(posArr[0]), Number(posArr[1]), Number(posArr[2]));
        };

        //生成材质
        var mat = new THREE.PointsMaterial({
            size: ctx.$kksOpt.size,
            map: new THREE.TextureLoader().load(ctx.$kksOpt.textrue),
            blending: THREE.AdditiveBlending,
            opacity: ctx.$kksOpt.opacity,
            transparent: true,
            depthTest: false,
        });

        //处理随机颜色
        if (ctx.$kksOpt.colors) {
            var carr = [];
            ctx.$kksOpt.colors.forEach(function (clr) {
                carr.push(new THREE.Color(clr));
            });
            ctx.$kksOpt.colors = carr;
            mat.vertexColors = THREE.VertexColors;
        } else {
            mat.color = new THREE.Color(ctx.$kksOpt.color);
        };

        ctx.$kksData.mat = mat;
    };


    /**
     * 生成雪花,将新的雪花points添加到points队列
     */
    function genSnow(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var n = deltaTime / 1000 * kksOpt.count;

        for (var i = 0; i < n; i++) {
            var p = {};

            var x = kksOpt.pos.x + Math.random() * kksOpt.range - kksOpt.range / 2;
            var z = kksOpt.pos.z + Math.random() * kksOpt.range - kksOpt.range / 2;
            p.pos = new THREE.Vector3(x, kksOpt.height + kksOpt.pos.y, z);

            //为了避免动态调整找不到clr，无论是否开启colors都指定clr参数
            if (kksOpt.colors) {
                var clr = kksOpt.colors[Math.floor(Math.random() * kksOpt.colors.length)];
                p.clr = clr;
                kksData.colors.push(clr);
            } else {
                p.clr = kksData.mat.color;
            };

            kksData.points.push(p);
        };
    };

    /**
     * 每帧都重新计算雪花的位置，生成新的物体
     */
    function tickSnow(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;


        var parr = [];
        var varr = [];
        var carr = [];

        //使用最新的雪花，超过数量限制的忽略掉
        var offset = kksData.points.length < ctx.$kksOpt.maxCount ? 0 : kksData.points.length - ctx.$kksOpt.maxCount;

        for (var i = offset; i < kksData.points.length; i++) {
            var p = kksData.points[i];
            if (p && p.pos && p.pos.y >= kksOpt.low) {
                p.pos.setY(p.pos.y -= kksOpt.speed * deltaTime / 1000);
                parr.push(p);
                varr.push(p.pos);
                if (kksOpt.colors) carr.push(p.clr);
            };
        };
        kksData.points = parr;

        //刷新粒子物体
        var newGeo = new THREE.Geometry();
        newGeo.vertices = varr;
        if (kksOpt.colors || kksOpt.colors) newGeo.colors = carr;

        ctx.$kksSnow.geometry = newGeo;
    };


})();


///
