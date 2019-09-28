console.log("webwork开始工作");

// 随机获取所有颜色
// var R = Math.floor(Math.random() * 255);
// var G = Math.floor(Math.random() * 255);
// var B = Math.floor(Math.random() * 255);
// var color = 'rgb(' + R + ',' + G + ',' + B + ')' ;


// 随机获取浅色
function getRandomColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    console.log(color);
    return color;
}
postMessage(getRandomColor());