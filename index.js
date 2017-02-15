window.KKsMagicMethods.init_redSnow = function () {
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
        color: 0xff00ff,
        size: 12,
        map: THREE.ImageUtils.loadTexture("./imgs/particle.png"),
        blending: THREE.AdditiveBlending,
        transparent: true,
    });

    var kk = new THREE.Points(geo, mat);
    return kk;

};

var sceneEl = document.querySelector('a-scene');
var snowEl = document.createElement('a-entity');
snowEl.setAttribute('kks-magic', {
    init: 'init_redSnow'
});
sceneEl.appendChild(snowEl);
