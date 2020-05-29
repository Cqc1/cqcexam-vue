<!-- 顶部信息栏 -->
<template>
    <header id="topbar">
        <el-row>
            <el-col :span="4" class="topbar-left">
                <i class="iconfont icon-kaoshi"></i>
                <span class="title" @click="index()">CQC-EXAM</span>
            </el-col>
            <el-col :span="20" class="topbar-right">
                <i class="el-icon-menu" @click="toggle()"></i>
                <div class="userinfo-right rflex">
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
                <div class="user">
                    <span>{{user.userName}}</span>
                    <img src="@/assets/img/user.png" class="user-img" ref="img" @click="showSetting()" />
                    <transition name="fade">
                        <div class="out" ref="out" v-show="login_flag">
                            <ul>
                                <li @click="Info()"><a href="javascript:;">用户信息</a></li>
                                <li @click="upPwd()"><a href="javascript:;">修改密码</a></li>
                                <li class="exit" @click="exit()"><a href="javascript:;">退出登录</a></li>
                            </ul>
                        </div>
                    </transition>
                </div>
                </div>
            </el-col>
        </el-row>
        <!-- 编辑对话框-->
        <el-dialog
                title="个人详细信息"
                :visible.sync="dialogVisible"
                width="30%"
                >
            <section class="update">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="帐号">
                        <el-input v-model="form.id" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="form.name" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="form.pwd" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item  label="所属院系" v-if="Role">
                        <el-input v-model="form.yuname" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" >
                        <el-input v-model="form.sex" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" >
                        <el-input v-model="form.email" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" >
                        <el-input v-model="form.tel" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
            </section>
        </el-dialog>
    </header>
</template>

<script>
    import store from '@/store/store'
    import {mapState,mapMutations} from 'vuex'
    import wechatImg from "@/assets/img/wechat.png";
    import qqImg from "@/assets/img/qq.png";
    import { github } from "@/utils/env";
    export default {
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
                dialogVisible: false, //查看对话框
                login_flag: false,
                Role:false,//标识为教师时显示
                user: { //用户信息
                    userName: null,
                    userId: null
                },
                form: {
                   id:null,
                   name:null,
                   pwd:null,
                   yuname:null,
                   sex:null,
                   email:null,
                   tel:null
                }
            }
        },
        created() {
            this.getUserInfo()
        },
        computed: mapState(["flag","menu"]),
        methods: {
            //显示、隐藏退出按钮
            showSetting() {
                this.login_flag = !this.login_flag
            },
            //左侧栏放大缩小
            ...mapMutations(["toggle"]),
            getUserInfo() { //获取用户信息
                let userName = this.$cookies.get("cname")
                let userId = this.$cookies.get("cid")
                this.user.userName = userName
                this.user.userId = userId
            },
            index() {
                this.$router.push({path: '/index'})
            },
            Info() {
                let role = this.$cookies.get("role")
                let userId = this.$cookies.get("cid")
                this.dialogVisible = true
                if(role == 0){
                    //按条件查询信息
                    this.$axios(`/api/admin/${userId}`).then(res => {
                        if(res.data !=null) {
                            this.form = res.data
                            this.form.id=res.data.adminid
                            this.form.name=res.data.adminname
                            this.form.pwd=res.data.adminpwd
                            this.form.sex=res.data.sex
                            this.form.email=res.data.email
                            this.form.tel=res.data.tel
                            this.$message({
                                message: '查询成功',
                                type: 'success'
                            })
                        }else{
                            this.$message({
                                message: '查询失败',
                                type: 'error'
                            })
                        }
                    }).catch(error => {});
                }else{
                    //按条件查询信息
                    this.$axios(`/api/teacher/${userId}`).then(res => {
                        if(res.data.code ==200) {
                            this.Role=true
                            this.form = res.data.data
                            this.form.id=res.data.data.teaid
                            this.form.name=res.data.data.teaname
                            this.form.pwd=res.data.data.teapwd
                            this.form.yuname=res.data.data.institution.instituname
                            this.form.sex=res.data.data.sex
                            this.form.email=res.data.data.email
                            this.form.tel=res.data.data.tel
                            this.$message({
                                message: '查询成功',
                                type: 'success'
                            })
                        }else{
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            })
                        }
                    }).catch(error => {});
                }
            },
            upPwd() {
                this.$router.push({path: '/managerPwd'})
            },
            exit() {
                let role = this.$cookies.get("role")
                this.$router.push({path:"/"}) //跳转到登录页面
                this.$cookies.remove("cname") //清除cookie
                this.$cookies.remove("cid")
                this.$cookies.remove("role")
                if(role == 0) {
                    this.menu.pop()
                    this.menu.pop()//弹出管理员所添加的菜单功能
                }
            }
        },
        store
    }
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    #topbar {
        position: relative;
        z-index: 10;
        background-color: rgba(42, 42, 42, 0.98);
        height: 80px;
        line-height: 80px;
        color: #fff;
        box-shadow: 5px 0px 10px rgba(4, 14, 65, 0.86);
    }
    #topbar .topbar-left {
        height: 80px;
        display: flex;
        justify-content: center;
        background: rgba(0, 0, 0, 0.05);
        overflow: hidden;
    }
    .topbar-left .icon-kaoshi {
        font-size: 60px;
    }
    .topbar-left .title {
        font-size: 20px;
        cursor: pointer;
    }
    .topbar-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .topbar-right .user-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .topbar-right .el-icon-menu {
        font-size: 30px;
        margin-left: 20px;
    }
    .topbar-right .user {
        position: relative;
        margin-right: 40px;
        display: flex;
    }
    .topbar-right .user .user-img {
        margin-top: 15px;
        margin-left: 10px;
        cursor: pointer;
    }
    .user .out {
        font-size: 14px;
        position: absolute;
        top: 80px;
        right: 0px;
        background-color: #fff;
        box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        padding: 12px;
    }
    .user .out ul {
        list-style: none;
    }
    .user .out ul > li {
        height: 26px;
        line-height: 26px;
    }
    .out a {
        text-decoration: none;
        color: #000;
    }
    .out .exit {
        margin-top: 4px;
        padding-top: 4px;
        border-top: 1px solid #ccc;
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