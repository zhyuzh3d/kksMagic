# kksMagic v0.12.12 
###kksFireWork 0.5.2 / kksSnow 0.2.0

![kksMagic_sn&fw_170226b.gif](https://zhyuzh3d.github.io/kksMagic/showReels/kksMagic_sn&fw_170226b.gif)

####DEMO／Home [https://zhyuzh3d.github.io/kksMagic/](https://zhyuzh3d.github.io/kksMagic/)

小于1.0的测试版本请勿使用，仅供参考
基于ThreeJs的A-frame粒子特效Entity对象插件
包括飘雪、焰火以及更多内容

Fireworks&more from 10knet.com; Base on Threejs；Currently only alpha, used with caution。

---
###kksMagic快速上手(基于v0.12)

####1.在html页面`<head>`中引用A-frame.js和kksMagic.js文件：

    <script src="./dist/lib/aframe.min.js"></script>
    <script src="./dist/kksMagic/kksMagic.js"></script>
    
####2.引用需要使用的预设，比如烟花kksFireWorks:

    <script src="./dist/kksFireWorks/kksFireWorks.js"></script>
    
####3.在`<body>`内的`<a-scene>`节点内添加`<a-entity>`节点，指定熟悉kks-magic选项（options选项应参照每个预设的使用说明）:


    <a-scene>
        <a-entity position='0 2 -15' kks-magic='preset:fireworks;options:{eColor:"#FF3333"}'></a-entity>
        <a-sky color='#000'></a-sky><br>
    </a-scene>
    
####4.更多内容请参照项目的index.html文件内demo效果使用

---

###preset:kksFireWorks(v0.6.0)

####示例:

kks-magic='preset:fireworks;options:{eColor:"#FF3333"}'

####自定义烟火图案:

先加入asset图片，然后将元素id指定为kksFireWorksPattern(也可以使用pAssetId参数自定义)。

```html
 <a-assets>
    <img id="myPattern" src="./dist/kksFireWorks/imgs/pattern.png">
</a-assets>
<a-entity position='0 -30 -100' kks-magic='preset:fireworks;options:{eColor:"#FF3333",pAssetId:"myPattern"}'></a-entity>

```

####说明:

#####焰火绽放效果分为5个状态：

1.Rocket，发射状态，指从地面发射到空中的过程，火箭拖尾效果；不能关闭；

2.Explore，爆炸状态，发射器到达最高点开始爆炸，形成焰火；不能关闭；

3.Pattern，图案状态，爆炸开来的粒子在空中形成自定义图案，userPattern为1开启，开启后以下两个状态被禁用；

4.Trail，爆炸拖尾状态，爆炸开来的每个粒子都可以产生拖尾效果；useTrail为1开启；

5.Bloom，绽放状态，爆炸开来的每个粒子生命终结后会引发新的爆炸，这里叫做绽放；useBloom为1开启。

####Option设置参数说明：

```javascript
{
    rMaxCount: 1000, //发射粒子最大数量，超过这个值的粒子被忽略
    rCount: 300, //发射器每帧每秒喷射的粒子数量，推荐50～200
    rSpeed: 40, //发射器每秒向上飞行的速度，推荐10~50
    rSpread: 0.2, //发射器粒子扩散范围，数值越大拖尾越宽，推荐0.01~0.05
    rLife: 200, //发射器粒子的最大生命值,毫秒，值越大拖尾越长，推荐100~1000
    rLifeRand: 100, //发射器粒子生命值的随机值，下同，推荐参照rLife设置
    rSize: 3, //发射器粒子大小，推荐1～5
    rColor: '#90ddff', //发射器粒子颜色，如果需要多种颜色请使用rColors，下同
    rColors: undefined, //发射器粒子随机颜色
    rTexture: path + "/imgs/dot-64.png", //发射器粒子的形状贴图

    eMaxCount: 2000, //爆炸粒子最大数量，超过这个值的粒子被忽略
    eCount: 50, //爆炸粒子数量，如果使用爆炸拖尾和绽放，请尽可能设置最小如5～20；同时影响图案和拖尾
    eSize: 3, //爆炸粒子大小，推荐1～5
    eColor: '#ff55ff', //爆炸粒子颜色
    eColors: undefined, //爆炸粒子随机颜色
    eTexture: path + "/imgs/dot-64.png", //爆炸粒子形状贴图
    eAcc: 40, //爆炸粒子炸开的加速度，值越大炸爆炸圆越大，推荐50~100
    eAccRand: 10, //随机值,值越大爆炸圆形越不清晰
    eLife: 1000, //爆炸粒子最大生命值，值越大爆炸圆越大
    eLifeRand: 100, //随机值
    eGravity: '0 -100 0', //重力值，会拉伸爆炸圆，同时影响爆炸和绽放
    eSpeed: '0 80 0', //爆炸器自身速度，用于中和重力值，不推荐设置
    eHeight: 80, //爆炸高度，发射器到达这个高度后触发爆炸

    usePattern: 0, //是否使用爆炸图案
    pAssetId: "kksFireWorksPattern", //爆炸形成的图案素材元素的id
    pScale: 1, //图案放缩大小，默认为原图像素单位，请不要使用太大像素的图片
    pRotationX: 90, //图案的x轴旋转角度，默认为竖直图片
    pDuration: 500, //组成图案前需要多少毫秒
    pLife: 1000, //图案粒子的生命时间，必须大于ptime才能形成图案
    pLifeRand: 500, //随机值
    pHold: 0, //保持图形，不发散

    useTrail: 1, //是否使用爆炸拖尾
    tMaxCount: 2000, //拖尾粒子最大数量，超过这个值的粒子被忽略
    tCount: 120, //拖尾每秒产生粒子数量，推荐50～200
    tSize: 2, //拖尾粒子大小
    tSpread: 0.2, //拖尾扩散范围，值越大拖尾越宽,推荐0.05~0.3
    tLife: 500, //拖尾粒子生命最大值
    tOpacity: 0.6, //拖尾透明值。拖尾的颜色由炸开的粒子控制；不能单独设置

    useBloom: 1, //是否使用绽放效果，绽放是爆炸开的粒子再次进行爆炸
    bMaxCount: 5000, //绽放粒子最大数量，超过这个值的粒子被忽略
    bCount: 200, //每个绽放爆炸的粒子数量，推荐100～1000
    bCountRand: 100, //随机值
    bColors: undefined, //绽放粒子随机颜色；绽放粒子颜色由炸开粒子颜色控制，但也可使用随机色
    bSize: 2, //绽放粒子的大小，推荐1～3
    bTexture: path + "/imgs/dot-64.png", //绽放粒子形状贴图
    bAcc: 30, //绽放粒子每秒加速度,10~50
    bAccRand: 1, //随机值
    bLife: 500, //绽放粒子生命最大值
    bLifeRand: 200, //随机值
}
```

---

###preset:kksSnow(v0.2.0)

####示例:

kks-magic='preset:snow;options:{color:"#FFFFFF"}'

####说明:

####所有选项支持动态调整，方法如下（5秒后开始生成随机的绿色、蓝色雪花）

```javascript
setTimeout(function () {
    var snow = document.querySelector('#snow');
    snow.emit('kksUpdate', {
        colors: ['#00FF00','#0000FF']
    });
}, 5000);
```

####Option设置参数说明
```javascript
 {
    maxCount: 2000, //最大雪花数量，超过这个数量的雪花会被忽略
    count: 60, //每秒产生雪花数量，推荐60～100
    size: 1, //雪花大小，不推荐修改
    pos: '0 -30 0', //飘雪范围的中心，不推荐修改;低于y值雪花消失
    box: '100 10 100', //生成雪花的盒子，相对于pos，范围越大需要生成越多的雪花
    boxHeight: 90, //雪花盒子的距离地面的高度
    speed: 10, //每秒向下移动数值，推荐5～20
    acc: 5, //加速度，每秒变化量,生成时生效，推荐小于speed；
    accRand: 2, //加速度随机变化值，生成时生效，推荐与acc相加小于speed；
    dance: 7, //每秒飘舞幅度，值越大水平方向飘动越严重，即时生效，推荐2～10
    color: '#FFFFFF', //雪花的颜色，不推荐修改
    colors: undefined, //随机颜色，数组，将覆盖color选项。不推荐使用
    opacity: 0.66, //雪花透明度，推荐0.1～1
    textrue: path + "imgs/dot-64.png", //雪花的形状图片，不推荐修改
}
```


---
###版本历史

####0.15.11 ／ kksFireworks 0.6.1 / 170226

微调各个参数的默认设置；默认打开拖尾和绽放，关闭图案；默认单色，不再默认彩色。

####0.15.10 ／ kksFireworks 0.6.0 / 170226

增加pattern图案功能，爆炸的烟火可以在天空形成特定图案

####kksMagic v0.15.02 / 170225

修复fireworks的elife无效的bug

####kksMagic v0.15.01 / 170225

只是更新了readme文档

####Demo/ 170224

更新连续释放焰火

####kksFireWorks v0.5.5 / 170224

调整设置参数，多个参数改为以时间秒为参考单位，避免受到帧率影响

####kksSnow v0.3.0 / 170224

增加dance随机舞动飘飞效果，依赖于第三方插件，以后考虑自己写；

调整设置参数，多个参数改为以时间秒为参考单位，避免受到帧率影响

####kksSnow v0.2.0 / 170223

调整代码结构

完善各种设置选项

增加动态updateOpt事件支持

####kksFireWorks v0.5.2 / 170223

增加四个阶段的MaxCount最大粒子数量参数，必要时保证性能

####kksFireWorks v0.5.0 / 170221

增加了爆炸拖尾效果

增加了二次爆炸（绽放）效果

增加了随机颜色功能

增加了粒子完结之后自动清除自身Entity的功能

####kksFireWorks v0.2 / 170219

实现了rocket基本的发射拖尾效果；

改为使用THREE.Group；附着两个变量$kksRocket，$kksExplore;

将外部选项和数据规整到Entity内，合并用户设定，分别附着到$kksOpt和$kksData;

更多参照上面的选项说明。

####KKsMagic v0.12 / 170219

调整变量命名规则，附着在Entity上的新增属性都以$kks开头；原来的.kk指针改为.$kksMagic；kksSnow和kksFireWorks也已同步调整。

####KKsMagic v0.1 / kksSnow v0.1 / kksFireWorks v0.1 / 170218

整理项目结构，最终代码都放在dist文件夹。

kksMagic提供最基础的A-frame对象注册功能，所有其他的飘雪、焰火等插件仅仅是提供kksMagic的预设。

---
<small>Create by zhyuzh from 10knet.com</small>


