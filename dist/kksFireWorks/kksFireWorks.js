/**
 * v0.3
 * Licence:Using this software, you have agreed to this,every fireworks is your blessing for kk.
 * KKsMagic焰火插件预设
 * options:{};
 */


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
            useTrail: 0,
            useBloom: 0,
            eCount: 1000,
            eSize: 3,
            eColor: '#ff67ff',
            eColors: ['#FF00FF','#FFFF00','#00FFFF'],
            eTexture: path + "/imgs/dot-64.png",
            eAcc: 0.75,
            eAccRand: 0.1,
            eLife: 500,
            eLifeRand: 300,
            eGravity: new THREE.Vector3(0, -0.04, 0),
            eSpeed: new THREE.Vector3(0, 1.5, 0),
            eHeight: 50,
            tSize: 2,
            tSpread: 0.1,
            tLife: 500,
            tOpacity: 0.6,
            bCount: 200,
            bCountRand: 100,
            bSize: 2,
            bColor: '#ae4fff',
            bTexture: path + "/imgs/dot-64.png",
            bAcc: 0.3,
            bAccRand: 0.0,
            bLife: 500,
            bLifeRand: 200,
            rCount: 1,
            rSpeed: 2,
            rSpread: 0.01,
            rLife: 200,
            rLifeRand: 100,
            rSize: 3,
            rColor: '#c7f6ff',
            rTexture: path + "/imgs/dot-64.png",
        };

        //合并用户设置
        ctx.$kksOpt = Object.assign(ctx.$kksOpt, ctx.data.options);

        //生成发射材质
        var rMat = new THREE.PointsMaterial({
            color: ctx.$kksOpt.rColor,
            size: ctx.$kksOpt.rSize,
            map: new THREE.TextureLoader().load(ctx.$kksOpt.rTexture),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
        });


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
            eMat.color = ctx.$kksOpt.eColor;
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
                color: ctx.$kksOpt.eColor,
                size: ctx.$kksOpt.tSize,
                map: new THREE.TextureLoader().load(ctx.$kksOpt.eTexture),
                blending: THREE.AdditiveBlending,
                opacity: ctx.$kksOpt.tOpacity,
                transparent: true,
                depthTest: false,
            });
            ctx.$kksTrail = new THREE.Points(new THREE.Geometry(), ctx.tMat);
            kksMagic.add(ctx.$kksTrail);
        };

        //使用绽放
        if (ctx.$kksOpt.useBloom) {
            ctx.bMat = new THREE.PointsMaterial({
                color: ctx.$kksOpt.bColor,
                size: ctx.$kksOpt.bSize,
                map: new THREE.TextureLoader().load(ctx.$kksOpt.bTexture),
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false,
            });
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
        time += deltaTime;

        if (kksData.height < ctx.$kksOpt.eHeight) {
            //生成发射粒子
            kksData.level = kksData.levels.rocket;
            genRocket.call(ctx);
        } else {
            //生成爆炸粒子
            if (kksData.level < kksData.levels.explore) {
                genExplore.call(ctx);
                kksData.level = kksData.levels.explore;
            };
            //爆炸阶段总是生成拖尾粒子
            if (kksOpt.useTrail) genTrails.call(ctx);
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

    };

    //------------ext functions----------

    /**
     * 为每个爆炸粒子产生的拖尾效果，最大拖尾数量100
     * 每tick为每个爆照粒子产生1个拖尾
     */
    function genTrails() {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        for (var i = 0; i < kksData.ePoints.length; i++) {
            var p = {};
            p.pos = kksData.ePoints[i].pos.clone();
            p.acc = genRandomV3().multiplyScalar(kksOpt.tSpread);
            p.life = kksOpt.tLife;
            kksData.tPoints.push(p);
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

        var parr = [];
        var varr = [];
        for (var i = 0; i < kksData.tPoints.length; i++) {
            var p = kksData.tPoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                //重新计算粒子位置
                p.pos = p.pos.add(p.acc);
                p.pos = p.pos.add(kksOpt.eGravity);
                parr.push(p);
                varr.push(p.pos);
            };
        };
        kksData.tPoints = parr;
        var newgeo = new THREE.Geometry();

        newgeo.vertices = varr;
        ctx.$kksTrail.geometry = newgeo;
    };


    /**
     * 计算发射粒子变化，并清理
     * @param {number} deltaTime [[Description]]
     */
    function rocketTick(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        kksData.height += kksOpt.rSpeed;
        ctx.$kksRocket.position.y = kksData.height;
        var rParr = [];
        var rVarr = [];
        for (var i = 0; i < kksData.rPoints.length; i++) {
            var p = kksData.rPoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                //重新计算粒子位置
                p.pos = p.pos.add(p.acc);
                p.pos = p.pos.add(kksOpt.eGravity);
                rParr.push(p);
                rVarr.push(p.pos);
            };
        };
        kksData.rPoints = rParr;
        var rGeo = new THREE.Geometry();

        rGeo.vertices = rVarr;
        ctx.$kksRocket.geometry = rGeo;
    };

    /**
     * 计算爆炸粒子变化，并清理
     * @param {number} deltaTime [[Description]]
     */
    function exploreTick(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var parr = [];
        var varr = [];
        var carr = [];
        for (var i = 0; i < kksData.ePoints.length; i++) {
            var p = kksData.ePoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                p.acc.add(kksOpt.eGravity);
                p.pos.add(p.acc);
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
            p.level = 1;
            kksData.bPoints.push(p);
        };
    };


    /**
     * 每tick计算绽放粒子的状态
     */
    function bloomTick(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var parr = [];
        var varr = [];
        for (var i = 0; i < kksData.bPoints.length; i++) {
            var p = kksData.bPoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                p.pos.add(p.acc);
                parr.push(p);
                varr.push(p.pos);
            };
        };
        kksData.bPoints = parr;

        //刷新粒子物体
        var newGeo = new THREE.Geometry();
        newGeo.vertices = varr;
        ctx.$kksBloom.geometry = newGeo;
    };



    /**
     * 生成新的发射粒子;
     */
    function genRocket() {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        for (var i = 0; i < kksOpt.rCount; i++) {
            var p = {};
            p.pos = new THREE.Vector3(0, 0, 0);
            var accx = genRandom() * kksOpt.rSpread;
            var accy = Math.random() * -1 - 0.5;
            var accz = genRandom() * kksOpt.rSpread;
            p.acc = new THREE.Vector3(accx, accy, accz);

            p.life = kksOpt.rLife + genRandom() * kksOpt.rLifeRand;
            kksData.rPoints.push(p);
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
