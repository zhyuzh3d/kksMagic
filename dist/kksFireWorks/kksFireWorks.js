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


    //初始化变量
    var opt, geo, mat, points, time, gravity;

    opt = {
        count: 2000,
        size: 3,
        color: 0xFF8888,
        acc: 0.75,
        accRand: 0.2,
        air: 0.005,
        life: 500,
        lifeRand: 1000,
        g: new THREE.Vector3(0, -0.04, 0),
        speed: new THREE.Vector3(0, 1.5, 0),
    };

    points = []; //所有粒子对象
    time = 0; //粒子开始时间计时
    gravity = new THREE.Vector3(0, opt.g, 0);

    mat = new THREE.PointsMaterial({
        color: '#FF00FF',
        size: opt.size,
        map: new THREE.TextureLoader().load(path + "/imgs/dot-64.png"),
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthTest: false,
    });


    //-------------base functions----------

    /**
     * 默认的初始化粒子函数
     * @returns {object} THREE.Points
     */
    function init() {
        var ctx = this;

        //生成粒子
        var arr = [];
        for (var i = 0; i < opt.count; i++) {
            var p = {};
            var pos = genBallPoint();
            p.pos = pos.clone().multiplyScalar(0.5);
            p.acc = pos.multiplyScalar(opt.acc + genRandom() * opt.accRand);
            p.acc.add(opt.speed);
            p.life = opt.life + genRandom() * opt.lifeRand;
            points.push(p);
            arr.push(p.pos);
        };

        geo = new THREE.Geometry();
        geo.vertices = arr;
        geo.dynamic = true;
        return new THREE.Points(geo, mat);
    };


    /**
     * 默认每次tick的函数,自动下落，落到最低返回顶部
     */
    function tick() {
        var ctx = this;
        var time = arguments[0][0];
        var deltaTime = arguments[0][1];
        time += deltaTime;

        //重新计算粒子位置属性
        var arr = [];
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            if (p.life > 1) {
                p.life -= deltaTime;
                p.acc.add(opt.g);
                p.pos.add(p.acc);
                arr.push(p.pos);
            }
        };

        //刷新粒子物体
        var newgeo = new THREE.Geometry();
        newgeo.vertices = arr;
        ctx.kk.geometry = newgeo;
    };


    //------------ext functions----------

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
     * 生成随机数字,正负值，有基础值
     * @param   {number} base 基础数值，1-base剩余的部分随机
     * @returns {number} res
     */
    function genRandomBase(base) {
        if (!base) base = 0;
        if (Math.random() > 0.5) {
            return Math.random() * (1 - base) + base;
        } else {
            return (Math.random() * (1 - base) + base) * -1;
        };
    };

    /**
     * 生成随机Vector3，正负值，有基础数
     * @param   {number} base 基础数值，1-base剩余的部分随机；
     * @returns {number} res
     */
    function genRandomV3(base) {
        if (base) {
            return new THREE.Vector3(genRandom(), genRandom(), genRandom());
        } else {
            return new THREE.Vector3(genRandomBase(), genRandomBase(), genRandomBase());
        };
    };

    /**
     * 计算阻力,在三个轴向上分别减少阻力值，使用相反符号
     * @param {object}   acc      THREE.Vector3
     * @param {object} air THREE.Vector3
     */
    function subAir(acc, air) {
        var x = acc.x > 0 ? acc.x - air : acc.x + air;
        x = x * acc.x >= 0 ? x : 0;
        var y = acc.y > 0 ? acc.y - air : acc.y + air;
        y = y * acc.y >= 0 ? y : 0;
        var z = acc.z > 0 ? acc.z - air : acc.z + air;;
        z = z * acc.z >= 0 ? z : 0;

        acc.set(x, y, z);
        return acc;
    };

    /**
     * 计算阻力,在三个轴向上分别增加速度，使用相反符号
     * @param {object}   v3      THREE.Vector3
     * @param {object} acc THREE.Vector3
     */
    function addAccV3(v3, acc) {
        var x = v3.x > 0 ? v3.x + acc.x : v3.x - acc.x;
        var y = v3.y > 0 ? v3.y + acc.y : v3.y - acc.y;
        var z = v3.z > 0 ? v3.z + acc.z : v3.z - acc.z;;

        v3.set(x, y, z);
        return v3;
    };




})();









//
