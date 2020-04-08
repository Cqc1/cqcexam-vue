<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app',
  }
  var deviceWidth = parseInt(window.screen.width);  //获取当前设备的屏幕宽度
  var deviceScale = deviceWidth / 640;  //得到当前设备屏幕与640之间的比例，之后我们就可以将网页宽度固定为640px
  var ua = navigator.userAgent;
  //获取当前设备类型（安卓或苹果）
  if (/Android (\d+\.\d+)/.test(ua)) {
    var version = parseFloat(RegExp.$1);
    if (version > 2.3) {
      document.write('<meta name="viewport" content="width=640,initial-scale=' + deviceScale + ', minimum-scale = ' + deviceScale + ', maximum-scale = ' + deviceScale + ', target-densitydpi=device-dpi">');
    } else {
      document.write('<meta name="viewport" content="width=640,initial-scale=0.75,maximum-scale=0.75,minimum-scale=0.75,target-densitydpi=device-dpi" />');
    }
  } else {
    document.write('<meta name="viewport" content="width=640, user-scalable=no">');
  }
  //得到手机屏幕的宽度
  let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  console.log('htmlWidth',htmlWidth)
  //得到html的Dom元素
  let htmlDom = document.getElementsByTagName('html')[0];
  // if(htmlWidth>640){//超过640大小的，字体根部都是16px
  //   htmlWidth=640;
  //   console.log('htmlWidth-true',htmlWidth)
  // }
  //设置根元素字体大小
  htmlDom.style.fontSize = htmlWidth / 40 + 'px';
  document.documentElement.style.fontSize = document.documentElement.clientWidth/10 + 'px';
</script>

<style lang="less">

  @import './style/variables';
  @import './style/element-ui';
  @import './style/common';
  @import './style/scrollBar';
  img, object { max-width: 100%;}
  @media screen and (max-device-width: 400px) { .column { float: none; width:auto; } #sidebar { display:none; } }

</style>


