/**
 * v0.3.0
 * KKsMagic飘雪预设
 * 随机舞动dance效果需要SimplexNoise和polyfill/typedarray支持
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
        pos: '0 -30 0', //飘雪范围的中心，不推荐修改;低于y值雪花消失
        box: '100 10 100', //生成雪花的盒子，相对于pos，范围越大需要生成越多的雪花
        boxHeight: 90, //雪花盒子的距离地面的高度
        speed: 10, //每秒向下移动数值，推荐5～20
        acc: 5, //加速度，每秒变化量,生成时生效，推荐小于speed；这个值同时轻微影响dance效果
        accRand: 2, //加速度随机变化值，生成时生效，推荐与acc相加小于speed；
        dance: 7, //每秒飘舞幅度，值越大水平方向飘动越严重，即时生效，推荐2～10
        color: '#FFFFFF', //雪花的颜色，不推荐修改
        colors: undefined, //随机颜色，数组，将覆盖color选项。不推荐使用
        opacity: 0.66, //雪花透明度，推荐0.1～1
        textrue: path + "imgs/dot-64.png", //雪花的形状图片，不推荐修改
    };

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
            time: 0,
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

        //整理数据
        if (ctx.$kksOpt.box.constructor == String) {
            var boxArr = ctx.$kksOpt.box.split(' ');
            ctx.$kksOpt.box = new THREE.Vector3(Number(boxArr[0]), Number(boxArr[1]), Number(boxArr[2]));
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

        var timeUnit = kksData.time == 0 ? 0.16 : deltaTime / 1000;
        var n = timeUnit * kksOpt.count;

        for (var i = 0; i < n; i++) {
            var p = {};

            var x = kksOpt.pos.x + Math.random() * kksOpt.box.x - kksOpt.box.x / 2;
            var y = kksOpt.pos.y + kksOpt.boxHeight + Math.random() * kksOpt.box.y - kksOpt.box.y / 2;
            var z = kksOpt.pos.z + Math.random() * kksOpt.box.z - kksOpt.box.z / 2;
            p.pos = new THREE.Vector3(x, y, z);

            p.acc = genRandomV3().multiplyScalar((kksOpt.acc + Math.random() * kksOpt.accRand));

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
    var danceGen = SimplexNoise ? new SimplexNoise() : undefined;

    function tickSnow(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        kksData.time += deltaTime;
        var timeUnit = kksData.time == 0 ? 0.16 : deltaTime / 1000;

        var parr = [];
        var varr = [];
        var carr = [];

        //使用最新的雪花，超过数量限制的忽略掉
        var offset = kksData.points.length < ctx.$kksOpt.maxCount ? 0 : kksData.points.length - ctx.$kksOpt.maxCount;

        for (var i = offset; i < kksData.points.length; i++) {
            var p = kksData.points[i];
            if (p && p.pos && p.pos.y >= kksOpt.pos.y) {

                if (danceGen) {
                    var ax = danceGen.noise2D(p.pos.y * 0.05, p.acc.x);
                    var az = danceGen.noise2D(p.pos.y * 0.05, p.acc.z);
                    var ay = danceGen.noise2D(p.pos.y * 0.05, p.acc.y);
                    var dance = new THREE.Vector3(ax, ay, az);
                    dance.multiplyScalar(kksOpt.dance * timeUnit);
                    p.pos.add(dance);
                };

                p.pos.add(p.acc.clone().multiplyScalar(timeUnit));
                p.pos.setY(p.pos.y -= kksOpt.speed * timeUnit);

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


    //--------------ext function-------
    /**
     * 生成随机数字,正负值,-1到+1
     * @returns {number} res
     */
    function genRandom() {
        if (Math.random() > 0.5) {
            return Math.random();
        } else {
            return Math.random() * -1;
        };
    };

    /**
     * 生成随机Vector3，正负值,-1到1
     * @returns {number} res
     */
    function genRandomV3(base) {
        return new THREE.Vector3(genRandom(), genRandom(), genRandom());
    };


})();


///
