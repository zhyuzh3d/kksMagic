# kksMagic v0.12 
###kksFireWork 0.5.0 / kksSnow 0.1
小于1.0的测试版本请勿使用，仅供参考

基于ThreeJs的A-frame粒子特效Entity对象插件
包括飘雪、焰火以及更多内容

Fireworks&more from 10knet.com; Base on Threejs.

---
###kksMagic快速上手(基于v0.12)

####1.在html页面`<head>`中引用A-frame.js和kksMagic.js文件：

    <script src="./dist/lib/aframe.min.js"></script>
    <script src="./dist/kksMagic/kksMagic.js"></script>
    
####2.引用需要使用的预设，比如烟花kksFireWorks:

    <script src="./dist/kksFireWorks/kksFireWorks.js"></script>
    
####3.在`<body>`内的`<a-scene>`节点内添加`<a-ntity>`节点，指定熟悉kks-magic选项（options选项应参照每个预设的使用说明）:


    <a-scene>
        <a-entity position='0 2 -15' kks-magic='preset:fireworks;options:{eColor:"#FF3333"}'></a-entity>
        <a-sky color='#000'></a-sky><br>
    </a-scene>
    
####4.更多内容请参照项目的index.html文件内demo效果使用

---

###preset:kksFireWorks(v0.2)

####示例:

kks-magic='preset:fireworks;options:{eColor:"#FF3333"}'

####说明:

#####焰火绽放效果分为4个阶段：

1.Rocket，发射阶段，指从地面发射到空中的过程，火箭拖尾效果；不能关闭；

2.Explore，爆炸阶段，发射器到达最高点开始爆炸，形成焰火；不能关闭；

3.Trail，爆炸拖尾阶段，爆炸开来的每个粒子都可以产生拖尾效果；useTrail为1开启；

4.Bloom，绽放阶段，爆炸开来的每个粒子生命终结后会引发新的爆炸，这里叫做绽放；useBloom为1开启。

####Option设置参数说明：
`
rCount: 1, //发射器每帧喷发的粒子数量，推荐1～5
rSpeed: 2, //发射器向上飞行的速度，推荐1~5
rSpread: 0.01, //发射器粒子扩散范围，数值越大拖尾越宽，推荐0.01~0.05
rLife: 200, //发射器粒子的最大生命值,毫秒，值越大拖尾越长，推荐100~1000
rLifeRand: 100, //发射器粒子生命值的随机值，下同，推荐参照rLife设置
rSize: 3, //发射器粒子大小，推荐1～5
rColor: '#c7f6ff', //发射器粒子颜色，如果需要多种颜色请使用rColors，下同
rColors: ['#FF0000', '#dd1fff', '#ff6200'], //发射器粒子随机颜色
rTexture: path + "/imgs/dot-64.png", //发射器粒子的形状贴图
eCount: 10, //爆炸粒子数量，如果使用爆炸拖尾和绽放，请尽可能设置最小如5～20；否则推荐100~2000
eSize: 3, //爆炸粒子大小，推荐1～5
eColor: '#ff67ff', //爆炸粒子颜色
eColors: ['#ff52ff', '#ffff42', '#76ffff'], //爆炸粒子随机颜色
eTexture: path + "/imgs/dot-64.png", //爆炸粒子形状贴图
eAcc: 0.75, //爆炸粒子炸开的加速度，值越大炸爆炸圆越大，推荐0.5~2
eAccRand: 0.1, //随机值,值越大爆炸圆形越不清晰
eLife: 500, //爆炸粒子最大生命值，值越大爆炸圆越大
eLifeRand: 300, //随机值
eGravity: '0 -0.04 0', //重力值，会拉伸爆炸圆，同时影响爆炸、拖尾和绽放，不推荐设置
eSpeed: '0 1.5 0', //爆炸器自身速度，用于中和重力值，不推荐设置
eHeight: 50, //爆炸高度，发射器到达这个高度后触发爆炸
useTrail: 1, //是否使用爆炸拖尾
tCount: 5, //拖尾每帧产生粒子数量，推荐1～5
tSize: 2, //拖尾粒子大小
tSpread: 0.1, //拖尾扩散范围，值越大拖尾越宽,推荐0.05~0.3
tLife: 500, //拖尾粒子生命最大值
tOpacity: 0.6, //拖尾透明值。拖尾的颜色由炸开的粒子控制；不能单独设置
useBloom: 1, //是否使用绽放效果，绽放是爆炸开的粒子再次进行爆炸
bCount: 200, //每个绽放爆炸的粒子数量，推荐100～1000
bCountRand: 100, //随机值
bColors: undefined, //绽放粒子随机颜色；绽放粒子颜色由炸开粒子颜色控制，但也可使用随机色
bSize: 2, //绽放粒子的大小，推荐1～3
bTexture: path + "/imgs/dot-64.png", //绽放粒子形状贴图
bAcc: 0.5, //绽放粒子加速度
bAccRand: 0.0, //随机值
bLife: 500, //绽放粒子生命最大值
bLifeRand: 200, //随机值
`

---

###preset:kksSnow(v0.1)

####示例:

kks-magic='preset:snow;options:{color:"#ff00ff"}'

####说明:

* color 雪花颜色，字符串16进制如"#FF0000"，或者0xFF0000


---
###版本历史

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


