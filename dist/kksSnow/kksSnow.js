/**
 * 此snow预设仅供参考，实际与default预设基本相同,但使用了THREE.Group
 * <a-entity kks-magic='preset:snow;options:{color:"#E91E61"}'></a-entity>
 * 必须实现preset_init,preset_tick,preset_update三个函数
 * ctx.$kksMagic指向aframe组件的threejs对象，比如ctx.$kksMagic.geometry指向
 * preset_init必须返回一个THREE.Points对象
 * 可以使用ctx.data.options中用户自定义参数，请注意是否需要parse处理
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
    function init() {
        var ctx = this;

        ctx.$kksOpt = {
            count: 20, //每秒产生雪花数量，推荐60～100
            size: 0.5, //雪花大小，不推荐修改
            gravity: '0 0 0', //重力值，每秒向下移动数值
            color: '#FFFFFF', //雪花的颜色，不推荐修改
            colors: undefined, //随机颜色，数组，将覆盖color选项。不推荐使用
            textrue: path + "imgs/dot-64.png", //雪花的形状图片，不推荐修改
            height: 10, //雪花生成的高度，不推荐修改
            low: -20, //雪花消失的高度，不推荐修改
            range: 10, //飘雪的范围，范围越大需要生成越多的雪花
            pos: '0 0 -10', //飘雪范围的中心，不推荐修改
        };

        //合并用户设置，整理数据，以及数量限定
        ctx.$kksOpt = Object.assign(ctx.$kksOpt, ctx.data.options);

        //数量最大限定
        if (ctx.$kksOpt.count > 500) ctx.$kksOpt.eCount = 500;

        //整理数据
        var gravityArr = ctx.$kksOpt.gravity.split(' ');
        ctx.$kksOpt.gravity = new THREE.Vector3(Number(gravityArr[0]), Number(gravityArr[1]), Number(gravityArr[2]));
        var posArr = ctx.$kksOpt.pos.split(' ');
        ctx.$kksOpt.pos = new THREE.Vector3(Number(posArr[0]), Number(posArr[1]), Number(posArr[2]));

        //生成材质
        var mat = new THREE.PointsMaterial({
            size: ctx.$kksOpt.size,
            map: new THREE.TextureLoader().load(ctx.$kksOpt.textrue),
            blending: THREE.AdditiveBlending,
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
            rMat.vertexColors = THREE.VertexColors;
        } else {
            mat.color = new THREE.Color(ctx.$kksOpt.color);
        };

        //生成基本数据
        ctx.$kksData = {
            points: [],
            colors: [],
            mat: mat,
        };

        //生成Object3D对象
        ctx.$kksSnow = new THREE.Points(new THREE.Geometry(), mat);
        var kksMagic = new THREE.Group();
        kksMagic.add(ctx.$kksSnow);
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
            var angle = Math.random() * 3.14;
            var rangeRand = Math.random() * kksOpt.range;
            var px = kksOpt.pos.x + rangeRand * Math.sin(angle);
            var pz = -1*(kksOpt.pos.z + rangeRand * Math.cos(angle));
            if (Math.random() > 0.5) px *= -1;
            p.pos = new THREE.Vector3(px, kksOpt.height, pz);

            if (kksOpt.colors) {
                var clr = kksOpt.colors[Math.floor(Math.random() * kksOpt.colors.length)];
                p.clr = clr;
                kksData.colors.push(clr);
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
        var offset = kksData.points.length < 5000 ? 0 : 5000 - kksData.points.length;

        for (var i = offset; i < kksData.points.length; i++) {
            var p = kksData.points[i];
            if (p.pos.y >= kksOpt.low) {
                //p.pos.add(kksOpt.gravity.multiplyScalar(deltaTime / 1000));
                //                p.pos.setY(p.pos.y -= 0.1);
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
