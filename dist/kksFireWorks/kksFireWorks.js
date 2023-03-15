/**
 * v0.6.1
 * Licence:Using this software, you have agreed to this,every fireworks is your blessing for kk.
 * KKsMagic Fireworks plug-in presets
 */

console.info('Above the former lighthouse\nThe fireworks he set off for her\nReflected on the river\n————Luo Tianyi "Dry Girl/Weiwei"\nThanks for use kks-Magic and kks-fireworks.');

(function () {
    //Get the preset path
    var js = document.scripts;
    js = js[js.length - 1];
    var path = js.src.substring(0, js.src.lastIndexOf("/") + 1);

    //Register preset
    KKsMagic.addPreset('fireworks', {
        init: init,
        tick: tick,
        author: 'zhyuzh',
        desc: 'A pretty fireworks!',
    });

    //-------------base functions----------

    /**
     * The default initialization particle function, initialize the user settings here and initialize the material color
     * @returns {object} THREE.Points
     */
    function init() {
        var ctx = this;

        //Default settings
        ctx.$kksOpt = {
            rMaxCount: 1000, //The maximum number of emitted particles, particles that exceed this value are ignored
            rCount: 300, //The number of particles ejected by the emitter per frame per second, 50~200 is recommended
            rSpeed: 50, //The speed at which the transmitter flies upward per second is recommended to be 10~50
            rSpread: 0.2, //The diffusion range of emitter particles, the larger the value, the wider the trailing, 0.01~0.05 is recommended
            rLife: 200, //The maximum health of the emitter particle, milliseconds, the larger the value, the longer the tail, 100~1000 is recommended
            rLifeRand: 100, //The random value of the health value of the emitter particle, the same as below, it is recommended to refer to the rLife setting
            rSize: 3, //Emitter particle size, recommended 1～5
            rColor: '#90ddff', //Emitter particle color, if you need multiple colors, please use rColors, the same below
            rColors: undefined, //Random color of emitter particles
            rTexture: path + "/imgs/dot-64.png", //Shape map of emitter particles

            eMaxCount: 2000, //The maximum number of explosive particles, particles that exceed this value are ignored
            eCount: 50, //The number of explosive particles, if you use explosive trailing and blooming, please set the minimum as much as possible, such as 5~20; at the same time affect the pattern and trailing
            eSize: 3, //Explosive particle size, recommended 1～5
            eColor: '#ff55ff', //Explosive particle color
            eColors: undefined, //Random color of explosive particles
            eTexture: path + "/imgs/dot-64.png", //Explosive particle shape map
            eAcc: 40, //The acceleration of the explosive particles exploding, the greater the value, the larger the explosion circle, 50~100 is recommended
            eAccRand: 10, //Random value, the larger the value, the less clear the circle
            eLife: 1000, //The maximum health of the explosive particle, the larger the value, the larger the big bang circle
            eLifeRand: 100, //Random value
            eGravity: '0 -100 0', //The gravity value will stretch the explosion circle and affect the explosion and bloom at the same time.
            eSpeed: '0 80 0', //The speed of the explosive device itself is used to neutralize the gravity value. It is not recommended to set it.
            eHeight: 80, //The height of the explosion, the transmitter triggers the explosion after reaching this height

            usePattern: 0, //Whether to use an explosion pattern
            pAssetId: "kksFireWorksPattern", //The id of the pattern material element formed by the explosion
            pScale: 1, //The size of the pattern is reduced, the default is the original image pixel unit, please do not use pictures that are too large pixels
            pRotationX: 90, //The x-axis rotation angle of the pattern defaults to a vertical picture
            pDuration: 500, //How many milliseconds does it take before the pattern is formed?
            pLife: 1000, //The life time of the pattern particles must be greater than ptime to form a pattern
            pLifeRand: 500, //Random value
            pHold: 0, //Keep the graphics and do not diverge

            useTrail: 1, //Whether to use explosive trailing
            tMaxCount: 2000, //The maximum number of trailing particles, particles that exceed this value are ignored
            tCount: 120, //The number of particles generated per second after trailing, 50～200 is recommended
            tSize: 2, //Trailing particle size
            tSpread: 0.2, //Trailing diffusion range, the larger the value, the wider the trailing, 0.05~0.3 is recommended
            tLife: 500, //Maximum life of trailing particles
            tOpacity: 0.6, //Trailing transparent value.The color of the trailing is controlled by the exploded particles; it cannot be set separately

            useBloom: 1, //Whether to use the bloom effect, the bloom is the particle that explodes and explodes again.
            bMaxCount: 5000, //The maximum number of bloom particles, particles that exceed this value are ignored
            bCount: 200, //The number of particles exploding in each bloom is recommended from 100 to 1000
            bCountRand: 100, //Random value
            bColors: undefined, //Random color of blooming particles; the color of blooming particles is controlled by the color of exploding particles, but random colors can also be used
            bSize: 2, //The size of the blooming particles is recommended from 1 to 3
            bTexture: path + "/imgs/dot-64.png", //Bloom particle shape map
            bAcc: 30, //Acceleration of blooming particles per second, 10~50
            bAccRand: 1, //Random value
            bLife: 500, //The maximum life value of blooming particles
            bLifeRand: 200, //Random value
        };

        //Merge user settings, organize data, and limit quantity
        ctx.$kksOpt = Object.assign(ctx.$kksOpt, ctx.data.options);

        //Organize data
        var gravityArr = ctx.$kksOpt.eGravity.split(' ');
        ctx.$kksOpt.eGravity = new THREE.Vector3(Number(gravityArr[0]), Number(gravityArr[1]), Number(gravityArr[2]));

        var espeedArr = ctx.$kksOpt.eSpeed.split(' ');
        ctx.$kksOpt.eSpeed = new THREE.Vector3(Number(espeedArr[0]), Number(espeedArr[1]), Number(espeedArr[2]));

        //Maximum quantity
        if (ctx.$kksOpt.eCount > 10000) ctx.$kksOpt.eCount = 10000;
        if (!ctx.$kksOpt.usePattern && ctx.$kksOpt.useTrail && ctx.$kksOpt.eCount > 100) ctx.$kksOpt.eCount = 100;
        if (ctx.$kksOpt.useBloom && ctx.$kksOpt.bCount > 1000) ctx.$kksOpt.bCount = 1000;
        if (ctx.$kksOpt.usePattern && ctx.$kksOpt.eCount > 10000) ctx.$kksOpt.eCount = 10000;


        //Generate emission material
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
            rMat.vertexColors = true;
            rMat.side = THREE.DoubleSide;
        } else {
            rMat.color = new THREE.Color(ctx.$kksOpt.rColor);
        };

        //Generate explosive material
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
            eMat.vertexColors = true;
            eMat.side = THREE.DoubleSide;
        } else {
            eMat.color = new THREE.Color(ctx.$kksOpt.eColor);
        };

        //Generate basic data
        ctx.$kksData = {
            rPoints: [],
            rColors: [],
            ePoints: [],
            eColors: [],
            tPoints: [],
            tColors: [],
            bPoints: [],
            bColors: [],
            pPoints: [],
            pColors: [],
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


        //Generate Object3D objects
        ctx.$kksRocket = new THREE.Points(new THREE.BufferGeometry(), rMat);
        ctx.$kksExplore = new THREE.Points(new THREE.BufferGeometry(), eMat);
        var kksMagic = new THREE.Group();
        kksMagic.add(ctx.$kksRocket);
        kksMagic.add(ctx.$kksExplore);


        //Use pattern
        if (ctx.$kksOpt.usePattern) {
            genPattern.call(ctx); //Generate in advance

            ctx.pMat = new THREE.PointsMaterial({
                size: ctx.$kksOpt.eSize,
                vertexColors: true,
                map: new THREE.TextureLoader().load(ctx.$kksOpt.eTexture),
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false,
            });
            ctx.$kksPattern = new THREE.Points(new THREE.BufferGeometry(), ctx.pMat);
            kksMagic.add(ctx.$kksPattern);
        };

        //Use trailing
        if (ctx.$kksOpt.useTrail) {
            ctx.tMat = new THREE.PointsMaterial({
                size: ctx.$kksOpt.tSize,
                map: new THREE.TextureLoader().load(ctx.$kksOpt.eTexture),
                blending: THREE.AdditiveBlending,
                opacity: ctx.$kksOpt.tOpacity,
                transparent: true,
                depthTest: false,
            });
            //The trailing color cannot be random. If multiple colors are used for the explosion, the trailing color is the same as the explosion color.
            if (ctx.$kksOpt.eColors) {
                ctx.tMat.vertexColors = true;
            } else {
                ctx.tMat.color = new THREE.Color(ctx.$kksOpt.eColor);
            };

            ctx.$kksTrail = new THREE.Points(new THREE.BufferGeometry(), ctx.tMat);
            kksMagic.add(ctx.$kksTrail);
        };

        //Use blooming
        if (ctx.$kksOpt.useBloom) {
            ctx.bMat = new THREE.PointsMaterial({
                size: ctx.$kksOpt.bSize,
                map: new THREE.TextureLoader().load(ctx.$kksOpt.bTexture),
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false,
            });
            //Blooms cannot directly specify a fixed color, only explosive colors (or random colors) can be used, blooms can specify random colors
            if (ctx.$kksOpt.bColors) {
                var carr = [];
                ctx.$kksOpt.bColors.forEach(function (clr) {
                    carr.push(new THREE.Color(clr));
                });
                ctx.$kksOpt.bColors = carr;
                ctx.bMat.vertexColors = true;
            } else {
                if (ctx.$kksOpt.eColors) {
                    ctx.bMat.vertexColors = true;
                } else {
                    ctx.bMat.color = new THREE.Color(ctx.$kksOpt.eColor);
                }
            };

            ctx.$kksBloom = new THREE.Points(new THREE.BufferGeometry(), ctx.bMat);
            kksMagic.add(ctx.$kksBloom);
        };

        return kksMagic;
    };

    /**
     * By default, every time the tick function is used, it will automatically fall, fall to the lowest and return to the top
     */
    function tick() {
        var ctx = this;
        var time = arguments[0][0];
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var deltaTime = arguments[0][1];
        kksData.time += deltaTime;

        if (kksData.height < ctx.$kksOpt.eHeight) {
            //Generate emitted particles
            kksData.level = kksData.levels.rocket;
            genRocket.call(ctx, deltaTime);
        } else {
            //Generate explosive particles
            if (kksData.level < kksData.levels.explore) {
                if (!kksOpt.usePattern) {
                    genExplore.call(ctx);
                }
                kksData.level = kksData.levels.explore;
            };
        };

        //Always clean up and recalculate the emitted particles
        if (kksData.rPoints.length > 0) {
            rocketTick.call(ctx, deltaTime);
        };

        //Recalculate the position properties of explosive particles only during the explosion phase
        if (kksData.level >= kksData.levels.explore) {
            if (!kksOpt.usePattern) {
                genTrails.call(ctx, deltaTime);
                exploreTick.call(ctx, deltaTime);
                if (kksOpt.useTrail) trailTick.call(ctx, deltaTime);
            } else {
                patternTick.call(ctx, deltaTime);
            };
        };

        //Recalculate the position properties of blooming particles only during the blooming phase
        if (kksData.level >= kksData.levels.bloom && kksOpt.useBloom && !kksOpt.usePattern) {
            bloomTick.call(ctx, deltaTime);
        };

        //Remove the entire element after the fireworks are over
        if (kksData.level > 0 && kksData.ePoints.length < 1 && kksData.rPoints.length < 1 && kksData.tPoints.length < 1 && kksData.bPoints.length < 1 && kksData.pPoints.length < 1) {
            ctx.el.parentNode.removeChild(ctx.el);
        };
    };
    //------------ext functions----------

    /**
     * Generate explosion graphics
     */
    function genPattern() {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;
        var img = document.getElementById(kksOpt.pAssetId);
        if (!img) {
            console.error('>kksFireWorks:genPattern failed:Asset not found!');
            return;
        };
        var imgData = getImageData(img);
        var pWid = img.width * kksOpt.pScale;
        var hpWid = pWid / 2;
        var pHei = img.height * kksOpt.pScale / 2;
        var hpHei = pHei / 2;

        var pRot = new THREE.Vector3(1, 0, 0); //Axial direction of rotation
        var pRotR = kksOpt.pRotationX * Math.PI / 180; //Radians of rotation

        for (var i = 0; ctx.$kksData.pPoints.length < ctx.$kksOpt.eCount; i++) {
            var ix = Math.floor(Math.random() * img.width);
            var iz = Math.floor(Math.random() * img.height);
            var clr = getPixel(imgData, ix, iz);

            var px = ix * kksOpt.pScale - hpWid;
            var pz = iz * kksOpt.pScale - hpHei;
            if (clr.a > 10) {
                var p = {};
                p.pos = new THREE.Vector3(0, kksOpt.eHeight, 0);
                p.tar = new THREE.Vector3(px, 0, pz);
                p.tar.applyAxisAngle(pRot, pRotR);
                p.tar.setY(p.tar.y + kksOpt.eHeight);
                p.clr = new THREE.Color(clr.r / 255, clr.g / 255, clr.b / 255);
                p.acc = p.tar.sub(p.pos).multiplyScalar(1000 / kksOpt.pDuration);
                p.life = kksOpt.pLife + genRandom() * kksOpt.pLifeRand;
                p.dur = kksOpt.pDuration;
                p.rand = Math.random() * 0.1 + 0.9;
                ctx.$kksData.pPoints.push(p);
            };
        };
    };

    /**
     * Graphics without tick calculation pattern
     * @param {[[Type]]} deltaTime [[Description]]
     */
    function patternTick(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;
        var timeUnit = kksData.time == 0 ? 0.16 : deltaTime / 1000;

        var parr = [];
        var varr = [];
        var carr = [];

        //Use the latest particles, ignore those that exceed the quantity limit
        var offset = kksData.pPoints.length < kksOpt.eMaxCount ? 0 : kksData.pPoints.length - kksOpt.eMaxCount;
        for (var i = offset; i < kksData.pPoints.length; i++) {
            var p = kksData.pPoints[i];
            p.life -= deltaTime;
            p.dur -= deltaTime;
            if (p.life > 0) {
                //Use acc only during the duration phase
                if (p.dur > 0) {
                    p.pos.add(p.acc.clone().multiplyScalar(timeUnit));
                    p.pos.add(kksOpt.eSpeed.clone().multiplyScalar(timeUnit));
                } else {
                    var weak = (kksOpt.pLife + p.dur) / kksOpt.pLife;
                    if (!kksOpt.pHold) {
                        p.pos = p.pos.add(kksOpt.eGravity.clone().multiplyScalar(timeUnit * (1 - weak) * p.rand));
                        p.pos = p.pos.add(p.acc.clone().multiplyScalar(timeUnit * weak * p.rand));
                    } else {
                        p.pos = p.pos.add(p.acc.clone().multiplyScalar(timeUnit * weak * 0.1 * p.rand));
                    };
                };
                parr.push(p);

                varr.push(p.pos.x);
                varr.push(p.pos.y);
                varr.push(p.pos.z);
                carr.push(p.clr.r);
                carr.push(p.clr.g);
                carr.push(p.clr.b);
            };
        };
        kksData.pPoints = parr;
        var newGeo = new THREE.BufferGeometry();
        
        const vertices = new Float32Array(varr);
        const colors = new Float32Array(carr);

        newGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        newGeo.setAttribute( 'color', new THREE.BufferAttribute( colors, 3) );
        const material = new THREE.MeshBasicMaterial( {vertexColors: true, side: THREE.DoubleSide} );
        const mesh = new THREE.Mesh( newGeo, material );

        ctx.$kksPattern.geometry = newGeo;
    };


    /**
     * For the trailing effect of each explosive particle, the maximum number of trailing is 100
     * Each tick generates 1 tail for each burst particle
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

                //Handle multiple colors
                if (kksOpt.eColors) {
                    var clr = kksOpt.eColors[i % kksOpt.eColors.length];
                    p.clr = clr;
                    ctx.$kksData.tColors.push(clr);
                };
            };
        };
    };

    /**
     * Calculate trailing particles
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

        //Use the latest particles, ignore those that exceed the quantity limit
        var offset = kksData.tPoints.length < kksOpt.rMaxCount ? 0 : kksData.tPoints.length - kksOpt.rMaxCount;

        for (var i = offset; i < kksData.tPoints.length; i++) {
            var p = kksData.tPoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                //Recalculate the particle position and ignore the gravity effect
                p.pos = p.pos.add(p.acc);
                parr.push(p);
                varr.push(p.pos.x);
                varr.push(p.pos.y);
                varr.push(p.pos.z);
                if (kksOpt.eColors) {
                    carr.push(p.clr.r);
                    carr.push(p.clr.g);
                    carr.push(p.clr.b);
                }
            };
        };
        kksData.tPoints = parr;
        var newGeo = new THREE.BufferGeometry();

        const vertices = new Float32Array(varr);
        const colors = new Float32Array(carr);

        newGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        newGeo.setAttribute( 'color', new THREE.BufferAttribute( colors, 3) );
        const material = new THREE.MeshBasicMaterial( {vertexColors: true, side: THREE.DoubleSide} );
        const mesh = new THREE.Mesh( newGeo, material );

        ctx.$kksTrail.geometry = newGeo;
    };



    /**
     * Blooming particles are generated at the end of the explosive particles
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

            //Handle multiple colors
            if (kksOpt.bColors) {
                //Bloom random colors
                var clr = kksOpt.bColors[i % kksOpt.bColors.length];
                p.clr = clr;
                ctx.$kksData.bColors.push(clr);
            } else if (kksOpt.eColors) {
                //The color of blooming explosive particles
                p.clr = particle.clr;
                ctx.$kksData.bColors.push(p.clr);
            };
        };
    };


    /**
     * Calculate the state of the blooming particles per tick
     */
    function bloomTick(deltaTime) {
        var ctx = this;
        var kksData = ctx.$kksData;
        var kksOpt = ctx.$kksOpt;

        var timeUnit = kksData.time == 0 ? 0.16 : deltaTime / 1000;

        var parr = [];
        var varr = [];
        var carr = [];

        //Use the latest particles, ignore those that exceed the quantity limit
        var offset = kksData.bPoints.length < kksOpt.bMaxCount ? 0 : kksData.bPoints.length - kksOpt.bMaxCount;

        for (var i = offset; i < kksData.bPoints.length; i++) {
            var p = kksData.bPoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                p.pos.add(p.acc.clone().multiplyScalar(timeUnit));
                parr.push(p);
                varr.push(p.pos.x);
                varr.push(p.pos.y);
                varr.push(p.pos.z);
                if (kksOpt.bColors || kksOpt.eColors) {
                    carr.push(p.clr.r);
                    carr.push(p.clr.g);
                    carr.push(p.clr.b);
                }
            };
        };
        kksData.bPoints = parr;

        //Refresh particle objects
        var newGeo = new THREE.BufferGeometry();
    
        const vertices = new Float32Array(varr);
        const colors = new Float32Array(carr);

        newGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        newGeo.setAttribute( 'color', new THREE.BufferAttribute( colors, 3) );
        const material = new THREE.MeshBasicMaterial( {vertexColors: true, side: THREE.DoubleSide} );
        const mesh = new THREE.Mesh( newGeo, material );

        ctx.$kksBloom.geometry = newGeo;
    };


    /**
     * Calculate the changes in emitted particles and clean up
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

        //Use the latest particles, ignore those that exceed the quantity limit
        var offset = kksData.rPoints.length < kksOpt.rMaxCount ? 0 : kksData.rPoints.length - kksOpt.rMaxCount;

        for (var i = offset; i < kksData.rPoints.length; i++) {
            var p = kksData.rPoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                //Recalculate particle position
                p.pos = p.pos.add(p.acc);
                p.pos = p.pos.add(kksOpt.eGravity.clone().multiplyScalar(timeUnit));
                parr.push(p);
                varr.push(p.pos.x);
                varr.push(p.pos.y);
                varr.push(p.pos.z);
                if (kksOpt.rColors) {
                    carr.push(p.clr.r);
                    carr.push(p.clr.g);
                    carr.push(p.clr.b);
                }
            };
        };
        kksData.rPoints = parr;
        var newGeo = new THREE.BufferGeometry();
        
        const vertices = new Float32Array(varr);
        const colors = new Float32Array(carr);

        newGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        newGeo.setAttribute( 'color', new THREE.BufferAttribute( colors, 3) );
        const material = new THREE.MeshBasicMaterial( {vertexColors: true, side: THREE.DoubleSide} );
        const mesh = new THREE.Mesh( newGeo, material );

        ctx.$kksRocket.geometry = newGeo;
    };

    /**
     * Calculate the changes in explosive particles and clean up
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

        //Use the latest particles, ignore those that exceed the quantity limit
        var offset = kksData.ePoints.length < kksOpt.eMaxCount ? 0 : kksData.ePoints.length - kksOpt.eMaxCount;

        for (var i = offset; i < kksData.ePoints.length; i++) {
            var p = kksData.ePoints[i];
            p.life -= deltaTime;
            if (p.life > 0) {
                p.acc.add(kksOpt.eGravity.clone().multiplyScalar(timeUnit));
                p.pos.add(p.acc.clone().multiplyScalar(timeUnit));
                parr.push(p);
                varr.push(p.pos.x);
                varr.push(p.pos.y);
                varr.push(p.pos.z);
                if (kksOpt.eColors) {
                    carr.push(p.clr.r);
                    carr.push(p.clr.g);
                    carr.push(p.clr.b);
                }
            } else if (kksOpt.useBloom) {
                //As long as you start bloom, you will enter the bloom stage and start calculating the bloomtick.
                genBloom.call(ctx, p);
                ctx.$kksData.level = ctx.$kksData.levels.bloom;
            };
        };
        kksData.ePoints = parr;

        //Refresh particle objects
        var newGeo = new THREE.BufferGeometry();
        
        const vertices = new Float32Array(varr);
        const colors = new Float32Array(carr);

        newGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        newGeo.setAttribute( 'color', new THREE.BufferAttribute( colors, 3) );
        const material = new THREE.MeshBasicMaterial( {vertexColors: true, side: THREE.DoubleSide} );
        const mesh = new THREE.Mesh( newGeo, material );

        ctx.$kksExplore.geometry = newGeo;
    };

    /**
     * Generate new emitted particles;
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

            //Handle multiple colors
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
     * Generate explosive particles;
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

            //Handle multiple colors
            if (kksOpt.eColors) {
                var clr = kksOpt.eColors[i % kksOpt.eColors.length];
                p.clr = clr;
                ctx.$kksData.eColors.push(clr);
            };
        };
    };

    //---------------other functions------------------

    /**
     * Function to generate spherical coordinates
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


    /**
     * Generate picture information data
     * @param   {object}   image
     * @returns {[[Type]]} imageData
     */
    function getImageData(image) {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);

        return context.getImageData(0, 0, image.width, image.height);
    };

    /**
     * Get the color value of a pixel
     * @param   {object}   imagedata imageData
     * @param   {number} x         The x coordinate of the image
     * @param   {number} y         The y coordinate of the image
     * @returns {object}   {r,g,b,a}
     */
    function getPixel(imagedata, x, y) {
        var position = (x + imagedata.width * y) * 4;
        var data = imagedata.data;
        return {
            r: data[position],
            g: data[position + 1],
            b: data[position + 2],
            a: data[position + 3]
        };
    };
})();
//
