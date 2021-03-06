import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import echarts from 'echarts'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCookies from 'vue-cookies'
import './components/iconSvg' // iconSvg
import 'lib-flexible'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCookies)
Vue.prototype.bus = new Vue()      //在main.js中挂载至原型链
Vue.prototype.$echarts = echarts    //项目数据进行可视化处理，导入echarts
Vue.prototype.$axios = axios
import vueXlsxTable from 'vue-xlsx-table';
Vue.use(vueXlsxTable, {rABS: false});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>',
  created(){
     router.beforeEach((to,from,next)=>{
       if(to.meta.loginRequest){
         if($cookies.get("cname")||$cookies.get("cid")){
           next();
         }else{
           next({
             path:'/',
             query:{
               redirect:to.fullPath
             }
           })
         }
       }else{
         next()
       }
     })
  }
})
