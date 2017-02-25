/**
 * v0.5.5
 * Licence:Using this software, you have agreed to this,every fireworks is your blessing for kk.
 * KKsMagic焰火插件预设
 */

console.info('曾经的灯塔上面\n他为她放的烟火\n倒映在江面\n————洛天依《干物女/WeiWei》\nThanks for use kks-Magic and kks-fireworks.');

(function () {
    //获取预设所在路径
    var js = document.scripts;
    js = js[js.length - 1];
    var path = js.src.substring(0, js.src.lastIndexOf("/") + 1);

    //注册预设
    KKsMagic.addPreset('fireworks', {
        init: init,
        tick: tick,
        author: 'zhyuzh',
        desc: 'A pretty fireworks!',
    });

    //-------------base functions----------

    /**
     * 默认的初始化粒子函数,在这里初始化用户设置，初始化材质颜色
     * @returns {object} THREE.Points
     */
    function init() {
        var ctx = this;

        //默认设置
        ctx.$kksOpt = {
            rMaxCount: 1000, //发射粒子最大数量，超过这个值的粒子被忽略
            rCount: 300, //发射器每帧每秒喷射的粒子数量，推荐50～200
            rSpeed: 40, //发射器每秒向上飞行的速度，推荐10~50
            rSpread: 0.2, //发射器粒子扩散范围，数值越大拖尾越宽，推荐0.01~0.05
            rLife: 200, //发射器粒子的最大生命值,毫秒，值越大拖尾越长，推荐100~1000
            rLifeRand: 100, //发射器粒子生命值的随机值，下同，推荐参照rLife设置
            rSize: 3, //发射器粒子大小，推荐1～5
            rColor: '#c7f6ff', //发射器粒子颜色，如果需要多种颜色请使用rColors，下同
            rColors: ['#FF0000', '#dd1fff', '#ff6200'], //发射器粒子随机颜色
            rTexture: path + "/imgs/dot-64.png", //发射器粒子的形状贴图
            eMaxCount: 2000, //爆炸粒子最大数量，超过这个值的粒子被忽略
            eCount: 10, //爆炸粒子数量，如果使用爆炸拖尾和绽放，请尽可能设置最小如5～20；否则推荐100~2000
            eSize: 3, //爆炸粒子大小，推荐1～5
            eColor: '#ff67ff', //爆炸粒子颜色
            eColors: ['#ff52ff', '#ffff42', '#76ffff'], //爆炸粒子随机颜色
            eTexture: path + "/imgs/dot-64.png", //爆炸粒子形状贴图
            eAcc: 70, //爆炸粒子炸开的加速度，值越大炸爆炸圆越大，推荐50~100
            eAccRand: 10, //随机值,值越大爆炸圆形越不清晰
            eLife: 400, //爆炸粒子最大生命值，值越大爆炸圆越大
            eLifeRand: 100, //随机值
            eGravity: '0 -100 0', //重力值，会拉伸爆炸圆，同时影响爆炸、拖尾和绽放，不推荐设置
            eSpeed: '0 10 0', //爆炸器自身速度，用于中和重力值，不推荐设置
            eHeight: 80, //爆炸高度，发射器到达这个高度后触发爆炸
            useTrail: 1, //是否使用爆炸拖尾
            tMaxCount: 2000, //拖尾粒子最大数量，超过这个值的粒子被忽略
            tCount: 120, //拖尾每秒产生粒子数量，推荐50～200
            tSize: 2, //拖尾粒子大小
            tSpread: 0.2, //拖尾扩散范围，值越大拖尾越宽,推荐0.05~0.3
            tLife: 500, //拖尾粒子生命最大值
            tOpacity: 0.6, //拖尾透明值。拖尾的颜色由炸开的粒子控制；不能单独设置
            useBloom: 1, //是否使用绽放效果，绽放是爆炸开的粒子再次进行爆炸
            bMaxCount: 5000, //绽放粒子最大数量，超过这个值的粒子被忽略
            bCount: 200, //每个绽放爆炸的粒子数量，推荐100～1000
            bCountRand: 100, //随机值
            bColors: undefined, //绽放粒子随机颜色；绽放粒子颜色由炸开粒子颜色控制，但也可使用随机色
            bSize: 2, //绽放粒子的大小，推荐1～3
            bTexture: path + "/imgs/dot-64.png", //绽放粒子形状贴图
            bAcc: 30, //绽放粒子每秒加速度,10~50
            bAccRand: 1, //随机值
            bLife: 500, //绽放粒子生命最大值
            bLifeRand: 200, //随机值
        };

        //合并用户设置，整理数据，以及数量限定
        ctx.$kksOpt = Object.assign(ctx.$kksOpt, ctx.data.options);

        //整理数据
        var gravityArr = ctx.$kksOpt.eGravity.split(' ');
        ctx.$kksOpt.eGravity = new THREE.Vector3(Number(gravityArr[0]), Number(gravityArr[1]), Number(gravityArr[2]));

        var espeedArr = ctx.$kksOpt.eSpeed.split(' ');
        ctx.$kksOpt.eSpeed = new THREE.Vector3(Number(espeedArr[0]), Number(espeedArr[1]), Number(espeedArr[2]));

        //数量最大限定
        if (ctx.$kksOpt.eCount > 10000) ctx.$kksOpt.eCount = 10000;
        if (ctx.$kksOpt.useTrail && ctx.$kksOpt.eCount > 100) ctx.$kksOpt.eCount = 100;
        if (ctx.$kksOpt.useBloom && ctx.$kksOpt.bCount > 1000) ctx.$kksOpt.bCount = 1000;

        //生成发射材质
        var rMat = new THREE.PointsMaterial({
            size: ctx.$kksOpt.rSize,
            map: new THREE.TextureLoader().load(ctx.$kksOpt.rTexture),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
        });
        if (ctx.$kksOpt.rColors) {
            var carr = [];
            ctx.$kksOpt.rColors.forEach(function (clr) {
                carr.push(new THREE.Color(clr));
            });
            ctx.$kksOpt.rColors = carr;
            rMat.vertexColors = THREE.VertexColors;
        } else {
            rMat.color = new THREE.Color(ctx.$kksOpt.rColor);
        };

        //生成爆炸材质
        var eMat = new THREE.PointsMaterial({
            size: ctx.$kksOpt.eSize,
            map: new THREE.TextureLoader().load(ctx.$kksOpt.eTexture),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
        });
        if (ctx.$kksOpt.eColors) {
            var carr = [];
            ctx.$kksOpt.eColors.forEach(function (clr) {
                carr.push(new THREE.Color(clr));
            });
            ctx.$kksOpt.eColors = carr;
            eMat.vertexColors = THREE.VertexColors;
        } else {
            eMat.color = new THREE.Color(ctx.$kksOpt.eColor);
        };

        //生成基本数据
        ctx.$kksData = {
            rPoints: [],
            rColors: [],
            ePoints: [],
            eColors: [],
            tPoints: [],
            tColors: [],
            bPoints: [],
            bColors: [],
            height: 0,
            level: 0,
            levels: {
                rocket: 0,
                explore: 1,
                bloom: 2,
            },
            rMat: rMat,
            eMat: eMat,
            time: 0,
        };

        //生成Object3D对象
        ctx.$kksRocket = new THREE.Points(new THREE.Geometry(), rMat);
        ctx.$kksExplore = new THREE.Points(new THREE.Geometry(), eMat);
        var kksMagic = new THREE.Group();
        kksMagic.add(ctx.$kksRocket);
        kksMagic.add(ctx.$kksExplore);

        //使用拖尾
        if (ctx.$kksOpt.useTrail) {
            ctx.tMat = new THREE.PointsMaterial({
                size: ctx.$kksOpt.tSize,
                map: new THREE.TextureLoader().load(ctx.$kksOpt.eTexture),
                blending: THREE.AdditiveBlending,
                opacity: ctx.$kksOpt.tOpacity,
                transparent: true,
                depthTest: false,
            });
            //拖尾不能随机颜色，如果爆炸使用多种颜色，那么拖尾与爆炸颜色一致
            if (ctx.$kksOpt.eColors) {
                ctx.tMat.vertexColors = THREE.VertexColors;
            } else {
                ctx.tMat.color = new THREE.Color(ctx.$kksOpt.eColor);
            };

            ctx.$kksTrail = new THREE.Points(new THREE.Geometry(), ctx.tMat);
            kksMagic.add(ctx.$kksTrail);
        };

        //使用绽放
        if (ctx.$kksOpt.useBloom) {
            ctx.bMat = new THREE.PointsMaterial({
                size: ctx.$kksOpt.bSize,
                map: new THREE.TextureLoader().load(ctx.$kksOpt.bTexture),
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false,
            });
            //绽放不能直接指定固定颜色只能使用爆炸颜色（或随机颜色），绽放可以指定随机颜色
            if (ctx.$kksOpt.bColors) {
                var carr = [];
                ctx.$kksOpt.bColors.forEach(function (clr) {
                    carr.push(new THREE.Color(clr));
                });
                ctx.$kksOpt.bColors = carr;
                ctx.bMat.vertexColors = THREE.VertexColors;
            } else {
                if (ctx.$kksOpt.eColors) {
                    ctx.bMat.vertexColors = THREE.VertexColors;
                } else {
                    ctx.bMat.color = new THREE.Color(ctx.$kksOpt.eColor);
                }
            };

            ctx.$kksBloom = new THREE.Points(new THREE.Geometry(), ctx.bMat);
            kksMagic.add(ctx.$kksBloom);
        };

        return kksMagic;
    };

    /**
     * 默认每次tick的函数,自动下落，落到最低返回顶部
     */
    function tick() {
        var ctx = this;
        var time = arguments[0][0];
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var deltaTime = arguments[0][1];
        kksData.time += deltaTime;

        if (kksData.height < ctx.$kksOpt.eHeight) {
            //生成发射粒子
            kksData.level = kksData.levels.rocket;
            genRocket.call(ctx, deltaTime);
        } else {
            //生成爆炸粒子
            if (kksData.level < kksData.levels.explore) {
                genExplore.call(ctx);
                kksData.level = kksData.levels.explore;
            };
            //爆炸阶段总是生成拖尾粒子
            if (kksOpt.useTrail) genTrails.call(ctx, deltaTime);
        };

        //总是清理和重新计算发射粒子
        if (kksData.rPoints.length > 0) {
            rocketTick.call(ctx, deltaTime);
        };

        //仅在爆炸阶段重新计算爆炸粒子位置属性
        if (kksData.level >= kksData.levels.explore) {
            exploreTick.call(ctx, deltaTime);
            if (kksOpt.useTrail) trailTick.call(ctx, deltaTime);
        };

        //仅在绽放阶段重新计算绽放粒子位置属性
        if (kksData.level >= kksData.levels.bloom && kksOpt.useBloom) {
            bloomTick.call(ctx, deltaTime);
        };

        //烟花完毕后将整个元素移除
        if (kksData.level > 0 && kksData.tPoints.length < 1 && kksData.rPoints.length < 1 && kksData.tPoints.length < 1 && kksData.bPoints.length < 1) {
            ctx.el.parentNode.removeChild(ctx.el);
        };
    };
    //------------ext functions----------

    /**
     * 为每个爆炸粒子产生的拖尾效果，最大拖尾数量100
     * 每tick为每个爆照粒子产生1个拖尾
     */
    function genTrails(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var timeUnit = kksData.time == 0 ? 0.16 : deltaTime / 1000;
        var count = Math.ceil(kksOpt.tCount * timeUnit);

        for (var i = 0; i < kksData.ePoints.length; i++) {
            for (var n = 0; n < count; n++) {
                var p = {};
                p.pos = kksData.ePoints[i].pos.clone();
                p.acc = genRandomV3().multiplyScalar(kksOpt.tSpread);
                p.life = kksOpt.tLife;
                kksData.tPoints.push(p);

                //处理多种颜色
                if (kksOpt.eColors) {
                    var clr = kksOpt.eColors[i % kksOpt.eColors.length];
                    p.clr = clr;
                    ctx.$kksData.tColors.push(clr);
                };
            };
        };
    };

    /**
     * 计算拖尾粒子
     * @param {number} deltaTime [[Description]]
     */
    function trailTick(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;
        var timeUnit = kksData.time == 0 ? 0.16 : deltaTime / 1000;

        var parr = [];
        var varr = [];
        var carr = [];

        //使用最新的粒子，超过数量限制的忽略掉
        var offset = kksData.tPoints.length < kksOpt.rMaxCount ? 0 : kksData.tPoints.length - kksOpt.rMaxCount;

        for (var i = offset; i < kksData.tPoints.length; i++) {
            var p = kksData.tPoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                //重新计算粒子位置
                p.pos = p.pos.add(p.acc);
                p.pos = p.pos.add(kksOpt.eGravity.multiplyScalar(timeUnit));
                parr.push(p);
                varr.push(p.pos);
                if (kksOpt.rColors) carr.push(p.clr);
            };
        };
        kksData.tPoints = parr;
        var newGeo = new THREE.Geometry();
        newGeo.vertices = varr;
        if (kksOpt.eColors) newGeo.colors = carr;

        ctx.$kksTrail.geometry = newGeo;
    };


    /**
     * 计算发射粒子变化，并清理
     * @param {number} deltaTime [[Description]]
     */
    function rocketTick(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var timeUnit = kksData.time == 0 ? 0.16 : deltaTime / 1000;

        kksData.height += kksOpt.rSpeed * timeUnit;
        ctx.$kksRocket.position.y = kksData.height;
        var parr = [];
        var varr = [];
        var carr = [];

        //使用最新的粒子，超过数量限制的忽略掉
        var offset = kksData.rPoints.length < kksOpt.rMaxCount ? 0 : kksData.rPoints.length - kksOpt.rMaxCount;

        for (var i = offset; i < kksData.rPoints.length; i++) {
            var p = kksData.rPoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                //重新计算粒子位置
                p.pos = p.pos.add(p.acc);
                p.pos = p.pos.add(kksOpt.eGravity.multiplyScalar(timeUnit));
                parr.push(p);
                varr.push(p.pos);
                if (kksOpt.rColors) carr.push(p.clr);
            };
        };
        kksData.rPoints = parr;
        var newGeo = new THREE.Geometry();
        newGeo.vertices = varr;
        if (kksOpt.rColors) newGeo.colors = carr;

        ctx.$kksRocket.geometry = newGeo;
    };

    /**
     * 计算爆炸粒子变化，并清理
     * @param {number} deltaTime [[Description]]
     */
    function exploreTick(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;
        var timeUnit = kksData.time == 0 ? 0.16 : deltaTime / 1000;

        var parr = [];
        var varr = [];
        var carr = [];

        //使用最新的粒子，超过数量限制的忽略掉
        var offset = kksData.ePoints.length < kksOpt.eMaxCount ? 0 : kksData.ePoints.length - kksOpt.eMaxCount;

        for (var i = offset; i < kksData.ePoints.length; i++) {
            var p = kksData.ePoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                p.acc.add(kksOpt.eGravity.multiplyScalar(timeUnit));
                p.pos.add(p.acc.clone().multiplyScalar(timeUnit));
                parr.push(p);
                varr.push(p.pos);
                if (kksOpt.eColors) carr.push(p.clr);
            } else if (kksOpt.useBloom) {
                //只要一个开始bloom开始就进入bloom阶段，开始计算bloomtick
                genBloom.call(ctx, p);
                ctx.$kksData.level = ctx.$kksData.levels.bloom;
            };
        };
        kksData.ePoints = parr;

        //刷新粒子物体
        var newGeo = new THREE.Geometry();
        newGeo.vertices = varr;
        if (kksOpt.eColors) newGeo.colors = carr;

        ctx.$kksExplore.geometry = newGeo;
    };

    /**
     * 爆炸粒子结束时候生成绽放粒子
     */
    function genBloom(particle) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var count = kksOpt.bCount - genRandom() * kksOpt.bCountRand;

        for (var i = 0; i < count; i++) {
            var p = {};
            var pos = genBallPoint();
            p.pos = pos.clone().multiplyScalar(0.5);
            p.pos.add(particle.pos);
            p.acc = pos.multiplyScalar(kksOpt.bAcc + genRandom() * kksOpt.bAccRand);
            p.life = kksOpt.bLife + genRandom() * kksOpt.bLifeRand;
            kksData.bPoints.push(p);

            //处理多种颜色
            if (kksOpt.bColors) {
                //绽放随机颜色
                var clr = kksOpt.bColors[i % kksOpt.bColors.length];
                p.clr = clr;
                ctx.$kksData.bColors.push(clr);
            } else if (kksOpt.eColors) {
                //绽放爆炸粒子的颜色
                p.clr = particle.clr;
                ctx.$kksData.bColors.push(p.clr);
            };
        };
    };


    /**
     * 每tick计算绽放粒子的状态
     */
    function bloomTick(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var timeUnit = kksData.time == 0 ? 0.16 : deltaTime / 1000;

        var parr = [];
        var varr = [];
        var carr = [];

        //使用最新的粒子，超过数量限制的忽略掉
        var offset = kksData.bPoints.length < kksOpt.bMaxCount ? 0 : kksData.bPoints.length - kksOpt.bMaxCount;

        for (var i = offset; i < kksData.bPoints.length; i++) {
            var p = kksData.bPoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                p.pos.add(p.acc.clone().multiplyScalar(timeUnit));
                parr.push(p);
                varr.push(p.pos);
                if (kksOpt.bColors || kksOpt.eColors) carr.push(p.clr);
            };
        };
        kksData.bPoints = parr;

        //刷新粒子物体
        var newGeo = new THREE.Geometry();
        newGeo.vertices = varr;
        if (kksOpt.bColors || kksOpt.eColors) newGeo.colors = carr;

        ctx.$kksBloom.geometry = newGeo;
    };



    /**
     * 生成新的发射粒子;
     */
    function genRocket(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var timeUnit = kksData.time == 0 ? 0.16 : deltaTime / 1000;
        var n = Math.ceil(kksOpt.rCount * timeUnit);

        for (var i = 0; i < n; i++) {
            var p = {};
            p.pos = new THREE.Vector3(0, 0, 0);
            var accx = genRandom() * kksOpt.rSpread;
            var accy = Math.random() * -1 - 0.5;
            var accz = genRandom() * kksOpt.rSpread;
            p.acc = new THREE.Vector3(accx, accy, accz);

            p.life = kksOpt.rLife + genRandom() * kksOpt.rLifeRand;
            kksData.rPoints.push(p);

            //处理多种颜色
            if (kksOpt.rColors) {
                var clr;
                if (kksOpt.rCount < kksOpt.rColors.length) {
                    clr = kksOpt.rColors[Math.floor(Math.random() * kksOpt.rColors.length)];
                } else {
                    clr = kksOpt.rColors[i % kksOpt.rColors.length];
                };
                p.clr = clr;
                ctx.$kksData.rColors.push(clr);
            };
        };
    };

    /**
     * 生成爆炸粒子;
     */
    function genExplore() {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        for (var i = 0; i < kksOpt.eCount; i++) {
            var p = {};
            var pos = genBallPoint();
            p.pos = pos.clone().multiplyScalar(0.5);
            p.pos.setY(p.pos.y + kksData.height);
            p.acc = pos.multiplyScalar(kksOpt.eAcc + genRandom() * kksOpt.eAccRand);
            p.acc.add(kksOpt.eSpeed);
            p.life = kksOpt.eLife + genRandom() * kksOpt.eLifeRand;
            p.level = 1;
            kksData.ePoints.push(p);

            //处理多种颜色
            if (kksOpt.eColors) {
                var clr = kksOpt.eColors[i % kksOpt.eColors.length];
                p.clr = clr;
                ctx.$kksData.eColors.push(clr);
            };
        };
    };

    //---------------other functions------------------

    /**
     * 生成球面坐标的函数
     * @returns {[[Type]]} [[Description]]
     */
    function genBallPoint() {
        var a = Math.random() * Math.PI;
        var b = Math.random() * 2 * Math.PI;
        var x = Math.sin(b) * Math.sin(a);
        var y = Math.cos(a);
        var z = Math.cos(b) * Math.sin(a);
        return new THREE.Vector3(x, y, z);
    };

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









//
