# kksMagic v0.12 
###kksFireWork 0.2 / kksSnow 0.1
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

以下e开头为explore爆炸效果设置，r开头为rocket发射拖尾效果设置
* eCount: 2000,爆炸粒子数量
* eSize: 3,爆炸粒子大小
* eColor: '#ff67ff',爆炸粒子颜色
* eTexture: path + "/imgs/dot-64.png",爆炸粒子贴图
* eAcc: 0.75,爆炸粒子加速度
* eAccRand: 0.1,爆炸粒子加速度随机量
* eLife: 500,爆炸粒子生命最大值
* eLifeRand: 500,爆炸粒子生命最大值随机量
* eGravity: new THREE.Vector3(0, -0.04, 0),爆炸粒子首重力影响值
* eSpeed: new THREE.Vector3(0, 1.2, 0),爆炸粒子初始向上飞行速度
* eHeight: 50,开始爆炸的高度，达到这个高度才会爆炸
* rCount: 1,发射拖尾粒子数量（每帧喷发数量）
* rSpeed: 1,焰火的上升速度
* rSpread: 0.1,发射拖尾的扩散范围
* rLife: 200,发射拖尾粒子的生命最大值
* rLifeRand: 100,发射拖尾粒子的生命最大值随机量
* rSize: 3,发射拖尾粒子的大小
* rColor: '#c7f6ff',发射拖尾粒子的颜色
* rTexture: path + "/imgs/dot-64.png",发射拖尾粒子的贴图

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


