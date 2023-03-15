/**
 * v0.3.0
 * KKsMagic Floating snow preset
 * Random dance support Effect required SimplexNoise and polyfill/typedarray support
 */

(function () {
    //Get the preset path
    var js = document.scripts;
    js = js[js.length - 1];
    var path = js.src.substring(0, js.src.lastIndexOf("/") + 1);

    //Register preset
    KKsMagic.addPreset('snow', {
        init: init,
        tick: tick,
        author: 'zhyuzh',
        desc: 'A 400X400X400 snow box,not textured,with options.color,as default preset.',
    });


    var kksOpt = {
        maxCount: 2000, //The maximum number of snowflakes, snowflakes that exceed this number will be ignored
        count: 20, //The number of snowflakes generated per second is recommended from 60 to 100
        size: 1, //Snowflake size, modification is not recommended
        pos: '0 -30 0', //The center of the floating snow range, modification is not recommended; snowflakes below the y value disappear
        box: '100 10 100', //The box that generates snowflakes, relative to the pos, the larger the range, the more snowflakes need to be generated.
        boxHeight: 90, //The height of the snowflake box from the ground
        speed: 10, //Move the value down every second, 5~20 is recommended
        acc: 5, //Acceleration, the amount of change per second, takes effect when generated, it is recommended to be less than speed; this value also slightly affects the dance effect
        accRand: 2, //The acceleration changes randomly, and it will take effect when it is generated. It is recommended that the sum of acc and acc is less than speed.；
        dance: 7, //The amplitude of fluttering per second, the greater the value, the more serious the fluttering in the square direction of the water, and it will take effect immediately. It is recommended that 2~10
        color: '#FFFFFF', //The color of snowflakes is not recommended to modify
        colors: undefined, //Random colors, an array, will overwrite the color option.Not recommended
        opacity: 0.66, //Snowflake transparency, recommended 0.1～1
        textrue: path + "imgs/dot-64.png", //The shape picture of the snowflake is not recommended to modify
    };

    /**
     * Default initialization particle function,
     * Randomly generate particles in a range of 400 cubic meters
     * Read the default image material
     * @returns {object} THREE.Points
     */
    function init() {
        var ctx = this;

        //Generate basic data
        ctx.$kksData = {
            time: 0,
            points: [],
            colors: [],
        };

        genOpt.call(ctx);

        //Generate Object3D objects
        ctx.$kksSnow = new THREE.Points(new THREE.BufferGeometry(), ctx.$kksData.mat);
        var kksMagic = new THREE.Group();
        kksMagic.add(ctx.$kksSnow);

        //Add update monitor
        ctx.el.addEventListener('kksUpdate', function (evt) {
            ctx.data.options = evt.detail || {};
            genOpt.call(ctx);
            ctx.$kksSnow.material = ctx.$kksData.mat;
        });

        return kksMagic;
    };


    /**
     * By default, every time the tick function is used, it will automatically fall, fall to the lowest and return to the top
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
     * Dynamic generation setting options
     */
    function genOpt() {
        var ctx = this;
        ctx.$kksOpt = kksOpt;

        //Merge user settings, organize data, and limit quantity
        ctx.$kksOpt = Object.assign(ctx.$kksOpt, ctx.data.options);

        //Organize data
        if (ctx.$kksOpt.pos.constructor == String) {
            var posArr = ctx.$kksOpt.pos.split(' ');
            ctx.$kksOpt.pos = new THREE.Vector3(Number(posArr[0]), Number(posArr[1]), Number(posArr[2]));
        };

        //Organize data
        if (ctx.$kksOpt.box.constructor == String) {
            var boxArr = ctx.$kksOpt.box.split(' ');
            ctx.$kksOpt.box = new THREE.Vector3(Number(boxArr[0]), Number(boxArr[1]), Number(boxArr[2]));
        };

        //Generate material
        var mat = new THREE.PointsMaterial({
            size: ctx.$kksOpt.size,
            map: new THREE.TextureLoader().load(ctx.$kksOpt.textrue),
            blending: THREE.AdditiveBlending,
            opacity: ctx.$kksOpt.opacity,
            transparent: true,
            depthTest: false,
        });

        //Handle random colors
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
     * Generate snowflakes and add new snowflake points to the points queue
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

            //In order to avoid the clr cannot be found for dynamic adjustment, specify the clr parameter regardless of whether colors is turned on or not
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
     * Recalculate the position of the snowflake in each frame to generate a new object
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

        //Use the latest snowflakes, ignore those that exceed the quantity limit
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

        //Refresh particle objects
        var newGeo = new THREE.BufferGeometry();
        let positions = [];

        for(let i=0; i<parr.length;i++) {
            positions.push(parr[i].pos.x);
            positions.push(parr[i].pos.y);
            positions.push(parr[i].pos.z);
        }

        const vertices = new Float32Array(positions);
        let color = new THREE.Color(); // default to white
        if(!isNaN(parr[0].clr.r) && !isNaN(parr[0].clr.g) && !isNaN(parr[0].clr.b)) {
            color = new THREE.Color( parr[0].clr.r, parr[0].clr.g, parr[0].clr.b );
        }

        newGeo.vertices = varr;
        //if (kksOpt.colors || kksOpt.colors) newGeo.colors = carr;
        newGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const material = new THREE.MeshBasicMaterial( { color: color } );
        const mesh = new THREE.Mesh( newGeo, material );

        ctx.$kksSnow.geometry = newGeo;
    };

    


    //--------------ext function-------
    /**
     * Generate random numbers, positive and negative values, -1 to +1
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
     * Generate random Vector3, positive and negative values, -1 to 1
     * @returns {number} res
     */
    function genRandomV3(base) {
        return new THREE.Vector3(genRandom(), genRandom(), genRandom());
    };


})();


///
