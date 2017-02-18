/**
 * 此snow预设仅供参考，实际与default预设基本相同,但使用了THREE.Group
 * <a-entity kks-magic='preset:snow;options:{color:"#E91E61"}'></a-entity>
 * 必须实现preset_init,preset_tick,preset_update三个函数
 * ctx.kk指向aframe组件的threejs对象，比如ctx.kk.geometry指向
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
            map: new THREE.TextureLoader().load(path + "imgs/dot-64.png"),
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        var kk = new THREE.Points(geo, mat);
        var grp = new THREE.Group();
        grp.add(kk);

        return grp;
    };


    /**
     * 默认每次tick的函数,自动下落，落到最低返回顶部
     */
    function tick() {
        var ctx = this;
        var time = arguments[0][0];
        var deltaTime = arguments[0][1];

        var verts = ctx.kk.children[0].geometry.vertices;
        for (var i = 0; i < verts.length; i++) {
            var vert = verts[i];
            if (vert.y < -200) {
                vert.y = Math.random() * 400 - 200;
            }
            vert.y = vert.y - (0.1 * deltaTime);
        }
        ctx.kk.children[0].geometry.verticesNeedUpdate = true;
    };
})();
