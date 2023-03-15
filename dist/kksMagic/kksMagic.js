/**
 * <a-entity kks-magic='preset:_default,options:{color:"#E91E61"}'></a-entity>
 * The most basic aframe particle system registration kks-magic component
 * Generate global KKsMagic objects
 * You can use KKsMagic.The addPreset (name preset) method adds a new preset, and then uses it again
 * Three functions in preset format {init, tick, update}
 * preset.The init function must return a THREE.Points object
 * In the function this points to el, such as this.$kksMagic.Geometry points to the threejs object
 * preset.The tick function modifies ctx.$kksMagic.geometry.All points in the vertebra array achieve animation effects
 * This can be accessed in the function.data.The options object accesses the parameters set in the user entity, pay attention to the parse processing
 * Default _default preset is square white particles landing within 400 cubic meters
*/

(function () {
    window.KKsMagic = {
        /**
         * Add a new preset template
         * @param {string} name   The name of the preset template
         * @param {object} preset {init,tick,update} Three functions
         */
        addPreset: function (name, preset) {
            if (this.presets[name]) {
                console.log('KKsMagic:addPreset:', name, 'has used.');
                console.info('┖--You can log KKsMagic.presets to see all presets.');
            } else {
                this.presets[name] = preset;
            };
        },
        presets: {},
    };

    //-------------Register components--------------
    AFRAME.registerComponent('kks-magic', {
        schema: {
            preset: {
                type: 'string',
                default: '_default',
            },
            options: {
                type: 'string',
                parse: function (val) {
                    var res = eval('(function(){return ' + val + '})()');
                    return res;
                },
            },
            init: {
                type: 'string',
                default: 'init',
            },
            tick: {
                type: 'string',
                default: 'tick',
            },
            update: {
                type: 'string',
                default: 'update',
            },
        },
        init: function () {
            var ctx = this;
            if (!KKsMagic.presets[ctx.data.preset]) {
                console.warn('KKsMagic:init:preset not found:', ctx.data.preset, ',set as _default.');
                console.info('┖--You can log KKsMagic.presets to see all valid names.');
                ctx.data.preset = '_default';
            };

            var points;
            if (KKsMagic.presets[ctx.data.preset].init) {
                points = KKsMagic.presets[ctx.data.preset].init.call(ctx, arguments);

            };

            if (points) {
                if (points.constructor != THREE.Points && points.constructor != THREE.Group) {
                    points = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial());
                    console.warn('KKsMagic:init:not return a THREE.Points/THREE.Group object:', ctx.data.preset, ',use a default THREE.Points.');
                };
            } else {
                points = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial());
                console.warn('KKsMagic:init:not return a object:', ctx.data.preset, ',use a default THREE.Points..');
            };

            ctx.$kksMagic = points;
            ctx.el.setObject3D('kks-magic', ctx.$kksMagic);
        },
        update: function () {
            var ctx = this;
            if (KKsMagic.presets[ctx.data.preset].update) {
                KKsMagic.presets[ctx.data.preset].update.call(ctx, arguments);
            };
        },
        tick: function () {
            var ctx = this;
            if (KKsMagic.presets[ctx.data.preset].tick) {
                KKsMagic.presets[ctx.data.preset].tick.call(ctx, arguments);
            };
        },
        remove: function () {
            var ctx = this;
            if (KKsMagic.presets[ctx.data.preset].remove) {
                KKsMagic.presets[ctx.data.preset].remove.call(ctx, arguments);
            };
            if (!ctx.$kksMagic) {
                return;
            };
            ctx.el.removeObject3D('kks-magic');
        },
        pause: function () {
            var ctx = this;
            if (KKsMagic.presets[ctx.data.preset].pause) {
                KKsMagic.presets[ctx.data.preset].pause.call(ctx, arguments);
            };
        },
        play: function () {
            var ctx = this;
            if (KKsMagic.presets[ctx.data.preset].play) {
                KKsMagic.presets[ctx.data.preset].play.call(ctx, arguments);
            };
        },
    });


    //--------------Add default preset-----------------

    KKsMagic.addPreset('_default', {
        init: defaultInit,
        tick: defaultTick,
        update: undefined,
        author: 'zhyuzh',
        desc: 'A 400X400X400 snow box,not textured,with options.color,as default preset.',
    });

    /**
     * Default initialization particle function,
     * Randomly generate particles in a range of 400 cubic meters
     * Read the default image material
     * @returns {object} THREE.Points
     */
    function defaultInit() {
        var ctx = this;
        var count = 100;
        var geo = new THREE.BufferGeometry();

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
            //map: new THREE.TextureLoader().load("./imgs/particle.png"),
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        var kk = new THREE.Points(geo, mat);
        return kk;
    };

    /**
     * By default, every time the tick function is used, it will automatically fall, fall to the lowest and return to the top
     */
    function defaultTick() {
        var ctx = this;
        var time = arguments[0][0];
        var deltaTime = arguments[0][1];

        var verts = ctx.$kksMagic.geometry.vertices;
        for (var i = 0; i < verts.length; i++) {
            var vert = verts[i];
            if (vert.y < -200) {
                vert.y = Math.random() * 400 - 200;
            }
            vert.y = vert.y - (0.1 * deltaTime);
        }
        ctx.$kksMagic.geometry.verticesNeedUpdate = true;
    };

})();
