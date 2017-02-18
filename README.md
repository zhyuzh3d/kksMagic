# kksMagic v0.1
小于1.0的测试版本请勿使用，仅供参考

基于ThreeJs的A-frame粒子特效Entity对象插件
包括飘雪、焰火以及更多内容

Fireworks&more from 10knet.com; Base on Threejs.

---
###快速上手(基于v0.1)

####1. 在html页面`<head>`中引用A-frame.js和kksMagic.js文件：

    <script src="./dist/lib/aframe.min.js"></script>
    <script src="./dist/kksMagic/kksMagic.js"></script>
    
####1. 引用需要使用的预设，比如烟花kksFireWorks:

    <script src="./dist/kksFireWorks/kksFireWorks.js"></script>
    
####1. 在`<body>`内的`<a-scene>`节点内添加`<a-ntity>`节点，指定熟悉kks-magic选项（options选项应参照每个预设的使用说明）:
    <a-scene>
        <a-entity position='0 2 -15' kks-magic='preset:fireworks;options:{color:0x00FF00}'></a-entity>
        <a-sky color='#000'></a-sky><br>
    </a-scene>
    
####1. 更多内容请参照项目的index.html文件内demo效果使用

---

###preset:snow(v0.1)

####示例:

kks-magic='preset:snow;options:{color:"#ff00ff"}'

####说明:

* color 雪花颜色，字符串16进制如"#FF0000"，或者0xFF0000




---
###版本历史

####v0.1 / 170218

整理项目结构，最终代码都放在dist文件夹。

kksMagic提供最基础的A-frame对象注册功能，所有其他的飘雪、焰火等插件仅仅是提供kksMagic的预设。

---
<small>Create by zhyuzh from 10knet.com</small>


