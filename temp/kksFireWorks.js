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
        update: update,
        author: 'zhyuzh',
        desc: 'A pretty fireworks!',
    });

    var opt;


    var mat = new THREE.PointsMaterial({
        color: '#FF00FF',
        size: 0.5,
        map: new THREE.TextureLoader().load(path + "/imgs/dot-64.png"),
        blending: THREE.AdditiveBlending,
        alphaTest: 0.5,
        transparent: true,
    });

    var geo;

    /**
     * 默认的初始化粒子函数,
     * 400立方的范围随机生成粒子
     * 读取默认图片材质
     * @returns {object} THREE.Points
     */
    function init() {
        var ctx = this;

        opt = {
            count: 1,
            acc: 1,
            air: 0.005,
            g: new THREE.Vector3(0, 0, 0),
            life: 0.5,
            speed: 0,
        };

        geo = new THREE.Geometry();

        for (var p = 0; p < opt.count; p++) {
            var point = new THREE.Vector3(0, 0, 0);
            //            point.acc = genRandomV3(0.8);
            point.acc = genBallPoint();
            var yfix = point.acc.y + opt.speed;
            point.acc.setY(yfix);
            point.acc = point.acc.multiplyScalar(opt.acc);

            geo.vertices.push(point);
        };




        var kk = new THREE.Points(geo, mat);
        //        var grp = new THREE.Group();
        //        grp.add(kk);

        return kk;
    };


    /**
     * 默认每次tick的函数,自动下落，落到最低返回顶部
     */
    function tick() {
        var ctx = this;
        var time = arguments[0][0];
        var deltaTime = arguments[0][1];
        //        var geo = ctx.kk.children[0].geometry;
        //        var geo = ctx.kk.geometry;




        //        //if (time < 2000) {
        //            //            for (var i = 0; i < 10; i++) {
        //            var point = new THREE.Vector3(0, 0, 0);
        //            point.acc = genBallPoint();
        //            point.acc = point.acc.multiplyScalar(opt.acc);
        //            geo.vertices.push(point);
        //            //            }
        // };

        //        console.log('>>>>', Math.log(time));
        //        console.log('>>>>', Math.sqrt(time));


        /*
        var points = geo.vertices;
        var newPoints = [];

        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            p.x += p.acc.x;
            p.y += p.acc.y;
            p.z += p.acc.z;

            if (p.acc.length() > 0.001) {
                var newp = p.clone();
                newp.acc = points[i].acc.multiplyScalar(0.9);
                newPoints.push(newp);
            } else {};

            //points[i].acc.add(opt.g);
            //subAir(points[i].acc, opt.air);
        };

        if (newPoints.length < 1) {
            ctx.el.parentNode.removeChild(ctx.el);
        } else {
            geo.vertices = newPoints;
        };

        */

        /*
         */
        //        var newgeo = new THREE.Geometry();
        //        for (var i = 0; i < points.length; i++) {
        //            newgeo.vertices.push(points[i]);
        //        };
        //        newgeo.dynamic = true;
        //        newgeo.verticesNeedUpdate = true;
        //        ctx.kk = grp;
        //        console.log('>>',ctx.el);


        //        var pnts = new THREE.Points(geo, mat);
        //
        //
        //        //
        //        var group = ctx.kk;
        //        for (var i = group.children.length - 1; i >= 0; i--) {
        //            group.remove(group.children[i]);
        //        };
        //        ctx.kk.add(pnts);
        //
        //        group.add(pnts);



        //ctx.el.setObject3D('kks-magic', grp);
        setPoints();


        /*
         */
        geo.vertices = points;
        geo.rotateX(0.02);
        geo.dynamic = true;
        geo.verticesNeedUpdate = true;
        geo.sortParticles = true;


        var newgeo = new THREE.Geometry();
        newgeo.vertices = points;
        ctx.kk.geometry = newgeo;

        //ctx.kk = new THREE.Points(geo, mat);
        //ctx.el.setObject3D('kks-magic', new THREE.Points(geo, mat));

        setPoints(ctx);


        //        console.log('>>>tick---');

    };


    function update() {
        var ctx = this;

        console.log('>update', arguments);
    };


    //------------functions----------

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

    var points = [];
    for (var i = 0; i < 5000; i++) {
        var point = genBallPoint().multiplyScalar(4);
        point.acc = genBallPoint();
        point.acc = point.acc.multiplyScalar(1);
        point.life = Math.random() * 50 + 50;
        points.push(point);
    };

    function setPoints() {
        var arr = [];



        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            p.life -= 1;
            if (p.life > 1) {
                arr.push(p);
            };
            p.x += Math.random() * 0.2;
        };

        if (arr.length < 1) {

            //ctx.update();
            /*
            for (var i = 0; i < 2; i++) {

                var point = genBallPoint().multiplyScalar(4);
                point.acc = genBallPoint();
                point.acc = point.acc.multiplyScalar(1);
                point.life = Math.random() * 50 + 50;
                arr.push(point);
            };
            */
        };

        points = arr;

        geo.vertices = arr;

    };



    /**
     * 生成随机数字,正负值
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
