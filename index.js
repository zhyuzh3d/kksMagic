setTimeout(function () {
    var snow = document.querySelector('#snow');
    snow.emit('kksUpdate', {
        colors: ['#00FF00','#0000FF']
    });
}, 3000);
