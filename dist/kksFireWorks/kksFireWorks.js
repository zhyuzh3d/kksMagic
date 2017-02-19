/**
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
            eCount: 2000,
            eSize: 3,
            eColor: '#ff67ff',
            eTexture: path + "/imgs/dot-64.png",
            eAcc: 0.75,
            eAccRand: 0.1,
            eLife: 500,
            eLifeRand: 500,
            eGravity: new THREE.Vector3(0, -0.04, 0),
            eSpeed: new THREE.Vector3(0, 1.2, 0),
            eHeight: 50,
            rCount: 1,
            rSpeed: 1,
            rSpread: 0.1,
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
            color: ctx.$kksOpt.eColor,
            size: ctx.$kksOpt.eSize,
            map: new THREE.TextureLoader().load(ctx.$kksOpt.eTexture),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
        });

        //生成基本数据
        ctx.$kksData = {
            rPoints: [],
            ePoints: [],
            height: 0,
            level: 0,
            levels: {
                rocket: 0,
                explore: 1,
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
        };

        //总是清理和重新计算发射粒子
        if (kksData.rPoints.length > 0) {
            rocketTick.call(ctx, deltaTime);
        };

        //仅在爆炸阶段重新计算爆炸粒子位置属性
        if (kksData.level >= kksData.levels.explore) {
            exploreTick.call(ctx, deltaTime);
        };
    };

    //------------ext functions----------

    /**
     * 计算发射粒子变化，并清理
     * @param {number} deltaTime [[Description]]
     */
    function rocketTick(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        kksData.height += kksOpt.rSpeed;
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

        var eParr = [];
        var eVarr = [];
        for (var i = 0; i < kksData.ePoints.length; i++) {
            var p = kksData.ePoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                p.acc.add(kksOpt.eGravity);
                p.pos.add(p.acc);
                eParr.push(p);
                eVarr.push(p.pos);
            }
        };
        kksData.ePoints = eParr;

        //刷新粒子物体
        var eGeo = new THREE.Geometry();
        eGeo.vertices = eVarr;
        ctx.$kksExplore.geometry = eGeo;
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
            p.pos = new THREE.Vector3(0, kksData.height, 0);
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
