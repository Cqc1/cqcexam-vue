<template>
  <div id="app">
    <router-view/>
     <v-footer></v-footer>
  </div>
</template>

<script>
  import myFooter from "@/components/common/myFooter"
  export default {
      name: 'app',
    components: {
      "v-footer": myFooter
    }
  }
</script>

<style lang="less">

  @import './style/variables';
  @import './style/element-ui';
  @import './style/common';
  @import './style/scrollBar';
  img, object { max-width: 100%;}
  @media screen and (max-device-width: 400px) { .column { float: none; width:auto; } #sidebar { display:none; } }

</style>


