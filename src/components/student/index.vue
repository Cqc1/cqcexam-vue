<!--学生考试首页-->
<template>
  <div id="student">
    <el-row class="padding-50">
      <el-col :span="24">
        <ul class="list">
          <li class="logo"><i class="iconfont iconkaoshi"></i><span>CQC-EXAM</span></li>
          <li><a href="javascript:;" @click="exam()">在线考试</a></li>
          <li><a href="javascript:;" @click="practice()">在线练习</a></li>
          <li><router-link to="/scoreTable">考试记录</router-link></li>
          <li><router-link to="/message">给我留言</router-link></li>
          <li class="right">
            <div class="notify-row">
              <ul class="top-menu">
                <li class="li-badge">
                  <el-tooltip class="item" effect="dark" content="访问github" placement="top">
                    <a :href='github' target="_blank">
                      <icon-svg icon-class="iconGithub" />
                    </a>
                  </el-tooltip>
                </li>
                <li class="li-badge">
                  <a :href='github' target="_blank" v-popover:qcode>
                    <icon-svg icon-class="iconwechat" />
                    <el-popover
                            ref="qcode"
                            popper-class="qcodepopper"
                            placement="bottom"
                            trigger="hover">
                      <div class="wechat-area cflex">
                        <p class="titles">加我微信</p>
                        <img :src="wechat.wechatImg" alt="加我微信"  />
                      </div>
                    </el-popover>
                  </a>
                </li>
                <li class="li-badge">
                  <a :href='github' target="_blank" v-popover:qqcode>
                    <icon-svg icon-class="iconqq" />
                    <el-popover
                            ref="qqcode"
                            popper-class="qcodepopper"
                            placement="bottom"
                            trigger="hover">
                      <div class="wechat-area cflex">
                        <p class="titles">加我qq</p>
                        <img :src="qq.qqImg" alt="加入qq群"  />
                      </div>
                    </el-popover>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li class="right" @mouseenter="flag = !flag" @mouseleave="flag = !flag">
            <a href="javascript:;"><i class="iconfont icon-Userselect icon"></i>{{user.userName}}</a>
            <div class="msg" v-if="flag">
              <p @click="manage()">管理中心</p>
              <p class="exit" @click="exit()">退出</p>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <!--路由区域-->
    <div class="main">
      <router-view></router-view>
    </div>
    <!--<v-footer class="el-footer"></v-footer>-->
  </div>
</template>

<script>
import store from '@/store/store'
import myFooter from "@/components/common/myFooter"
import {mapState} from 'vuex'
import wechatImg from "@/assets/img/wechat.png";
import qqImg from "@/assets/img/qq.png";
import { github } from "@/utils/env";
export default {
  store,
  components: {
    "v-footer": myFooter
  },
  data() {
    return {
      wechat:{
        wechatImg:wechatImg,
        isWechat:false
      },
      qq:{
        qqImg:qqImg,
        isQq:false,
      },
      github:github,
      flag: false,
      user: {}
    }
  },
  created() {
    this.userInfo()
  },
  methods: {
    exit() {  //退出登录
      this.$router.push({path:"/"}) //跳转到登录页面
      this.$cookies.remove("cname") //清除cookie
      this.$cookies.remove("cid")
    },
    manage() {  //跳转到修改密码页面
      this.$router.push({path: '/manager'})
    },
    userInfo() {
      let studentName = this.$cookies.get("cname")
      let studentId = this.$cookies.get("cid")
      console.log(`studentId${studentId}`)
      console.log(`studentName ${studentName}`)
      this.user.userName = studentName
      this.user.studentId = studentId
    },
    practice() { //跳转练习模式
      let isPractice = true
      this.$store.commit("practice", isPractice)
      this.$router.push({path:'/practice'})
    },
    exam() { //跳转考试模式
     let isPractice = false
      this.$store.commit("practice", isPractice)
      this.$router.push({path:'/student'})
    }
  },
  computed:mapState(["isPractice"])
}
</script>

<style scoped>
  .el-footer{
    position: absolute;
    text-align:center;
    bottom:0;
    margin:0 auto;
    width:100%;
    color: #5c6b77
  }
.right .icon {
  margin-right: 6px;
}
#student .padding-50 {
  margin: 0 auto;
  padding: 0 50px;
  box-shadow: 0 0 10px 4px rgba(1,149,255,0.1);
  background-color: rgba(96, 96, 96, 0.47);
}
.list a {
  text-decoration: none;
  color: #334046;
}
li {
  list-style: none;
  height: 60px;
  line-height: 60px;
}
#student .list{
  display: flex;
}
#student .list li {
  padding: 0 20px;
  cursor: pointer;
}
#student .list li:hover {
  background-color: #0195ff;
  transition: all 2s ease;
}
#student .list li:hover a {
  color: #ff8a1b;
}
#student .list .right {
  margin-left: auto;
  position: relative;
}
#student .list li.right :hover a {
  color: #000;
}
#student .list .logo {
  display: flex;
  font-weight: bold;
  color: #2f6c9f;
}
#student .list .logo i {
  font-size: 50px;
}
.right .msg {
  text-align: center;
  position: absolute;
  top: 60px;
  left: 0px;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border-bottom: 3px solid #0195ff;
  background-color: #606060;
}
.right .msg p {
  height: 40px;
  line-height: 40px;
  width: 105px;
}
.right .msg p:hover {
  background-color: #0195ff;
}
</style>
<style scoped lang='less'>
  .right-nav{
    display: flex;
    flex: 1;
    width:calc(100% - 180px);
    padding-right: 15px;
    justify-content: space-between;
    box-shadow:0px 2px 5px 0px rgba(237,233,233,0.5);
  }
  .head-nav {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 29;
    transition: width .2s;
    justify-content: space-between;
    height: 60px;
    box-sizing: border-box;
    background: #fff;
    .logout {
      vertical-align: middle;
      cursor: pointer;
    }
  }
  .middle{
    align-items: center;
    border:1px solid;
  }
  .userinfo-right{
    width:320px;
    padding: 0 10px;
    justify-content: space-between;
  }
  .userinfo {
    line-height: 60px;
    text-align:right;
  }
  .avatar{
    width: 32px;
    height: 32px;
    border-radius: 50%;
    vertical-align: middle;
    display: inline-block;
  }
  .langAvatar{
    width: 24px;
    height: 24px;
    border-radius: 50%;
    vertical-align: middle;
    display: inline-block;
  }
  .welcome{
    display: inline-block;
    vertical-align: middle;
    padding: 0 5px;
    .name{
      line-height: 20px;
      text-align: center;
      font-size: 12px;
    }
    .avatarname{
      color:#a9d86e;
      font-weight:bolder;
      font-size: 13px;
    }
  }

  .username {
    cursor: pointer;
    margin-right: 5px;
  }
  .border{
    border:1px solid;
  }
  .notify-row{
    line-height:60px;
    flex:1;
    ul{
      display: flex;
      justify-content: space-around;
    }
  }

  ul.top-menu > li {
    position: relative;
  }
</style>