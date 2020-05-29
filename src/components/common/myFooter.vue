<!--页脚部分-->
<template>
  <footer id="footer">
    <ul style="text-align:center;bottom:0;margin:0 auto;width:100%;color: #000000">
      <li><a target="_blank" style="color: #FF7622" href="http://www.beian.miit.gov.cn">豫ICP备20010791</a></li>
      <li><a href="http://www.njit.edu.cn/">@2020 南京工程学院</a></li>
      <li>计算机工程学院 软件161</li>
      <li><a href="https://github.com/Cqc1">@Copyright 2020. ALL Rights Reserved CQC</a></li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: "myFooter"
}
</script>

<style scoped>
#footer a {
  color: #606060;
  font-size: 14px;
}
#footer {
  background-color: #ffffff;
}
#footer ul {
  margin-top: 40px;
  border-top: 1px solid #d5d5d5;
  display: flex;
  justify-content: center;
  height: 40px;
  line-height: 40px;
}
#footer ul li {
  color: #606060;
  font-size: 14px;
  margin-right: 20px;
}
</style>

